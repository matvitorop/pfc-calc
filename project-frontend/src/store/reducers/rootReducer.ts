import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import summaryReducer from './summarySlice';
import mealReducer from './mealTypeSlice';
export const rootReducer = combineReducers({
    userReducer,
    themeReducer,
    summaryReducer,
    mealReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
