import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
export const rootReducer = combineReducers({
    userReducer,
    themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
