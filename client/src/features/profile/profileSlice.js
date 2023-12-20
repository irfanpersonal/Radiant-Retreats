import {createSlice} from "@reduxjs/toolkit";
import {getOwnerSpecificListings, getSingleUser, updateUser} from "./profileThunk";
import {toast} from 'react-toastify';

const initialState = {
    isLoadingProfile: true,
    isLoadingProfileListings: true,
    editButtonLoading: false,
    profile: null,
    profileListings: [],
    totalListings: null,
    numberOfPages: null,
    page: 1,
    editProfileValues: {
        name: '',
        bio: '',
        email: ''
    }
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfileValues: (state, action) => {
            state.editProfileValues[action.payload.name] = action.payload.value;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builer) => {
        builer.addCase(getSingleUser.pending, (state, action) => {
            state.isLoadingProfile = true;
        }).addCase(getSingleUser.fulfilled, (state, action) => {
            state.isLoadingProfile = false;
            state.profile = action.payload;
            state.editProfileValues = action.payload;
        }).addCase(getSingleUser.rejected, (state, action) => {
            state.isLoadingProfile = false;
        }).addCase(updateUser.pending, (state, action) => {
            state.editButtonLoading = true;
        }).addCase(updateUser.fulfilled, (state, action) => {
            state.editButtonLoading = false;
            state.profile = action.payload;
            toast.success('Edited Profile!');
        }).addCase(updateUser.rejected, (state, action) => {
            state.editButtonLoading = false;
        }).addCase(getOwnerSpecificListings.pending, (state, action) => {
            state.isLoadingProfileListings = true;
        }).addCase(getOwnerSpecificListings.fulfilled, (state, action) => {
            state.isLoadingProfileListings = false;
            state.profileListings = action.payload.listings;
            state.totalListings = action.payload.totalListings;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getOwnerSpecificListings.rejected, (state, action) => {
            state.isLoadingProfileListings = false;
        })
    }
});

export const {updateProfileValues, setPage} = profileSlice.actions;

export default profileSlice.reducer;