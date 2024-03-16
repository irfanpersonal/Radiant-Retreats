import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import User from '../database/models/User';
import Listing from '../database/models/Listing';
import Reservation from '../database/models/Reservation';
import Review from '../database/models/Review';
import HostRequest from '../database/models/HostRequest';;
import CustomError from '../errors';
import Sequelize from 'sequelize';

const getGeneralStats = async(req: Request, res: Response) => {
    let total = 0;
    const userCount = (await User.findAll({
        where: {
            role: {
                [Sequelize.Op.not]: 'admin'
            }
        }
    }))!.length;
    const reviewCount = ((await Review.findAll()))!.length;
    const listingCount = ((await Listing.findAll()))!.length;
    const reservationCount = ((await Reservation.findAll()));
    reservationCount.forEach(reservation => {
        total += reservation.total;
    });
    const hostRequestCount = ((await HostRequest.findAll()))!.length;
    return res.status(StatusCodes.OK).json({generalStats: {
        userCount,
        reviewCount,
        listingCount,
        reservationCount: reservationCount.length,
        hostRequestCount,
        totalProfit: total / 100
    }});
}

const getAdvancedStats = async(req: Request, res: Response) => {
    const monthlyUsers = await User.findAll({
        attributes: [
            [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: {
            role: {
                [Sequelize.Op.not]: 'admin'
            }
        },
        group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))]
    });
    const monthlyReservations = await Reservation.findAll({
        attributes: [
            [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))]
    });
    const monthlyListings = await Listing.findAll({
        attributes: [
            [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))]
    });
    const monthlyHostRequests = await HostRequest.findAll({
        attributes: [
            [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))]
    });
    const monthlyReviews = await Review.findAll({
        attributes: [
            [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.fn('YEAR', Sequelize.col('createdAt')), Sequelize.fn('MONTH', Sequelize.col('createdAt'))]
    });
    return res.status(StatusCodes.OK).json({advancedStats: {
        monthlyUsers,
        monthlyReservations,
        monthlyListings,
        monthlyHostRequests,
        monthlyReviews
    }});
}

export {
    getGeneralStats,
    getAdvancedStats
};