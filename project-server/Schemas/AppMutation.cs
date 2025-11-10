using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
            IMealTypeRepository _mealTypeRepository)
        {
            Field<ApiResponseGraphType<AuthResponseType, AuthResponse>>("loginUser")
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
                        return ApiResponse<AuthResponse>.Fail("Invalid Credentials");
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

                    return ApiResponse<AuthResponse>.Ok(new AuthResponse
                    {
                        Token = jwt
                    }, "Login successful");
                });

            Field<ApiResponseGraphType<AuthResponseType, AuthResponse>>("registerUser")
            .Argument<RegisterInputType>("user", "registering user data")
            .ResolveAsync(async context =>
            {
                try
                {
                    var user = context.GetArgument<Users>("user");
                    
                    var registeredUser = await userService.RegisterAsync(
                        user.Email, user.HashPass, user.Username,
                        user.Age, user.Weight, user.Height,
                        0, user.ActivityCoefId, user.DietId, user.CaloriesStandard
                    );
            
                    if (registeredUser != null)
                    {
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

                        return ApiResponse<AuthResponse>.Ok(new AuthResponse
                        {
                            Token = jwt
                        }, "Registration successful");

                    }
                    else
                    {
                        return ApiResponse<AuthResponse>.Fail("Registration failed");
                    }
                }
                catch (Exception ex)
                {
                    return ApiResponse<AuthResponse>.Fail($"Registration failed: {ex.Message}");
                }
            });

            Field<ApiResponseGraphType<NoContentGraphType, NoContent>>("logout")
            .Authorize()
            .ResolveAsync(async context =>
            {
                if (context.UserContext is GraphQLUserContext userContext && userContext.HttpContext != null)
                {
                    userContext.HttpContext.Request.Cookies.TryGetValue("jwt", out var jwt);
                    userContext.HttpContext.Response.Cookies.Delete("jwt");
            
                    return ApiResponse<NoContent>.Ok(new NoContent(), "Logout successful");
                }
            
                return ApiResponse<NoContent>.Fail("Logout failed");
            });

            Field<ApiResponseGraphType<DetailsResponseType, DetailsResponse>>("changeDetails")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DetailsInputType>> { Name = "details" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                var input = context.GetArgument<DetailsInput>("details");
                var userId = context.GetUserId(_jwtHelper);

                if (!userId.HasValue)
                {
                    return ApiResponse<DetailsResponse>.Fail("User not authenticated or token invalid");
                }

                var user = await userService.UpdateUserDetailsAsync(userId.Value, input.FieldName, input.Value);

                if (user == null)
                    return ApiResponse<DetailsResponse>.Fail("User not fouund");

                var property = typeof(Users).GetProperty(input.FieldName);
                if (property == null)
                    return ApiResponse<DetailsResponse>.Fail($"Field '{input.FieldName}' not found");

                var dataUser = new Users { Id = user.Id };
                property.SetValue(dataUser, property.GetValue(user));

                return ApiResponse<DetailsResponse>.Ok(
                    new DetailsResponse
                    {
                        UserDatails = dataUser
                    },
                    $"{input.FieldName} changed successfully"
                );
            });

            Field<ApiResponseGraphType<ResetResponseType, ResetResponse>>("checkForStreakReset")
            .Authorize()
            .ResolveAsync(async context =>
            {
                var userId = context.GetUserId(_jwtHelper);

                var recentDays = await _daysRepository.GetDaysAsync(userId ?? 0, null, 2);

                var result = await _counterChangerService.CheckForStreakResetAsync(context.GetUserEmail(_jwtHelper), recentDays);

                return ApiResponse<ResetResponse>.Ok(
                    new ResetResponse
                    {
                        CurrentStreak = result
                    }, "Streak changed successfully");
            
            });
        
            Field<ApiResponseGraphType<MealTypesResponseType, MealTypesResponse>>("addMealType")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
            ))
            .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    var userId = context.GetUserId(_jwtHelper);

                    var mealTypes = await _mealTypeRepository.CreateAsync(userId.Value, name);

                    if (mealTypes == null)
                    {
                        return ApiResponse<MealTypesResponse>.Fail("Failed to add meal type");
                    }

                    return ApiResponse<MealTypesResponse>.Ok(new MealTypesResponse
                    {
                        Items = new List<MealTypes> { mealTypes }
                    }, "Meal type added successfully");
                });

            Field<ApiResponseGraphType<MealTypesResponseType, MealTypesResponse>>("deleteMealType")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
            ))
            .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    var userId = context.GetUserId(_jwtHelper);

                    var deletedMealType = await _mealTypeRepository.DeleteByNameAsync(userId.Value, name);

                    if (deletedMealType == null)
                    {
                        return ApiResponse<MealTypesResponse>.Fail("Failed to delete meal type");
                    }
                    
                    return ApiResponse<MealTypesResponse>.Ok(new MealTypesResponse
                    {
                        Items = new List<MealTypes> { await _mealTypeRepository.DeleteByNameAsync(userId.Value, name) }
                    }, "Meal type deleted successfully");

                });
        }
    }

}