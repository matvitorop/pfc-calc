/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { type RootState } from '../store/reducers/rootReducer';

const useFetchData = (selector: (state: RootState) => { data: any; loading: boolean; error: string | null }, fetchAction: () => any) => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(selector);

    const shouldFetch = !state.data && !state.loading && !state.error;

    useEffect(() => {
        if (shouldFetch) {
            dispatch(fetchAction());
        }
    }, [dispatch, shouldFetch, fetchAction]);

    return state;
};

export default useFetchData;
