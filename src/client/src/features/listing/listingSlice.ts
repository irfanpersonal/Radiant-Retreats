import {createSlice} from '@reduxjs/toolkit';
import {createListing, deleteSingleListing, getAllListings, getAllProfileListings, getSingleListing, getSingleListingWithAuth, updateSingleListing} from './listingThunk';
import {toast} from 'react-toastify';
import {type UserType} from '../user/userSlice';
import {deleteSingleReview, updateSingleReview, createReview} from '../reviews/reviewsThunk';
import {getSingleUserListings} from '../user/userThunk';

export type ReserveType = {
    id: string,
    startDate: string,
    endDate: string,
    clientSecret: string,
    userId: string,
    listingId: string,
    createdAt: string,
    updatedAt: string
};

export type ListingType = {
    id: string,
    name: string,
    description: string,
    housingCapacity: string,
    bedrooms: string,
    beds: string,
    baths: string,
    price: string,
    amenities: string[],
    maintenanceFee: string,
    photos: string[],
    propertyType: string,
    bookedDates: [string, string][],
    averageRating: string,
    userId: string,
    user: UserType,
    myListing: boolean,
    didReserveAtOnePoint: ReserveType,
    country: string,
    address?: string,
    createdAt: string,
    updatedAt: string
};

interface IListing {
    createListingLoading: boolean,
    getAllProfileListingsLoading: boolean,
    getSingleListingLoading: boolean,
    getSingleUserListingsLoading: boolean,
    getAllListingsLoading: boolean,
    deleteSingleListingLoading: boolean,
    updateSingleListingLoading: boolean,
    searchBoxValues: {
        search: string,
        country: string,
        priceMin: string,
        priceMax: string,
        housingAmount: string,
        bedroomsAmount: string,
        bedsAmount: string,
        bathsAmount: string,
        sort: 'oldest' | 'latest' | 'lowest-price' | 'highest-price' | '',
        propertyTypeValue: 'house' | 'apartment' | 'hotel' | 'guesthouse' | '',
        hostLanguage: string
    }
    page: number | '',
    listings: ListingType[],
    totalListings: number | null,
    numberOfPages: number | null,
    listing: ListingType | null,
    isEditing: boolean
}

const initialState: IListing = {
    createListingLoading: false,
    getAllProfileListingsLoading: true,
    getSingleListingLoading: true,
    getSingleUserListingsLoading: true,
    getAllListingsLoading: true,
    deleteSingleListingLoading: false,
    updateSingleListingLoading: false,
    page: '',
    searchBoxValues: {
        search: '',
        country: '',
        priceMin: '',
        priceMax: '',
        housingAmount: '',
        bedroomsAmount: '',
        bedsAmount: '',
        bathsAmount: '',
        sort: '',
        propertyTypeValue: '',
        hostLanguage: ''
    },
    listings: [],
    totalListings: null,
    numberOfPages: null,
    listing: null,
    isEditing: false
};

const listingSlice = createSlice({
    name: 'listing',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        resetSearchBoxValues: (state, action) => {
            state.searchBoxValues = {
                search: '',
                country: '',
                priceMin: '',
                priceMax: '',
                housingAmount: '',
                bedroomsAmount: '',
                bedsAmount: '',
                bathsAmount: '',
                sort: '',
                propertyTypeValue: '',
                hostLanguage: ''
            };
        },
        setIsEditing: (state, action) => {
            state.isEditing = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createListing.pending, (state) => {
            state.createListingLoading = true;
        }).addCase(createListing.fulfilled, (state) => {
            state.createListingLoading = false;
            toast.success('Created Listing!');
        }).addCase(createListing.rejected, (state, action) => {
            state.createListingLoading = false;
            toast.error(action.payload as string);
        }).addCase(getAllProfileListings.pending, (state) => {
            state.getAllProfileListingsLoading = true;
        }).addCase(getAllProfileListings.fulfilled, (state, action) => {
            state.getAllProfileListingsLoading = false;
            state.listings = action.payload.listings;
            state.totalListings = action.payload.totalListings;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllProfileListings.rejected, (state) => {
            state.getAllProfileListingsLoading = false;
        }).addCase(getSingleListing.pending, (state) => {
            state.getSingleListingLoading = true;
        }).addCase(getSingleListing.fulfilled, (state, action) => {
            state.getSingleListingLoading = false;
            state.listing = action.payload;
        }).addCase(getSingleListing.rejected, (state) => {
            state.getSingleListingLoading = true;
        }).addCase(getSingleListingWithAuth.pending, (state) => {
            state.getSingleListingLoading = true;
        }).addCase(getSingleListingWithAuth.fulfilled, (state, action) => {
            state.getSingleListingLoading = false;
            state.listing = action.payload;
        }).addCase(getSingleListingWithAuth.rejected, (state) => {
            state.getSingleListingLoading = true;
        }).addCase(updateSingleReview.fulfilled, (state, action) => {
            state.listing!.averageRating = action.payload.averageRating;
        }).addCase(deleteSingleReview.fulfilled, (state, action) => {
            state.listing!.averageRating = action.payload.averageRating;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.listing!.averageRating = action.payload.review.averageRating;
        }).addCase(getSingleUserListings.pending, (state) => {
            state.getSingleUserListingsLoading = true;
        }).addCase(getSingleUserListings.fulfilled, (state, action) => {
            state.getSingleUserListingsLoading = false;
            state.listings = action.payload.listings;
            state.totalListings = action.payload.totalListings;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getSingleUserListings.rejected, (state) => {
            state.getSingleUserListingsLoading = false;
        }).addCase(getAllListings.pending, (state) => {
            state.getAllListingsLoading = true;
        }).addCase(getAllListings.fulfilled, (state, action) => {
            state.getAllListingsLoading = false;
            state.listings = action.payload.listings;
            state.totalListings = action.payload.totalListings;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllListings.rejected, (state) => {
            state.getAllListingsLoading = false;
        }).addCase(deleteSingleListing.pending, (state) => {
            state.deleteSingleListingLoading = true;
        }).addCase(deleteSingleListing.fulfilled, (state, action) => {
            state.deleteSingleListingLoading = false;
            toast.success('Deleted Listing!');
        }).addCase(deleteSingleListing.rejected, (state, action) => {
            state.deleteSingleListingLoading = false;
            toast.error(action.payload as string);
        }).addCase(updateSingleListing.pending, (state) => {
            state.updateSingleListingLoading = true;
        }).addCase(updateSingleListing.fulfilled, (state, action) => {
            state.updateSingleListingLoading = false;
            state.listing = {...state.listing, ...action.payload};
            toast.success('Edited Listing!');
        }).addCase(updateSingleListing.rejected, (state) => {
            state.updateSingleListingLoading = false;
        });
    }
});

export const {setPage, updateSearchBoxValues, resetSearchBoxValues, setIsEditing} = listingSlice.actions;

export default listingSlice.reducer;