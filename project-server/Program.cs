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
using project_server.Models;
using project_server.Models_part;
using project_server.Repositories;
using project_server.Repositories_part;
using project_server.Repositories.Diet;
using project_server.Repositories.ActivityCoef;
using project_server.Schemas;
using project_server.Services;
using project_server.Services_part;
using System.Data;
using System.Text;
using Microsoft.Extensions.DependencyInjection.Extensions;

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

// Configure JWT Authentication
var key = "super_secret_key_change_me_1234567890";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateLifetime = true
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

// Configure Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Authenticated", policy => policy.RequireAuthenticatedUser());
});

// Configure GraphQL Authorization
// Configure GraphQL Authorization
builder.Services
    .AddSingleton<GraphQL.Authorization.IAuthorizationEvaluator, AuthorizationEvaluator>()
    .AddSingleton(s =>
    {
        var authSettings = new AuthorizationSettings();
        authSettings.AddPolicy("Authenticated", policy => policy.RequireAuthenticatedUser());
        // authSettings.DefaultPolicyName = "Authenticated"; // розкоментуйте за потреби
        return authSettings;
    })
    .AddTransient<IValidationRule, AuthorizationValidationRule>();

// Register GraphQL Types
builder.Services.AddScoped<ActivityCoefficientsResponseType>();
builder.Services.AddScoped<DetailsResponseType>();
builder.Services.AddScoped<UserPublicType>();
builder.Services.AddScoped<DetailsInputType>();
builder.Services.AddScoped<DietsResponseType>();




// Register GraphQL Schema (виберіть одну схему: ProjectSchema або AppSchema)
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

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Configure endpoints
app.MapGet("/", () => "GraphQL Server is running!");

// GraphQL endpoint
app.UseGraphQL<ISchema>("/graphql");

// GraphQL UI (виберіть один або обидва)
//app.UseGraphQLGraphiQL("/ui/graphiql", new GraphiQLOptions());
app.UseGraphQLPlayground("/graphql/playground", new PlaygroundOptions
{
    GraphQLEndPoint = "/graphql",
    SubscriptionsEndPoint = "/graphql",
});

app.MapControllers();

app.Run();