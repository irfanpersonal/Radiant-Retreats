import {createSlice} from '@reduxjs/toolkit';
import {getCurrentPageLocation} from '../../utils';
import {loginUser, logoutUser, registerUser} from '../user/userThunk';
import {getAllListings} from '../home/homeThunk';
import {createListing, createPaymentIntent, createReservation, deleteSingleListing, editSingleListing, getSingleListing} from '../listing/listingThunk';

const initialState = {
    location: getCurrentPageLocation()
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            state.location = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/'; // The reason why we are doing this is because without it we won't trigger a useEffect for location. So by changing it up with a hashtag and not a hashtag I fix this issue.
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(getAllListings.pending, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(createListing.fulfilled, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(createPaymentIntent.fulfilled, (state, action) => {
            state.location = state.location === '/checkout' ? '/checkout#' : '/checkout';
        }).addCase(createReservation.fulfilled, (state, action) => {
            state.location = state.location === '/success' ? '/success#' : '/success';
        }).addCase(getSingleListing.rejected, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(deleteSingleListing.fulfilled, (state, action) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(editSingleListing.fulfilled, (state, action) => {
            state.location = state.location === `/listing/${action.payload.id}` ? `/listing/${action.payload.id}#` : `/listing/${action.payload.id}`;
        });
    }
});

export const {setLocation} = navigationSlice.actions;

export default navigationSlice.reducer;