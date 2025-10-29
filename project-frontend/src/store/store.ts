import { configureStore } from "@reduxjs/toolkit";
import coefReducer from "./coef/coefSlice";
import dietReducer from "./diets/dietSlice";

export const store = configureStore({
    reducer: {
        coef: coefReducer,
        diets: dietReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;