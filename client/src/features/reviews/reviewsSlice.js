import {createSlice} from "@reduxjs/toolkit";
import {createReview, deleteReview, getAllReviews, updateReview} from "./reviewsThunk";
import {toast} from 'react-toastify';

const initialState = {
    isLoadingReviews: true,
    isLoadingCreateReview: false,
    isDeletingReview: false,
    isEditingReview: false,
    reviews: [],
    averageRating: null
};

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(getAllReviews.pending, (state, action) => {
            state.isLoadingReviews = true;
        }).addCase(getAllReviews.fulfilled, (state, action) => {
            state.isLoadingReviews = false;
            state.reviews = action.payload.reviews;
            state.averageRating = action.payload.averageRating;
        }).addCase(getAllReviews.rejected, (state, action) => {
            state.isLoadingReviews = false;
        }).addCase(createReview.pending, (state, action) => {
            state.isLoadingCreateReview = true;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.isLoadingCreateReview = false;
            toast.success('Created Review!');
        }).addCase(createReview.rejected, (state, action) => {
            state.isLoadingCreateReview = false;
            toast.error(action.payload);
        }).addCase(deleteReview.pending, (state, action) => {
            state.isDeletingReview = true;
        }).addCase(deleteReview.fulfilled, (state, action) => {
            state.isDeletingReview = false;
            toast.success('Deleted Review');
        }).addCase(deleteReview.rejected, (state, action) => {
            state.isDeletingReview = false;
        }).addCase(updateReview.pending, (state, action) => {
            state.isEditingReview = true;
        }).addCase(updateReview.fulfilled, (state, action) => {
            state.isEditingReview = false;
            toast.success('Edited Review!');
        }).addCase(updateReview.rejected, (state, action) => {
            state.isEditingReview = false;
            toast.error(action.payload);
        });
    }
});

export const {} = reviewSlice.actions;

export default reviewSlice.reducer;