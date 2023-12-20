import {createSlice} from "@reduxjs/toolkit";
import {getAllListings} from "./homeThunk";

const initialState = {
    isLoading: true,
    listings: [],
    totalListings: null,
    numberOfPages: null,
    page: 1,
    searchValues: {
        search: '',
        country: '',
        priceMin: '',
        priceMax: ''
    }
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateSearchValues: (state, action) => {
            state.searchValues[action.payload.name] = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllListings.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getAllListings.fulfilled, (state, action) => {
            state.isLoading = false;
            state.listings = action.payload.listings;
            state.totalListings = action.payload.totalListings;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllListings.rejected, (state, action) => {
            state.isLoading = false;
        })
    }
});

export const {setPage, updateSearchValues} = homeSlice.actions;

export default homeSlice.reducer;