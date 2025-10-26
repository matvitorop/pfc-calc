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
            IMealTypeRepository _mealTypeRepository, IDaysService _daysServiсe)
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
                try
                {
                    var input = context.GetArgument<DetailsInput>("details");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
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
                }catch(Exception ex)
                {
                    return new DetailsResponse
                    {
                        Success = false,
                        Message = $"User`s details changing failed:  {ex.Message}",
                        Data = null,
                    };
                }
                
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

            Field<DaysResponseType>("addItemForDay")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DaysInputType>> { Name = "item" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                try
                {

                    var input = context.GetArgument<DaysInput>("item");

                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                    var userEmail = _jwtHelper.GetEmailFromToken(userContext.User);

                    var recentDays = await _daysRepository.GetDaysAsync(userId ?? 0, null, 2);
                    var streakChangeresult = await _counterChangerService.ChangeCounterAsync(userEmail, recentDays);
                    if (streakChangeresult == null)
                        return new DaysResponse { Success = false, Message = "Changing counter failed", Data = null };

                    var result = await _daysServiсe.AddItemForDayAsync(userId.Value, input.Day, input.MealTypeId, input.Item, input.Measurement);
                    if (result == null)
                        return new DaysResponse { Success = false, Message = "User not found", Data = null };


                    return new DaysResponse
                    {
                        Success = true,
                        Message = "Item added to day successfully",
                        Data = result
                    };
                }catch(Exception ex)
                {
                    return new DaysResponse
                    {
                        Success = false,
                        Message = $"Adding item to day failed: {ex.Message}",
                        Data = null
                    };
                }

            });

            Field<DaysResponseType>("changeMeasurement")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<FloatGraphType>> { Name = "measurement" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                try
                {
                    int dayId = context.GetArgument<int>("id");
                    double measurement = context.GetArgument<double>("measurement");

                    var result = await _daysServiсe.ChangeMeasurementAsync(dayId, measurement);
                    if (result == null)
                    {
                        return new DaysResponse
                        {
                            Success = false,
                            Message = "Unable to change measurement — specified day not exist",
                            Data = result,
                        };
                    }
                    return new DaysResponse
                    {
                        Success = true,
                        Message = "Changed measurement of item in Day successfully",
                        Data = result,
                    };
                }
                catch (Exception ex) {
                    return new DaysResponse {
                        Success = false,
                        Message = $"Changing measurement failed: {ex.Message}",
                        Data = null,
                    };
                }


            });

            Field<DaysResponseType>("deleteItemFromDay")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                try
                {
                    int dayId = context.GetArgument<int>("id");
                    var result = await _daysServiсe.DeleteItemFromDayAsync(dayId);
                    if (result == null)
                    {

                        return new DaysResponse
                        {
                            Success = false,
                            Message = "Unable to delete day`s record, specified day  not exist",
                            Data = result,
                        };
                    }
                    return new DaysResponse
                    {
                        Success = true,
                        Message = "Day`s record was deleted successfully",
                        Data = result,
                    };
                }
                catch (Exception ex)
                {
                    return new DaysResponse
                    {
                        Success = false,
                        Message = $"Day`s record deleting failed: {ex.Message}",
                        Data = null,
                    };

                }
            });
        }
    }

}