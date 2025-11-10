using GraphQL.Types;
using project_server.Models;

namespace project_server.Schemas
{
    public class UserDayItemType : ObjectGraphType<UserDayItemDTO>
    {
        public UserDayItemType()
        {
            Field(x => x.Id).Description("The ID of the user day item.");
            Field(x => x.UserId, nullable: true).Description("The ID of the user.");
            Field(x => x.Day).Description("The day of the item.");
            Field(x => x.MealTypeId).Description("The meal type ID.");
            Field(x => x.ItemId).Description("The item ID.");
            Field(x => x.Measurement).Description("The measurement of the item.");
            Field(x => x.Name, nullable: true).Description("The name of the item.");
            Field(x => x.Proteins, nullable: true).Description("The protein content of the item.");
            Field(x => x.Fats, nullable: true).Description("The fat content of the item.");
            Field(x => x.Carbs, nullable: true).Description("The carbohydrate content of the item.");
            Field(x => x.Description, nullable: true).Description("The description of the item.");
            Field(x => x.ApiId, nullable: true).Description("The API ID of the item.");
            Field(x => x.Calories, nullable: true).Description("The calorie content of the item.");
        }
    }
}
