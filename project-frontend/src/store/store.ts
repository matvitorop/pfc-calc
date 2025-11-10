import { configureStore } from "@reduxjs/toolkit";
import coefReducer from "./coef/coefSlice";
import dietReducer from "./diets/dietSlice";
import { rootEpic } from "../epics/rootEpic";

import { createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware();  

export const store = configureStore({
    reducer: {
        coef: coefReducer,
        diets: dietReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;