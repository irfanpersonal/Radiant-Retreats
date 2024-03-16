"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleReview = exports.updateSingleReview = exports.createReview = exports.getAllListingReviewsWithAuth = exports.getAllListingReviews = void 0;
const http_status_codes_1 = require("http-status-codes");
const Review_1 = __importDefault(require("../database/models/Review"));
const Reservation_1 = __importDefault(require("../database/models/Reservation"));
const User_1 = __importDefault(require("../database/models/User"));
const errors_1 = __importDefault(require("../errors"));
const Listing_1 = __importDefault(require("../database/models/Listing"));
const getAllListingReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort } = req.query;
    const { id } = req.params;
    const queryObject = {
        listingId: id
    };
    let order;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']];
    }
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    else if (sort === 'lowest-rating') {
        order = [['rating', 'ASC']];
    }
    else if (sort === 'highest-rating') {
        order = [['rating', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Review_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: ['firstName', 'lastName', 'profilePicture', 'email']
            }]
    });
    const reviews = yield result;
    const totalReviews = (yield Review_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalReviews / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, totalReviews, numberOfPages });
});
exports.getAllListingReviews = getAllListingReviews;
const getAllListingReviewsWithAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort } = req.query;
    const { id } = req.params;
    const queryObject = {
        listingId: id
    };
    let order;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']];
    }
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    else if (sort === 'lowest-rating') {
        order = [['rating', 'ASC']];
    }
    else if (sort === 'highest-rating') {
        order = [['rating', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Review_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: ['firstName', 'lastName', 'profilePicture', 'email']
            }]
    });
    const reviews = yield result;
    const processedReviews = reviews.map(review => {
        const reviewJSON = review.toJSON();
        const isMyComment = reviewJSON.user.email === req.user.email;
        return Object.assign(Object.assign({}, reviewJSON), { isMyComment: isMyComment });
    });
    const totalReviews = (yield Review_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalReviews / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reviews: processedReviews, totalReviews, numberOfPages });
});
exports.getAllListingReviewsWithAuth = getAllListingReviewsWithAuth;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { rating, title, content } = req.body;
    if (!rating || !title || !content) {
        throw new errors_1.default.BadRequestError('Please provide rating, title, and comment!');
    }
    const didReserveAtOnePoint = yield Reservation_1.default.findOne({
        where: {
            listingId: id,
            userId: req.user.userID
        }
    });
    if (!didReserveAtOnePoint) {
        throw new errors_1.default.BadRequestError('You cannot create a review unless you have reserved this listing at one point in time!');
    }
    const userAlreadyWroteReview = yield Review_1.default.findOne({
        where: {
            listingId: id,
            userId: req.user.userID
        }
    });
    if (userAlreadyWroteReview) {
        throw new errors_1.default.BadRequestError('You already wrote a review for this listing!');
    }
    req.body.userId = req.user.userID;
    req.body.listingId = id;
    const review = yield Review_1.default.create(req.body);
    const updatedListing = (yield Listing_1.default.findByPk(review.listingId)).toJSON();
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ review: Object.assign(Object.assign({}, review.toJSON()), { averageRating: updatedListing.averageRating }) });
});
exports.createReview = createReview;
const updateSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const review = yield Review_1.default.findOne({
        where: {
            id: reviewId,
            userId: req.user.userID
        }
    });
    if (!review) {
        throw new errors_1.default.NotFoundError('No Review Found with the ID Provided!');
    }
    const { rating, title, content } = req.body;
    if (rating) {
        review.rating = Number(rating);
    }
    if (title) {
        review.title = title;
    }
    if (content) {
        review.content = content;
    }
    yield review.save();
    const updatedListing = (yield Listing_1.default.findByPk(review.listingId)).toJSON();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ review: Object.assign(Object.assign({}, review.toJSON()), { averageRating: updatedListing.averageRating }) });
});
exports.updateSingleReview = updateSingleReview;
const deleteSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const review = yield Review_1.default.findOne({
        where: {
            id: reviewId,
            userId: req.user.userID
        }
    });
    if (!review) {
        throw new errors_1.default.NotFoundError('No Review Found with the ID Provided!');
    }
    yield review.destroy();
    const updatedListing = (yield Listing_1.default.findByPk(review.listingId)).toJSON();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Single Review!', averageRating: updatedListing.averageRating });
});
exports.deleteSingleReview = deleteSingleReview;
