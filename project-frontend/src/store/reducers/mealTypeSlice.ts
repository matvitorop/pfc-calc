import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../models/User';

export interface MealType {
    id: number;
    name: string;
}

export interface MealTypeState {
    loading: boolean;
    error: string | null;
    mealTypes: MealType[] | null;
}

//! del test-mealTypes from state after all testing
const intialState: MealTypeState = {
    mealTypes: [
        { id: 1, name: 'breakfast' },
        { id: 2, name: 'Lunch' },
        { id: 3, name: 'Dinner' },
    ],
    loading: false,
    error: null,
};

interface UpdateMealTypePayload {
    id: number;
    name: string;
}
export const mealSlice = createSlice({
    name: 'meal',
    initialState: intialState,
    reducers: {
        fetchMeals(state) {
            state.loading = true;
            state.error = null;
        },

        fetchMealsSuccess(state, action: PayloadAction<MealType[]>) {
            state.loading = false;
            state.mealTypes = action.payload;
        },

        fetchMealsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        createMeal(state, action: PayloadAction<string>) {
            state.loading = true;
            state.error = null;
        },

        createMealSuccess(state, action: PayloadAction<MealType>) {
            state.loading = false;
            if (state.mealTypes) {
                state.mealTypes.push(action.payload);
            }
        },

        createMealFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        updateMeal(state, _action: PayloadAction<UpdateMealTypePayload>) {
            state.loading = true;
            state.error = null;
        },

        updateMealSuccess(state, action: PayloadAction<MealType>) {
            state.loading = false;
            if (state.mealTypes) {
                state.mealTypes = {
                    ...state.mealTypes,
                    ...action.payload,
                };
            }
        },

        updateMealFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteMeal(state, action: PayloadAction<number>) {
            state.loading = true;
            state.error = null;
        },
        deleteMealSuccess(state, action: PayloadAction<MealType>) {
            state.loading = false;
            if (state.mealTypes) {
                state.mealTypes = state.mealTypes.filter(el => el.id !== action.payload.id);
            }
        },
        deleteMealFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});
export const {
    fetchMeals,
    fetchMealsSuccess,
    fetchMealsFailure,
    createMeal,
    createMealSuccess,
    createMealFailure,
    updateMeal,
    updateMealSuccess,
    updateMealFailure,
    deleteMeal,
    deleteMealSuccess,
    deleteMealFailure,
} = mealSlice.actions;
export default mealSlice.reducer;
