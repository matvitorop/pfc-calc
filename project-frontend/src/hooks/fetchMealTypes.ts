import { useCallback, useMemo } from 'react';
import useFetchData from './fetchData';
import { fetchMeals, type MealType } from '../store/reducers/mealTypeSlice';
import { type RootState } from '../store/reducers/rootReducer';
interface UseFetchMealTypesReturn {
    meals: {
        mealTypes: MealType[];
        loading: boolean;
        error: string | null;
    };
    isLoading: boolean;
    hasError: boolean;
}

export const useFetchMealTypes = (): UseFetchMealTypesReturn => {
    const selector = useCallback(
        (state: RootState) => ({
            data: state.mealReducer.mealTypes,
            loading: state.mealReducer.loading,
            error: state.mealReducer.error,
        }),
        [],
    );
    const mealTypes = useFetchData(selector, fetchMeals);
    const isLoading = mealTypes.loading;
    const hasError = Boolean(mealTypes.error);

    return useMemo(
        () => ({
            meals: { mealTypes: mealTypes.data, loading: mealTypes.loading, error: mealTypes.error },
            isLoading,
            hasError,
        }),
        [mealTypes, isLoading, hasError],
    );
};
