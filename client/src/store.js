import {configureStore} from "@reduxjs/toolkit";
import userReducer from './features/user/userSlice.js';
import navigationReducer from './features/navigation/navigationSlice.js';
import profileReducer from './features/profile/profileSlice.js';
import homeReducer from './features/home/homeSlice.js';
import listingReducer from './features/listing/listingSlice.js';
import reservationsReducer from './features/reservations/reservationsSlice.js';
import reviewReducer from './features/reviews/reviewsSlice.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        navigation: navigationReducer,
        profile: profileReducer,
        home: homeReducer,
        listing: listingReducer,
        reservations: reservationsReducer,
        review: reviewReducer
    }
});

export default store;