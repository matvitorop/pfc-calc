using GraphQL;
using GraphQL.Authorization;
using GraphQL.Server;
using GraphQL.Server.Ui.GraphiQL;
using GraphQL.Types;
using GraphQL.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using project_server.Models;
using project_server.Models_part;
using project_server.Repositories;
using project_server.Repositories_part;
using project_server.Schemas;
using project_server.Services;
using project_server.Services_part;
using System.Data;
using System.Text;

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
builder.Services.AddHttpContextAccessor();

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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Authenticated", policy => policy.RequireAuthenticatedUser());
});

builder.Services.AddHttpContextAccessor();

builder.Services
    .AddSingleton<GraphQL.Authorization.IAuthorizationEvaluator, AuthorizationEvaluator>()
    .AddSingleton(s =>
    {
        var authSettings = new AuthorizationSettings();
        authSettings.AddPolicy("Authenticated", _ => _.RequireAuthenticatedUser());
        //authSettings.DefaultPolicyName = "Authenticated";
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

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();


//app.MapGet("/test-login", async (IUserService userService) =>
//{
//    var auth = await userService.AuthenticateAsync("test@example1.com", "1234567");
//    return auth != null ? Results.Ok(auth) : Results.Unauthorized();
//});


app.UseGraphQL("/graphql");

app.UseGraphQLGraphiQL("/ui/graphiql", new GraphiQLOptions
{
    //Headers = new Dictionary<string, string>
    //{
    //    { "StorageType", "db" }
    //}
});

app.Run();