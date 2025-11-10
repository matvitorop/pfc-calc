using GraphQL.Types;

namespace project_server.Schemas
{
    public class ApiResponseGraphType<Y, T> : ObjectGraphType<ApiResponse<T>>
        where Y : IGraphType
    {
        public ApiResponseGraphType()
        {
            Name = "ApiResponseOf" + typeof(T).Name;
            Description = "A generic API response wrapper.";
            
            Field(x => x.Success)
                .Description("Indicates whether the API call was successful.");
            
            Field(x => x.Message, nullable: true)
                .Description("A message providing additional information about the API call.");
            
            Field<Y>("data");
        }
    }
}
