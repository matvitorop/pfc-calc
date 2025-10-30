import { combineEpics } from 'redux-observable';
import { fetchCoefEpic } from './coefEpic';
import { fetchDietsEpic } from './dietEpic';

export const rootEpic = combineEpics(
    fetchCoefEpic,
    fetchDietsEpic
);