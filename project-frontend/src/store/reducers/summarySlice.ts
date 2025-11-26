import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';
import type { DaysState } from './daysSlice';

//! del test-days from state after all testing
const initialState: DaysState = {
    data: [
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-12',
            mealTypeId: 1,
            measurement: 200,
            name: 'banana',
            proteins: 1.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 200,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-12',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 5.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 300,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-12',
            mealTypeId: 1,
            measurement: 100,
            name: 'banana',
            proteins: 8.3,
            fats: 0.3,
            carbs: 27,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 300,
        },
        {
            id: 1,
            userId: 1,
            itemId: 1,
            day: '2025-11-12',
            mealTypeId: 1,
            measurement: 300,
            name: 'salo',
            proteins: 3,
            fats: 15,
            carbs: 5,
            description: 'tatsty medium banana',
            apiId: null,
            calories: 234,
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
            state.data = action.payload;
            state.error = null;
        },
        fetchSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearSummary: state => {
            state.data = [];
            state.error = null;
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addItemToSummary: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        addItemToSummarySuccess: (state, action: PayloadAction<Days>) => {
            state.loading = false;
            state.data.push(action.payload);
            state.error = null;
            console.log('Stored Days:', JSON.stringify(state.data, null, 2));
        },
        addItemToSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchSummary,
    fetchSummarySuccess,
    fetchSummaryFailure,
    clearSummary,
    addItemToSummary,
    addItemToSummarySuccess,
    addItemToSummaryFailure,
} = summarySlice.actions;

export default summarySlice.reducer;
