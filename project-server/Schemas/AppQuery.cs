using GraphQL;
using GraphQL.Types;
using project_server.Services;
using GraphQL.Authorization;

namespace project_server.Schemas
{
    public class AppQuery : ObjectGraphType
    {
        public AppQuery()
        {
            Field<StringGraphType>("publicHello")
                .Resolve(context => "Hello world (public)");

            Field<StringGraphType>("privateHello")
                .Resolve(context => "Hello world (private)")
                .Authorize();
        }
    }
}
