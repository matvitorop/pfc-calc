import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';

interface SummaryState {
    days: Days[];
    loading: boolean;
    error: string | null;
}
//! del test-days from state after all testing
const initialState: SummaryState = {
    days: [
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
    ],
    loading: false,
    error: null,
};

const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {
        fetchSummary: state => {
            state.loading = true;
            state.error = null;
        },
        fetchSummarySuccess: (state, action: PayloadAction<Days[]>) => {
            state.loading = false;
            state.days = action.payload;
            state.error = null;
        },
        fetchSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearSummary: state => {
            state.days = [];
            state.error = null;
        },
    },
});

export const { fetchSummary, fetchSummarySuccess, fetchSummaryFailure, clearSummary } = summarySlice.actions;

export default summarySlice.reducer;
