import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Diet } from "./dietAPI";

interface dietState {
    data: Diet[];
    loading: boolean;
    error: string | null;
}

const initialState: dietState = {
    data: [],
    loading: false,
    error: null
}

const dietSlice = createSlice({
    name: 'diets',
    initialState,
    reducers: {
        fetchStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSuccess(state, action: PayloadAction<Diet[]>) {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
})

export const { fetchStart, fetchSuccess, fetchFailure } = dietSlice.actions;
export default dietSlice.reducer;