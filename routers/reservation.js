const express = require('express');
const router = express.Router();

const {getAllReservations, createPaymentIntent ,createReservation, getSingleReservation} = require('../controllers/reservation.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/').get(authentication, getAllReservations).post(authentication, restrictFunctionalityTo('customer'), createReservation);
router.route('/createPaymentIntent').post(authentication, restrictFunctionalityTo('customer'), createPaymentIntent);
router.route('/:id').get(authentication, getSingleReservation);

module.exports = router;