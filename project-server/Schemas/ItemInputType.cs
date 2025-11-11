using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas
{
    public class ItemInputType : InputObjectGraphType<Items>
    {
        public ItemInputType()
        {
            Name = "ItemInput";
            Field(x => x.Id).Description("Item ID");
            Field(x => x.UserId).Description("User ID");
            Field(x => x.Name).Description("Item name");
            Field(x => x.Proteins).Description("Item proteins");
            Field(x => x.Fats).Description("Item fats");
            Field(x => x.Carbs).Description("Item carbohydrates");
            Field(x => x.Description).Description("Item description");
            Field(x => x.ApiId).Description("Item API ID");
        }
    }
}
