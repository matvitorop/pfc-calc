using GraphQL.Types;
using project_server.Models_part;


namespace project_server.Schemas;

public class NoteResponse
{
    public bool Success { get; set; }
    public Notes? Note { get; set; }
    public string Message { get; set; }
}

public class NoteResponseType : ObjectGraphType<NoteResponse>
{
        public NoteResponseType()
        {
            Field(x => x.Success);
            Field(x => x.Note, nullable: true, type: typeof(NotesType));
            Field(x => x.Message);
        }
}