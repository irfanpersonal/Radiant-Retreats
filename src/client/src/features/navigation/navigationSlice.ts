import {createSlice} from '@reduxjs/toolkit';
import {getCurrentPageLocation} from '../../utils';
import {createHostRequest, getSingleHostRequest} from '../hostRequest/hostRequestThunk';
import {createListing, deleteSingleListing, getSingleListing, getSingleListingWithAuth} from '../listing/listingThunk';
import {getSingleReservation} from '../reservation/reservationThunk';
import {getSingleUser} from '../user/userThunk';
import {getSingleCashOut} from '../cashOut/cashOutThunk';

interface INavigate {
    location: string
}

const initialState: INavigate = {
    location: getCurrentPageLocation()
};

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(createHostRequest.fulfilled, (state) => {
            state.location = state.location === `/profile` ? `/profile#` : `/profile`;
        }).addCase(getSingleHostRequest.rejected, (state) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(createListing.fulfilled, (state) => {
            state.location = state.location === '/profile' ? '/profile#' : '/profile';
        }).addCase(getSingleReservation.rejected, (state) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(getSingleListing.rejected, (state) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(getSingleListingWithAuth.rejected, (state) => {
            state.location = state.location === '/' ? '/#' : '/';
        }).addCase(deleteSingleListing.fulfilled, (state) => {
            state.location = state.location === '/profile' ? '/profile#' : '/profile';
        }).addCase(getSingleUser.rejected, (state) => {
            state.location = state.location === '/user' ? '/user#' : '/user';
        }).addCase(getSingleCashOut.rejected, (state) => {
            state.location = state.location === '/' ? '/#' : '/';
        });
    }
});

export const {} = navigationSlice.actions;

export default navigationSlice.reducer;