using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using project_server.Models_part;
using project_server.Services;
using project_server.Services_part;

namespace project_server.Schemas
{
    public class AppMutation : ObjectGraphType
    {
        public AppMutation(IUserService userService)
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

            var jwt = JwtHelper.GenerateToken(user);

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
        });


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
            .ResolveAsync(async context =>
            {
                try
                {
                    var input = context.GetArgument<DetailsInput>("details");

                    var userId = JwtHelper.GetUserIdFromToken(context.As<GraphQLUserContext>().User);

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
                }
                catch (Exception ex)
                {
                    throw new GraphQL.ExecutionError($"Error in changeDetails: {ex.Message}", ex);
                }
            })
           .Authorize();



        }



        
    }

}

