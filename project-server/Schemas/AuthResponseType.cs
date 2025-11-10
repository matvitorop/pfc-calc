using GraphQL.Types;

namespace project_server.Schemas
{
    public class AuthResponseType : ObjectGraphType<AuthResponse>
    {
        public AuthResponseType()
        {
            Name = "LoginResponse";
            Field(x => x.Token, nullable: true).Description("JWT token");
        }
    }
}
