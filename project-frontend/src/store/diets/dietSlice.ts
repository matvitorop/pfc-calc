import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Diet {
    id: number;
    name: string;
    description: string;
    proteinPerc: number;
    carbsPerc: number;
    fatsPerc: number;
}
interface dietState {
    data: Diet[];
    loading: boolean;
    error: string | null;
}

const initialState: dietState = {
    data: [],
    loading: false,
    error: null,
};

const dietSlice = createSlice({
    name: 'diets',
    initialState,
    reducers: {
        fetchDietsStart: state => {
            state.loading = true;
            state.error = null;
        },
        fetchDietsSuccess: (state, action: PayloadAction<Diet[]>) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchDietsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchDietsStart, fetchDietsSuccess, fetchDietsFailure } = dietSlice.actions;
export default dietSlice.reducer;
