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
import { fetchSummary, fetchSummaryFailure, fetchSummarySuccess } from '../reducers/summarySlice';

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

interface GetSummaryResponse {
    getSummary: Days[];
}
const GET_SUMMARY = `
  query {
    getSummary {
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

type UpdateUserAction = ReturnType<typeof updateUserDetails>;

type MyEpic = Epic<Action, Action, RootState, AppDispatch>;

export const fetchSummaryEpic: MyEpic = action$ =>
    action$.pipe(
        ofType(fetchSummary.type),
        switchMap(() =>
            from(graphqlFetch<GetSummaryResponse>(GET_SUMMARY)).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchSummaryFailure(res.errors[0].message);
                    }

                    const result = res.data?.getSummary;
                    if (!result) {
                        return fetchSummaryFailure('No data received');
                    }

                    return fetchSummarySuccess(result);
                }),
                catchError(err => of(fetchSummaryFailure(err.message || 'Unexpected error while fetching summary'))),
            ),
        ),
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
            from(graphqlFetch<LogoutResponse>(LOGOUT_USER)).pipe(
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

export const rootEpic = combineEpics(fetchUser, updateUser, logout);
