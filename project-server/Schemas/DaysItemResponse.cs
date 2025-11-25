using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas
{
    public class DaysItemResponse
    {
        public bool Success { get; set; }
        public UserDayItemDTO? Data { get; set; }
        public string Message { get; set; }
    }
    public class DaysItemResponseType : ObjectGraphType<DaysItemResponse>
    {
        public DaysItemResponseType()
        {
            Name = "DaysItemResponse";
            Field(x => x.Success).Description("Changing user's day success status");
            Field(x => x.Message).Description("Response message");
            Field<UserDayItemType>("data").Resolve(context => context.Source.Data);

        }
    }
}
