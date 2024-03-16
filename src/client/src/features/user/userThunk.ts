import {createAsyncThunk} from '@reduxjs/toolkit';
import {useSelectorType} from '../../store';
import axios from 'axios';

export const showCurrentUser = createAsyncThunk('user/showCurrentUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/showCurrentUser');
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.resposne.data.msg);
    }
});

export const registerUser = createAsyncThunk('user/registerUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/register', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/login', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const logoutUser = createAsyncThunk('user/logoutUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/auth/logout');
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getProfileData = createAsyncThunk('user/getProfileData', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/profileData');
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateUser = createAsyncThunk('user/updateUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateUser', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleUser = createAsyncThunk('user/getSingleUser', async(userID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${userID}`);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleUserListings = createAsyncThunk('user/getSingleUserListings', async(userEmail: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/listing?email=${userEmail}`);
        const data = response.data;
        return data;
    }   
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllUsers = createAsyncThunk('user/getAllUsers', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).user;
        const response = await axios.get(`/api/v1/user?search=${searchBoxValues.search}&role=${searchBoxValues.role}&country=${searchBoxValues.country}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});