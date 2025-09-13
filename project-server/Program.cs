using Microsoft.Data.SqlClient;
var builder = WebApplication.CreateBuilder(args);


string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");


builder.Services.AddScoped<SqlConnection>(_ => new SqlConnection(connectionString));
var app = builder.Build();
app.MapGet("/", () => "Hello World");

app.Run();
