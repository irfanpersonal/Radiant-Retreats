import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const createHostRequest = createAsyncThunk('hostRequest/createHostRequest', async(hostRequestData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/hostRequest', hostRequestData);
        const data = response.data;
        return data.hostRequest;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllHostRequests = createAsyncThunk('hostRequest/getAllHostRequests', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).hostRequest;
        const response = await axios.get(`/api/v1/hostRequest?search=${searchBoxValues.search}&country=${searchBoxValues.country}&status=${searchBoxValues.status}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleHostRequest = createAsyncThunk('hostRequest/getSingleHostRequest', async(hostRequestID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/hostRequest/${hostRequestID}`);
        const data = response.data;
        return data.hostRequest;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleHostRequest = createAsyncThunk('hostRequest/updateSingleHostRequest', async(hostRequestData: {id: string, data: 'accepted' | 'rejected'}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/hostRequest/${hostRequestData.id}`, {status: hostRequestData.data});
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});