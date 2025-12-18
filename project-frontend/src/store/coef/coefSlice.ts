import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface ActivityCoefficient {
    id: number;
    name: string;
    value: number;
}
interface CoefState {
    data: ActivityCoefficient[];
    loading: boolean;
    error: string | null;
}

const initialState: CoefState = {
    data: [/*
        { id: 1, name: "Very Low", value: 1.2 },
        { id: 2, name: "Low", value: 1.375 },
        { id: 3, name: "Medium", value: 1.55 },
        { id: 4, name: "High", value: 1.725 },
        { id: 5, name: "Very High", value: 1.9 }
    */],
    loading: false,
    error: null,
};

const coefSlice = createSlice({
    name: 'coef',
    initialState,
    reducers: {
        fetchCoefStart: state => {
            state.loading = true;
            state.error = null;
        },
        fetchCoefSuccess: (state, action: PayloadAction<ActivityCoefficient[]>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchCoefFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchCoefStart, fetchCoefSuccess, fetchCoefFailure } = coefSlice.actions;
export default coefSlice.reducer;
