using GraphQL.Types;
using project_server.Schemas;
using project_server.Models;


namespace project_server.Schemas;

public class ItemsUpdateInput
{
    public int Id { get; set; } // require для update
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public double? Proteins { get; set; }
    public double? Fats { get; set; }
    public double? Carbs { get; set; }
}

public class ItemsUpdateInputType : InputObjectGraphType<ItemsUpdateInput>
    {
        public ItemsUpdateInputType()
        {
            Name = "updateCustomItem";

            Field(x => x.Id); // require для update
            Field(x => x.Name);
            Field(x => x.Description, nullable: true);
            Field(x => x.Proteins, nullable: true);
            Field(x => x.Fats, nullable: true);
            Field(x => x.Carbs, nullable: true);
        }
    }
    