import { combineEpics } from 'redux-observable';
import { type Epic, ofType } from 'redux-observable';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import type { AppDispatch } from '../store';
import type { RootState } from '../reducers/rootReducer';
import type { Action } from 'redux';
import { graphqlFetch } from '../../GraphQL/fetchRequest';
import {
    fetchUserDetails,
    fetchUserDetailsSuccess,
    fetchUserDetailsFailure,
    updateUserDetails,
    updateUserDetailsSuccess,
    updateUserDetailsFailure,
    logoutUser,
    logoutUserSuccess,
    logoutUserFailure,
} from '../reducers/userSlice';
import type { User } from '../../models/User';
import type { Days } from '../../models/Days';
import { fetchDays, fetchDaysFailure, fetchDaysSuccess } from '../reducers/daysSlice';
import {
    createMeal,
    createMealFailure,
    createMealSuccess,
    deleteMeal,
    deleteMealFailure,
    deleteMealSuccess,
    fetchMeals,
    fetchMealsFailure,
    fetchMealsSuccess,
    updateMeal,
    updateMealFailure,
    updateMealSuccess,
    type MealType,
} from '../reducers/mealTypeSlice';
import { fetchCoefEpic } from './coefEpic';
import { fetchDietsEpic } from './dietEpic';
import { addItemToSummaryEpic } from './summaryEpic';

interface GetUserResponse {
    getDetails: {
        success: boolean;
        message: string;
        data: User;
    };
}

interface ChangeDetailsResponse {
    changeDetails: {
        success: boolean;
        message: string;
        data: User;
    };
}

interface LogoutResponse {
    logout: {
        success: boolean;
        message: string;
    };
}

interface GetDaysResponse {
    getDays: Days[];
}

const GET_SUMMARY = `
  query($day:DateTime) {
    getSummary(day:$day) {
      id
      userId
      day
      mealTypeId
      itemId
      measurement
      name
      proteins
      fats
      carbs
      description
      apiId
      calories
    }
  }
`;

const GET_DAYS = `
    query($day:DateTime,$limit:Int, $daysBack: Int){
        getDays(day: $day, limit: $limit,daysBack:$daysBack){
            userId
            day
            mealTypeId
            itemId
            measurement
        }
    }`;

const GET_USER = `
  query {
  getDetails {
    success
    message
    data {
      id
      age
      weight
      height
      activityCoefId
      dietId
      caloriesStandard
    }
  }
}
`;

const UPDATE_USER = `
  mutation ChangeDetails($fieldName: String!,$value:String!) {
  changeDetails(details:{fieldName: $fieldName,value: $value}) 
  {
    success
    message
    data {
      id
      age
      weight
      height
      activityCoefId
      dietId
      caloriesStandard
    }
  }
}
`;

const LOGOUT_USER = `
  mutation Logout {
  logout {
    success
    message
  }
}
`;

const GET_MEAL_TYPES = `
 query {
  getUserMealTypes {
    success
    message
    data {
      id
      name
    }
  }
}
`;
const CREATE_MEAL = `
 mutation AddMealType($name:String!) {
  addMealType(name: $name) 
  {
    id
    name
  }
}
`;

const UPDATE_MEAL_NAME = `
 mutation ChangeMealTypeName($id: Int!,$name:String!) {
  changeMealTypeName(id: $id,name: $name) 
  {
    id
    name
  }
}
`;

const DELETE_MEAL = `
 mutation DeleteMealTypeById($id:Int!) {
  deleteMealTypeById(id: $id) 
  {
    id
    name
  }
}
`;

type UpdateUserAction = ReturnType<typeof updateUserDetails>;
type UpdateUserMeal = ReturnType<typeof updateMeal>;
type createUserMeal = ReturnType<typeof createMeal>;
type deleteUserMeal = ReturnType<typeof deleteMeal>;
type getDays = ReturnType<typeof fetchDays>;
type MyEpic = Epic<Action, Action, RootState, AppDispatch>;

export const fetchSummaryEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(fetchDays.type),
        switchMap(() =>
            from(graphqlFetch<GetDaysResponse>(GET_SUMMARY, { day: new Date().toISOString() })).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchDaysFailure(res.errors[0].message);
                    }

                    const result = res.data?.getDays;
                    if (!result) {
                        return fetchDaysFailure('No data received');
                    }

                    return fetchDaysSuccess(result);
                }),
                catchError(err => of(fetchDaysFailure(err.message || 'Unexpected error while fetching days'))),
            ),
        ),
    );

export const fetchDaysEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(fetchDays.type),
        switchMap((action: getDays) => {
            const day = action.payload?.day;
            const limit = action.payload?.limit;
            const daysBack = action.payload?.daysBack;
            return from(graphqlFetch<GetDaysResponse>(GET_DAYS, { day: day ? new Date(day).toISOString() : null, limit, daysBack })).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchDaysFailure(res.errors[0].message);
                    }

                    const result = res.data?.getDays;
                    if (!result) {
                        return fetchDaysFailure('No data received');
                    }

                    return fetchDaysSuccess(result);
                }),
                catchError(err => of(fetchDaysFailure(err.message || 'Unexpected error while fetching days'))),
            );
        }),
    );

