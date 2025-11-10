using GraphQL;
using project_server.Services;

namespace project_server.Schemas
{
    public static class GraphQLExtensions
    {
        public static int? GetUserId(this IResolveFieldContext context, JwtHelper jwtHelper)
        {
            var userContext = context.UserContext as GraphQLUserContext;
            return jwtHelper.GetUserIdFromToken(userContext?.User);
        }

        public static string? GetUserEmail(this IResolveFieldContext context, JwtHelper jwtHelper)
        {
            var userContext = context.UserContext as GraphQLUserContext;
            return jwtHelper.GetEmailFromToken(userContext?.User);
        }
    }
}
