import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getGeneralStats = createAsyncThunk('stats/getGeneralStats', async(_, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/admin/generalStats`);
        const data = response.data;
        return data.generalStats;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAdvancedStats = createAsyncThunk('stats/getAdvancedStats', async(_, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/admin/advancedStats`);
        const data = response.data;
        return data.advancedStats;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});