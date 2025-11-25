import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import themeReducer from './themeSlice';
import daysReducer from './daysSlice';
import mealReducer from './mealTypeSlice';
import coefReducer from '../coef/coefSlice';
import dietReducer from '../diets/dietSlice';
import summaryReducer from './summarySlice';

export const rootReducer = combineReducers({
    userReducer,
    themeReducer,
    daysReducer,
    summaryReducer,
    mealReducer,
    coefReducer,
    dietReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
