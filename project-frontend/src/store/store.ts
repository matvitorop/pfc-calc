import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics/rootEpic';
import { rootReducer } from './reducers/rootReducer';
import type { RootState } from './reducers/rootReducer';
import type { Action } from '@reduxjs/toolkit';
const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type AppDispatch = typeof store.dispatch;
