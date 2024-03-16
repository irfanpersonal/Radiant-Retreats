import {createSlice} from '@reduxjs/toolkit';
import {showCurrentUser, registerUser, loginUser, logoutUser, getProfileData, updateUser, getSingleUser, getAllUsers} from './userThunk';
import {toast} from 'react-toastify';

export type UserType = {
    id: string,
    userID: string,
    firstName: string,
    lastName: string,
    birthdate: string,
    email: string,
    role: 'guest' | 'host' | 'admin',
    profilePicture: string,
    country: string,
    language: string,
    name: string,
    hostRequest: HostRequestType,
    createdAt: string,
    updatedAt: string
};

type HostRequestType = {
    id: string,
    phoneNumber: string,
    location: string,
    governmentIssuedID: string,
    backgroundCheck: string,
    status: string
};

interface IUser {
    globalLoading: boolean,
    authLoading: boolean,
    logoutLoading: boolean,
    getProfileDataLoading: boolean,
    editProfileLoading: boolean,
    wantsToRegister: boolean,
    user: UserType | null,
    authValues: {
        firstName: string,
        lastName: string,
        birthdate: string,
        email: string,
        password: string,
        country: string,
        language: string
    },
    getSingleUserLoading: boolean,
    singleUser: UserType | null,
    getAllUsersLoading: boolean,
    page: number,
    users: UserType[],
    totalUsers: number | null,
    numberOfPages: number | null,
    searchBoxValues: {
        search: string,
        role: 'guest' | 'admin' | '',
        country: string,
        sort: 'latest' | 'oldest' | ''
    }
}

const initialState: IUser = {
    globalLoading: true,
    authLoading: false,
    logoutLoading: false,
    getProfileDataLoading: true,
    editProfileLoading: false,
    user: null,
    wantsToRegister: true,
    authValues: {
        firstName: '',
        lastName: '',
        birthdate: '',
        email: '',
        password: '',
        country: '',
        language: ''
    },
    getSingleUserLoading: true,
    singleUser: null,
    getAllUsersLoading: true,
    page: 1,
    users: [],
    totalUsers: null,
    numberOfPages: null,
    searchBoxValues: {
        search: '',
        role: '',
        country: '',
        sort: ''
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.wantsToRegister = !state.wantsToRegister;
        },
        setAuthValues: (state, action) => {
            state.authValues[action.payload.name as keyof typeof state.authValues] = action.payload.value;
        },
        resetAuthValue: (state) => {
            state.authValues = {
                firstName: '',
                lastName: '',
                birthdate: '',
                email: '',
                password: '',
                country: '',
                language: ''
            };
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        resetSearchBoxValues: (state, action) => {
            state.searchBoxValues = {
                search: '',
                role: '',
                country: '',
                sort: ''
            };
        },
        resetSingleUser: (state) => {
            state.singleUser = null;
            state.getSingleUserLoading = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(showCurrentUser.pending, (state) => {
            state.globalLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.globalLoading = false;
            state.user = action.payload;
        }).addCase(showCurrentUser.rejected, (state) => {
            state.globalLoading = false;
        }).addCase(registerUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Registered User!');
        }).addCase(registerUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(loginUser.pending, (state) => {
            state.authLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.user = action.payload;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.authLoading = false;
            toast.error(action.payload as string);
        }).addCase(logoutUser.pending, (state) => {
            state.logoutLoading = true;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.logoutLoading = false;
            state.user = null;
        }).addCase(logoutUser.rejected, (state) => {
            state.logoutLoading = false;
        }).addCase(getProfileData.pending, (state) => {
            state.getProfileDataLoading = true;
        }).addCase(getProfileData.fulfilled, (state, action) => {
            state.getProfileDataLoading = false;
            state.user = action.payload;
        }).addCase(getProfileData.rejected, (state) => {
            state.getProfileDataLoading = false;
        }).addCase(updateUser.pending, (state) => {
            state.editProfileLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.editProfileLoading = false;
            state.user = action.payload;
            toast.success('Edited User!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.editProfileLoading = false;
        }).addCase(getSingleUser.pending, (state) => {
            state.getSingleUserLoading = true;
        }).addCase(getSingleUser.fulfilled, (state, action) => {
            state.getSingleUserLoading = false;
            state.singleUser = action.payload;
        }).addCase(getSingleUser.rejected, (state) => {
            state.getSingleUserLoading = true;
        }).addCase(getAllUsers.pending, (state) => {
            state.getAllUsersLoading = true;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            state.getAllUsersLoading = false;
            state.users = action.payload.users;
            state.totalUsers = action.payload.totalUsers;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllUsers.rejected, (state) => {
            state.getAllUsersLoading = false;
        });
    }
});

export const {toggleAuthType, setAuthValues, resetAuthValue, setPage, updateSearchBoxValues, resetSearchBoxValues, resetSingleUser} = userSlice.actions;

export default userSlice.reducer;