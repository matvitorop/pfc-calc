import { useMemo } from 'react';
import useFetchData from './fetchData';
import { type RootState } from '../store/reducers/rootReducer';
import { fetchSummary } from '../store/reducers/summarySlice';
import type { UseFetchDaysReturn } from './fetchDays';

export const useFetchSummary = (): UseFetchDaysReturn => {
    //^ think about adding arg for fetch days instead of generating it in rootEpic
    const days = useFetchData((state: RootState) => state.summaryReducer, fetchSummary);

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
