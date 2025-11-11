import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import summaryReducer from './summarySlice';
import mealReducer from './mealTypeSlice';
import coefReducer from '../coef/coefSlice';
import dietReducer from "../diets/dietSlice";

export const rootReducer = combineReducers({
    userReducer,
    themeReducer,
    summaryReducer,
    mealReducer,
    coefReducer,
    dietReducer
});

export type RootState = ReturnType<typeof rootReducer>;
