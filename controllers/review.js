const {StatusCodes} = require('http-status-codes');
const {Review, Reservation, Listing, User} = require('../models');
const CustomError = require('../errors');

const getAllListingReviews = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findOne({
        where: {id}
    });
    const reviews = await Review.findAll({
        where: {listing: id},
        include: [{ 
            model: User, 
            as: 'userDetails',
            attributes: ['name', 'profilePicture']
        }]
    });
    return res.status(StatusCodes.OK).json({reviews, averageRating: listing.toJSON().averageRating});
}

const createReview = async(req, res) => {
    // Check if the user had a reservation for this listing at any point in time
    const didReserve = await Reservation.findOne({
        where: {listing: req.body.listing, user: req.user.userID}
    });
    // If it didnt throw an error
    if (!didReserve) {
        throw new CustomError.BadRequestError('You need to have reserved this listing at some point in time to leave a review.');
    }
    // Check if a review has already been written by this user 
    const alreadyExists = await Review.findOne({
        where: {user: req.user.userID, listing: req.body.listing}
    });
    // If user already wrote a review for the same listing throw an error
    if (alreadyExists) {
        throw new CustomError.BadRequestError('You already wrote a review for this listing');
    }
    req.body.user = req.user.userID;
    const review = await Review.create(req.body);
    return res.status(StatusCodes.OK).json({review});
}

const getSingleReview = async(req, res) => {
    const {id} = req.params;
    const review = await Review.findOne({
        where: {id}
    });
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({review});
}

const updateSingleReview = async(req, res) => {
    const {id} = req.params;
    const review = await Review.findOne({
        where: {id}
    });
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    const {rating, title, content} = req.body;
    if (rating) {
        review.rating = rating;
    } 
    if (title) {
        review.title = title;
    }
    if (content) {
        review.content = content;
    }
    await review.save();
    return res.status(StatusCodes.OK).json({review});
}

const deleteSingleReview = async(req, res) => {
    const {id} = req.params;
    const review = await Review.findOne({
        where: {id}
    });
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    await review.destroy();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Review!'});
}

module.exports = {
    getAllListingReviews,
    createReview,
    getSingleReview,
    updateSingleReview,
    deleteSingleReview
};