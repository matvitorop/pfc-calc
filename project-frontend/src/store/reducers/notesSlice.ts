import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {Note} from '../../models/Notes'
export interface NotesState {
    activeNotes: Note[];
    completedNotes: Note[];
    loading: boolean;
    error: string | null;
}

const initialState: NotesState = {
    activeNotes: [],
    completedNotes: [],
    loading: false,
    error: null,
};

export const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        // Fetch active notes
            fetchActiveNotesRequest: (state) => {
            state.loading = false;
            state.error = null;
        },
        fetchActiveNotesSuccess: (state, action: PayloadAction<Note[]>)  => {
            state.loading = false;
            state.activeNotes = action.payload;
            state.error = null;
        },
        fetchActiveNotesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            
        },
        fetchCompletedNotesRequest: (state) => {
            state.loading = false;
            state.error = null;
        },
        fetchCompletedNotesSuccess: (state, action: PayloadAction<Note[]>) => {
            state.loading = false;
            state.completedNotes = action.payload;
            state.error = null;
        },
        fetchCompletedNotesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        //addNote
        addNoteRequest: (state, action: PayloadAction<{title: string; dueDate?: string}>) => {
            state.loading = true;
            state.error = null;
        },
        addNoteSuccess: (state, action: PayloadAction<Note>) => {
            state.loading = false;
            state.activeNotes.push(action.payload);
            state.error = null;
        },
        addNoteFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        //completeNote
        completeNoteRequestStarted: (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.error = null;
        },
        completeNoteSuccess: (state, action: PayloadAction<Note>) => {
            state.loading = false;
            //deletting from active
            state.activeNotes = state.activeNotes.filter(n => n.id != action.payload.id);
            //adding to completed
            state.completedNotes.unshift(action.payload);
            state.error = null;
        },
        completeNoteFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        //restoreNote
        restoreNoteRequest: (state, action: PayloadAction<number>) => {
            state.loading = true;
            state.error = null;

        },
        restoreNoteSuccess: (state, action: PayloadAction<Note>) => {
            state.loading = false;
            state.completedNotes = state.completedNotes.filter(n => n.id != action.payload.id);
            state.activeNotes.unshift(action.payload);
            state.error = null;
        },
        restoreNoteFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        //deleteNote
        deleteNoteRequest: (state, action: PayloadAction<number>) => {
            state.loading = true;
            state.error = null;
        },
        deleteNoteSuccess: (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.activeNotes = state.activeNotes.filter(n => n.id != action.payload);
            state.completedNotes = state.completedNotes.filter(n => n.id != action.payload);
            state.error = null;
        },
        deleteNoteFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
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
} = notesSlice.actions;

export default notesSlice.reducer;