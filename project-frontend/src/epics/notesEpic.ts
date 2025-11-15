import {ofType} from 'redux-observable';
import {async, from, of} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import {graphqlFetch} from './../models/Notes'; //import { graphqlFetch } from '../../GraphQL/fetchRequest';
import type {Note} from './../models/Notes'; //import type { Note } from '../../models/Notes';
import
{
    fetchActiveNotesRequest,
    fetchActiveNotesSuccess,
    fetchActiveNotesFailure,
    fetchCompletedNotesRequest,
    fetchCompletedNotesSuccess,
    fetchCompletedNotesFailure,
    addNoteRequest,
    addNoteSuccess,
    addNoteFailure,
    completeNoteRequest,
    completeNoteSuccess,
    completeNoteFailure,
    restoreNoteRequest,
    restoreNoteSuccess,
    restoreNoteFailure,
    deleteNoteRequest,
    deleteNoteSuccess,
    deleteNoteFailure,
} from '../store/reducers/notesSlice'; //from '../reducers/notesSlice';
// GraphQL queries - just as backend

const GET_ACTIVE_NOTES = `
    query {
        getActiveNotes {
            id
            userId
            title
            dueDate
            isCompleted
            completedDate
        }
    }
`;
const GET_COMPLETED_NOTES = `
    query {
        getCompletedNotes {
            id
            userId
            title
            dueDate
            isCompleted
            completedDate
        }
    }
`;
const ADD_NOTE = `
    mutation AddNote($title: String!, $dueDate: DateTime) {
        addNote(title: $title, dueDate: $dueDate) {
            success
            note {
                id
                userId
                title
                dueDate
                isCompleted
                completedDate
            }
            message
        }
    }
`;
const COMPLETE_NOTE = `
    mutation CompleteNote($id: Int!) {
        completeNote(id: $id) {
            success
            note {
                id
                userId
                title
                dueDate
                isCompleted
                completedDate
            }
            message
        }
    }
`;
const RESTORE_NOTE = `
    mutation RestoreNote($id: Int!) {
        restoreNote(id: $id) {
            success
            note {
                id
                userId
                title
                dueDate
                isCompleted
                completedDate
            }
            message
        }
    }
`;
const DELETE_NOTE = `
    mutation DeleteNote($id: Int!) {
        deleteNote(id: $id) {
            success
            note {
                id
                userId
                title
                dueDate
                isCompleted
                completedDate
            }
            message
        }
    }
`;
//Epics
// Epic 1: Fetch active notes
export const fetchActiveNotesEpic = (action$: any) =>
    action$.pipe(ofType(fetchActiveNotesRequest.type),
        mergeMap(() =>
            from(graphqlFetch<{ getActiveNotes: Note[] }>(GET_ACTIVE_NOTES)).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchActiveNotesFailure(res.errors[0].message);
                    }
                    return fetchActiveNotesSuccess(res.data?.getActiveNotes ?? []);

                }),
                catchError((err) => of(fetchActiveNotesFailure(err.message)))
            )
        )
    );
// Epic 2: Fetch completed notes
export const fetchCompletedNotesEpic = (action$: any) =>
    action$.pipe(
        ofType(fetchCompletedNotesRequest.type),
        mergeMap(() =>
            from(graphqlFetch<{ getCompletedNotes: Note[] }>(GET_COMPLETED_NOTES)).pipe(
                map(res => {
                    if (res.errors) {
                        return fetchCompletedNotesFailure(res.errors[0].message);
                    }
                    return fetchCompletedNotesSuccess(res.data?.getCompletedNotes ?? []);
                }),
                catchError((err) => of(fetchCompletedNotesFailure(err.message)))
            )
        )
    );
// Epic 3: Add note
export const addNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(addNoteRequest.type),
        mergeMap((action) =>
            from(
                graphqlFetch<{ addNote: { success: boolean; note: Note; message: string } }>(
                    ADD_NOTE,
                    {title: action.payload.title, dueDate: action.payload.dueDate}
                )
            ).pipe(
                map((res) => {
                    if (res.errors) {
                        return addNoteFailure(res.errors[0].message);
                    }
                    const result = res.data?.addNote;
                    if (!result?.success || !result.note) {
                        return addNoteFailure(result?.message || 'Failed to add note');
                    }
                    return addNoteSuccess(result.note);
                }),
                catchError((err) => of(addNoteFailure(err.message)))
            )
        )
    );
// Epic 4: Complete note
export const completeNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(completeNoteRequest.type),
        mergeMap((action) =>
            from(
                graphqlFetch<{ completeNote: { success: boolean; note: Note; message: string } }>(
                    COMPLETE_NOTE,
                    { id: action.payload }
                )
            ).pipe(
                map((res) => {
                    if (res.errors) {
                        return completeNoteFailure(res.errors[0].message);
                    }
                    const result = res.data?.completeNote;
                    if (!result?.success || !result.note) {
                        return completeNoteFailure(result?.message || 'Failed to complete note');
                    }
                    return completeNoteSuccess(result.note);
                }),
                catchError((err) => of(completeNoteFailure(err.message)))
            )
        )
    );
// Epic 5: Restore note
export const restoreNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(restoreNoteRequest.type),
        mergeMap((action) =>
            from(
                graphqlFetch<{ restoreNote: { success: boolean; note: Note; message: string } }>(
                    RESTORE_NOTE,
                    { id: action.payload }
                )
            ).pipe(
                map((res) => {
                    if (res.errors) {
                        return restoreNoteFailure(res.errors[0].message);
                    }
                    const result = res.data?.restoreNote;
                    if (!result?.success || !result.note) {
                        return restoreNoteFailure(result?.message || 'Failed to restore note');
                    }
                    return restoreNoteSuccess(result.note);
                }),
                catchError((err) => of(restoreNoteFailure(err.message)))
            )
        )
    );
// Epic 6: Delete note
export const deleteNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(deleteNoteRequest.type),
        mergeMap((action) =>
            from(
                graphqlFetch<{ deleteNote: { success: boolean; note: Note; message: string } }>(
                    DELETE_NOTE,
                    { id: action.payload }
                )
            ).pipe(
                map((res) => {
                    if (res.errors) {
                        return deleteNoteFailure(res.errors[0].message);
                    }
                    const result = res.data?.deleteNote;
                    if (!result?.success) {
                        return deleteNoteFailure(result?.message || 'Failed to delete note');
                    }
                    return deleteNoteSuccess(action.payload);
                }),
                catchError((err) => of(deleteNoteFailure(err.message)))
            )
        )
    );