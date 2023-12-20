import {createSlice} from "@reduxjs/toolkit";
import {createListing, createPaymentIntent, createReservation, deleteSingleListing, editSingleListing, getSingleListing} from "./listingThunk";
import {toast} from 'react-toastify';

const initialState = {
    isLoading: false,
    isLoadingSingleListing: true,
    singleListing: null,
    isReservationLoading: false,
    createReservationData: null,
    message: '',
    successfulOrder: false,
    isLoadingEdit: false
};

const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        setSuccessfulOrder: (state, action) => {
            state.successfulOrder = action.payload;
        },
        updateSingleListing: (state, action) => {
            state.singleListing[action.payload.name] = action.payload.value;
        },
        removeAmenity: (state, action) => {
            state.singleListing.amenities = state.singleListing.amenities.filter(amenity => amenity !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createListing.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(createListing.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success('Created Listing!');
        }).addCase(createListing.rejected, (state, action) => {
            state.isLoading = false;
            toast.error(action.payload);
        }).addCase(getSingleListing.pending, (state, action) => {
            state.isLoadingSingleListing = true;
        }).addCase(getSingleListing.fulfilled, (state, action) => {
            state.isLoadingSingleListing = false;
            state.singleListing = action.payload;
        }).addCase(getSingleListing.rejected, (state, action) => {
            state.isLoading = false;
        }).addCase(createPaymentIntent.pending, (state, action) => {
            state.isReservationLoading = true;
            state.message = '';
        }).addCase(createPaymentIntent.fulfilled, (state, action) => {
            state.isReservationLoading = false;
            state.createReservationData = action.payload;
        }).addCase(createPaymentIntent.rejected, (state, action) => {
            state.isReservationLoading = false;
            state.message = action.payload;
        }).addCase(createReservation.fulfilled, (state, action) => {
            state.successfulOrder = true;
        }).addCase(deleteSingleListing.fulfilled, (state, action) => {
            toast.success('Deleted Listing!');
        }).addCase(editSingleListing.pending, (state, action) => {
            state.isLoadingEdit = true;
        }).addCase(editSingleListing.fulfilled, (state, action) => {
            state.isLoadingEdit = false;
            toast.success('Editing Listing!');
        }).addCase(editSingleListing.rejected, (state, action) => {
            state.isLoadingEdit = false;
        });
    }
});

export const {setSuccessfulOrder, updateSingleListing, removeAmenity} = listingSlice.actions;

export default listingSlice.reducer;