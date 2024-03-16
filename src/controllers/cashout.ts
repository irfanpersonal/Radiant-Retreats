import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import User from '../database/models/User';
import CashOut, {ICashOut} from '../database/models/CashOut';
import {ITokenPayload} from '../utils';
import Sequelize from 'sequelize';
import CustomError from '../errors';

interface CashOutRequest extends Request {
    params: {
        id: string
    },
    body: ICashOut,
    query: {
        sort: 'latest' | 'oldest',
        status: 'pending' | 'paid',
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const getEarningsData = async(req: CashOutRequest, res: Response) => {
    const user = (await User.findByPk(req.user!.userID))!;
    const existingCashout = await CashOut.findOne({
        where: {
            userId: req.user!.userID,
            status: 'pending'
        }
    });
    return res.status(StatusCodes.OK).json({earningsData: {
        balance: user.balance,
        canCashOut: existingCashout ? false : true
    }});
}

const getAllCashOuts = async(req: CashOutRequest, res: Response) => {
    const queryObjectOuter: {[index: string]: any, [index: symbol]: any} = {};
    const {sort, status} = req.query;
    if (status) {
        queryObjectOuter.status = {[Sequelize.Op.like]: `%${status}%`};
    }
    let order: Sequelize.OrderItem[] | undefined;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']]; 
    } 
    else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    else if (sort === 'lowest-price') {
        order = [['price', 'ASC']]
    }
    else if (sort === 'highest-price') {
        order = [['price', 'DESC']]
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const result = CashOut.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order,
        include: [
            {
                model: User,
                as: 'user',
                attributes: {exclude: ['password']}
            }
        ]
    });
    const cashOuts = await result;
    const totalCashOuts = (await CashOut.findAll({where: queryObjectOuter})).length;
    const numberOfPages = Math.ceil(totalCashOuts / limit);
    return res.status(StatusCodes.OK).json({cashOuts, totalCashOuts, numberOfPages});
}

const getAllMyCashOuts = async(req: CashOutRequest, res: Response) => {
    const queryObjectOuter: {[index: string]: any, [index: symbol]: any} = {
        userId: req.user!.userID
    };
    const {sort, status} = req.query;
    if (status) {
        queryObjectOuter.status = {[Sequelize.Op.like]: `%${status}%`};
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
    const result = CashOut.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order
    });
    const cashOuts = await result;
    const totalCashOuts = (await CashOut.findAll({where: queryObjectOuter})).length;
    const numberOfPages = Math.ceil(totalCashOuts / limit);
    return res.status(StatusCodes.OK).json({cashOuts, totalCashOuts, numberOfPages});
}

const createCashOut = async(req: CashOutRequest, res: Response) => {
    const existingCashout = await CashOut.findOne({
        where: {
            userId: req.user!.userID,
            status: 'pending'
        }
    });
    if (existingCashout) {
        throw new CustomError.BadRequestError('You already created a cash out request. Please wait before you make another one!');
    }
    const userBalance = (await User.findByPk(req.user!.userID))!.balance;
    if (!(userBalance > 0)) {
        throw new CustomError.BadRequestError('You cannot create a cash out request with no money!');
    }
    req.body.userId = req.user!.userID;
    req.body.amount = userBalance;
    const cashOut = await CashOut.create(req.body);
    return res.status(StatusCodes.CREATED).json({cashOut});
}

const getSingleCashOut = async(req: CashOutRequest, res: Response) => {
    const {id} = req.params;
    const cashOut = await CashOut.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: User,
                as: 'user',
                attributes: {exclude: ['password']}
            }
        ]
    });
    if (!cashOut) {
        throw new CustomError.NotFoundError('No Cash Out Found with the ID Provided!');
    }
    if (req.user!.role == 'admin') {
        return res.status(StatusCodes.OK).json({cashOut});
    }
    if (cashOut.userId !== req.user!.userID) {
        throw new CustomError.NotFoundError('No Cash Out Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({cashOut});
}

const updateSingleCashOut = async(req: CashOutRequest, res: Response) => {
    const {status} = req.body;
    if (status !== 'paid') {
        throw new CustomError.BadRequestError('You can only update listing to paid!');
    }
    const {id} = req.params;
    const cashOut = await CashOut.findByPk(id);
    if (!cashOut) {
        throw new CustomError.NotFoundError('No Cash Out Request Found with the ID Provided!');
    }
    if (cashOut.status !== 'pending') {
        throw new CustomError.BadRequestError('You already updated this cash out request to paid!');
    }
    const user = (await User.findByPk(cashOut!.userId))!;
    user.balance = user.balance - cashOut.amount;
    await user.save();
    cashOut.status = status;
    await cashOut.save();
    return res.status(StatusCodes.OK).json({cashOut});
}

export {
    getEarningsData,
    getAllCashOuts, 
    getAllMyCashOuts,
    createCashOut,
    getSingleCashOut,
    updateSingleCashOut
};