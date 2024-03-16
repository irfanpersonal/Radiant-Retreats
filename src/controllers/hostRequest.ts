import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import HostRequst, {IHostRequest} from '../database/models/HostRequest';
import {ITokenPayload, deleteImage, createToken, createCookieWithToken} from '../utils';
import CustomError from '../errors';
import {UploadedFile} from 'express-fileupload';
import validator from 'validator';
import path from 'node:path';
import {v2 as cloudinary} from 'cloudinary';
import User from '../database/models/User';
import Sequelize from 'sequelize';

interface HostRequest extends Request {
    params: {
        id: string
    },
    body: IHostRequest,
    query: {
        search: string,
        country: string,
        sort: 'latest' | 'oldest',
        status: 'pending' | 'accepted' | 'rejected',
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const createHostRequest = async(req: HostRequest, res: Response) => {
    const {phoneNumber} = req.body;
    const alreadyMadeHostRequest = await HostRequst.findOne({
        where: {
            userId: req.user!.userID
        }
    });
    if (alreadyMadeHostRequest) {
        throw new CustomError.BadRequestError('You can only make 1 host request per user!');
    }
    if (!req.files?.governmentIssuedID || !req.files?.backgroundCheck || !phoneNumber) {
        throw new CustomError.BadRequestError('Please provide/check all inputs!');
    }
    if (!validator.isMobilePhone(phoneNumber)) {
        throw new CustomError.BadRequestError('Phone Number is not correct!');
    }
    const governmentIssuedId = req.files.governmentIssuedID as UploadedFile;
    const backgroundCheck = req.files.backgroundCheck as UploadedFile;
    const maxSize = 1000000 * 2; // 2MB
    if (!governmentIssuedId.mimetype.startsWith('image') || governmentIssuedId.size > maxSize || !backgroundCheck.mimetype.startsWith('image') || governmentIssuedId.size > maxSize) {
        throw new CustomError.BadRequestError('Please check your file uploads!');
    }
    const [firstName, lastName] = req.user!.name.split(' ');
    const uniqueIdentifierForGovernmentIssuedId = new Date().getTime() + '_' + firstName + '_' + lastName + '_' + 'host_request_government_issued_id' + '_' + governmentIssuedId.name;
    const uniqueIdentifierForBackgroundCheck = new Date().getTime() + '_' + firstName + '_' + lastName + '_' + 'host_request_background_check' + '_' + backgroundCheck.name;
    const destinationForGovernmentIssuedId = path.resolve(__dirname, '../images', uniqueIdentifierForGovernmentIssuedId);
    const destinationForBackgroundCheck = path.resolve(__dirname, '../images', uniqueIdentifierForBackgroundCheck);
    await governmentIssuedId.mv(destinationForGovernmentIssuedId);
    await backgroundCheck.mv(destinationForBackgroundCheck);
    const resultForGovernmentIssuedId = await cloudinary.uploader.upload(destinationForGovernmentIssuedId, {
        public_id: uniqueIdentifierForGovernmentIssuedId,
        folder: 'RADIANT_RETREATS/GOVERNMENT_IDS'
    });
    const resultForBackgroundCheck = await cloudinary.uploader.upload(destinationForBackgroundCheck, {
        public_id: uniqueIdentifierForBackgroundCheck,
        folder: 'RADIANT_RETREATS/BACKGROUND_CHECKS'
    });
    await deleteImage(destinationForGovernmentIssuedId);
    await deleteImage(destinationForBackgroundCheck);
    req.body.userId = req.user!.userID;
    req.body.governmentIssuedID = resultForGovernmentIssuedId.secure_url;
    req.body.backgroundCheck = resultForBackgroundCheck.secure_url;
    const hostRequest = await HostRequst.create(req.body, {
        include: [User]
    });
    return res.status(StatusCodes.CREATED).json({hostRequest});
}

const viewHostRequest = async(req: HostRequest, res: Response) => {
    const hostRequest = await HostRequst.findOne({
        where: {
            userId: req.user!.userID
        },
        // Populate the "user" property with the "userId"
        // include: [{
        //     model: User, 
        //     as: 'user',
        //     attributes: ['firstName', 'lastName', 'profilePicture']
        // }]
    });
    if (!hostRequest) {
        throw new CustomError.BadRequestError('No Host Request Created by this User!');
    }
    return res.status(StatusCodes.OK).json({hostRequest});
}

const viewAllHostRequests = async(req: HostRequest, res: Response) => {
    const {search, country, sort, status} = req.query;
    // The queryObject for the "include"
    const queryObjectInner: {[index: string]: any, [index: symbol]: any} = {};
    // The queryObject for just general search
    const queryObjectOuter: {[index: string]: any, [index: symbol]: any} = {};
    if (search) {
        const searchTerms = search.split(' ');
        const searchConditions = searchTerms.map(term => ({
            [Sequelize.Op.or]: [
                {'$user.firstName$': {[Sequelize.Op.like]: `%${term}%`}},
                {'$user.lastName$': {[Sequelize.Op.like]: `%${term}%`}}
            ]
        }));
        queryObjectInner[Sequelize.Op.and] = searchConditions;
    }
    if (country) {
        queryObjectInner.country = {[Sequelize.Op.like]: `%${country}%`};
    }
    if (status) {
        queryObjectOuter.status = {[Sequelize.Op.like]: `%${status}%`};
    }
    let order: Sequelize.OrderItem[] | undefined;
    if (sort === 'oldest') {
        order = [['createdAt', 'ASC']]; 
    } else if (sort === 'latest') {
        order = [['createdAt', 'DESC']];
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = HostRequst.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order,
        include: [{
            model: User,
            as: 'user',
            attributes: {exclude: ['password']},
            // If you want to query based of the populated field you would pass it 
            // into the "where" inside of the include.
            where: queryObjectInner
        }]
    });
    const hostRequests = await result;
    const totalHostRequests = (await HostRequst.findAll({where: queryObjectOuter, include: [{model: User, as: 'user', attributes: {exclude: ['password']}, where: queryObjectInner}]})).length;
    const numberOfPages = Math.ceil(totalHostRequests / limit);
    return res.status(StatusCodes.OK).json({hostRequests, totalHostRequests, numberOfPages});
}

const getSingleHostRequest = async(req: HostRequest, res: Response) => {
    const {id} = req.params;
    const hostRequest = await HostRequst.findByPk(id, {
        include: [{
            model: User,
            as: 'user',
            attributes: {exclude: ['password']}
        }]
    });
    if (!hostRequest) {
        throw new CustomError.NotFoundError('No Host Request Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({hostRequest});
}

const updateSingleHostRequest = async(req: HostRequest, res: Response) => {
    const {id} = req.params;
    const hostRequest = (await HostRequst.findByPk(id, {
        include: [{
            model: User,
            as: 'user',
            attributes: {exclude: ['password']}
        }]
    }))!;
    if (!hostRequest) {
        throw new CustomError.NotFoundError('No Host Request Found with the ID Provided!');
    }
    const {status} = req.body;
    if (status !== 'accepted' && status !== 'rejected') {
        throw new CustomError.BadRequestError('Status Value must be either accepted or rejected!');
    }
    if (hostRequest.status !== 'pending') {
        throw new CustomError.BadRequestError(`Once you've initially changed the status of a host request, it cannot be altered thereafter.`);
    }
    if (status === 'accepted') {
        // If status is accepted change status of hostRequest to match it and update
        // its user role to host. 
        hostRequest.status = 'accepted';
        const user = (await User.findByPk(hostRequest.userId))!;
        user.role = 'host';
        await hostRequest.save();
        await user.save();
    }
    else {
        hostRequest.status = 'rejected';
        await hostRequest.save();
    }
    return res.status(StatusCodes.OK).json({msg: 'Update Single Host Request'});
}

export {
    createHostRequest,
    viewHostRequest,
    viewAllHostRequests,
    getSingleHostRequest,
    updateSingleHostRequest
};