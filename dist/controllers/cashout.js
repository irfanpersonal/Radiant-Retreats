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
exports.updateSingleCashOut = exports.getSingleCashOut = exports.createCashOut = exports.getAllMyCashOuts = exports.getAllCashOuts = exports.getEarningsData = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../database/models/User"));
const CashOut_1 = __importDefault(require("../database/models/CashOut"));
const sequelize_1 = __importDefault(require("sequelize"));
const errors_1 = __importDefault(require("../errors"));
const getEarningsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield User_1.default.findByPk(req.user.userID));
    const existingCashout = yield CashOut_1.default.findOne({
        where: {
            userId: req.user.userID,
            status: 'pending'
        }
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ earningsData: {
            balance: user.balance,
            canCashOut: existingCashout ? false : true
        } });
});
exports.getEarningsData = getEarningsData;
const getAllCashOuts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObjectOuter = {};
    const { sort, status } = req.query;
    if (status) {
        queryObjectOuter.status = { [sequelize_1.default.Op.like]: `%${status}%` };
    }
    let order;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']];
    }
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    else if (sort === 'lowest-price') {
        order = [['price', 'ASC']];
    }
    else if (sort === 'highest-price') {
        order = [['price', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const result = CashOut_1.default.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order,
        include: [
            {
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    const cashOuts = yield result;
    const totalCashOuts = (yield CashOut_1.default.findAll({ where: queryObjectOuter })).length;
    const numberOfPages = Math.ceil(totalCashOuts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ cashOuts, totalCashOuts, numberOfPages });
});
exports.getAllCashOuts = getAllCashOuts;
const getAllMyCashOuts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObjectOuter = {
        userId: req.user.userID
    };
    const { sort, status } = req.query;
    if (status) {
        queryObjectOuter.status = { [sequelize_1.default.Op.like]: `%${status}%` };
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
    const result = CashOut_1.default.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order
    });
    const cashOuts = yield result;
    const totalCashOuts = (yield CashOut_1.default.findAll({ where: queryObjectOuter })).length;
    const numberOfPages = Math.ceil(totalCashOuts / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ cashOuts, totalCashOuts, numberOfPages });
});
exports.getAllMyCashOuts = getAllMyCashOuts;
const createCashOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCashout = yield CashOut_1.default.findOne({
        where: {
            userId: req.user.userID,
            status: 'pending'
        }
    });
    if (existingCashout) {
        throw new errors_1.default.BadRequestError('You already created a cash out request. Please wait before you make another one!');
    }
    const userBalance = (yield User_1.default.findByPk(req.user.userID)).balance;
    if (!(userBalance > 0)) {
        throw new errors_1.default.BadRequestError('You cannot create a cash out request with no money!');
    }
    req.body.userId = req.user.userID;
    req.body.amount = userBalance;
    const cashOut = yield CashOut_1.default.create(req.body);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ cashOut });
});
exports.createCashOut = createCashOut;
const getSingleCashOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cashOut = yield CashOut_1.default.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            }
        ]
    });
    if (!cashOut) {
        throw new errors_1.default.NotFoundError('No Cash Out Found with the ID Provided!');
    }
    if (req.user.role == 'admin') {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ cashOut });
    }
    if (cashOut.userId !== req.user.userID) {
        throw new errors_1.default.NotFoundError('No Cash Out Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ cashOut });
});
exports.getSingleCashOut = getSingleCashOut;
const updateSingleCashOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    if (status !== 'paid') {
        throw new errors_1.default.BadRequestError('You can only update listing to paid!');
    }
    const { id } = req.params;
    const cashOut = yield CashOut_1.default.findByPk(id);
    if (!cashOut) {
        throw new errors_1.default.NotFoundError('No Cash Out Request Found with the ID Provided!');
    }
    if (cashOut.status !== 'pending') {
        throw new errors_1.default.BadRequestError('You already updated this cash out request to paid!');
    }
    const user = (yield User_1.default.findByPk(cashOut.userId));
    user.balance = user.balance - cashOut.amount;
    yield user.save();
    cashOut.status = status;
    yield cashOut.save();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ cashOut });
});
exports.updateSingleCashOut = updateSingleCashOut;
