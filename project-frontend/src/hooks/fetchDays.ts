import { useCallback, useMemo } from 'react';
import useFetchData from './fetchData';
import type { Days } from '../models/Days';
import { fetchDays } from '../store/reducers/daysSlice';
import { type RootState } from '../store/reducers/rootReducer';
import { type FetchDaysArgTypes } from '../store/reducers/daysSlice';
//^think about rename on Days all that in summary
export interface UseFetchDaysReturn {
    days: {
        data: Days[];
        loading: boolean;
        error: string | null;
    };
    isLoading: boolean;
    hasError: boolean;
}

export const useFetchDays = ({ day = null, daysBack = null, limit = null }: FetchDaysArgTypes): UseFetchDaysReturn => {
    const days = useFetchData(
        (state: RootState) => state.daysReducer,
        () =>
            fetchDays({
                day: day,
                limit: limit,
                daysBack: daysBack,
            }),
    );

    const isLoading = days.loading;
    const hasError = Boolean(days.error);

    return useMemo(
        () => ({
            days: { data: days.data, loading: days.loading, error: days.error },
            isLoading,
            hasError,
        }),
        [days, isLoading, hasError],
    );
};
