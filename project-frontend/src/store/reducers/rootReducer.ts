import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import summaryReducer from './summarySlice';
import mealReducer from './mealTypeSlice';
import coefReducer from '../coef/coefSlice';
import dietReducer from "../diets/dietSlice";
import notesReducer from './notesSlice';

export const rootReducer = combineReducers({
    userReducer,
    themeReducer,
    summaryReducer,
    mealReducer,
    coefReducer,
    dietReducer,
    notesReducer
});

export type RootState = ReturnType<typeof rootReducer>;
