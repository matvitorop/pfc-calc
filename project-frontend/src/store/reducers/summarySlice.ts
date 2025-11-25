import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';

interface SummaryState {
    days: Days[];
    loading: boolean;
    error: string | null;
}

const initialState: SummaryState = {
    days: [],
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
        addItemToSummary: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        addItemToSummarySuccess: (state, action: PayloadAction<Days>) => {
            state.loading = false;
            state.days.push(action.payload);
            state.error = null;
            console.log("Stored Days:", JSON.stringify(state.days, null, 2));
        },
        addItemToSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSummary, fetchSummarySuccess, fetchSummaryFailure, clearSummary, addItemToSummary, addItemToSummarySuccess, addItemToSummaryFailure } = summarySlice.actions;

export default summarySlice.reducer;
