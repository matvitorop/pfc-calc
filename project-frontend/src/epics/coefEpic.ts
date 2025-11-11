import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { fetchCoefStart, fetchCoefSuccess, fetchCoefFailure } from '../store/coef/coefSlice';
import { graphqlFetch } from '../GraphQL/fecthRequest';
import type { ActivityCoefficient } from '../store/coef/coefSlice';

const getCoef = `
        query{
            getCoef{
                id
                name
                value
            }
        }`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchCoefEpic = (action$: any) =>
    action$.pipe(
        ofType(fetchCoefStart.type),
        mergeMap(() =>
            from(graphqlFetch<{ getCoef: ActivityCoefficient[] }>(getCoef)).pipe(
                map(res => fetchCoefSuccess(res.data?.getCoef ?? [])),
                catchError(err => of(fetchCoefFailure(err.message))),
            ),
        ),
    );
