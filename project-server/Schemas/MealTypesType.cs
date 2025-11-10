using GraphQL.Types;
using project_server.Models_part;

namespace project_server.Schemas
{
    public class MealTypesResponse
    {
        public IEnumerable<MealTypes>? Items { get; set; }
    }

    public class MealTypesType : ObjectGraphType<MealTypes>
    {
        public MealTypesType()
        {
            Field(x => x.Id).Description("The ID of the Meal Type.");
            Field(x => x.UserId).Description("User`s Id which meal type is it");
            Field(x => x.Name).Description("Name of mealtype");
        }
    }

    public class MealTypesResponseType : ObjectGraphType<MealTypesResponse>
    {
        public MealTypesResponseType()
        {
            Name = "MealTypesResponse";
            Field<ListGraphType<MealTypesType>>("items")
                .Resolve(context => context.Source.Items);
        }
    }
}
