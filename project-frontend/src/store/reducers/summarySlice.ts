import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';

interface SummaryState {
    items: Days[];
    loading: boolean;
    error: string | null;
}

const initialState: SummaryState = {
    items: [],
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
            state.items = action.payload;
            state.error = null;
        },
        fetchSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearSummary: state => {
            state.items = [];
            state.error = null;
        },
    },
});

export const { fetchSummary, fetchSummarySuccess, fetchSummaryFailure, clearSummary } = summarySlice.actions;

export default summarySlice.reducer;
