import {createSlice} from "@reduxjs/toolkit";
import {getAllListingReservations, getAllReservations} from "./reservationsThunk";

const initialState = {
    isLoading: true,
    reservations: null,
    isLoadingListingReservations: true
};

const reservationsSlice = createSlice({
    name: 'reservations',
    initialState, 
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllReservations.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getAllReservations.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reservations = action.payload;
        }).addCase(getAllReservations.rejected, (state, action) => {
            state.isLoading = false;
        }).addCase(getAllListingReservations.pending, (state, action) => {
            state.isLoadingListingReservations = true;
        }).addCase(getAllListingReservations.fulfilled, (state, action) => {
            state.isLoadingListingReservations = false;
            state.reservations = action.payload;
        }).addCase(getAllListingReservations.rejected, (state, action) => {
            state.isLoadingListingReservations = false;
        });
    }
});

export const {} = reservationsSlice.actions;

export default reservationsSlice.reducer;