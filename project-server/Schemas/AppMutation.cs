using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using project_server.Models;
using project_server.Models_part;
using project_server.Repositories.Day;
using project_server.Repositories.Item;
using project_server.Repositories.ItemCalorie;
using project_server.Repositories_part;
using project_server.Schemas;
using project_server.Services;
using project_server.Services_part;
using static GraphQL.Validation.Rules.OverlappingFieldsCanBeMerged;

namespace project_server.Schemas
{
    public class AppMutation : ObjectGraphType
{
        public AppMutation(IUserService userService,
            JwtHelper _jwtHelper,
            IStreakService _counterChangerService,
            IDaysRepository _daysRepository,
            IMealTypeRepository _mealTypeRepository,
            INotesRepository _notesRepository,
            IItemsRepository _itemsRepository,
            IItemService _itemService,

            IItemCaloriesRepository _caloriesRepository,
            IDaysService _daysService)

        {
            Field<ApiResponseGraphType<AuthResponseType, AuthResponse>>("loginUser")
            .Arguments(new QueryArguments(
            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "email" },
            new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "password" }
            ))
            .ResolveAsync(async context =>
                {
                    var email = context.GetArgument<string>("email");
                    var password = context.GetArgument<string>("password");

                    var user = await userService.AuthenticateAsync(email, password);

                    if (user == null)
                    {
                        return ApiResponse<AuthResponse>.Fail("Invalid Credentials");
                    }

                    var jwt = _jwtHelper.GenerateToken(user);

                    if (context.UserContext is GraphQLUserContext userContext && userContext.HttpContext != null)
                    {
                        userContext.HttpContext.Response.Cookies.Append("jwt", jwt, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.None,
                            Expires = DateTimeOffset.UtcNow.AddHours(10)
                        });
                    }

                    return ApiResponse<AuthResponse>.Ok(new AuthResponse
                    {
                        Token = jwt
                    }, "Login successful");
                });

            Field<ApiResponseGraphType<AuthResponseType, AuthResponse>>("registerUser")
            .Argument<RegisterInputType>("user", "registering user data")
            .ResolveAsync(async context =>
            {
                try
                {
                    var user = context.GetArgument<Users>("user");

                    var registeredUser = await userService.RegisterAsync(
                        user.Email, user.HashPass, user.Username,
                        user.Age, user.Weight, user.Height,
                        0, user.ActivityCoefId, user.DietId, user.CaloriesStandard
                    );

                    if (registeredUser != null)
                    {
                        var jwt = _jwtHelper.GenerateToken(user);


                        if (context.UserContext is GraphQLUserContext userContext && userContext.HttpContext != null)
                        {
                            userContext.HttpContext.Response.Cookies.Append("jwt", jwt, new CookieOptions
                            {
                                HttpOnly = true,
                                Secure = false,
                                SameSite = SameSiteMode.None,
                                Expires = DateTimeOffset.UtcNow.AddHours(10)
                            });
                        }

                        return ApiResponse<AuthResponse>.Ok(new AuthResponse
                        {
                            Token = jwt
                        }, "Registration successful");

                    }
                    else
                    {
                        return ApiResponse<AuthResponse>.Fail("Registration failed");
                    }
                }
                catch (Exception ex)
                {
                    return ApiResponse<AuthResponse>.Fail($"Registration failed: {ex.Message}");
                }
            });

            Field<ApiResponseGraphType<NoContentGraphType, NoContent>>("logout")
            .Authorize()
            .ResolveAsync(async context =>
            {
                if (context.UserContext is GraphQLUserContext userContext && userContext.HttpContext != null)
                {
                    userContext.HttpContext.Request.Cookies.TryGetValue("jwt", out var jwt);
                    userContext.HttpContext.Response.Cookies.Delete("jwt");

                    return ApiResponse<NoContent>.Ok(new NoContent(), "Logout successful");
                }

                return ApiResponse<NoContent>.Fail("Logout failed");
            });

            Field<ApiResponseGraphType<DetailsResponseType, DetailsResponse>>("changeDetails")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DetailsInputType>> { Name = "details" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {

                try
                {
                    var input = context.GetArgument<DetailsInput>("details");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                    var user = await userService.UpdateUserDetailsAsync(userId.Value, input.FieldName, input.Value);

                    if (user == null)
                        return ApiResponse<DetailsResponse>.Fail("User not found");
                    //return new DetailsResponse { Success = false, Message = "User not found", Data = null };

                    var property = typeof(Users).GetProperty(input.FieldName);
                    if (property == null)
                        return ApiResponse<DetailsResponse>.Fail($"Field '{input.FieldName}' not found");
                        //return new DetailsResponse { Success = false, Message = $"Field '{input.FieldName}' not found", Data = null };

                    var dataUser = new Users { Id = user.Id };
                    property.SetValue(dataUser, property.GetValue(user));

                    return ApiResponse<DetailsResponse>.Ok(new DetailsResponse
                    {
                        UserDatails = dataUser
                    }, $"{input.FieldName} changed successfully");

                }catch(Exception ex)
                {
                    return ApiResponse<DetailsResponse>.Fail($"User`s details changing failed:  {ex.Message}");
                }
                
            });

            Field<ApiResponseGraphType<ResetResponseType, ResetResponse>>("checkForStreakReset")
            .Authorize()
            .ResolveAsync(async context =>
            {
                var userId = context.GetUserId(_jwtHelper);

                var recentDays = await _daysRepository.GetDaysAsync(userId ?? 0, null, 2);

                var result = await _counterChangerService.CheckForStreakResetAsync(context.GetUserEmail(_jwtHelper), recentDays);

                return ApiResponse<ResetResponse>.Ok(
                    new ResetResponse
                    {
                        CurrentStreak = result
                    }, "Streak changed successfully");

            });

            Field<ApiResponseGraphType<MealTypesResponseType, MealTypesResponse>>("addMealType")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
            ))
            .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    var userId = context.GetUserId(_jwtHelper);

                    var mealTypes = await _mealTypeRepository.CreateAsync(userId.Value, name);

                    if (mealTypes == null)
                    {
                        return ApiResponse<MealTypesResponse>.Fail("Failed to add meal type");
                    }

                    return ApiResponse<MealTypesResponse>.Ok(new MealTypesResponse
                    {
                        Items = new List<MealTypes> { mealTypes }
                    }, "Meal type added successfully");
                });

            Field<ApiResponseGraphType<MealTypesResponseType, MealTypesResponse>>("deleteMealType")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
            ))
            .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    var userId = context.GetUserId(_jwtHelper);

                    var deletedMealType = await _mealTypeRepository.DeleteByNameAsync(userId.Value, name);

                    if (deletedMealType == null)
                    {
                        return ApiResponse<MealTypesResponse>.Fail("Failed to delete meal type");
                    }

                    return ApiResponse<MealTypesResponse>.Ok(new MealTypesResponse
                    {
                        Items = new List<MealTypes> { await _mealTypeRepository.DeleteByNameAsync(userId.Value, name) }
                    }, "Meal type deleted successfully");

                });

            Field<MealTypesType>("changeMealTypeName")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
                ))
                .ResolveAsync(async context =>
                {
                    var name = context.GetArgument<string>("name");
                    var id = context.GetArgument<int>("id");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    return await _mealTypeRepository.UpdateNameByIdAsync(userId.Value, id, name);
                }
                );
            
            Field<MealTypesType>("deleteMealTypeById")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }
                ))
                .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");

                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    return await _mealTypeRepository.DeleteByIdAsync(userId.Value, id);
                }
                );

            Field<DaysResponseType>("addItemForDay")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DaysInputType>> { Name = "item" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                try
                {

                    var input = context.GetArgument<DaysInput>("item");

                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                    var userEmail = _jwtHelper.GetEmailFromToken(userContext.User);

                    var recentDays = await _daysRepository.GetDaysAsync(userId ?? 0, null, 2);
                    var streakChangeresult = await _counterChangerService.ChangeCounterAsync(userEmail, recentDays);
                    if (streakChangeresult == null)
                        return new DaysResponse { Success = false, Message = "Changing counter failed", Data = null };

                    var result = await _daysService.AddItemForDayAsync(userId.Value, input.Day, input.MealTypeId, input.Item, input.Measurement);
                    if (result == null)
                        return new DaysResponse { Success = false, Message = "User not found", Data = null };


                    return new DaysResponse
                    {
                        Success = true,
                        Message = "Item added to day successfully",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new DaysResponse
                    {
                        Success = false,
                        Message = $"Adding item to day failed: {ex.Message}",
                        Data = null
                    };
                }

            });

            Field<DaysResponseType>("changeMeasurement")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                new QueryArgument<NonNullGraphType<FloatGraphType>> { Name = "measurement" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                try
                {
                    int dayId = context.GetArgument<int>("id");
                    double measurement = context.GetArgument<double>("measurement");

                    var result = await _daysService.ChangeMeasurementAsync(dayId, measurement);
                    if (result == null)
                    {
                        return new DaysResponse
                        {
                            Success = false,
                            Message = "Unable to change measurement — specified day not exist",
                            Data = result,
                        };
                    }
                    return new DaysResponse
                    {
                        Success = true,
                        Message = "Changed measurement of item in Day successfully",
                        Data = result,
                    };
                }
                catch (Exception ex)
                {
                    return new DaysResponse
                    {
                        Success = false,
                        Message = $"Changing measurement failed: {ex.Message}",
                        Data = null,
                    };
                }


            });

            Field<DaysResponseType>("deleteItemFromDay")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" }
            ))
            .Authorize()
            .ResolveAsync(async context =>
            {
                try
                {
                    int dayId = context.GetArgument<int>("id");
                    var result = await _daysService.DeleteItemFromDayAsync(dayId);
                    if (result == null)
                    {

                        return new DaysResponse
                        {
                            Success = false,
                            Message = "Unable to delete day`s record, specified day  not exist",
                            Data = result,
                        };
                    }
                    return new DaysResponse
                    {
                        Success = true,
                        Message = "Day`s record was deleted successfully",
                        Data = result,
                    };
                }
                catch (Exception ex)
                {
                    return new DaysResponse
                    {
                        Success = false,
                        Message = $"Day`s record deleting failed: {ex.Message}",
                        Data = null,
                    };

                }
            });


            Field<NoteResponseType>("addNote")
                .Authorize()
                .Arguments(new QueryArguments(
                        new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "title" },
                        new QueryArgument<DateTimeGraphType> { Name = "dueDate" }
                    )
                )
                .ResolveAsync(async context =>
                {
                    //try
                    //{
                    //    Success = false,
                    //    Message = "Logout failed - no HTTP context"
                    //
                    //};
                    var title = context.GetArgument<string>("title");
                    var dueDate = context.GetArgument<DateTime?>("dueDate");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    var result = await _notesRepository.AddNoteAsync(userId.Value, title, dueDate);

                    if (result != null)
                    {
                        return new NoteResponse
                        {
                            Success = true,
                            Note = result,
                            Message = "Нотатка створена"
                        };
                    }
                    else
                    {
                        return new NoteResponse
                        {
                            Success = false,
                            Note = null,
                            Message = "Не вдалося створити нотатку"
                        };
                    };
                

                //catch (Exception ex){
                //return new NoteResponse
                //{
                //    Success = false,
                //    Note = null,
                //    Message = "Помилка: " + ex.Message
                //};
            });
            
           Field<NoteResponseType>("deleteNote")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" })
            )
            .ResolveAsync(async context =>
            {
                try
                {
                    var id = context.GetArgument<int>("id");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);

                    var result = await _notesRepository.DeleteNoteAsync(id, userId.Value);

                    if (result != null)
                    {
                        return new NoteResponse
                        {
                            Success = true,
                            Note = result,
                            Message = "Нотатка видалена"
                        };
                    }
                    else
                    {
                        return new NoteResponse
                        {
                            Success = false,
                            Note = null,
                            Message = "Нотатка не знайдена"
                        };
                    }
                }
                catch (Exception ex)
                {
                    return new NoteResponse
                    {
                        Success = false,
                        Note = null,
                        Message = "Помилка: " + ex.Message
                    };
                }
            });

            Field<NoteResponseType>("completeNote")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" })
                )
                .ResolveAsync(async context =>
                 {
                     try
                     {
                         var id = context.GetArgument<int>("id");
                         var userContext = context.UserContext as GraphQLUserContext;
                         var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                         var result = await _notesRepository.CompleteNoteAsync(id, userId.Value);
                         if (result != null)
                         {
                             return new NoteResponse
                             {
                                 Success = true,
                                 Note = result,
                                 Message = "Нотатка виконана"
                             };
                         }
                         else
                         {
                             return new NoteResponse
                             {
                                 Success = false,
                                 Note = null,
                                 Message = "Нотатка не знайдена або вже виконана"
                             };
                         }
                     }
                     catch (Exception ex)
                     {
                         return new NoteResponse
                         {
                             Success = false,
                             Note = null,
                             Message = $"Помилка: {ex.Message}"
                         };
                     }
                 });

            // Restore note
            Field<NoteResponseType>("restoreNote")
                .Authorize()
                .Arguments(new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" })
                )
                .ResolveAsync(async context =>
            {
                try
                {
                    var id = context.GetArgument<int>("id");
                    var userContext = context.UserContext as GraphQLUserContext;
                    var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                    var result = await _notesRepository.RestoreNoteAsync(id, userId.Value);
        
                    if (result != null)
                    {
                        return new NoteResponse
                        {
                            Success = true,
                            Note = result,
                            Message = "Нотатка відновлена"
                        };
                    }
                    else
                    {
                        return new NoteResponse
                        {
                            Success = false,
                            Note = null,
                            Message = "Нотатка не знайдена або вже активна"
                        };
                    }
                }
                catch (Exception ex)
                {
                    return new NoteResponse
                    {
                        Success = false,
                        Note = null,
                        Message = $"Помилка: {ex.Message}"
                    };
                }
            });

            //ITEMS
            Field<ItemsResponseType>("addCustomItem")
                  .Authorize()
                  .Arguments(new QueryArguments(
                          new QueryArgument<NonNullGraphType<ItemsInputType>> { Name = "customItem" },
                          new QueryArgument<FloatGraphType> { Name = "calories" }
                      )
                  )
                  .ResolveAsync(async context =>
              {
                  try
                  {
                      var input = context.GetArgument<ItemsInput>("customItem");
                      var calories = context.GetArgument<double?>("calories");
                      var userContext = context.UserContext as GraphQLUserContext;
                      var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
        
                      if (string.IsNullOrEmpty(input.Name))
                      {
                          return new ItemsResponse
                          {
                              Success = false,
                              Item = null,
                              Message = "Назва продукту обов'язкова"
                          };
                      }
                      double finalCalories;
                      if (!calories.HasValue)
                      {
                          var calculatedCalories = _itemService.CalculateCalories(
                              input.Carbs.Value,
                              input.Proteins.Value,
                              input.Fats.Value
                          );
                          if (!calculatedCalories.HasValue)
                          {
                              return new ItemsResponse
                              {
                                  Success = false,
                                  Item = null,
                                  Message = "Вкажіть калорії або хоча б один з показників: білки, жири або вуглеводи"
                              };
                          }
        
                          finalCalories = calculatedCalories.Value;
                      }
                      else
                      {
                          finalCalories = calories.Value;
                      }
                      double proteins = input.Proteins ?? 0;
                      double fats = input.Fats ?? 0;
                      double carbs = input.Carbs ?? 0;
                      var item = new Items
                      {
                          UserId = userId,
                          Name = input.Name,
                          Description = input.Description,
                          Proteins = proteins,
                          Fats = fats,
                          Carbs = carbs,
                          ApiId = null
                      };
                      var createdItem = await _itemsRepository.AddItemAsync(item);
                      if (createdItem == null)
                      {
                          return new ItemsResponse
                          {
                              Success = false,
                              Item = null,
                              Message = "Не вдалося створити продукт"
                          };
                      }
        
                      var itemCalories = new ItemCalories
                      {
                          ItemId = createdItem.Id,
                          Calories = (float)finalCalories
                      };
                      var addedCalories = await _itemService.AddItemAsync(itemCalories, createdItem);
                      if (addedCalories == null)
                      {
                          return new ItemsResponse
                          {
                              Success = false,
                              Item = createdItem,
                              Message = "Продукт створено, але не вдалося додати калорії"
                          };
                      }
                      return new ItemsResponse
                      {
                          Success = true,
                          Item = createdItem,
                          Message = "Продукт успішно додано"
                      };
                  }
                  catch (Exception ex)
                  {
                      return new ItemsResponse
                      {
                          Success = false,
                          Item = null,
                          Message = "Помилка: " + ex.Message
                      };
                  }
              });

            Field<ItemsResponseType>("changeCustomItem")
            .Authorize()
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<ItemsUpdateInputType>> { Name = "updateCustomItem" },
                new QueryArgument<FloatGraphType> { Name = "calories" }
            ))
            .ResolveAsync(async context =>
        {
            try
            {
                var input = context.GetArgument<ItemsUpdateInput>("updateCustomItem");
                var calories = context.GetArgument<double?>("calories");
                var userContext = context.UserContext as GraphQLUserContext;
                var userId = _jwtHelper.GetUserIdFromToken(userContext.User);
                if (string.IsNullOrEmpty(input.Name))
                {
                    return new ItemsResponse
                    {
                        Success = false,
                        Item = null,
                        Message = "Назва продукту обов'язкова"
                    };
                }
        
                double finalCalories;
                if (!calories.HasValue)
                {
                    var calculatedCalories = _itemService.CalculateCalories(
                        input.Carbs.Value,
                        input.Proteins.Value,
                        input.Fats.Value
                    );
                    if (!calculatedCalories.HasValue)
                    {
                        return new ItemsResponse
                        {
                            Success = false,
                            Item = null,
                            Message = "Вкажіть калорії або хоча б один з показників: білки, жири або вуглеводи"
                        };
                    }
                    finalCalories = calculatedCalories.Value;
                }
                else
                {
                    finalCalories = calories.Value;
                }
                double proteins = input.Proteins ?? 0;
                double fats = input.Fats ?? 0;
                double carbs = input.Carbs ?? 0;
        
                var updatedItem = await _itemsRepository.ChangeItemAsync(
                    input.Id,
                    null,
                    userId.Value,
                    input.Name,
                    proteins,
                    fats,
                    carbs,
                    input.Description
                );
        
                if (updatedItem == null)
                {
                    return new ItemsResponse
                    {
                        Success = false,
                        Item = null,
                        Message = "Продукт не знайдено або не вдалося оновити"
                    };
                }
        
                var existingCalories = await _caloriesRepository.GetItemAsync(input.Id);
                if (existingCalories != null)
                {
                    existingCalories.Calories = finalCalories;
                    await _caloriesRepository.UpdateItemCaloriesAsync(existingCalories);
                }
                else
                {
                    var itemCalories = new ItemCalories
                    {
                        ItemId = updatedItem.Id,
                        Calories = finalCalories
                    };
                    await _itemService.AddItemAsync(itemCalories, updatedItem);
                }
        
                return new ItemsResponse
                {
                    Success = true,
                    Item = updatedItem,
                    Message = "Продукт успішно оновлено"
                };
            }
        
            catch (Exception ex)
            {
                return new ItemsResponse
                {
                    Success = false,
                    Item = null,
                    Message = "Помилка: " + ex.Message
                };
            }
        });    
    
        }


  }
}