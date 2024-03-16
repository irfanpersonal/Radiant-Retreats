import {createSlice} from '@reduxjs/toolkit';
import {getEarningsData, createCashOut, getAllMyCashOuts, getSingleCashOut, updateSingleCashOut, getAllCashOuts} from './cashOutThunk';
import {toast} from 'react-toastify';
import {type UserType} from '../user/userSlice';

export type CashOutType = {
    id: string,
    fullName: string,
    accountNumber: string,
    routingNumber: string,
    amount: number,
    status: string,
    user: UserType,
    userId: string,
    createdAt: string,
    updatedAt: string
}

interface ICashOut {
    getAllMyCashOutsLoading: boolean,
    getEarningsDataLoading: boolean,
    createCashOutLoading: boolean,
    getSingleCashOutLoading: boolean,
    updateSingleCashOutLoading: boolean,
    getAllCashOutsLoading: boolean,
    earningsData: {balance: number, canCashOut: boolean} | null,
    showCashOutModal: boolean,
    showConfirmPayoutModal: boolean,
    cashOut: CashOutType | null,
    cashOuts: CashOutType[],
    totalCashOuts: number | null,
    numberOfPages: number | null,
    page: 1,
    searchBoxValues: {
        status: 'pending' | 'paid' | '',
        sort: 'oldest' | 'latest' | ''
    }
}

const initialState: ICashOut = {
    getAllMyCashOutsLoading: true,
    getEarningsDataLoading: true,
    createCashOutLoading: false,
    getSingleCashOutLoading: true,
    updateSingleCashOutLoading: false,
    getAllCashOutsLoading: true,
    earningsData: null,
    showCashOutModal: false,
    showConfirmPayoutModal: false,
    cashOut: null,
    cashOuts: [],
    totalCashOuts: null,
    numberOfPages: null,
    page: 1,
    searchBoxValues: {
        status: '',
        sort: ''
    }
};

const cashOutSlice = createSlice({
    name: 'cashOut',
    initialState,
    reducers: {
        setShowCashOutModal: (state, action) => {
            state.showCashOutModal = action.payload;
        },
        setShowConfirmPayoutModal: (state, action) => {
            state.showConfirmPayoutModal = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        resetSearchBoxValues: (state, action) => {
            state.searchBoxValues = {
                status: '',
                sort: ''
            }
        },
        updateSearchBoxValues: (state, action) => {
            state.searchBoxValues[action.payload.name as keyof typeof state.searchBoxValues] = action.payload.value;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllMyCashOuts.pending, (state) => {
            state.getAllMyCashOutsLoading = true;
        }).addCase(getAllMyCashOuts.fulfilled, (state, action) => {
            state.getAllMyCashOutsLoading = false;
            state.cashOuts = action.payload.cashOuts;
            state.totalCashOuts = action.payload.totalCashOuts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllMyCashOuts.rejected, (state, action) => {
            state.getAllMyCashOutsLoading = false;
        }).addCase(getEarningsData.pending, (state) => {
            state.getEarningsDataLoading = true;
        }).addCase(getEarningsData.fulfilled, (state, action) => {
            state.getEarningsDataLoading = false;
            state.earningsData = action.payload;
        }).addCase(getEarningsData.rejected, (state) => {
            state.getEarningsDataLoading = false;
        }).addCase(createCashOut.pending, (state) => {
            state.createCashOutLoading = true;
        }).addCase(createCashOut.fulfilled, (state, action) => {
            state.createCashOutLoading = false;
            state.earningsData!.canCashOut = false;
            state.showCashOutModal = false;
            toast.success('Created Cash Out!');
        }).addCase(createCashOut.rejected, (state, action) => {
            state.createCashOutLoading = false;
            toast.error(action.payload as string);
        }).addCase(getSingleCashOut.pending, (state) => {
            state.getSingleCashOutLoading = true;
        }).addCase(getSingleCashOut.fulfilled, (state, action) => {
            state.getSingleCashOutLoading = false;
            state.cashOut = action.payload;
        }).addCase(getSingleCashOut.rejected, (state) => {
            state.getSingleCashOutLoading = true;
        }).addCase(updateSingleCashOut.pending, (state) => {
            state.updateSingleCashOutLoading = true;
        }).addCase(updateSingleCashOut.fulfilled, (state, action) => {
            state.updateSingleCashOutLoading = false;
            state.cashOut!.status = 'paid';
            state.cashOut!.updatedAt = String(new Date());
            toast.success('Updated Cash Out');
        }).addCase(updateSingleCashOut.rejected, (state, action) => {
            state.updateSingleCashOutLoading = false;
            toast.error(action.payload as string);
        }).addCase(getAllCashOuts.pending, (state) => {
            state.getAllCashOutsLoading = true;
        }).addCase(getAllCashOuts.fulfilled, (state, action) => {
            state.getAllCashOutsLoading = false;
            state.cashOuts = action.payload.cashOuts;
            state.totalCashOuts = action.payload.totalCashOuts;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllCashOuts.rejected, (state) => {
            state.getAllCashOutsLoading = false;
        });
    }
});

export const {setShowCashOutModal, setShowConfirmPayoutModal, setPage, resetSearchBoxValues, updateSearchBoxValues} = cashOutSlice.actions;

export default cashOutSlice.reducer;