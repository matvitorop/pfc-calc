﻿using GraphQL;
using GraphQL.Types;
using project_server.Services;
using GraphQL.Authorization;
using project_server.Repositories;
using project_server.Repositories.ActivityCoef;
using project_server.Repositories.Diet;
using project_server.Repositories_part;
namespace project_server.Schemas
{
    public class AppQuery : ObjectGraphType
    {
        public AppQuery(IActivityCoefficientsRepository activityCoefRepository,
            IDietsRepository dietsRepository, IUserRepository userRepository)
        {
            //Field<StringGraphType>("publicHello")
            //    .Resolve(context => "Hello world (public)");

            //Field<StringGraphType>("privateHello")
            //    .Resolve(context => "Hello world (private)")
            //    .Authorize();

            Field<ListGraphType<ActivityCoefficientsResponseType>>("getCoef")
               .ResolveAsync(async context => await activityCoefRepository.GetAcitivityCoefsAsync());

            Field<ListGraphType<DietsResponseType>>("getDiets")
                .ResolveAsync(async context => await dietsRepository.GetDietsAsync());

            Field<DetailsResponseType>("getDetails")
            .ResolveAsync(async context =>
            {
                var userContext = context.UserContext as GraphQLUserContext;
                var userEmail = JwtHelper.GetEmailFromToken(userContext?.User);

                if (userEmail == null)
                {
                    return new DetailsResponse
                    {
                        Success = false,
                        Message = "User not authenticated",
                        Data = null
                    };
                }

                var user = await userRepository.GetByEmailAsync(userEmail);

                if (user == null)
                {
                    return new DetailsResponse
                    {
                        Success = false,
                        Message = "User not found",
                        Data = null
                    };
                }

                return new DetailsResponse
                {
                    Success = true,
                    Message = "User details retrieved successfully",
                    Data = user
                };
            })
            .Authorize();
            }
        }
}
