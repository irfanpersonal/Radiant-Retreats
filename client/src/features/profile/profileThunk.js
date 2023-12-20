import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getSingleUser = createAsyncThunk('profile/getSingleUser', async(userID, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/users/${userID}`);
        const data = response.data;
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getOwnerSpecificListings = createAsyncThunk('profile/getOwnerSpecificListings', async(_, thunkAPI) => {
    try {
        const page = thunkAPI.getState().profile.page;
        const response = await axios.get(`/api/v1/listings/getOwnerSpecificListings?page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateUser = createAsyncThunk('profile/updateUser', async({user, userID}, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/users/updateSingleUser', user);
        const data = response.data;
        thunkAPI.dispatch(getSingleUser(userID));
        return data.user;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});