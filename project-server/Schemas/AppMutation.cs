using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using project_server.Models_part;
using project_server.Repositories.Day;
using project_server.Repositories_part;
using project_server.Services;
using project_server.Services_part;

namespace project_server.Schemas
{
    public class AppMutation : ObjectGraphType
    {
        public AppMutation(IUserService userService, 
            JwtHelper _jwtHelper,
            IStreakService _counterChangerService, 
            IDaysRepository _daysRepository, 
            IMealTypeRepository _mealTypeRepository,
            INotesRepository _notesRepository)
        {
            Field<LoginResponseType>("loginUser")
            .Arguments(new QueryArguments(
            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "password" }
        ))
            .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");

                    var user = await userService.AuthenticateAsync(email, password);

                    if (user == null)
                    {
                        return new LoginResponse
                        {
                            Success = false,
                            Message = "Invalid username or password"
                        };
                    }

                    var jwt = _jwtHelper.GenerateToken(user);

                    if (context.UserContext is GraphQLUserContext userContext && userContext.HttpContext != null)
                    {
                        userContext.HttpContext.Response.Cookies.Append("jwt", jwt, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = false,                
                            SameSite = SameSiteMode.Strict,
                            Expires = DateTimeOffset.UtcNow.AddHours(1)
                        });
                    }

                    return new LoginResponse
                    {
                        Success = true,
                        Token = jwt,                    
                        Message = "Logged in successfully"
                    };
                }
            );

            Field<LogoutResponseType>("logout")
            .Authorize()
            .ResolveAsync(async context =>
            {
                if (context.UserContext is GraphQLUserContext userContext && userContext.HttpContext != null)
                {
                    userContext.HttpContext.Request.Cookies.TryGetValue("jwt", out var jwt);
                    userContext.HttpContext.Response.Cookies.Delete("jwt");

                    return new LogoutResponse
                    {
                        Success = true,
                        Message = $"Congrat, Logged out successfully, {jwt}"
                    };
                }

                return new LogoutResponse
                {
                    Success = false,
                    Message = "Logout failed - no HTTP context"
                };
            });

            Field<DetailsResponseType>("changeDetails")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DetailsInputType>> { Name = "details" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                
                var input = context.GetArgument<DetailsInput>("details");
                
                var userContext = context.UserContext as GraphQLUserContext;
                var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                
                if (!userId.HasValue)
                {
                    return new DetailsResponse
                    {
                        Success = false,
                        Message = "User not authenticated or token invalid",
                        Data = null
                    };
                }

                var user = await userService.UpdateUserDetailsAsync(userId.Value, input.FieldName, input.Value);

                if (user == null)
                    return new DetailsResponse { Success = false, Message = "User not found", Data = null };

                var property = typeof(Users).GetProperty(input.FieldName);
                if (property == null)
                    return new DetailsResponse { Success = false, Message = $"Field '{input.FieldName}' not found", Data = null };

                var dataUser = new Users { Id = user.Id };
                property.SetValue(dataUser, property.GetValue(user));

                return new DetailsResponse
                {
                    Success = true,
                    Message = $"{input.FieldName} changed successfully",
                    Data = dataUser
                };
                
                
            });

            Field<ResetResponseType>("checkForStreakReset")
            .Authorize()
            .ResolveAsync(async context =>
            {
                var userContext = context.UserContext as GraphQLUserContext;
                var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                var recentDays = await _daysRepository.GetDaysAsync(userId ?? 0, null, 2);

                var result = await _counterChangerService.CheckForStreakResetAsync(_jwtHelper.GetEmailFromToken(userContext.User), recentDays);

                // Overthink result later
                return new ResetResponse
                {
                    Success = true,
                    Message = result == null
                        ? $"Nothing to change {userId}"
                        : "Streak changed"
                };
            });
        
            Field<MealTypesType>("addMealType")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
                ))
                .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    return await _mealTypeRepository.CreateAsync(userId.Value, name);
                }
                );

            Field<MealTypesType>("deleteMealType")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
                ))
                .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    return await _mealTypeRepository.DeleteByNameAsync(userId.Value, name);
                }
                );
            
            //NOTES 
            Field<NotesType>("addNote")
                .Authorize()
                .Arguments(new QueryArguments(
                        new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "Title" },
                        new QueryArgument<DateTimeGraphType> { Name = "dueDate" },
                        new QueryArgument<BooleanGraphType> { Name = "isCompleted" }
                    )
                )
                .ResolveAsync(async context =>
                {
                    var title = context.GetArgument<string>("title");
                    var dueDate = context.GetArgument<DateTime?>("dueDate");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                    return await _notesRepository.AddNoteAsync(userId.Value, title, dueDate);
                });
          
        }
    }
}