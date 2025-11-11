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
    data: [],
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
