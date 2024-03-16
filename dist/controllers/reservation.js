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
exports.getSingleReservation = exports.createReservation = exports.createPaymentIntent = exports.getAllListingReservations = exports.getAllUserReservations = void 0;
const http_status_codes_1 = require("http-status-codes");
const Listing_1 = __importDefault(require("../database/models/Listing"));
const Reservation_1 = __importDefault(require("../database/models/Reservation"));
const User_1 = __importDefault(require("../database/models/User"));
const errors_1 = __importDefault(require("../errors"));
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = __importDefault(require("sequelize"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const getAllUserReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort, startDate, endDate } = req.query;
    const queryObject = {
        userId: req.user.userID
    };
    const startDateMoment = (0, moment_1.default)(startDate, 'YYYY/MM/DD').startOf('day');
    const endDateMoment = (0, moment_1.default)(endDate, 'YYYY/MM/DD').startOf('day');
    if (startDate && endDate) {
        queryObject.startDate = { [sequelize_1.default.Op.between]: [startDateMoment, endDateMoment] };
        queryObject.endDate = { [sequelize_1.default.Op.between]: [startDateMoment, endDateMoment] };
    }
    let order;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']];
    }
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Reservation_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        include: [
            {
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            },
            {
                model: Listing_1.default,
                as: 'listing'
            }
        ]
    });
    const reservations = yield result;
    const totalReservations = (yield Reservation_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalReservations / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reservations, totalReservations, numberOfPages });
});
exports.getAllUserReservations = getAllUserReservations;
const getAllListingReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const yourListing = yield Listing_1.default.findOne({
        where: {
            id: id,
            userId: req.user.userID
        }
    });
    if (!yourListing) {
        throw new errors_1.default.BadRequestError('You cannot view the reservations of a listing that is not yours!');
    }
    const queryObject = {
        listingId: id
    };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Reservation_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        include: [
            {
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            },
            {
                model: Listing_1.default,
                as: 'listing'
            }
        ]
    });
    const reservations = yield result;
    const totalReservations = (yield Reservation_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalReservations / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reservations, totalReservations, numberOfPages });
});
exports.getAllListingReservations = getAllListingReservations;
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.body;
    let subTotal = 0;
    let total = 0;
    if (!startDate || !endDate) {
        throw new errors_1.default.BadRequestError('Please provide startDate and endDate!');
    }
    const { id } = req.params;
    const listing = yield Listing_1.default.findByPk(id, {
        attributes: { exclude: ['address'] }
    });
    if (!listing) {
        throw new errors_1.default.NotFoundError('No Listing Found with the ID Provided!');
    }
    if (listing.userId === req.user.userID) {
        throw new errors_1.default.BadRequestError('You cannot create a payment intent on your own listing!');
    }
    const currentDate = (0, moment_1.default)().format('YYYY-MM-DD');
    const startDateMoment = (0, moment_1.default)(startDate, 'YYYY/MM/DD').startOf('day');
    const endDateMoment = (0, moment_1.default)(endDate, 'YYYY/MM/DD').startOf('day');
    if (startDateMoment.isBefore((0, moment_1.default)(currentDate), 'day') || endDateMoment.isBefore(startDateMoment, 'day')) {
        throw new errors_1.default.BadRequestError('Invalid Dates Picked!');
    }
    const anyExistingReservationForProvidedDates = yield Reservation_1.default.findOne({
        where: {
            listingId: id,
            startDate: {
                [sequelize_1.default.Op.between]: [startDateMoment, endDateMoment]
            },
            endDate: {
                [sequelize_1.default.Op.between]: [startDateMoment, endDateMoment]
            }
        }
    });
    if (anyExistingReservationForProvidedDates) {
        throw new errors_1.default.BadRequestError('Someone already reserved in the provided dates!');
    }
    const maintenanceFee = listing.maintenanceFee;
    const days = endDateMoment.diff(startDateMoment, 'day') + 1;
    subTotal += listing.price * days;
    total += subTotal + maintenanceFee;
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: total,
        currency: 'usd'
    });
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({
        startDate,
        endDate,
        listing,
        total,
        clientSecret: paymentIntent.client_secret
    });
});
exports.createPaymentIntent = createPaymentIntent;
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, total, clientSecret } = req.body;
    if (!startDate || !endDate || !total || !clientSecret) {
        throw new errors_1.default.BadRequestError('Please provide all inputs!');
    }
    const listing = (yield Listing_1.default.findByPk(req.params.id));
    if (!listing) {
        throw new errors_1.default.NotFoundError('No Listing Found with the ID Provided!');
    }
    listing.bookedDates = [...listing.bookedDates, [String(startDate), String(endDate)]];
    req.body.userId = req.user.userID;
    req.body.listingId = req.params.id;
    // Find Listing User
    const listingUser = (yield User_1.default.findByPk(listing.userId));
    // Add total to balance
    listingUser.balance = listingUser.balance + (total / 100);
    // Save Listing User
    yield listingUser.save();
    // Create Reservation
    const reservation = yield Reservation_1.default.create(req.body);
    yield listing.save();
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ reservation });
});
exports.createReservation = createReservation;
const getSingleReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const reservation = yield Reservation_1.default.findByPk(id, {
        include: [
            {
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            },
            {
                model: Listing_1.default,
                as: 'listing',
                include: [
                    {
                        model: User_1.default,
                        as: 'user',
                        attributes: { exclude: ['password'] }
                    }
                ]
            }
        ]
    });
    if (!reservation) {
        throw new errors_1.default.NotFoundError('No Reservation Found with the ID Provided!');
    }
    const listing = yield Listing_1.default.findByPk(reservation.listingId);
    if (listing.userId === req.user.userID) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ reservation });
    }
    if (reservation.userId !== req.user.userID) {
        throw new errors_1.default.ForbiddenError('You cannot access a reservation that is not yours!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ reservation });
});
exports.getSingleReservation = getSingleReservation;
