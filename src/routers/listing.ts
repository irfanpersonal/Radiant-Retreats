import express from 'express';
const router: express.Router = express.Router();

import {getAllListings, createListing, getSingleListing, getSingleListingWithAuth, updateSingleListing, deleteSingleListing} from '../controllers/listing';
import {getAllListingReservations, createPaymentIntent, createReservation} from '../controllers/reservation';
import {getAllListingReviews, getAllListingReviewsWithAuth, createReview, updateSingleReview, deleteSingleReview} from '../controllers/review';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').get(getAllListings).post(authentication, restrictFunctionalityTo('host'), createListing);
router.route('/:id/reservation').get(authentication, restrictFunctionalityTo('host'), getAllListingReservations).post(authentication, restrictFunctionalityTo('guest', 'host'), createPaymentIntent);
router.route('/:id/reservation/create').post(authentication, restrictFunctionalityTo('guest', 'host'), createReservation);
router.route('/:id/review/auth').get(authentication, getAllListingReviewsWithAuth);
router.route('/:id/review').get(getAllListingReviews);
router.route('/:id/review').post(authentication, restrictFunctionalityTo('guest', 'host'), createReview);
router.route('/:id/review/:reviewId').patch(authentication, restrictFunctionalityTo('guest', 'admin'), updateSingleReview).delete(authentication, restrictFunctionalityTo('guest', 'host'), deleteSingleReview);
router.route('/:id/auth').get(authentication, getSingleListingWithAuth);
router.route('/:id').get(getSingleListing).patch(authentication, restrictFunctionalityTo('host'), updateSingleListing).delete(authentication, restrictFunctionalityTo('host'), deleteSingleListing);

export default router;