using GraphQL.Types;
using project_server.Models_part;

namespace project_server.Schemas
{
    public class RegisterInputType : InputObjectGraphType<Users>
    {
        public RegisterInputType()
        {
            Name = "RegisterInput";
            Field(x => x.Email).Description("User's email address");
            Field(x => x.HashPass).Description("User's password");
            Field(x => x.Username).Description("User's username");
            Field(x => x.Age).Description("User's birth date");
            Field(x => x.Weight).Description("User's weight");
            Field(x => x.Height).Description("User's height");
            Field(x => x.ActivityCoefId).Description("User's activity coefficient ID");
            Field(x => x.DietId).Description("User's diet ID");
        }
    }
}
