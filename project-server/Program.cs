using GraphQL;
using GraphQL.Authorization;

using GraphQL.Server;
using GraphQL.Server.Ui.GraphiQL;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using GraphQL.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;

using Microsoft.IdentityModel.Tokens;
using project_server.Repositories.Day;
using project_server.Repositories_part;
using project_server.Repositories.Diet;
using project_server.Repositories.ActivityCoef;
using project_server.Schemas;
using project_server.Services;
using project_server.Services_part;
using System.Diagnostics.Metrics;
using System.Text;
using Microsoft.Extensions.DependencyInjection.Extensions;

// =========== BUILDER ===========
var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
    });
});

// Configure Dapper

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

// Configure logging
builder.Services.AddLogging();

// Register HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMealTypeRepository, MealTypeRepository>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

builder.Services.AddScoped<IDietsRepository, project_server.Repositories.Diet.DietsRepository>();
builder.Services.AddScoped<IActivityCoefficientsRepository, project_server.Repositories.ActivityCoef.ActivityCoefficientsRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICalorieStandardService,CalorieStandardService>();

builder.Services.AddScoped<IDaysRepository, DaysRepository>();
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddTransient<IStreakService, StreakService>();

builder.Services.AddHttpContextAccessor();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true /*ï³çí³øå çì³íèòè*/,
            ValidateAudience = false /*ï³çí³øå çì³íèòè*/,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
            ValidateLifetime = true,
            ValidIssuer = jwtSettings["Issuer"]
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                if (ctx.Request.Cookies.TryGetValue("jwt", out var token))
                    ctx.Token = token;
                return Task.CompletedTask;
            }
        };
    });


builder.Services.AddAuthorization();
builder.Services.AddHttpContextAccessor();

builder.Services
    .AddSingleton<IAuthorizationEvaluator, AuthorizationEvaluator>()
    .AddSingleton(s =>
    {
        var authSettings = new AuthorizationSettings();
        authSettings.AddPolicy("Authenticated", _ => _.RequireAuthenticatedUser());

        return authSettings;
    })
    .AddTransient<IValidationRule, AuthorizationValidationRule>();

// Register GraphQL Types
builder.Services.AddScoped<ActivityCoefficientsResponseType>();
builder.Services.AddScoped<DetailsResponseType>();
builder.Services.AddScoped<UserPublicType>();
builder.Services.AddScoped<DetailsInputType>();
builder.Services.AddScoped<DietsResponseType>();




// Register GraphQL Schema (Ð²Ð¸Ð±ÐµÑÑÑÑ Ð¾Ð´Ð½Ñ ÑÑÐµÐ¼Ñ: ProjectSchema Ð°Ð±Ð¾ AppSchema)
builder.Services.AddScoped<ISchema, AppSchema>(); 

// Configure GraphQL
builder.Services.AddGraphQL(b => b
    .AddSystemTextJson()
    .AddGraphTypes()
    .AddSchema<AppSchema>() 
    .AddAuthorizationRule()
    .AddUserContextBuilder(httpContext => new GraphQLUserContext
    {
        HttpContext = httpContext,
        User = httpContext.User
    })
    .ConfigureExecutionOptions(options =>
    {
        options.EnableMetrics = true;
        options.ThrowOnUnhandledException = false;
    }));

// Add Controllers
builder.Services.AddControllers();

// =========== BUILD ===========
var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();


app.MapGet("/", () => "GraphQL Server is running!");

// GraphQL endpoint
app.UseGraphQL<ISchema>("/graphql");
app.UseGraphQLGraphiQL("/ui/graphiql");
// GraphQL UI (Ð²Ð¸Ð±ÐµÑÑÑÑ Ð¾Ð´Ð¸Ð½ Ð°Ð±Ð¾ Ð¾Ð±Ð¸Ð´Ð²Ð°)
//app.UseGraphQLGraphiQL("/ui/graphiql", new GraphiQLOptions());
app.UseGraphQLPlayground("/graphql/playground", new PlaygroundOptions
{
    GraphQLEndPoint = "/graphql",
    SubscriptionsEndPoint = "/graphql",
});

app.MapControllers();

app.Run();