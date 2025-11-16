import { combineEpics } from 'redux-observable';
import { fetchCoefEpic } from './coefEpic';
import { fetchDietsEpic } from './dietEpic';
import {
    fetchActiveNotesEpic,
    fetchCompletedNotesEpic,
    addNoteEpic,
    completeNoteEpic,
    restoreNoteEpic,
    deleteNoteEpic,
} from './notesEpic';


export const rootEpic = combineEpics(
    fetchCoefEpic,
    fetchDietsEpic,
/*    fetchUser,
    updateUser,
    logout,
    fetchSummaryEpic,
    fetchMealsEpic,
    updateMealEpic,
    createMealEpic,
    deleteMealEpic,*/
    // Додаємо notes epics
    fetchActiveNotesEpic,
    fetchCompletedNotesEpic,
    addNoteEpic,
    completeNoteEpic,
    restoreNoteEpic,
    deleteNoteEpic,
);