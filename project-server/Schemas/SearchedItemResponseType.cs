using project_server.Models;
using GraphQL.Types;

namespace project_server.Schemas
{
    public class SearchedItemResponseType : ObjectGraphType<ExtendedItemDTO>
    {
        public SearchedItemResponseType() {
            Name = "searchedItemResponse";
            Field(x => x.Id);
            Field(x => x.UserId, nullable: true);
            Field(x => x.Name);
            Field(x => x.Proteins, nullable: true);
            Field(x => x.Fats, nullable: true);
            Field(x => x.Carbs, nullable: true);
            Field(x => x.Description, nullable: true);
            Field(x => x.ApiId, nullable: true);
            Field(x => x.Calories, nullable: true);
        }
    }
}
