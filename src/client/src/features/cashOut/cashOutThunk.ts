import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {setShowConfirmPayoutModal} from './cashOutSlice';
import { useSelectorType } from '../../store';

export const getEarningsData = createAsyncThunk('cashOut/getEarningsData', async(_, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/cashout/getEarningsData`);
        const data = response.data;
        return data.earningsData;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createCashOut = createAsyncThunk('cashOut/createCashOut', async(inputData: FormData, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/cashout`, inputData);
        const data = response.data;
        thunkAPI.dispatch(getAllMyCashOuts());
        return data.cashOut;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllMyCashOuts = createAsyncThunk('cashOut/getAllMyCashOuts', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).cashOut;
        const response = await axios.get(`/api/v1/cashout/myCashOuts?status=${searchBoxValues.status}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleCashOut = createAsyncThunk('cashOut/getSingleCashOut', async(cashOutID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/cashout/${cashOutID}`);
        const data = response.data;
        return data.cashOut;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleCashOut = createAsyncThunk('cashOut/updateSingleCashOut', async(inputData: {status: string, cashOutId: string}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/cashout/${inputData.cashOutId}`, {status: inputData.status});
        const data = response.data;
        thunkAPI.dispatch(setShowConfirmPayoutModal(false));
        return data.cashOut;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllCashOuts = createAsyncThunk('cashOut/getAllCashOuts', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).cashOut;
        const response = await axios.get(`/api/v1/cashout?status=${searchBoxValues.status}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});