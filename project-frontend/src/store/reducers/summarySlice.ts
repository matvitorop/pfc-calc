import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Days } from '../../models/Days';
import type { DaysState } from './daysSlice';

export interface UpdateSummaryPayload {
    id: number;
    measurement: number;
}

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
        },
        addItemToSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateItemSummary: (state, action: PayloadAction<UpdateSummaryPayload>) => {
            //state.loading = true;
            state.error = null;
        },
        updateItemSummarySuccess: (state, action: PayloadAction<Days>) => {
            state.loading = false;
            if (state.data) {
                const itemToUpdate = state.data.find(item => item.id === action.payload.id);
                if (itemToUpdate) {
                    itemToUpdate.measurement = action.payload.measurement;
                }
            }
        },
        updateItemSummaryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        deleteItemFromSummary: (state, action: PayloadAction<number>) => {
            //state.loading = true;
            state.error = null;
        },
        deleteItemFromSummarySuccess: (state, action: PayloadAction<number>) => {
            //state.loading = false;
            if (state.data) {
                state.data = state.data.filter(item => item.id !== action.payload);
            }
        },
        deleteItemFromSummaryFailure: (state, action: PayloadAction<string>) => {
            //state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    // fetching
    fetchSummary,
    fetchSummarySuccess,
    fetchSummaryFailure,

    // clearing
    clearSummary,

    // adding
    addItemToSummary,
    addItemToSummarySuccess,
    addItemToSummaryFailure,

    //updating
    updateItemSummary,
    updateItemSummarySuccess,
    updateItemSummaryFailure,

    // deleting
    deleteItemFromSummary,
    deleteItemFromSummarySuccess,
    deleteItemFromSummaryFailure,
} = summarySlice.actions;

export default summarySlice.reducer;
