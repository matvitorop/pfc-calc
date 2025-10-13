using GraphQL.Types;
using project_server.Models_part;

namespace project_server.Schemas
{
    public class DetailsInput
    {
        public string FieldName { get; set; }
        public string Value { get; set; }
    }
    public class DetailsInputType: InputObjectGraphType<DetailsInput>
    {
        public DetailsInputType() {
            Name = "details";
            Field(x => x.FieldName).Description("name of the field that need change");
            Field(x => x.Value).Description("value of field to change");
        }

    }
}
