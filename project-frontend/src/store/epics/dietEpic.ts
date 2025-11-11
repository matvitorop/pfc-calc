import { fetchStart, fetchSuccess, fetchFailure } from '../diets/dietSlice';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { graphqlFetch } from '../../GraphQL/fetchRequest';
import type { Diet } from '../diets/dietSlice';

const getDiets = `
        query{
            getDiets{
                id
                name
                description
                proteinPerc
                carbsPerc
                fatsPerc
            }
        }`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchDietsEpic = (action$: any) =>
    action$.pipe(
        ofType(fetchStart.type),
        mergeMap(() =>
            from(graphqlFetch<{ getDiets: Diet[] }>(getDiets)).pipe(
                map(res => fetchSuccess(res.data?.getDiets ?? [])),
                catchError(err => of(fetchFailure(err.message))),
            ),
        ),
    );
