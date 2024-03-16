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
exports.getAdvancedStats = exports.getGeneralStats = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../database/models/User"));
const Listing_1 = __importDefault(require("../database/models/Listing"));
const Reservation_1 = __importDefault(require("../database/models/Reservation"));
const Review_1 = __importDefault(require("../database/models/Review"));
const HostRequest_1 = __importDefault(require("../database/models/HostRequest"));
;
const sequelize_1 = __importDefault(require("sequelize"));
const getGeneralStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let total = 0;
    const userCount = (yield User_1.default.findAll({
        where: {
            role: {
                [sequelize_1.default.Op.not]: 'admin'
            }
        }
    })).length;
    const reviewCount = ((yield Review_1.default.findAll())).length;
    const listingCount = ((yield Listing_1.default.findAll())).length;
    const reservationCount = ((yield Reservation_1.default.findAll()));
    reservationCount.forEach(reservation => {
        total += reservation.total;
    });
    const hostRequestCount = ((yield HostRequest_1.default.findAll())).length;
    return res.status(http_status_codes_1.StatusCodes.OK).json({ generalStats: {
            userCount,
            reviewCount,
            listingCount,
            reservationCount: reservationCount.length,
            hostRequestCount,
            totalProfit: total / 100
        } });
});
exports.getGeneralStats = getGeneralStats;
const getAdvancedStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const monthlyUsers = yield User_1.default.findAll({
        attributes: [
            [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), 'year'],
            [sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt')), 'month'],
            [sequelize_1.default.fn('COUNT', sequelize_1.default.col('id')), 'count']
        ],
        where: {
            role: {
                [sequelize_1.default.Op.not]: 'admin'
            }
        },
        group: [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt'))]
    });
    const monthlyReservations = yield Reservation_1.default.findAll({
        attributes: [
            [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), 'year'],
            [sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt')), 'month'],
            [sequelize_1.default.fn('COUNT', sequelize_1.default.col('id')), 'count']
        ],
        group: [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt'))]
    });
    const monthlyListings = yield Listing_1.default.findAll({
        attributes: [
            [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), 'year'],
            [sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt')), 'month'],
            [sequelize_1.default.fn('COUNT', sequelize_1.default.col('id')), 'count']
        ],
        group: [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt'))]
    });
    const monthlyHostRequests = yield HostRequest_1.default.findAll({
        attributes: [
            [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), 'year'],
            [sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt')), 'month'],
            [sequelize_1.default.fn('COUNT', sequelize_1.default.col('id')), 'count']
        ],
        group: [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt'))]
    });
    const monthlyReviews = yield Review_1.default.findAll({
        attributes: [
            [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), 'year'],
            [sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt')), 'month'],
            [sequelize_1.default.fn('COUNT', sequelize_1.default.col('id')), 'count']
        ],
        group: [sequelize_1.default.fn('YEAR', sequelize_1.default.col('createdAt')), sequelize_1.default.fn('MONTH', sequelize_1.default.col('createdAt'))]
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ advancedStats: {
            monthlyUsers,
            monthlyReservations,
            monthlyListings,
            monthlyHostRequests,
            monthlyReviews
        } });
});
exports.getAdvancedStats = getAdvancedStats;
