import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../models/User';

export interface UserState {
    loading: boolean;
    error: string | null;
    data: User | null;
}

/*
test data

email: 'joe@schmoe.com',
password: 'WERTYUu3546!'



*/

//! del test-data from state after all testing
const intialState: UserState = {
    data: null,
    loading: false,
    error: null,
};

interface UpdateUserPayload {
    fieldName: string;
    value: unknown;
}

export const userSlice = createSlice({
    name: 'user',
    initialState: intialState,
    reducers: {
        fetchUserDetails(state) {
            state.loading = true;
            state.error = null;
        },

        fetchUserDetailsSuccess(state, action: PayloadAction<User>) {
            state.loading = false;
            state.data = action.payload;
        },

        fetchUserDetailsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        updateUserDetails(state, _action: PayloadAction<UpdateUserPayload>) {
            state.loading = true;
            state.error = null;
        },

        updateUserDetailsSuccess(state, action: PayloadAction<User>) {
            state.loading = false;
            if (state.data) {
                state.data = {
                    ...state.data,
                    ...action.payload,
                };
            }
        },

        updateUserDetailsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        logoutUser(state) {
            state.loading = true;
            state.error = null;
        },
        logoutUserSuccess(state) {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
        logoutUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});
export const {
    fetchUserDetails,
    fetchUserDetailsSuccess,
    fetchUserDetailsFailure,
    updateUserDetails,
    updateUserDetailsSuccess,
    updateUserDetailsFailure,
    logoutUser,
    logoutUserSuccess,
    logoutUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
