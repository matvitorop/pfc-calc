using GraphQL.Types;

namespace project_server.Schemas
{
    public class LoginResponseType : ObjectGraphType<LoginResponse>
    {
        public LoginResponseType()
        {
            Field(x => x.Token).Description("JWT token");
            Field(x => x.Message).Description("Status message");
            Field(x => x.Success).Description("Login success status");
        }
    }
}
