using GraphQL;
using GraphQL.Authorization;
using GraphQL.Types;
using GraphQL.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using project_server.Repositories.Day;
using project_server.Repositories_part;
using project_server.Schemas;
using project_server.Services;
using project_server.Services_part;
using System.Diagnostics.Metrics;
using System.Text;

// =========== BUILDER ===========
var builder = WebApplication.CreateBuilder(args);

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

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMealTypeRepository, MealTypeRepository>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();
builder.Services.AddScoped<IDaysRepository, DaysRepository>();
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddTransient<ICounterChangerService, CounterChangerService>();

builder.Services.AddHttpContextAccessor();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true /*пізніше змінити*/,
            ValidateAudience = false /*пізніше змінити*/,
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

builder.Services.AddGraphQL(b => b
    .AddSystemTextJson()
    .AddGraphTypes()
    .AddAuthorizationRule()
    .AddUserContextBuilder(httpContext => new GraphQLUserContext
    {
        HttpContext = httpContext,
        User = httpContext.User
    }));

builder.Services.AddScoped<ISchema, AppSchema>();

// =========== BUILD ===========
var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.UseGraphQL("/graphql");

app.UseGraphQLGraphiQL("/ui/graphiql");

app.Run();