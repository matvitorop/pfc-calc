import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchUserDetails } from '../store/reducers/userSlice';
import useFetchData from './fetchData';
import type { User } from '../models/User';
import { type RootState } from '../store/reducers/rootReducer';
interface UseFetchUserDataReturn {
    user: {
        data: User;
        loading: boolean;
        error: string | null;
    };
    isLoading: boolean;
    hasError: boolean;
}

export const useFetchUserData = (): UseFetchUserDataReturn => {
    const selector = useCallback(
        (state: RootState) => ({
            data: state.userReducer.data,
            loading: state.userReducer.loading,
            error: state.userReducer.error,
        }),
        [],
    );
    const user = useFetchData(selector, fetchUserDetails);
    const isLoading = user.loading;
    const hasError = Boolean(user.error);
    return useMemo(
        () => ({
            user: { data: user.data, loading: user.loading, error: user.error },
            isLoading,
            hasError,
        }),
        [user, isLoading, hasError],
    );
};
