using GraphQL.Types;

namespace project_server.Schemas
{
    public class NoContentGraphType : ObjectGraphType<NoContent>
    {
        public NoContentGraphType()
        {
            Name = "NoContent";
            Description = "Empty response for operations that return no data";

            Field(x => x.Plug).Description("A placeholder field");
        }
    }
}
