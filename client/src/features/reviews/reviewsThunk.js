import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getAllReviews = createAsyncThunk('reviews/getAllReviews', async(listingID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/listings/${listingID}/reviews`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReview = createAsyncThunk('reviews/createReview', async({review, listingID}, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/reviews', review);
        const data = response.data;
        thunkAPI.dispatch(getAllReviews(listingID));
        return data.review;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async({reviewID, listingID}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/reviews/${reviewID}`);
        const data = response.data;
        thunkAPI.dispatch(getAllReviews(listingID));
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateReview = createAsyncThunk('reviews/updateReview', async({reviewID, review, listingID}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/reviews/${reviewID}`, review);
        const data = response.data;
        thunkAPI.dispatch(getAllReviews(listingID));
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});