using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas
{
    public class DietsResponseType : ObjectGraphType<Diets>
    {
        public DietsResponseType()
        {
            Field(x => x.Id).Description("The unique indentificator of the diet");
            Field(x => x.Name).Description("The name of the diet");
            Field(x => x.Description).Description("The description  of the diet");
            Field(x => x.CarbsPerc).Description("The persent of carbs of the diet");
            Field(x => x.FatsPerc).Description("The persent of fats of the diet");
            Field(x => x.ProteinPerc).Description("The persent of proteins of the diet");
        }
    }
}
