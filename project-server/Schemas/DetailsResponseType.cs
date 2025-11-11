using GraphQL.Types;
using project_server.Models_part;

namespace project_server.Schemas
{
    public class DetailsResponse
    {
        public Users? UserDatails { get; set; }
    }

    public class UserPublicType : ObjectGraphType<Users>
    {
        public UserPublicType()
        {
            Name = "UserPublic";
            Field(x => x.Id).Description("User's id");
            Field(x => x.Username).Description("User's name");
            Field(x => x.Email).Description("User's email");
            Field(x => x.Age).Description("User's age");
            Field(x => x.Weight).Description("User's weight");
            Field(x => x.Height).Description("User's height");
            Field(x => x.ActivityCoefId).Description("Activity coefficient ID");
            Field(x => x.DietId).Description("Diet ID");
            Field(x => x.CaloriesStandard).Description("Standard calories");
            Field(x => x.VisitsStreak).Description("User`s visit streak");
        }
    }

    public class DetailsResponseType : ObjectGraphType<DetailsResponse>
    {
        public DetailsResponseType()
        {
            Name = "DetailsResponse";
            Field<UserPublicType>("userDetails").Resolve(context => context.Source.UserDatails);
        }
    }
}