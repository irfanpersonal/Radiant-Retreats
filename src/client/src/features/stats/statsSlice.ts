import {createSlice} from '@reduxjs/toolkit';
import {getAdvancedStats, getGeneralStats} from './statsThunk';

type GeneralStatsType = {
    userCount: number,
    reviewCount: number,
    listingCount: number,
    reservationCount: number,
    hostRequestCount: number,
    totalProfit: number
};

type ChartDataType = {year: number, month: number, count: number};

type AdvancedStatsType = {
    monthlyUsers: ChartDataType[],
    monthlyReservations: ChartDataType[],
    monthlyListings: ChartDataType[],
    monthlyHostRequests: ChartDataType[],
    monthlyReviews: ChartDataType[]
};

interface IStats {
    getGeneralStatsLoading: boolean,
    generalStats: GeneralStatsType | null,
    getAdvancedStatsLoading: boolean,
    advancedStats: AdvancedStatsType | null
}

const initialState: IStats = {
    getGeneralStatsLoading: true,
    generalStats: null,
    getAdvancedStatsLoading: true,
    advancedStats: null
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getGeneralStats.pending, (state) => {
            state.getGeneralStatsLoading = true;
        }).addCase(getGeneralStats.fulfilled, (state, action) => {
            state.getGeneralStatsLoading = false;
            state.generalStats = action.payload;
        }).addCase(getGeneralStats.rejected, (state) => {
            state.getGeneralStatsLoading = false;
        }).addCase(getAdvancedStats.pending, (state) => {
            state.getAdvancedStatsLoading = true;
        }).addCase(getAdvancedStats.fulfilled, (state, action) => {
            state.getAdvancedStatsLoading = false;
            state.advancedStats = action.payload;
        }).addCase(getAdvancedStats.rejected, (state) => {
            state.getAdvancedStatsLoading = false;
        });
    }
});

export const {} = statsSlice.actions;

export default statsSlice.reducer;