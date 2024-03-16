import {createSlice} from '@reduxjs/toolkit';
import {createPaymentIntent, createReservation, getAllListingReservations, getAllUserReservations, getSingleReservation} from './reservationThunk';
import {toast} from 'react-toastify';
import {type ListingType} from '../listing/listingSlice';
import {type UserType} from '../user/userSlice';

type PaymentIntentType = {
    startDate: string,
    endDate: string,
    listing: ListingType,
    total: number,
    clientSecret: string
};

export type ReservationType = {
    id: string,
    startDate: string,
    endDate: string,
    clientSecret: string,
    userId: string,
    user: UserType,
    listingId: string,
    listing: ListingType,
    total: string,
    createdAt: string,
    updatedAt: string
};

interface IReservation {
    createPaymentIntentLoading: boolean,
    createReservationLoading: boolean,
    getSingleReservationLoading: boolean,
    paymentIntentData: PaymentIntentType | null,
    successfullyPayed: boolean,
    successfulPaymentInfo: ReservationType | null,
    reservation: ReservationType | null,
    getAllUserReservationsLoading: boolean,
    getAllListingReservationsLoading: boolean,
    reservations: ReservationType[],
    totalReservations: number | null,
    numberOfPages: number | null,
    page: number,
    searchBoxValues: {
        sort: 'latest' | 'oldest' | '',
        startDate: string,
        endDate: string
    }
}

const initialState: IReservation = {
    createPaymentIntentLoading: false,
    createReservationLoading: false,
    getSingleReservationLoading: true,
    paymentIntentData: null,
    successfullyPayed: false,
    successfulPaymentInfo: null,
    reservation: null,
    getAllUserReservationsLoading: true,
    getAllListingReservationsLoading: true,
    reservations: [],
    totalReservations: null,
    numberOfPages: null,
    page: 1,
    searchBoxValues: {
        sort: '',
        startDate: '',
        endDate: ''
    }
};

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setCreateReservationLoading: (state, action) => {
            state.createReservationLoading = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        },
        resetSearchBoxValues: (state, action) => {
            state.searchBoxValues = {
                sort: '',
                startDate: '',
                endDate: ''
            };
        },
        resetPurchaseData: (state) => {
            state.successfullyPayed = false;
            state.successfulPaymentInfo = null;
            state.paymentIntentData = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createPaymentIntent.pending, (state) => {
            state.createPaymentIntentLoading = true;
        }).addCase(createPaymentIntent.fulfilled, (state, action) => {
            state.createPaymentIntentLoading = false;
            state.paymentIntentData = action.payload;
        }).addCase(createPaymentIntent.rejected, (state, action) => {
            state.createPaymentIntentLoading = false;
            toast.error(action.payload as string);
        }).addCase(createReservation.pending, (state) => {
            state.createReservationLoading = true;
        }).addCase(createReservation.fulfilled, (state, action) => {
            state.createReservationLoading = false;
            state.successfullyPayed = true;
            state.successfulPaymentInfo = action.payload;
        }).addCase(createReservation.rejected, (state) => {
            state.createReservationLoading = false;
        }).addCase(getSingleReservation.pending, (state) => {
            state.getSingleReservationLoading = true;
        }).addCase(getSingleReservation.fulfilled, (state, action) => {
            state.getSingleReservationLoading = false;
            state.reservation = action.payload;
        }).addCase(getSingleReservation.rejected, (state) => {
            state.getSingleReservationLoading = true;
        }).addCase(getAllUserReservations.pending, (state) => {
            state.getAllUserReservationsLoading = true;
        }).addCase(getAllUserReservations.fulfilled, (state, action) => {
            state.getAllUserReservationsLoading = false;
            state.reservations = action.payload.reservations;
            state.totalReservations = action.payload.totalReservations;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllUserReservations.rejected, (state) => {
            state.getAllUserReservationsLoading = false;
        }).addCase(getAllListingReservations.pending, (state) => {
            state.getAllListingReservationsLoading = true;
        }).addCase(getAllListingReservations.fulfilled, (state, action) => {
            state.getAllListingReservationsLoading = false;
            state.reservations = action.payload.reservations;
            state.totalReservations = action.payload.totalReservations;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllListingReservations.rejected, (state) => {
            state.getAllListingReservationsLoading = false;
        });
    } 
});

export const {setCreateReservationLoading, setPage, updateSearchBoxValues, resetSearchBoxValues, resetPurchaseData} = reservationSlice.actions;

export default reservationSlice.reducer;