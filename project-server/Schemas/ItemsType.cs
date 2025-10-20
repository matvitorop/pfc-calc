using GraphQL.Types;
using project_server.Schemas;
using project_server.Models;

namespace project_server.Schemas;

public class ItemsType :ObjectGraphType<Items>
{
    public ItemsType()
    { Field(x => x.Id);
        Field(x => x.UserId, nullable: true);
        Field(x => x.Name);
        Field(x => x.Proteins);
        Field(x => x.Fats);
        Field(x => x.Carbs);
        Field(x => x.Description, nullable: true);
        Field(x => x.ApiId, nullable: true);
    }
}