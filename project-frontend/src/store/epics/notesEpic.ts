import {ofType} from 'redux-observable';
import {async, from, of} from 'rxjs';
import {mergeMap, map, catchError} from 'rxjs/operators';
import { graphqlFetch } from "../../GraphQL/fetchRequest";
import type { Epic } from 'redux-observable';
import type { Action } from '@reduxjs/toolkit';
import type { RootState } from '../reducers/rootReducer';
import type {Note} from '../../models/Notes';
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
    completeNoteRequestStarted,
    completeNoteSuccess,
    completeNoteFailure,
    restoreNoteRequest,
    restoreNoteSuccess,
    restoreNoteFailure,
    deleteNoteRequest,
    deleteNoteSuccess,
    deleteNoteFailure,
} from '../reducers/notesSlice';

type AddNoteAction = ReturnType<typeof addNoteRequest>;
type CompleteNoteAction = ReturnType<typeof completeNoteRequestStarted>;
type RestoreNoteAction = ReturnType<typeof restoreNoteRequest>;
type DeleteNoteAction = ReturnType<typeof deleteNoteRequest>;
type MyEpic = Epic<Action, Action, RootState>;
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
console.log('✅✅✅ notesEpic.ts FILE LOADED ✅✅✅');
//Epics
// Epic 1: Fetch active notes
export const fetchActiveNotesEpic: MyEpic = (action$) =>
    action$.pipe(
        ofType(fetchActiveNotesRequest.type),
        mergeMap(() => {
            console.log('1️⃣ [Epic] Action received, starting fetch...');

            return from(graphqlFetch<{ getActiveNotes: Note[] }>(GET_ACTIVE_NOTES)).pipe(
                map((res) => {
                    console.log('2️⃣ [Epic] Response received:', res);

                    if (res.errors) {
                        console.error('3️⃣ [Epic] GraphQL errors:', res.errors);
                        return fetchActiveNotesFailure(res.errors[0].message);
                    }

                    const notes = res.data?.getActiveNotes ?? [];
                    console.log('4️⃣ [Epic] Returning success with notes:', notes);
                    return fetchActiveNotesSuccess(notes);
                }),
                catchError((err) => {
                    console.error('5️⃣ [Epic] Catch error:', err);
                    return of(fetchActiveNotesFailure(err.message || 'Unknown error'));
                })
            );
        })
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
        mergeMap((action: AddNoteAction) => {
            const {title, dueDate} = action.payload;
            return from(
                graphqlFetch<{ addNote: { success: boolean; note: Note; message: string } }>(
                    ADD_NOTE,
                    {title, dueDate}
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
        })
    );
// Epic 4: Complete note
export const completeNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(completeNoteRequestStarted.type),
        mergeMap((action: CompleteNoteAction) =>{
            const noteId = action.payload;
            return from(
                graphqlFetch<{ completeNote: { success: boolean; note: Note; message: string } }>(
                    COMPLETE_NOTE,
                    { id: noteId }
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
        })
    );
// Epic 5: Restore note
export const restoreNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(restoreNoteRequest.type),
        mergeMap((action: RestoreNoteAction) => {
            const noteId = action.payload;
            return from(
                graphqlFetch<{ restoreNote: { success: boolean; note: Note; message: string } }>(
                    RESTORE_NOTE,
                    { id: noteId }
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
        })
    );
// Epic 6: Delete note
export const deleteNoteEpic = (action$: any) =>
    action$.pipe(
        ofType(deleteNoteRequest.type),
        mergeMap((action: DeleteNoteAction) => {
            const noteId = action.payload;
            return from(
                graphqlFetch<{ deleteNote: { success: boolean; note: Note; message: string } }>(
                    DELETE_NOTE,
                    { id: noteId }
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
        })
    );
