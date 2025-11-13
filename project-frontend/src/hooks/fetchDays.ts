import { useCallback, useMemo } from 'react';
import useFetchData from './fetchData';
import type { Days } from '../models/Days';
import { fetchSummary } from '../store/reducers/summarySlice';
import { type RootState } from '../store/reducers/rootReducer';
//^think about rename on Days all that in summary
interface UseFetchDaysReturn {
    days: {
        data: Days[];
        loading: boolean;
        error: string | null;
    };
    isLoading: boolean;
    hasError: boolean;
}

export const useFetchDays = (): UseFetchDaysReturn => {
    const selector = useCallback(
        (state: RootState) => ({
            data: state.summaryReducer.days,
            loading: state.summaryReducer.loading,
            error: state.summaryReducer.error,
        }),
        [],
    );

    const days = useFetchData(selector, fetchSummary);
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
