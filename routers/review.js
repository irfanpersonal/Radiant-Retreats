const express = require('express');
const router = express.Router();

const {createReview, getSingleReview, updateSingleReview, deleteSingleReview} = require('../controllers/review.js');
const {authentication, restrictFunctionalityTo} = require('../middleware/authentication.js');

router.route('/').post(authentication, restrictFunctionalityTo('customer'), createReview);
router.route('/:id').get(getSingleReview).patch(authentication, restrictFunctionalityTo('customer'), updateSingleReview).delete(authentication, restrictFunctionalityTo('customer'), deleteSingleReview);

module.exports = router;