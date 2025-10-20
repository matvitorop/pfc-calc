using GraphQL.Types;
using project_server.Models;

namespace project_server.Services
{
    public class ItemShortType : ObjectGraphType<ItemShortDTO>
    {
        public ItemShortType()
        {
            Field(x => x.Id).Description("Item ID");
            Field(x => x.Name).Description("Item name");
        }
    }
}
