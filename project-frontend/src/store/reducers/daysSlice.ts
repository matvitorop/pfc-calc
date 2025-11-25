import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';

export interface DaysState {
    data: Days[];
    loading: boolean;
    error: string | null;
}
//! del test-days from state after all testing
const initialState: DaysState = {
    data: [
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-13',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 105,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-12',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 105,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-12',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 105,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-14',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 105,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-14',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 4005,
        },

        {
            id: 4,
            userId: 1,
            itemId: 1,
            day: '2025-11-13',
            mealTypeId: 1,
            measurement: 50,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tasty medium banana',
            apiId: null,
            calories: 105,
        },
        {
            id: 5,
            userId: 1,
            itemId: 1,
            day: '2025-11-13',
            mealTypeId: 2,
            measurement: 327,
            name: 'tomato cream soup',
            proteins: 58.5,
            fats: 103.5,
            carbs: 288,
            description: 'tomato cream soup info ... lalala',
            apiId: null,
            calories: 287,
        },
        {
            id: 5,
            userId: 1,
            itemId: 1,
            day: '2025-11-16',
            mealTypeId: 5,
            measurement: 327,
            name: 'roast beef',
            proteins: 58.5,
            fats: 103.5,
            carbs: 288,
            description: 'roast beef info... lalala',
            apiId: null,
            calories: 400,
        },
        {
            id: 5,
            userId: 1,
            itemId: 1,
            day: '2025-11-16',
            mealTypeId: 5,
            measurement: 327,
            name: 'roast beef',
            proteins: 58.5,
            fats: 103.5,
            carbs: 288,
            description: 'roast beef info... lalala',
            apiId: null,
            calories: 400,
        },
        {
            id: 5,
            userId: 1,
            itemId: 1,
            day: '2025-11-17',
            mealTypeId: 5,
            measurement: 327,
            name: 'roast beef',
            proteins: 58.5,
            fats: 103.5,
            carbs: 288,
            description: 'roast beef info... lalala',
            apiId: null,
            calories: 400,
        },
        {
            id: 5,
            userId: 1,
            itemId: 1,
            day: '2025-11-17',
            mealTypeId: 5,
            measurement: 327,
            name: 'roast beef',
            proteins: 58.5,
            fats: 103.5,
            carbs: 288,
            description: 'roast beef info... lalala',
            apiId: null,
            calories: 400,
        },
    ],
    loading: false,
    error: null,
};

export interface FetchDaysArgTypes {
    day: Date | null;
    limit: number | null;
    daysBack: number | null;
}

const daysSlice = createSlice({
    name: 'days',
    initialState,
    reducers: {
        fetchDays: (state, action: PayloadAction<FetchDaysArgTypes | null>) => {
            state.loading = true;
            state.error = null;
        },
        fetchDaysSuccess: (state, action: PayloadAction<Days[]>) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        fetchDaysFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchDays, fetchDaysSuccess, fetchDaysFailure } = daysSlice.actions;

export default daysSlice.reducer;
