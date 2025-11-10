using GraphQL;
using GraphQL.Types;
using project_server.Services;
using GraphQL.Authorization;
using project_server.Repositories;
using project_server.Repositories.ActivityCoef;
using project_server.Repositories.Diet;
using project_server.Repositories_part;
using project_server.Repositories.Day;

using project_server.Repositories.Item;
// ПОДУМАТИ НАД ОБГОРТКОЮ КЛАСУ
namespace project_server.Schemas
{
    public class AppQuery : ObjectGraphType
    {
        public AppQuery(IActivityCoefficientsRepository activityCoefRepository,
            IDietsRepository dietsRepository, IUserRepository userRepository,
            JwtHelper _jwtHelper, IMealTypeRepository _mealTypeRepository,
            IItemsRepository _itemsRepository, IDaysService _daysService,
            INotesRepository _notesRepository, IDaysRepository _daysRepository)

        {

            Field<ListGraphType<ActivityCoefficientsResponseType>>("getCoef")
                .ResolveAsync(async context => await activityCoefRepository.GetAcitivityCoefsAsync());

            Field<ListGraphType<DietsResponseType>>("getDiets")
                .ResolveAsync(async context => await dietsRepository.GetDietsAsync());

            Field<BooleanGraphType>("isAuthorized")               
                .ResolveAsync(async context =>
                {
                    var userId = context.GetUserId(_jwtHelper);

                    if (userId == null || userId <= 0)
                        return false;

                    return true;
                });

            Field<DetailsResponseType>("getDetails")
            .Authorize()
            .ResolveAsync(async context =>
            {
                var userEmail = context.GetUserEmail(_jwtHelper);

                if (userEmail == null)
                {
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userEmail = _jwtHelper.GetEmailFromToken(userContext?.User);

                    if (userEmail == null)
                    {
                        UserDatails = null
                    };
                }
            
                var user = await userRepository.GetByEmailAsync(userEmail);
            
                if (user == null)
                {
                    return new DetailsResponse
                    {
                        UserDatails = null
                    };
                }
            
                return new DetailsResponse
                {
                    UserDatails = user
                };
            });

            Field<StringGraphType>("privateHello")
            .Resolve(context => "Hello world (private)")
            .Authorize();

            Field<ListGraphType<MealTypesType>>("getUserMealTypes")
            .Authorize()
            .ResolveAsync(async context =>
            {
                var userId = context.GetUserId(_jwtHelper);

                return await _mealTypeRepository.GetByUserIdAsync(userId.Value);
            });

            Field<ListGraphType<ItemShortType>>("searchItems")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "query" }
            ))
            .ResolveAsync(async context =>
            {
                var query = context.GetArgument<string>("query");
                var userId = context.GetUserId(_jwtHelper);

                return await _itemsRepository.SearchItemsByNameAsync(query, userId.Value);
            });

            Field<ItemsResponseType>("getSearchedItem")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "query" }
            ))
            .ResolveAsync(async context =>
            {
                var query = context.GetArgument<string>("query");
                var userId = context.GetUserId(_jwtHelper);

                return await _itemsRepository.GetItemAsync(query, userId.Value);
            });

            Field<ListGraphType<UserDayItemType>>("getSummary")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "day" }
            ))
            .ResolveAsync(async context =>
            {
                var day = context.GetArgument<DateTime>("day");
                var userContext = context.UserContext as GraphQLUserContext;
                var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                return await _daysService.GetUserSummaryAsync(userId.Value, day);
            });
            
            Field<ListGraphType<NotesType>>("getActiveNotes")
                .Authorize()
                .ResolveAsync(async context =>
                    {
                        var userContext = context.UserContext as GraphQLUserContext;
                        var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                        return await _notesRepository.GetActiveNotesAsync(userId.Value);
                    }
                );
            Field<ListGraphType<NotesType>>("getCompletedNotes")
                .Authorize()
                .ResolveAsync(async context =>
                    {
                        var userContext = context.UserContext as GraphQLUserContext;
                        var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                        return await _notesRepository.GetCompletedNotesAsync(userId.Value);
                    }
                );
            //DAYS
            Field<ListGraphType<DaysType>>("getDays")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<DateTimeGraphType> { Name = "day" },
                    new QueryArgument<IntGraphType> { Name = "limit" }
                ))
                .ResolveAsync(async context =>
                {
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                    var day = context.GetArgument<DateTime?>("day");
                    var limit = context.GetArgument<int?>("limit");

                    return await _daysRepository.GetDaysAsync(userId.Value, day, limit);
                });
        }

    }    
}
