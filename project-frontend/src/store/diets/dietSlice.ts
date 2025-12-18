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
    data: [
    /*{
        id: 1,
        name: "Weight Loss",
        description: "Calorie deficit diet focusing on higher protein.",
        proteinPerc: 40,
        carbPerc: 30,
        fatPerc: 30
    },
    {
        id: 2,
        name: "Maintain Weight",
        description: "Balanced diet for stable weight maintenance.",
        proteinPerc: 33,
        carbPerc: 34,
        fatPerc: 33
    },
    {
        id: 3,
        name: "Weight Gain",
        description: "Surplus calories with increased carbs.",
        proteinPerc: 25,
        carbPerc: 50,
        fatPerc: 25
    }*/
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
