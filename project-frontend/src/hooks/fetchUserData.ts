import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchUserDetails } from '../store/reducers/userSlice';
import useFetchData from './fetchData';
import type { User } from '../models/User';

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
    const user = useFetchData(state => state.userReducer, fetchUserDetails);
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
