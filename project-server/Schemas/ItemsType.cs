using GraphQL.Types;
using project_server.Schemas;
using project_server.Models;
using project_server.Repositories;
using project_server.Repositories_part;
using project_server.Models_part;
using project_server.Repositories.ItemCalorie;

namespace project_server.Schemas;

    public class ItemsType : ObjectGraphType<Items>    
    {
        public ItemsType(IItemCaloriesRepository itemCaloriesRepository)
        {   Name = "ItemFull";
            Field(x => x.Id);
            Field(x => x.UserId, nullable: true);
            Field(x => x.Name);
            Field(x => x.Proteins, nullable: true);
            Field(x => x.Fats, nullable: true);
            Field(x => x.Carbs, nullable: true);
            Field(x => x.Description, nullable: true);
            Field(x => x.ApiId, nullable: true);
            
            Field<FloatGraphType>("calories")
                .ResolveAsync(async context =>
                {
                    var item = context.Source as Items;
                    var itemCalories = await itemCaloriesRepository.GetItemAsync(item.Id);
                    return itemCalories?.Calories;
                });
        }
        
    }
