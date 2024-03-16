import {createAsyncThunk} from '@reduxjs/toolkit';
import {useSelectorType} from '../../store';
import axios from 'axios';

export const getListingReviews = createAsyncThunk('reviews/getListingReviews', async(listingID: string, thunkAPI) => {
    try {
        const {searchBoxValues} = (thunkAPI.getState() as useSelectorType).reviews;
        const response = await axios.get(`/api/v1/listing/${listingID}/review?sort=${searchBoxValues.sort}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getListingReviewsWithAuth = createAsyncThunk('reviews/getListingReviewsWithAuth', async(listingID: string, thunkAPI) => {
    try {
        const {searchBoxValues} = (thunkAPI.getState() as useSelectorType).reviews;
        const response = await axios.get(`/api/v1/listing/${listingID}/review/auth?sort=${searchBoxValues.sort}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleReview = createAsyncThunk('reviews/updateSingleReview', async(inputData: {listingID: string, reviewID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/listing/${inputData.listingID}/review/${inputData.reviewID}`, inputData.data);
        const data = response.data;
        return data.review;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleReview = createAsyncThunk('reviews/deleteSingleReview', async(inputData: {listingID: string, reviewID: string}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/listing/${inputData.listingID}/review/${inputData.reviewID}`);
        const data = response.data;
        thunkAPI.dispatch(getListingReviews(inputData.listingID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReview = createAsyncThunk('reviews/createReview', async(inputData: {listingID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/listing/${inputData.listingID}/review`, inputData.data);
        const data = response.data;
        thunkAPI.dispatch(getListingReviewsWithAuth(inputData.listingID));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});