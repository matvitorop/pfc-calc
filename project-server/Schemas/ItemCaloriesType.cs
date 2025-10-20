using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas;

public class ItemCaloriesType : ObjectGraphType<ItemCalories>
{
    public ItemCaloriesType()
    {
        Field(x => x.Id);
        Field(x => x.ItemId);
        Field(x => x.Calories);
    }
}