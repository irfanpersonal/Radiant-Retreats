import {createSlice} from '@reduxjs/toolkit';
import {getListingReviews, getListingReviewsWithAuth, updateSingleReview, createReview} from './reviewsThunk';
import {toast} from 'react-toastify';

export type ReviewType = {
    id: string,
    title: string,
    content: string,
    rating: number,
    userId: string,
    listingId: string,
    user: {
        firstName: string,
        lastName: string,
        profilePicture: string
    },
    isMyComment: boolean,
    createdAt: string,
    updatedAt: string
};

interface IReview {
    getListingReviewsLoading: boolean,
    updateSingleReviewLoading: boolean,
    createReviewLoading: boolean,
    searchBoxValues: {
        sort: 'oldest' | 'latest' | 'lowest-rating' | 'highest-rating' | ''
    },
    page: number | '',
    reviews: ReviewType[],
    totalReviews: number | null,
    numberOfPages: number | null
}

const initialState: IReview = {
    getListingReviewsLoading: true,
    updateSingleReviewLoading: false,
    createReviewLoading: false,
    searchBoxValues: {
        sort: ''
    },
    page: '',
    reviews: [],
    totalReviews: null,
    numberOfPages: null
};

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        resetSearchBoxValues: (state, action) => {
            state.searchBoxValues = {
                sort: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getListingReviews.pending, (state) => {
            state.getListingReviewsLoading = true;
        }).addCase(getListingReviews.fulfilled, (state, action) => {
            state.getListingReviewsLoading = false;
            state.reviews = action.payload.reviews;
            state.totalReviews = action.payload.totalReviews;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getListingReviews.rejected, (state) => {
            state.getListingReviewsLoading = false;
        }).addCase(getListingReviewsWithAuth.pending, (state) => {
            state.getListingReviewsLoading = true;
        }).addCase(getListingReviewsWithAuth.fulfilled, (state, action) => {
            state.getListingReviewsLoading = false;
            state.reviews = action.payload.reviews;
            state.totalReviews = action.payload.totalReviews;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getListingReviewsWithAuth.rejected, (state) => {
            state.getListingReviewsLoading = false;
        }).addCase(updateSingleReview.pending, (state) => {
            state.updateSingleReviewLoading = true;
        }).addCase(updateSingleReview.fulfilled, (state, action) => {
            state.updateSingleReviewLoading = false;
            const review = state.reviews.find(review => review.id === action.meta.arg.reviewID);
            review!.title = action.payload.title;
            review!.rating = action.payload.rating;
            review!.content = action.payload.content;
        }).addCase(updateSingleReview.rejected, (state, action) => {
            state.updateSingleReviewLoading = false;
            toast.error(action.payload as string);
        }).addCase(createReview.pending, (state) => {
            state.createReviewLoading = true;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.createReviewLoading = false;
        }).addCase(createReview.rejected, (state, action) => {
            state.createReviewLoading = false;
            toast.error(action.payload as string);
        });
    }  
});

export const {setPage, resetSearchBoxValues, updateSearchBoxValues} = reviewsSlice.actions;

export default reviewsSlice.reducer;