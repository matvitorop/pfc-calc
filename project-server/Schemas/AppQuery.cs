using GraphQL;
using GraphQL.Types;
using project_server.Services;
using GraphQL.Authorization;
using project_server.Repositories_part;

namespace project_server.Schemas
{
    public class AppQuery : ObjectGraphType
    {
        public AppQuery(JwtHelper _jwtHelper, IMealTypeRepository _mealTypeRepository)    
        {
            Field<StringGraphType>("publicHello")
                .Resolve(context => "Hello world (public)");

            Field<StringGraphType>("privateHello")
                .Resolve(context => "Hello world (private)")
                .Authorize();

            Field<ListGraphType<MealTypesType>>("getUserMealTypes")
                .Authorize()
                .ResolveAsync(async context =>
                {
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
           
                    return await _mealTypeRepository.GetByUserIdAsync(userId.Value);
                });
        }
    }
}
