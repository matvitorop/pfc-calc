using GraphQL;
using GraphQL.Types;
using project_server.Services;
using GraphQL.Authorization;

using project_server.Repositories;
using project_server.Repositories.ActivityCoef;
using project_server.Repositories.Diet;
using project_server.Repositories_part;
using project_server.Repositories.Item;

namespace project_server.Schemas
{
    public class AppQuery : ObjectGraphType
    {
        public AppQuery(IActivityCoefficientsRepository activityCoefRepository,
            IDietsRepository dietsRepository, IUserRepository userRepository,
            JwtHelper _jwtHelper, IMealTypeRepository _mealTypeRepository,
            IItemsRepository _itemsRepository, IDaysService _daysService)
        {

            Field<ListGraphType<ActivityCoefficientsResponseType>>("getCoef")
               .ResolveAsync(async context => await activityCoefRepository.GetAcitivityCoefsAsync());

            Field<ListGraphType<DietsResponseType>>("getDiets")
                .ResolveAsync(async context => await dietsRepository.GetDietsAsync());

            //Field<DetailsResponseType>("getDetails")
            //.Authorize()
            //.ResolveAsync(async context =>
            //{
            //    var userContext = context.UserContext as GraphQLUserContext;
            //    var userEmail = _jwtHelper.GetEmailFromToken(userContext?.User);
            //
            //    if (userEmail == null)
            //    {
            //        return new DetailsResponse
            //        {
            //            Success = false,
            //            Message = "User not authenticated",
            //            Data = null
            //        };
            //    }
            //
            //    var user = await userRepository.GetByEmailAsync(userEmail);
            //
            //    if (user == null)
            //    {
            //        return new DetailsResponse
            //        {
            //            Success = false,
            //            Message = "User not found",
            //            Data = null
            //        };
            //    }
            //
            //    return new DetailsResponse
            //    {
            //        Success = true,
            //        Message = "User details retrieved successfully",
            //        Data = user
            //    };
            //});

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

            Field<ListGraphType<ItemShortType>>("searchItems")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "query" }
            ))
            .ResolveAsync(async context =>
            {
                var query = context.GetArgument<string>("query");
                var userContext = context.UserContext as GraphQLUserContext;
                var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

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
                var userContext = context.UserContext as GraphQLUserContext;
                var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

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
        }

    }    
}