export const fetchUser: MyEpic = action$ =>
    action$.pipe(
        ofType(fetchUserDetails.type),
        switchMap(() =>
            from(graphqlFetch<GetUserResponse>(GET_USER)).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchUserDetailsFailure(res.errors[0].message);
                    }

                    const result = res.data?.getDetails;
                    if (!result?.success) {
                        return fetchUserDetailsFailure(result?.message || 'Failed to load user');
                    }

                    return fetchUserDetailsSuccess(result.data);
                }),
                catchError(err => of(fetchUserDetailsFailure(err.message || 'Unexpected error while fetching user'))),
            ),
        ),
    );

export const updateUser: MyEpic = action$ =>
    action$.pipe(
        ofType(updateUserDetails.type),
        switchMap((action: UpdateUserAction) => {
            const { fieldName, value } = action.payload;

            return from(graphqlFetch<ChangeDetailsResponse>(UPDATE_USER, { fieldName, value })).pipe(
                map(res => {
                    if (res.errors) {
                        return updateUserDetailsFailure(res.errors[0].message);
                    }

                    const result = res.data?.changeDetails;
                    if (!result?.success) {
                        return updateUserDetailsFailure(result?.message || 'Failed to update');
                    }

                    return updateUserDetailsSuccess(result.data);
                }),
                catchError(err => of(updateUserDetailsFailure(err.message || 'Unexpected error while updating'))),
            );
        }),
    );

export const logout: MyEpic = action$ =>
    action$.pipe(
        ofType(logoutUser.type),
        switchMap(() =>
            from(graphqlFetch<LogoutResponse>(LOGOUT_USER, {}, true)).pipe(
                map(res => {
                    if (res.errors) {
                        return logoutUserFailure(res.errors[0].message);
                    }

                    const result = res.data?.logout;
                    if (!result?.success) {
                        return logoutUserFailure(result?.message || 'Logout failed');
                    }

                    return logoutUserSuccess();
                }),
                catchError(err => of(logoutUserFailure(err.message || 'Unexpected error while logout'))),
            ),
        ),
    );

export const fetchMealsEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(fetchMeals.type),
        switchMap(() =>
            from(graphqlFetch<MealType[]>(GET_MEAL_TYPES)).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchMealsFailure(res.errors[0].message);
                    }

                    const result = res?.data;
                    if (!result) {
                        return fetchMealsFailure('No data received');
                    }

                    return fetchMealsSuccess(result);
                }),
                catchError(err => of(fetchMealsFailure(err.message || 'Unexpected error while fetching users mealTypes'))),
            ),
        ),
    );

export const createMealEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(createMeal.type),
        switchMap((action: createUserMeal) => {
            const name = action.payload;

            return from(graphqlFetch<MealType>(CREATE_MEAL, { name })).pipe(
                map(res => {
                    if (res.errors) {
                        return createMealFailure(res.errors[0].message);
                    }

                    const result = res.data;
                    if (!result) {
                        return createMealFailure('Failed to update');
                    }

                    return createMealSuccess(result);
                }),
                catchError(err => of(createMealFailure(err.message || 'Unexpected error while creating meal'))),
            );
        }),
    );

export const deleteMealEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(deleteMeal.type),
        switchMap((action: deleteUserMeal) => {
            const id = action.payload;

            return from(graphqlFetch<MealType>(DELETE_MEAL, { id })).pipe(
                map(res => {
                    if (res.errors) {
                        return deleteMealFailure(res.errors[0].message);
                    }

                    const result = res.data;
                    if (!result) {
                        return deleteMealFailure('Failed to update');
                    }

                    return deleteMealSuccess(result);
                }),
                catchError(err => of(deleteMealFailure(err.message || 'Unexpected error while creating meal'))),
            );
        }),
    );
// think about return type of updating meal on back
export const updateMealEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(updateMeal.type),
        switchMap((action: UpdateUserMeal) => {
            const { id, name } = action.payload;

            return from(graphqlFetch<MealType>(UPDATE_MEAL_NAME, { id, name })).pipe(
                map(res => {
                    if (res.errors) {
                        return updateMealFailure(res.errors[0].message);
                    }

                    const result = res.data;
                    if (!result) {
                        return updateMealFailure('Failed to update');
                    }

                    return updateMealSuccess(result);
                }),
                catchError(err => of(updateMealFailure(err.message || 'Unexpected error while updating'))),
            );
        }),
    );


export const rootEpic = combineEpics(
    fetchCoefEpic,
    fetchDietsEpic,
    fetchUser,
    updateUser,
    logout,
    fetchSummaryEpic,
    fetchMealsEpic,
    updateMealEpic,
    createMealEpic,
    deleteMealEpic,
    addItemToSummaryEpic
);
