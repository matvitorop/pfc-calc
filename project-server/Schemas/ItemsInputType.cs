using GraphQL.Types;
using project_server.Schemas;
using project_server.Models;

namespace project_server.Schemas;

public class ItemsInput
{
//    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public double? Proteins { get; set; }
    public double? Fats { get; set; }
    public double? Carbs { get; set; }
}
public class ItemsInputType : InputObjectGraphType<ItemsInput>    //чому записуємо в Items а не в ItemsInput
{
    public ItemsInputType()
    {   Name = "customItem";
//        Field(x => x.Id);
//        Field(x => x.UserId, nullable: true); //бере з токена, тому непотрібно 24.10
        Field(x => x.Name);
        Field(x => x.Proteins, nullable: true);
        Field(x => x.Fats, nullable: true);
        Field(x => x.Carbs, nullable: true);
        Field(x => x.Description, nullable: true);
//        Field(x => x.ApiId, nullable: true);
    }
}