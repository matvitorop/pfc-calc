using project_server.Services;
using project_server.Models;
using project_server.Interfaces;
using project_server.Repositories;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);
Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.MapGet("/", () => "Hello World");

app.Run();
