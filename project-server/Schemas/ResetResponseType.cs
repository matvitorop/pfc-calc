using GraphQL.Types;

namespace project_server.Schemas
{
    public class ResetResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int? CurrentStreak { get; set; }
    }

    public class ResetResponseType : ObjectGraphType<ResetResponse>
    {
        public ResetResponseType()
        {
            Name = "ResetResponse";
            Description = "Represents the result of checking or resetting the user's visit streak.";

            Field(x => x.Success)
                .Description("Indicates whether the operation was successful.");

            Field(x => x.Message, nullable: true)
                .Description("Describes what happened during the operation.");

            Field(x => x.CurrentStreak, nullable: true)
                .Description("The user's current visit streak after validation (if applicable).");
        }
    }

}
