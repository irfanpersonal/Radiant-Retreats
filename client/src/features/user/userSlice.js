import {createSlice} from "@reduxjs/toolkit";
import {loginUser, logoutUser, registerUser, showCurrentUser} from "./userThunk";
import {toast} from 'react-toastify';

const initialState = {
    user: null,
    isLoading: true,
    isLoadingAuth: false,
    wantsToRegister: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state, action) => {
            state.wantsToRegister = !state.wantsToRegister;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.isLoadingAuth = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoadingAuth = false;
            state.user = action.payload;
            toast.success('Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoadingAuth = false;
            toast.error(action.payload);
        }).addCase(loginUser.pending, (state, action) => {
            state.isLoadingAuth = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoadingAuth = false;
            state.user = action.payload;
            toast.success('Logged In User!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoadingAuth = false;
            toast.error(action.payload);
        }).addCase(showCurrentUser.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.user = null;
            toast.success('Logged Out!');
        });
    }
});

export const {toggleAuthType} = userSlice.actions;

export default userSlice.reducer;