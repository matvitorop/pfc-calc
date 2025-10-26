using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas
{   


    public class DaysInput
    {
        public DateTime Day { get; set; }
        public int? MealTypeId { get; set; }
        public Items Item { get; set; } 
        public double Measurement { get; set; }
    }

    
    public class DaysInputType : InputObjectGraphType<DaysInput>
    {
        public DaysInputType()
        {
            Name = "DaysInputType";
            Field(x => x.Day).Description("The Day when was added Item to Days");
            Field(x => x.MealTypeId).Description("The ID of Mealtype for added Item");
            Field<ItemInputType>("Item").Description("The Item added to Days");
            Field(x => x.Measurement).Description("The Measuremant of the item");
        }
    }
}
