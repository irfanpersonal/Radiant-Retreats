import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const createPaymentIntent = createAsyncThunk('reservation/createPaymentIntent', async(inputData: {listingID: string, startDate: string, endDate: string}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/listing/${inputData.listingID}/reservation`, {startDate: inputData.startDate, endDate: inputData.endDate});
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReservation = createAsyncThunk('reservation/createReservation', async(inputData: {startDate: string, endDate: string, clientSecret: string, total: number, listingID: string}, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/listing/${inputData.listingID}/reservation/create`, {startDate: inputData.startDate, endDate: inputData.endDate, total: inputData.total, clientSecret: inputData.clientSecret});
        const data = response.data;
        return data.reservation;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllUserReservations = createAsyncThunk('reservation/getAllUserReservations', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).reservation;
        const response = await axios.get(`/api/v1/user/allUserReservations?sort=${searchBoxValues.sort}&startDate=${searchBoxValues.startDate}&endDate=${searchBoxValues.endDate}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleReservation = createAsyncThunk('reservation/getSingleReservation', async(reservationID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/reservation/${reservationID}`);
        const data = response.data;
        return data.reservation;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllListingReservations = createAsyncThunk('reservation/getAllListingReservations', async(listingID: string, thunkAPI) => {
    try {
        const {page} = (thunkAPI.getState() as useSelectorType).reservation;
        const response = await axios.get(`/api/v1/listing/${listingID}/reservation?page=${page}&limit=4`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});