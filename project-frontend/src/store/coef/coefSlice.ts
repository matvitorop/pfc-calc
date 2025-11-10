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
    error: null
}

const todoSlice = createSlice({
    name: 'coef',
    initialState,
    reducers: {
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess: (state, action: PayloadAction<ActivityCoefficient[]>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
})

export const { fetchStart, fetchSuccess, fetchFailure } = todoSlice.actions;
export default todoSlice.reducer;