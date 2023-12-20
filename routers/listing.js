const express = require('express');
const router = express.Router();

const {getAllListings, getOwnerSpecificListings, createListing, getSingleListing, updateSingleListing, deleteSingleListing} = require('../controllers/listing.js');
const {getAllListingReservations} = require('../controllers/reservation.js');
const {getAllListingReviews} = require('../controllers/review.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/').get(getAllListings).post(authentication, restrictFunctionalityTo('owner'), createListing);
router.route('/getOwnerSpecificListings').get(authentication, getOwnerSpecificListings);
router.route('/:id').get(getSingleListing).patch(authentication, restrictFunctionalityTo('owner'), updateSingleListing).delete(authentication, restrictFunctionalityTo('owner'), deleteSingleListing);
router.route('/:id/reservations').get(authentication, restrictFunctionalityTo('owner'), getAllListingReservations);
router.route('/:id/reviews').get(getAllListingReviews);

module.exports = router;