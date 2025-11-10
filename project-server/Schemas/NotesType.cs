using GraphQL.Types;
using project_server.Models_part;
using project_server.Models;
namespace project_server.Schemas;

public class NotesType : ObjectGraphType<Notes>
{
    public NotesType()
    {
        Field(x => x.Id);
        Field(x => x.UserId);
        Field(x => x.Title);
        Field(x => x.DueDate, nullable: true);
        Field(x => x.IsCompleted);
        Field(x => x.CompletedDate, nullable: true);
    }

}
