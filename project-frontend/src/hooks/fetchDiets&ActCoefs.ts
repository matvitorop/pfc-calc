import { useCallback, useMemo } from 'react';
import { fetchDietsStart, type Diet } from '../store/diets/dietSlice';
import { fetchCoefStart, type ActivityCoefficient } from '../store/coef/coefSlice';
import useFetchData from './fetchData';
import { type RootState } from '../store/reducers/rootReducer';
interface UseFetchDiets_CoefDataReturn {
    diets: {
        data: Diet[];
        loading: boolean;
        error: string | null;
    };
    activityCoefs: {
        data: ActivityCoefficient[];
        loading: boolean;
        error: string | null;
    };
    isLoading: boolean;
    hasError: boolean;
}

export const useFetchDiets_ActCoefsData = (): UseFetchDiets_CoefDataReturn => {
    const dietsSelector = useCallback(
        (state: RootState) => ({
            data: state.dietReducer.data,
            loading: state.dietReducer.loading,
            error: state.dietReducer.error,
        }),
        [],
    );

    const coefsSelector = useCallback(
        (state: RootState) => ({
            data: state.coefReducer.data,
            loading: state.coefReducer.loading,
            error: state.coefReducer.error,
        }),
        [],
    );

    const diets = useFetchData(dietsSelector, fetchDietsStart);
    const activityCoefs = useFetchData(coefsSelector, fetchCoefStart);

    const isLoading = diets.loading || activityCoefs.loading;
    const hasError = Boolean(diets.error || activityCoefs.error);

    return useMemo(
        () => ({
            diets: { data: diets.data, loading: diets.loading, error: diets.error },
            activityCoefs: { data: activityCoefs.data, loading: activityCoefs.loading, error: activityCoefs.error },
            isLoading,
            hasError,
        }),
        [diets, activityCoefs, isLoading, hasError],
    );
};
