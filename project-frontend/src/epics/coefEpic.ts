import { ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { fetchStart, fetchSuccess, fetchFailure } from "../store/coef/coefSlice";
import { graphqlFetch } from "../GraphQL/fecthRequest";
import type { ActivityCoefficient } from "../store/coef/coefAPI";


const fetchCoefsQuery = `
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
            from(graphqlFetch<{ getCoef: ActivityCoefficient[] }>(fetchCoefsQuery)).pipe(
                map((res) => fetchSuccess(res.data?.getCoef ?? [])),
                catchError((err) => of(fetchFailure(err.message)))
            )
        )
    );