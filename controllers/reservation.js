const {StatusCodes} = require('http-status-codes');
const {Listing, Reservation} = require('../models');
const {User} = require('../models');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Sequelize = require('sequelize');
const CustomError = require('../errors');
const moment = require('moment');

const getAllReservations = async(req, res) => {
    const reservations = await Reservation.findAll({
        where: {user: req.user.userID},
        include: {
            model: Listing,
            as: 'listingDetails'
        }
    });
    return res.status(StatusCodes.OK).json({reservations});
}

const getAllListingReservations = async(req, res) => {
    const {id} = req.params;
    const reservations = await Reservation.findAll({
        where: {listing: id},
        include: [
            {
                model: User,
                as: 'userDetails',
                attributes: ['name', 'email']
            },
            {
                model: Listing,
                as: 'listingDetails'
            }
        ]
    });
    return res.status(StatusCodes.OK).json({reservations});
}

const createPaymentIntent = async (req, res) => {
    const {startDate, endDate, listing} = req.body;
    let subTotal = 0;
    let total = 0;
    // If missing this critical data throw an error.
    if (!startDate || !endDate || !listing) {
        throw new CustomError.BadRequestError('Please provide startDate, endDate, and listing!');
    }
    // Formatted the times for easier comparison
    const currentDate = moment().format('YYYY-MM-DD');
    const startDateMoment = moment(startDate).startOf('day');
    const endDateMoment = moment(endDate).startOf('day');
    // If the startDate and endDate are the same thats another error. You cant come in on x day and leave x day. You come x day and leave y date. Thats the flow.
    if (startDateMoment.isSame(endDateMoment, 'day')) {
        throw new CustomError.BadRequestError('You cannot set startDate and endDate as the same!');
    }
    // If the startDate or endDate is somewhere in the past throw an error!
    if (startDateMoment.isBefore(moment(currentDate), 'day')) {
        throw new CustomError.BadRequestError('startDate cannot be in the past!');
    }
    // If endDate is less than or equal to startDate throw an error
    if (endDateMoment.isSameOrBefore(startDateMoment, 'day')) {
        throw new CustomError.BadRequestError('endDate must be after startDate!');
    }
    const isReal = await Listing.findOne({
        where: {id: listing},
        include: [{ 
            model: User,
            as: 'userDetails', 
            attributes: ['name', 'email'] 
        }]
    });
    // If the listing you are trying to reserve doesn't exist throw an error
    if (!isReal) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    const existingReservation = await Reservation.findOne({
        where: {
            listing,
            startDate: {
                [Sequelize.Op.between]: [startDateMoment, endDateMoment]
            },
            endDate: {
                [Sequelize.Op.between]: [startDateMoment, endDateMoment]
            }
        }
    });
    console.log('existingReservation', existingReservation);
    if (existingReservation) {
        throw new CustomError.BadRequestError('Someone already reserved in the provided dates!');
    }
    const maintenanceFee = isReal.toJSON().maintenanceFee;
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    subTotal += (isReal.toJSON().price * 100) * days;
    total += subTotal + ((maintenanceFee * days) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, 
        currency: 'usd'
    });
    return res.status(StatusCodes.OK).json({
        startDate: startDate,
        endDate: endDate,
        listing: listing,
        listingDetails: isReal,
        total,
        user: req.user.userID,
        clientSecret: paymentIntent.client_secret
    });
}

const createReservation = async(req, res) => {
    req.body.user = req.user.userID;
    const reservation = await Reservation.create(req.body);
    return res.status(StatusCodes.OK).json({reservation});
}

const getSingleReservation = async(req, res) => {
    const {id} = req.params;
    const reservation = await Reservation.findOne({
        where: {id},
        include: {
            model: User,
            as: 'userDetails',
            attributes: ['name', 'email']
        }
    });
    if (!reservation) {
        throw new CustomError.NotFoundError('No Reservation Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({reservation});
}

module.exports = {
    getAllReservations,
    getAllListingReservations,
    createPaymentIntent,
    createReservation,
    getSingleReservation
};