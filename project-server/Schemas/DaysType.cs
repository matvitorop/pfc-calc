using GraphQL.Types;
using project_server.Schemas;
using project_server.Models;

namespace project_server.Schemas;

public class DaysType : ObjectGraphType<Days>
{
    public DaysType()
    {
        Field(x => x.Id);
        Field(x => x.UserId);
        Field(x => x.Day);
        Field(x => x.MealTypeId, nullable: true);
        Field(x => x.ItemId);
        Field(x => x.Measurement);
    }
}