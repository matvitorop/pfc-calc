using project_server.Models_part;
using project_server.Repositories_part;
using project_server.Services_part;

var builder = WebApplication.CreateBuilder(args);

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMealTypeRepository, MealTypeRepository>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

var app = builder.Build();


Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
var app = builder.Build();
app.MapGet("/", () => "Hello World");


// Test endpoint to register and authenticate a user
app.MapGet("/test-user", async (IUserService userService) =>
{
    var user = await userService.RegisterAsync("test@example1.com", "1234567", "Tester");
    if (user == null) return Results.BadRequest("User already exists");

    var auth = await userService.AuthenticateAsync("test@example1.com", "1234567");
    return auth != null ? Results.Ok(auth) : Results.Unauthorized();
});

app.MapGet("/test-notes", async (INotesRepository notesRepo) =>
{
    int testUserId = 1;
    string testTitle = "Test Note";

    var newNote = await notesRepo.AddNoteAsync(testUserId, testTitle, DateTime.UtcNow.AddDays(3));

    var activeNotes = await notesRepo.GetActiveNotesAsync(testUserId);

    Notes? completedNote = null;
    if (activeNotes.Any())
    {
        completedNote = await notesRepo.CompleteNoteAsync(activeNotes.First().Id);
    }

    var completedNotes = await notesRepo.GetCompletedNotesAsync(testUserId);

    return Results.Ok(new
    {
        NewNote = newNote,
        ActiveNotes = activeNotes,
        CompletedNote = completedNote,
        CompletedNotes = completedNotes
    });
});

app.MapGet("/test-mealtypes", async (IMealTypeRepository mealTypeRepo) =>
{
    var mealTypes = await mealTypeRepo.CreateAsync(1, "Breakfast");
    return Results.Ok(mealTypes);
});

app.Run();