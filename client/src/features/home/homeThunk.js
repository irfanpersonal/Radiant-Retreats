import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

export const getAllListings = createAsyncThunk('home/getAllListings', async(_, thunkAPI) => {
    try {
        const {page, searchValues} = thunkAPI.getState().home;
        const response = await axios.get(`/api/v1/listings?page=${page}&search=${searchValues.search}&country=${searchValues.country}&priceMin=${searchValues.priceMin}&priceMax=${searchValues.priceMax}`);
        const data = response.data;
        return data;
    }
    catch(error) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});