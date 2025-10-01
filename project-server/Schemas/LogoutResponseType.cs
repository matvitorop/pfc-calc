using GraphQL.Types;

namespace project_server.Schemas
{
    public class LogoutResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class LogoutResponseType : ObjectGraphType<LogoutResponse>
    {
        public LogoutResponseType()
        {
            Field(x => x.Success).Description("Logout success status");
            Field(x => x.Message).Description("Logout message");
        }
    }
}
