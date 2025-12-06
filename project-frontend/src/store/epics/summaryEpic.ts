import type { Days } from '../../models/Days';
import { ofType } from 'redux-observable';
import { from, tap } from 'rxjs';
import { addItemToSummary, addItemToSummarySuccess, addItemToSummaryFailure, deleteItemFromSummary, deleteItemFromSummarySuccess, deleteItemFromSummaryFailure } from '../reducers/summarySlice';
import { mergeMap, map, catchError, of } from 'rxjs';
import { graphqlFetch } from '../../GraphQL/fetchRequest';
import type { PayloadAction } from '@reduxjs/toolkit';

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
                map(res => {
                    if (res.errors?.length) {
                        return addItemToSummaryFailure(res.errors[0].message);
                    }

                    const response = res.data?.addItemForDay;

                    if (!response || !response.success) {
                        return addItemToSummaryFailure(response?.message ?? 'Failed to add item');
                    }

                    return addItemToSummarySuccess(response.data);
                }),
                catchError(err => of(addItemToSummaryFailure(err.message))),
            ),
        ),
    );


export const deleteItemFromSummaryEpic = (action$: any) =>
    action$.pipe(
        ofType(deleteItemFromSummary.type),
        mergeMap((action: PayloadAction<number>) =>
            from(
                graphqlFetch<{
                    deleteItemFromDay: { success: boolean; message: string; data: { id: number } }
                }>(deleteItemMutation, { id: action.payload }, true)
            ).pipe(
                map(res => {
                    if (res.errors?.length) {
                        return deleteItemFromSummaryFailure(res.errors[0].message);
                    }

                    const response = res.data?.deleteItemFromDay;

                    if (!response || !response.success) {
                        return deleteItemFromSummaryFailure(response?.message ?? 'Failed to delete item');
                    }

                    return deleteItemFromSummarySuccess(response.data.id);
                }),
                catchError(err => of(deleteItemFromSummaryFailure(err.message))),
            ),
        ),
    );