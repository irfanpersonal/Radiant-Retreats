import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const createListing = createAsyncThunk('listing/createListing', async(listing, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/listings', listing);
        const data = response.data;
        return data.listing;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleListing = createAsyncThunk('listing/getSingleListing', async(listingID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/listings/${listingID}`);
        const data = response.data;
        return data.listing;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createPaymentIntent = createAsyncThunk('listing/createPaymentIntent', async({startDate, endDate, listing}, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/reservations/createPaymentIntent', {startDate, endDate, listing});
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReservation = createAsyncThunk('listing/createReservation', async({startDate, endDate, listing, user, clientSecret}, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/reservations', {startDate, endDate, listing, user, clientSecret});
        const data = response.data;
        return data;
    }   
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleListing = createAsyncThunk('listing/deleteSingleListing', async(listingID, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/listings/${listingID}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleListing = createAsyncThunk('listing/editSingleListing', async({listingID, formData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/listings/${listingID}`, formData);
        const data = response.data;
        return data.listing;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});