using project_server.Repositories_part;
using project_server.Services_part;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMealTypeRepository, MealTypeRepository>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

var app = builder.Build();

app.MapGet("/", () => "Hello World");


// Test endpoint to register and authenticate a user
app.MapGet("/test-user", async (IUserService userService) =>
{
    var user = await userService.RegisterAsync("test@example.com", "123456", "Tester");
    if (user == null) return Results.BadRequest("User already exists");

    var auth = await userService.AuthenticateAsync("test@example.com", "123456");
    return auth != null ? Results.Ok($"Auth success: {auth.Username}") : Results.Unauthorized();
});

app.Run();