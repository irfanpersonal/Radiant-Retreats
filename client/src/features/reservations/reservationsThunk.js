import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getAllReservations = createAsyncThunk('reservations/getAllReservations', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/reservations');
        const data = response.data;
        return data.reservations;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllListingReservations = createAsyncThunk('reservations/getAllListingReservations', async(listingID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/listings/${listingID}/reservations`);
        const data = response.data;
        return data.reservations;
    }   
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});