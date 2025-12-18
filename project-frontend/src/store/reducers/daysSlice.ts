import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';

export interface DaysState {
    data: Days[] | null;
    loading: boolean;
    error: string | null;
}
//! del test-days from state after all testing
const initialState: DaysState = {
    data: null,
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
        fetchDays: (state, action) => {
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
