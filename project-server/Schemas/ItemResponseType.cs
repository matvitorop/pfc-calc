using GraphQL.Types;
using project_server.Models_part;
using project_server.Models;


namespace project_server.Schemas;

    public class ItemsResponse
    {
        public bool Success { get; set; }
        public Items? Item { get; set; }
        public string Message { get; set; }
    }

    public class ItemsResponseType : ObjectGraphType<ItemsResponse>
    {
        public ItemsResponseType()
        {
            Field(x => x.Success);
            Field(x => x.Item, nullable: true, type: typeof(ItemsType));
            Field(x => x.Message);
        }
    }