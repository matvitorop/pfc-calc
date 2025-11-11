import { ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { fetchStart, fetchSuccess, fetchFailure } from "../coef/coefSlice";
import { graphqlFetch } from "../../GraphQL/fecthRequest";
import type { ActivityCoefficient } from "../coef/coefSlice"; 

const getCoef = `
        query{
            getCoef{
                id
                name
                value
            }
        }`;

export const fetchCoefEpic = (action$: any) =>
    action$.pipe(
        ofType(fetchStart.type),
        mergeMap(() =>
            from(graphqlFetch<{ getCoef: ActivityCoefficient[] }>(getCoef)).pipe(
                map((res) => fetchSuccess(res.data?.getCoef ?? [])),
                catchError((err) => of(fetchFailure(err.message)))
            )
        )
    );