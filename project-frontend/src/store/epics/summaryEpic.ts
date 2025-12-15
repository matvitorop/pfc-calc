/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Days } from '../../models/Days';
import { ofType } from 'redux-observable';
import { from, tap } from 'rxjs';
import {
    addItemToSummary,
    addItemToSummarySuccess,
    addItemToSummaryFailure,
    deleteItemFromSummary,
    deleteItemFromSummarySuccess,
    deleteItemFromSummaryFailure,
    updateItemSummary,
    type UpdateSummaryPayload,
    updateItemSummaryFailure,
    updateItemSummarySuccess,
} from '../reducers/summarySlice';
import { mergeMap, map, catchError, of } from 'rxjs';
import { graphqlFetch } from '../../GraphQL/fetchRequest';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchUserDetails } from '../reducers/userSlice';

interface updateItemResponse {
    changeMeasurement: {
        success: boolean;
        message: string;
        data: Days;
    };
}

const addItemMutation = `
mutation AddItemForDay($item: DaysInputType!) {
  addItemForDay(item: $item) {
    success
    message
    data {
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
}
`;

const updateItemMutation = `
mutation updateItemMeasurement($id:Int!,$measurement:Float!) {
  changeMeasurement(id:$id,measurement:$measurement) {
    success
    message
    data {
        id
        measurement
    }
  }
}
`;

const deleteItemMutation = `
mutation DeleteDay($id:Int!) {
  deleteItemFromDay(id:$id) {
    success
    message
    data {
      id
    }
  }
}
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addItemToSummaryEpic = (action$: any) =>
    action$.pipe(
        ofType(addItemToSummary.type),
        tap(a => console.log('Epic caught action:', a)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mergeMap((action: any) =>
            from(
                graphqlFetch<{ addItemForDay: { success: boolean; message: string; data: Days } }>(addItemMutation, { item: action.payload }, true),
            ).pipe(
                mergeMap(res => {
                    if (res.errors?.length) {
                        return of(addItemToSummaryFailure(res.errors[0].message));
                    }

                    const response = res.data?.addItemForDay;

                    if (!response || !response.success) {
                        return of(addItemToSummaryFailure(response?.message ?? 'Failed to add item'));
                    }

                    const successAction = addItemToSummarySuccess(response.data);

                    const refreshUserAction = fetchUserDetails();
                    return from([successAction, refreshUserAction]);
                }),
                catchError(err => of(addItemToSummaryFailure(err.message))),
            ),
        ),
    );

export const updateItemSummaryEpic = (action$: any) =>
    action$.pipe(
        ofType(updateItemSummary.type),
        mergeMap((action: PayloadAction<UpdateSummaryPayload>) =>
            from(graphqlFetch<updateItemResponse>(updateItemMutation, { id: action.payload.id, measurement: action.payload.measurement }, true)).pipe(
                map(res => {
                    if (res.errors?.length) {
                        return updateItemSummaryFailure(res.errors[0].message);
                    }

                    const response = res.data?.changeMeasurement;

                    if (!response || !response.success) {
                        return updateItemSummaryFailure(response?.message ?? 'Failed to delete item');
                    }

                    return updateItemSummarySuccess(response.data);
                }),
                catchError(err => of(deleteItemFromSummaryFailure(err.message))),
            ),
        ),
    );

export const deleteItemFromSummaryEpic = (action$: any) =>
    action$.pipe(
        ofType(deleteItemFromSummary.type),
        mergeMap((action: any) =>
            from(
                graphqlFetch<{
                    deleteItemFromDay: { success: boolean; message: string; data: { id: number } };
                }>(deleteItemMutation, { id: action.payload }, true),
            ).pipe(
                mergeMap(res => {
                    if (res.errors?.length) {
                        return of(deleteItemFromSummaryFailure(res.errors[0].message));
                    }

                    const response = res.data?.deleteItemFromDay;

                    if (!response || !response.success) {
                        return of(deleteItemFromSummaryFailure(response?.message ?? 'Failed to delete item'));
                    }

                    const successAction = deleteItemFromSummarySuccess(response.data.id);
                    const refreshUserAction = fetchUserDetails();

                    return from([successAction, refreshUserAction]);
                }),
                catchError(err => of(deleteItemFromSummaryFailure(err.message))),
            ),
        ),
    );
