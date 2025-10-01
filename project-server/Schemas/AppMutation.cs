using GraphQL;
using GraphQL.Types;
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
        }
    }
}