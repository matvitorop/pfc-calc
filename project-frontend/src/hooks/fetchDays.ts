import { useCallback, useMemo } from 'react';
import useFetchData from './fetchData';
import type { Days } from '../models/Days';
import { fetchDays } from '../store/reducers/daysSlice';
import { type RootState } from '../store/reducers/rootReducer';
import { type FetchDaysArgTypes } from '../store/reducers/daysSlice';

export interface UseFetchDaysReturn {
    days: {
        data: Days[] | null;
        loading: boolean;
        error: string | null;
    };
    isLoading: boolean;
    hasError: boolean;
}

export const useFetchDays = ({ day = null, daysBack = null, limit = null }: FetchDaysArgTypes): UseFetchDaysReturn => {
    const fetchAction = useCallback(
        () =>
            fetchDays({
                day,
                limit,
                daysBack,
            }),
        [day, limit, daysBack],
    );

    const daysState = useFetchData((state: RootState) => state.daysReducer, fetchAction);
    const isLoading = daysState.loading;
    const hasError = Boolean(daysState.error);

    return useMemo(
        () => ({
            days: { data: daysState.data, loading: daysState.loading, error: daysState.error },
            isLoading,
            hasError,
        }),
        [daysState, isLoading, hasError],
    );
};
