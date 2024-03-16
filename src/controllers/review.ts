import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import Review, {IReview} from '../database/models/Review';
import Reservation from '../database/models/Reservation';
import User from '../database/models/User';
import {ITokenPayload} from '../utils';
import CustomError from '../errors';
import Sequelize from 'sequelize';
import Listing from '../database/models/Listing';

interface ReviewRequest extends Request {
    params: {
        id: string,
        reviewId: string
    },
    body: IReview,
    query: {
        sort: 'latest' | 'oldest' | 'lowest-rating' | 'highest-rating'
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const getAllListingReviews = async(req: ReviewRequest, res: Response) => {
    const {sort} = req.query;
    const {id} = req.params;
    const queryObject = {
        listingId: id
    };
    let order: Sequelize.OrderItem[] | undefined;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']]; 
    } 
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    else if (sort === 'lowest-rating') {
        order = [['rating', 'ASC']]
    }
    else if (sort === 'highest-rating') {
        order = [['rating', 'DESC']]
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Review.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'profilePicture', 'email']
        }]
    });
    const reviews = await result;
    const totalReviews = (await Review.findAll({where: queryObject})).length;
    const numberOfPages = Math.ceil(totalReviews / limit);
    return res.status(StatusCodes.OK).json({reviews, totalReviews, numberOfPages});
}

const getAllListingReviewsWithAuth = async(req: ReviewRequest, res: Response) => {
    const {sort} = req.query;
    const {id} = req.params;
    const queryObject = {
        listingId: id
    };
    let order: Sequelize.OrderItem[] | undefined;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']]; 
    } 
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    else if (sort === 'lowest-rating') {
        order = [['rating', 'ASC']]
    }
    else if (sort === 'highest-rating') {
        order = [['rating', 'DESC']]
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Review.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'profilePicture', 'email']
        }]
    });
    const reviews = await result;
    const processedReviews = reviews.map(review => {
        const reviewJSON = review.toJSON();
        const isMyComment = reviewJSON.user!.email === req.user!.email;
        return {...reviewJSON, isMyComment: isMyComment};
    });
    const totalReviews = (await Review.findAll({where: queryObject})).length;
    const numberOfPages = Math.ceil(totalReviews / limit);
    return res.status(StatusCodes.OK).json({reviews: processedReviews, totalReviews, numberOfPages});
}

const createReview = async(req: ReviewRequest, res: Response) => {
    const {id} = req.params;
    const {rating, title, content} = req.body;
    if (!rating || !title || !content) {
        throw new CustomError.BadRequestError('Please provide rating, title, and comment!');
    }
    const didReserveAtOnePoint = await Reservation.findOne({
        where: {
            listingId: id,
            userId: req.user!.userID
        }
    });
    if (!didReserveAtOnePoint) {
        throw new CustomError.BadRequestError('You cannot create a review unless you have reserved this listing at one point in time!');
    }
    const userAlreadyWroteReview = await Review.findOne({
        where: {
            listingId: id,
            userId: req.user!.userID
        }
    });
    if (userAlreadyWroteReview) {
        throw new CustomError.BadRequestError('You already wrote a review for this listing!');
    }
    req.body.userId = req.user!.userID;
    req.body.listingId = id;
    const review = await Review.create(req.body);
    const updatedListing = (await Listing.findByPk(review.listingId))!.toJSON();
    return res.status(StatusCodes.CREATED).json({review: {...review.toJSON(), averageRating: updatedListing.averageRating}});
}

const updateSingleReview = async(req: ReviewRequest, res: Response) => {
    const {reviewId} = req.params;
    const review = await Review.findOne({
        where: {
            id: reviewId,
            userId: req.user!.userID
        }
    });
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    const {rating, title, content} = req.body;
    if (rating) {
        review.rating = Number(rating);
    }
    if (title) {
        review.title = title;
    }
    if (content) {
        review.content = content;
    }
    await review.save();
    const updatedListing = (await Listing.findByPk(review.listingId))!.toJSON();
    return res.status(StatusCodes.OK).json({review: {...review.toJSON(), averageRating: updatedListing.averageRating}});
}

const deleteSingleReview = async(req: ReviewRequest, res: Response) => {
    const {reviewId} = req.params;
    const review = await Review.findOne({
        where: {
            id: reviewId,
            userId: req.user!.userID
        }
    });
    if (!review) {
        throw new CustomError.NotFoundError('No Review Found with the ID Provided!');
    }
    await review.destroy();
    const updatedListing = (await Listing.findByPk(review.listingId))!.toJSON();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Single Review!', averageRating: updatedListing.averageRating});
}

export {
    getAllListingReviews,
    getAllListingReviewsWithAuth,
    createReview,
    updateSingleReview,
    deleteSingleReview
};