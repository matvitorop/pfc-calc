using GraphQL;
using GraphQL.Authorization;
using GraphQL.Types;
using project_server.Models_part;

using project_server.Repositories;
using project_server.Repositories.ActivityCoef;
using project_server.Repositories.Day;
using project_server.Repositories.Diet;
using project_server.Repositories.Item;
using project_server.Repositories_part;
using project_server.Services;

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
                try
                {
                    var userEmail = context.GetUserEmail(_jwtHelper);
                    var user = await userRepository.GetByEmailAsync(userEmail);


                    return new DetailsResponse
                    {
                        // змінив поки без success, message
                        UserDatails = user
                    };
                }
                catch (Exception ex)
                {
                    return new DetailsResponse
                    {
                        // змінив поки без success, message
                        UserDatails = null
                    };
                }
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

            Field<SearchedItemResponseType>("getUserSearchedItemById")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }
            ))
            .ResolveAsync(async context =>
            {
                var query = context.GetArgument<int>("id");
                var userId = context.GetUserId(_jwtHelper);

                return await _itemsRepository.GetUserItemByIdAsync(query, userId.Value);
            });

            Field<ListGraphType<UserDayItemType>>("getSummary")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "day" }
            ))
            .ResolveAsync(async context =>
            {
                var day = context.GetArgument<DateTime>("day");
                //var userContext = context.UserContext as GraphQLUserContext;
                //var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                var userId = context.GetUserId(_jwtHelper);
                return await _daysService.GetUserSummaryAsync(userId.Value, day);
            });
            
            Field<ListGraphType<NotesType>>("getActiveNotes")
                .Authorize()
                .ResolveAsync(async context =>
                    {
                        //var userContext = context.UserContext as GraphQLUserContext;
                        //var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                        var userId = context.GetUserId(_jwtHelper);
                        return await _notesRepository.GetActiveNotesAsync(userId.Value);
                    }
                );
            Field<ListGraphType<NotesType>>("getCompletedNotes")
                .Authorize()
                .ResolveAsync(async context =>
                    {
                        //var userContext = context.UserContext as GraphQLUserContext;
                        //var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                        var userId = context.GetUserId(_jwtHelper);

                        return await _notesRepository.GetCompletedNotesAsync(userId.Value);
                    }
                );
            //DAYS
            Field<ListGraphType<DaysType>>("getDays")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<DateTimeGraphType> { Name = "day" },
                    new QueryArgument<IntGraphType> { Name = "limit" },
                     new QueryArgument<IntGraphType> { Name = "daysBack" }
                ))
                .ResolveAsync(async context =>
                {
                    //var userContext = context.UserContext as GraphQLUserContext;
                    //var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    var userId = context.GetUserId(_jwtHelper);
                    var day = context.GetArgument<DateTime?>("day");
                    var limit = context.GetArgument<int?>("limit");
                    var daysBack = context.GetArgument<int?>("daysBack");

                    return await _daysRepository.GetDaysAsync(userId.Value, day, limit,daysBack);
                });
        }

    }    
}
