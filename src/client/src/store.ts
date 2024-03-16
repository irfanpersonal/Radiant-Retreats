import {configureStore} from '@reduxjs/toolkit';
import navigationReducer from './features/navigation/navigationSlice';
import userReducer from './features/user/userSlice';
import hostRequestReducer from './features/hostRequest/hostRequestSlice';
import listingReducer from './features/listing/listingSlice';
import reviewsReducer from './features/reviews/reviewsSlice';
import reservationReducer from './features/reservation/reservationSlice';
import statsReducer from './features/stats/statsSlice';
import cashOutReducer from './features/cashOut/cashOutSlice';

const store = configureStore({
    reducer: {
        navigation: navigationReducer,
        user: userReducer,
        hostRequest: hostRequestReducer,
        listing: listingReducer,
        reviews: reviewsReducer,
        reservation: reservationReducer,
        stats: statsReducer,
        cashOut: cashOutReducer
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;