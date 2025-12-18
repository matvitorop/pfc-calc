/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { type RootState } from '../store/reducers/rootReducer';

const useFetchData = (selector: (state: RootState) => { data: any; loading: boolean; error: string | null }, fetchAction: () => any) => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(selector);
    const isDataEmpty = state.data == null;
    const shouldFetch = isDataEmpty && !state.loading && !state.error;

    useEffect(() => {
        dispatch(fetchAction());
    }, [dispatch, fetchAction]);

    return state;
};

export default useFetchData;
