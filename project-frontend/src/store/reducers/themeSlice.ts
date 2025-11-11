import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ITheme {
    isDarkTheme: boolean;
}
const savedTheme = localStorage.getItem('theme');
const intialState: ITheme = {
    isDarkTheme: savedTheme ? JSON.parse(savedTheme) === true : false,
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState: intialState,
    reducers: {
        toggleTheme(state) {
            state.isDarkTheme = !state.isDarkTheme;
            localStorage.setItem('theme', JSON.stringify(state.isDarkTheme));
        },
        setTheme(state, action: PayloadAction<boolean>) {
            state.isDarkTheme = action.payload;
            localStorage.setItem('theme', JSON.stringify(state.isDarkTheme));
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
