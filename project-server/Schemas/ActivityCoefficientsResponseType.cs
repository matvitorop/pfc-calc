using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas
{
    public class ActivityCoefficientsResponseType : ObjectGraphType<ActivityCoefficients>
    {
        public ActivityCoefficientsResponseType() {
            Field(x => x.Id).Description("The unique indentificator of the activity coefficient");
            Field(x => x.Name).Description("The name and some description of the activity coefficient");
            Field(x => x.Value).Description("The float value of the activity coefficient");
        
        }
    }
}
