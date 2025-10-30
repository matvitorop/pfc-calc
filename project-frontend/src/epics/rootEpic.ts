import { combineEpics } from 'redux-observable';
import { fetchCoefEpic } from './coefEpic'; 

export const rootEpic = combineEpics(
    fetchCoefEpic
);