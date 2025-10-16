using GraphQL.Types;
using project_server.Models;
using project_server.Models_part;

namespace project_server.Schemas
{
    public class ItemsResponse
    {
        public bool Success { get; set; }
        public Items? Data { get; set; }
        public string Message { get; set; }
    }
    public class ItemsResponseType : ObjectGraphType<ItemsResponse>
    {
        public ItemsResponseType()
        {
            Name = "ItemsResponse";
            Field(x => x.Success).Description("Getting user's adding item for a day success status");
            Field(x => x.Message).Description("Getted item");
            Field(x => x.Data).Description("The Item that was added");
        }
    }
}
