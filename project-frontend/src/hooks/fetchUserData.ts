import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchUserDetails } from '../store/reducers/userSlice';

export const useFetchUserData = () => {
    const dispatch = useAppDispatch();
    const { data, loading, error } = useAppSelector(state => state.userReducer);

    useEffect(() => {
        if (!data && !loading && !error) {
            dispatch(fetchUserDetails());
        }
    }, [dispatch, data, loading, error]);

    return { user: data, loading, error };
};
