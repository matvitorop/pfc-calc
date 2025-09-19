using Microsoft.Data.SqlClient;
var builder = WebApplication.CreateBuilder(args);


Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
var app = builder.Build();
app.MapGet("/", () => "Hello World");

app.Run();
