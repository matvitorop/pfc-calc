using GraphQL;
using GraphQL.Authorization;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using GraphQL.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using project_server.Repositories.Day;
using project_server.Repositories_part;
using project_server.Repositories.Diet;
using project_server.Repositories.ActivityCoef;
using project_server.Schemas;
using project_server.Services;
using project_server.Services_part;
using System.Text;
using project_server.Repositories.Item;
using project_server.Repositories.ItemCalorie;

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
builder.Services.AddScoped<IDaysRepository, DaysRepository>();//change
builder.Services.AddScoped<IItemsRepository, ItemsRepository>();
builder.Services.AddScoped<IItemCaloriesRepository, ItemCaloriesRepository>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

builder.Services.AddScoped<IDietsRepository, project_server.Repositories.Diet.DietsRepository>();
builder.Services.AddScoped<IActivityCoefficientsRepository, project_server.Repositories.ActivityCoef.ActivityCoefficientsRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICalorieStandardService,CalorieStandardService>();

builder.Services.AddScoped<IDaysService, DaysService>();
builder.Services.AddScoped<IDaysRepository, DaysRepository>();//hmm??(dublicate)
builder.Services.AddScoped<IItemService, ItemService>();

builder.Services.AddScoped<JwtHelper>();
builder.Services.AddTransient<IStreakService, StreakService>();

builder.Services.AddHttpClient<FatSecretService>();
builder.Services.AddScoped<FatSecretService>();

builder.Services.AddScoped<IItemsRepository, ItemsRepository>();
builder.Services.AddScoped<IItemCaloriesRepository, ItemCaloriesRepository>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true /*change later*/,
            ValidateAudience = false /*change later*/,
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

builder.Services.AddScoped<NotesType>();
builder.Services.AddScoped<DaysType>();
builder.Services.AddScoped<ItemsInputType>();
builder.Services.AddScoped<ItemsResponseType>();
builder.Services.AddScoped<ItemCaloriesType>();
builder.Services.AddScoped<RegisterInputType>();
builder.Services.AddScoped<ItemShortType>();

// Register GraphQL Schema 
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


app.MapGet("/", async (FatSecretService fatSecret) =>
{
    //int foodId = 33691;
    var json = await fatSecret.GetFoodByNameAsync("appl", 3);
    return Results.Content(json, "application/json");
});

// GraphQL endpoint
app.UseGraphQL<ISchema>("/graphql");
app.UseGraphQLGraphiQL("/ui/graphiql"); //last trouble with paths

// GraphQL UI
//app.UseGraphQLGraphiQL("/ui/graphiql", new GraphiQLOptions());
app.UseGraphQLPlayground("/graphql/playground", new PlaygroundOptions
{
    GraphQLEndPoint = "/graphql",
    SubscriptionsEndPoint = "/graphql",
});

app.MapControllers();

app.Run();