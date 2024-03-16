import {createSlice} from '@reduxjs/toolkit';
import {type UserType} from '../user/userSlice';
import {createHostRequest, getAllHostRequests, getSingleHostRequest, updateSingleHostRequest} from './hostRequestThunk';
import {toast} from 'react-toastify';

export type HostRequest = {
    id: string,
    userId: string,
    phoneNumber: string,
    location: string,
    governmentIssuedID: string,
    backgroundCheck: string,
    status: string,
    user: UserType,
    createdAt: string,
    updatedAt: string,
};

interface IHostRequest {
    createHostRequestLoading: boolean,
    getAllHostRequestsLoading: boolean,
    hostRequests: HostRequest[],
    totalHostRequests: number | '',
    numberOfPages: number | '',
    page: number | '',
    searchBoxValues: {
        search: string,
        country: string,
        status: 'pending' | 'accepted' | 'rejected' | '',
        sort: 'latest' | 'oldest' | ''
    },
    getSingleHostRequestLoading: boolean,
    hostRequest: HostRequest | null,
    editSingleHostRequestLoading: boolean
}

const initialState: IHostRequest = {
    createHostRequestLoading: false,
    getAllHostRequestsLoading: true,
    hostRequests: [],
    totalHostRequests: '',
    numberOfPages: '',
    page: '',
    searchBoxValues: {
        search: '',
        country: '',
        status: '',
        sort: ''
    },
    getSingleHostRequestLoading: true,
    hostRequest: null,
    editSingleHostRequestLoading: false
};

const hostRequestSlice = createSlice({
    name: 'hostRequest',
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
                status: '',
                sort: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createHostRequest.pending, (state) => {
            state.createHostRequestLoading = true;
        }).addCase(createHostRequest.fulfilled, (state, action) => {
            state.createHostRequestLoading = false;
            toast.success('Created Host Request!');
        }).addCase(createHostRequest.rejected, (state, action) => {
            state.createHostRequestLoading = false;
            toast.error(action.payload as string);
        }).addCase(getAllHostRequests.pending, (state) => {
            state.getAllHostRequestsLoading = true;
        }).addCase(getAllHostRequests.fulfilled, (state, action) => {
            state.getAllHostRequestsLoading = false;
            state.hostRequests = action.payload.hostRequests;
            state.totalHostRequests = action.payload.totalHostRequests;
            state.numberOfPages = action.payload.numberOfPages;
        }).addCase(getAllHostRequests.rejected, (state) => {
            state.getAllHostRequestsLoading = false;
        }).addCase(getSingleHostRequest.pending, (state) => {
            state.getSingleHostRequestLoading = true;
        }).addCase(getSingleHostRequest.fulfilled, (state, action) => {
            state.getSingleHostRequestLoading = false;
            state.hostRequest = action.payload;
        }).addCase(getSingleHostRequest.rejected, (state) => {
            state.getSingleHostRequestLoading = true;
        }).addCase(updateSingleHostRequest.pending, (state) => {
            state.editSingleHostRequestLoading = true;
        }).addCase(updateSingleHostRequest.fulfilled, (state, action) => {
            state.editSingleHostRequestLoading = false;
            state.hostRequest!.status = action.meta.arg.data;
        }).addCase(updateSingleHostRequest.rejected, (state, action) => {
            state.editSingleHostRequestLoading = false;
            toast.error(action.payload as string);
        });
    }
});

export const {setPage, updateSearchBoxValues, resetSearchBoxValues} = hostRequestSlice.actions;

export default hostRequestSlice.reducer;