using GraphQL.Types;
using project_server.Schemas;
using project_server.Models;

namespace project_server.Schemas;

    public class ItemsResponseType : ObjectGraphType<Items>    
    {
        public ItemsResponseType()
        {   Name = "customItemResponse";
            Field(x => x.Id);
            Field(x => x.UserId, nullable: true);
            Field(x => x.Name);
            Field(x => x.Proteins, nullable: true);
            Field(x => x.Fats, nullable: true);
            Field(x => x.Carbs, nullable: true);
            Field(x => x.Description, nullable: true);
            Field(x => x.ApiId, nullable: true);
        }
        
    }
