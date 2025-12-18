import { fetchDietsStart, fetchDietsSuccess, fetchDietsFailure } from '../../store/diets/dietSlice';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { graphqlFetch } from '../../GraphQL/fetchRequest';
import type { Diet } from '../../store/diets/dietSlice';

const getDiets = `
        query{
  getDiets{
    id
    name
    description
    proteinPerc
    fatsPerc
    carbsPerc
  }
}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchDietsEpic = (action$: any) =>
    action$.pipe(
        ofType(fetchDietsStart.type),
        mergeMap(() =>
            from(graphqlFetch<{ getDiets: Diet[] }>(getDiets)).pipe(
                map(res => fetchDietsSuccess(res.data?.getDiets ?? [])),
                catchError(err => of(fetchDietsFailure(err.message))),
            ),
        ),
    );
