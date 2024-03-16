import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import Listing from '../database/models/Listing';
import Reservation, {IReservation} from '../database/models/Reservation';
import User from '../database/models/User';
import {ITokenPayload} from '../utils';
import CustomError from '../errors';
import moment from 'moment';
import Sequelize from 'sequelize';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface ReservationRequest extends Request {
    params: {
        id: string
    },
    body: IReservation,
    query: {
        sort: 'latest' | 'oldest',
        startDate: string,
        endDate: string,
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const getAllUserReservations = async(req: ReservationRequest, res: Response) => {
    const {sort, startDate, endDate} = req.query;
    const queryObject: {[index: string]: any} = {
        userId: req.user!.userID
    }
    const startDateMoment = moment(startDate, 'YYYY/MM/DD').startOf('day');
    const endDateMoment = moment(endDate, 'YYYY/MM/DD').startOf('day');
    if (startDate && endDate) {
        queryObject.startDate = { [Sequelize.Op.between]: [startDateMoment, endDateMoment] };
        queryObject.endDate = { [Sequelize.Op.between]: [startDateMoment, endDateMoment] };
    }
    let order: Sequelize.OrderItem[] | undefined;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']]; 
    }
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Reservation.findAll({
        where: queryObject,
        offset: skip, 
        limit: limit,
        order: order,
        include: [
            {
                model: User,
                as: 'user',
                attributes: {exclude: ['password']}
            },
            {
                model: Listing,
                as: 'listing'
            }
        ]
    });
    const reservations = await result;
    const totalReservations = (await Reservation.findAll({where: queryObject})).length;
    const numberOfPages = Math.ceil(totalReservations / limit);
    return res.status(StatusCodes.OK).json({reservations, totalReservations, numberOfPages});
}

const getAllListingReservations = async(req: ReservationRequest, res: Response) => {
    const {id} = req.params;
    const yourListing = await Listing.findOne({
        where: {
            id: id,
            userId: req.user!.userID
        }
    });
    if (!yourListing) {
        throw new CustomError.BadRequestError('You cannot view the reservations of a listing that is not yours!');
    }
    const queryObject = {
        listingId: id
    };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Reservation.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        include: [
            {
                model: User,
                as: 'user',
                attributes: {exclude: ['password']}
            },
            {
                model: Listing,
                as: 'listing'
            }
        ]
    });
    const reservations = await result;
    const totalReservations = (await Reservation.findAll({where: queryObject})).length;
    const numberOfPages = Math.ceil(totalReservations / limit);
    return res.status(StatusCodes.OK).json({reservations, totalReservations, numberOfPages});
}

const createPaymentIntent = async(req: ReservationRequest, res: Response) => {
    const {startDate, endDate} = req.body;
    let subTotal = 0;
    let total = 0;
    if (!startDate || !endDate) {
        throw new CustomError.BadRequestError('Please provide startDate and endDate!');
    }
    const {id} = req.params;
    const listing = await Listing.findByPk(id, {
        attributes: {exclude: ['address']}
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    if (listing.userId === req.user!.userID) {
        throw new CustomError.BadRequestError('You cannot create a payment intent on your own listing!');
    }
    const currentDate = moment().format('YYYY-MM-DD');
    const startDateMoment = moment(startDate, 'YYYY/MM/DD').startOf('day');
    const endDateMoment = moment(endDate, 'YYYY/MM/DD').startOf('day');
    if (startDateMoment.isBefore(moment(currentDate), 'day') || endDateMoment.isBefore(startDateMoment, 'day')) {
        throw new CustomError.BadRequestError('Invalid Dates Picked!');
    }
    const anyExistingReservationForProvidedDates = await Reservation.findOne({
        where: {
            listingId: id,
            startDate: {
                [Sequelize.Op.between]: [startDateMoment, endDateMoment]
            },
            endDate: {
                [Sequelize.Op.between]: [startDateMoment, endDateMoment]
            }
        }
    });
    if (anyExistingReservationForProvidedDates) {
        throw new CustomError.BadRequestError('Someone already reserved in the provided dates!');
    }
    const maintenanceFee = listing.maintenanceFee;
    const days = endDateMoment.diff(startDateMoment, 'day') + 1;
    subTotal += listing.price * days;
    total += subTotal + maintenanceFee;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd'
    });
    return res.status(StatusCodes.CREATED).json({
        startDate,
        endDate,
        listing,
        total,
        clientSecret: paymentIntent.client_secret
    });
}

const createReservation = async(req: ReservationRequest, res: Response) => {
    const {startDate, endDate, total, clientSecret} = req.body;
    if (!startDate || !endDate || !total || !clientSecret) {
        throw new CustomError.BadRequestError('Please provide all inputs!');
    }
    const listing = (await Listing.findByPk(req.params.id))!;
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    listing.bookedDates = [...listing.bookedDates, [String(startDate), String(endDate)]];
    req.body.userId = req.user!.userID;
    req.body.listingId = req.params.id;
    // Find Listing User
    const listingUser = (await User.findByPk(listing.userId))!;
    // Add total to balance
    listingUser.balance = listingUser.balance + (total / 100);
    // Save Listing User
    await listingUser.save();
    // Create Reservation
    const reservation = await Reservation.create(req.body);
    await listing.save();
    return res.status(StatusCodes.CREATED).json({reservation});
}

const getSingleReservation = async(req: ReservationRequest, res: Response) => {
    const {id} = req.params;
    const reservation = await Reservation.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: {exclude: ['password']}
            }, 
            {
                model: Listing,
                as: 'listing',
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: {exclude: ['password']}
                    }
                ]
            }
        ]
    });
    if (!reservation) {
        throw new CustomError.NotFoundError('No Reservation Found with the ID Provided!');
    }
    const listing = await Listing.findByPk(reservation.listingId);
    if (listing!.userId === req.user!.userID) {
        return res.status(StatusCodes.OK).json({reservation});
    }
    if (reservation.userId !== req.user!.userID) {
        throw new CustomError.ForbiddenError('You cannot access a reservation that is not yours!');
    }
    return res.status(StatusCodes.OK).json({reservation});
}

export {
    getAllUserReservations,
    getAllListingReservations,
    createPaymentIntent,
    createReservation,
    getSingleReservation
};