using GraphQL.Types;
using project_server.Models;
using project_server.Models_part;

namespace project_server.Schemas
{

    public class DaysResponse
    {
        public bool Success { get; set; }
        public Days? Data { get; set; }
        public string Message { get; set; }
    }

    public class DaysType : ObjectGraphType<Days>
    {
        public DaysType()
        {
            Name = "Days";
            Field(x => x.Id).Description("Days record ID");
            Field(x => x.UserId).Description("User ID");
            Field(x => x.Day).Description("Date of the day");
            Field(x => x.MealTypeId).Description("Meal type ID");
            Field(x => x.ItemId).Description("Item ID");
            Field(x => x.Measurement).Description("Measurement of the item");
        }
    }
    public class DaysResponseType : ObjectGraphType<DaysResponse>
    {
        public DaysResponseType() {
            Name = "DaysResponse";
            Field(x => x.Success).Description("Changing user's day success status");
            Field(x => x.Message).Description("Response message");
            Field<DaysType>("data").Resolve(context => context.Source.Data);

        }
    }
}
