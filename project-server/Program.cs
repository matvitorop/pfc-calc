var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
app.MapGet("/", () => "Hello World");

app.Run();
