using System.Security.Claims;

namespace project_server.Services
{
    public class GraphQLUserContext : Dictionary<string, object>
    {
        public ClaimsPrincipal User { get; set; }
        public HttpContext HttpContext { get; set; }

    }
}