import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';
import type { DaysState } from './daysSlice';

//! del test-days from state after all testing
const initialState: DaysState = {
    data: null,
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
            state.data?.push(action.payload);
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
