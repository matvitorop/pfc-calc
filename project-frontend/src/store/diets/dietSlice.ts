import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Diet {
    id: number;
    name: string;
    description: string;
    proteinPerc: number;
    carbPerc: number;
    fatPerc: number;
}
interface dietState {
    data: Diet[];
    loading: boolean;
    error: string | null;
}

const initialState: dietState = {
    data: [
        { id: 1, name: 'usual diet', description: '', proteinPerc: 50, carbPerc: 25, fatPerc: 25 },
        { id: 2, name: 'gain weight', description: '', proteinPerc: 50, carbPerc: 25, fatPerc: 25 },
        { id: 3, name: 'loose diet', description: '', proteinPerc: 50, carbPerc: 25, fatPerc: 25 },
        { id: 4, name: 'more carbs', description: '', proteinPerc: 50, carbPerc: 25, fatPerc: 25 },
    ],
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
