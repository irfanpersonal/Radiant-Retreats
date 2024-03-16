import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import {setIsEditing} from './listingSlice';
import axios from 'axios';

export const createListing = createAsyncThunk('listing/createListing', async(listingData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/listing', listingData);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllProfileListings = createAsyncThunk('listing/getAllProfileListings', async(_, thunkAPI) => {
    try {
        const {user} = (thunkAPI.getState() as useSelectorType).user;
        const {page, searchBoxValues} = (thunkAPI.getState() as useSelectorType).listing;
        const response = await axios.get(`/api/v1/listing?email=${user!.email}&search=${searchBoxValues.search}&country=${searchBoxValues.country}&priceMin=${searchBoxValues.priceMin}&priceMax=${searchBoxValues.priceMax}&housingAmount=${searchBoxValues.housingAmount}&bedroomsAmount=${searchBoxValues.bedroomsAmount}&bedsAmount=${searchBoxValues.bedsAmount}&bathsAmount=${searchBoxValues.bathsAmount}&propertyTypeValue=${searchBoxValues.propertyTypeValue}&hostLanguage=${searchBoxValues.hostLanguage}&sort=${searchBoxValues.sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleListing = createAsyncThunk('listing/getSingleListing', async(listingID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/listing/${listingID}`);
        const data = response.data;
        return data.listing;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleListingWithAuth = createAsyncThunk('listing/getSingleListingWithAuth', async(listingID: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/listing/${listingID}/auth`);
        const data = response.data;
        return data.listing;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllListings = createAsyncThunk('listing/getAllListings', async(_, thunkAPI) => {
    try {
        const {searchBoxValues, page} = (thunkAPI.getState() as useSelectorType).listing;
        const response = await axios.get(`/api/v1/listing?search=${searchBoxValues.search}&country=${searchBoxValues.country}&priceMin=${searchBoxValues.priceMin}&priceMax=${searchBoxValues.priceMax}&housingAmount=${searchBoxValues.housingAmount}&bedroomsAmount=${searchBoxValues.bedroomsAmount}&bedsAmount=${searchBoxValues.bedsAmount}&bathsAmount=${searchBoxValues.bathsAmount}&sort=${searchBoxValues.sort}&propertyTypeValue=${searchBoxValues.propertyTypeValue}&hostLanguage=${searchBoxValues.hostLanguage}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateSingleListing = createAsyncThunk('listing/updateSingleListing', async(inputData: {listingID: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/listing/${inputData.listingID}`, inputData.data);
        const data = response.data;
        thunkAPI.dispatch(setIsEditing(false));
        return data.listing;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleListing = createAsyncThunk('listing/deleteSingleListing', async(listingID: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/listing/${listingID}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});