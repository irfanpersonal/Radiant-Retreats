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
exports.updateSingleHostRequest = exports.getSingleHostRequest = exports.viewAllHostRequests = exports.viewHostRequest = exports.createHostRequest = void 0;
const http_status_codes_1 = require("http-status-codes");
const HostRequest_1 = __importDefault(require("../database/models/HostRequest"));
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const validator_1 = __importDefault(require("validator"));
const node_path_1 = __importDefault(require("node:path"));
const cloudinary_1 = require("cloudinary");
const User_1 = __importDefault(require("../database/models/User"));
const sequelize_1 = __importDefault(require("sequelize"));
const createHostRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { phoneNumber } = req.body;
    const alreadyMadeHostRequest = yield HostRequest_1.default.findOne({
        where: {
            userId: req.user.userID
        }
    });
    if (alreadyMadeHostRequest) {
        throw new errors_1.default.BadRequestError('You can only make 1 host request per user!');
    }
    if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.governmentIssuedID) || !((_b = req.files) === null || _b === void 0 ? void 0 : _b.backgroundCheck) || !phoneNumber) {
        throw new errors_1.default.BadRequestError('Please provide/check all inputs!');
    }
    if (!validator_1.default.isMobilePhone(phoneNumber)) {
        throw new errors_1.default.BadRequestError('Phone Number is not correct!');
    }
    const governmentIssuedId = req.files.governmentIssuedID;
    const backgroundCheck = req.files.backgroundCheck;
    const maxSize = 1000000 * 2; // 2MB
    if (!governmentIssuedId.mimetype.startsWith('image') || governmentIssuedId.size > maxSize || !backgroundCheck.mimetype.startsWith('image') || governmentIssuedId.size > maxSize) {
        throw new errors_1.default.BadRequestError('Please check your file uploads!');
    }
    const [firstName, lastName] = req.user.name.split(' ');
    const uniqueIdentifierForGovernmentIssuedId = new Date().getTime() + '_' + firstName + '_' + lastName + '_' + 'host_request_government_issued_id' + '_' + governmentIssuedId.name;
    const uniqueIdentifierForBackgroundCheck = new Date().getTime() + '_' + firstName + '_' + lastName + '_' + 'host_request_background_check' + '_' + backgroundCheck.name;
    const destinationForGovernmentIssuedId = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifierForGovernmentIssuedId);
    const destinationForBackgroundCheck = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifierForBackgroundCheck);
    yield governmentIssuedId.mv(destinationForGovernmentIssuedId);
    yield backgroundCheck.mv(destinationForBackgroundCheck);
    const resultForGovernmentIssuedId = yield cloudinary_1.v2.uploader.upload(destinationForGovernmentIssuedId, {
        public_id: uniqueIdentifierForGovernmentIssuedId,
        folder: 'RADIANT_RETREATS/GOVERNMENT_IDS'
    });
    const resultForBackgroundCheck = yield cloudinary_1.v2.uploader.upload(destinationForBackgroundCheck, {
        public_id: uniqueIdentifierForBackgroundCheck,
        folder: 'RADIANT_RETREATS/BACKGROUND_CHECKS'
    });
    yield (0, utils_1.deleteImage)(destinationForGovernmentIssuedId);
    yield (0, utils_1.deleteImage)(destinationForBackgroundCheck);
    req.body.userId = req.user.userID;
    req.body.governmentIssuedID = resultForGovernmentIssuedId.secure_url;
    req.body.backgroundCheck = resultForBackgroundCheck.secure_url;
    const hostRequest = yield HostRequest_1.default.create(req.body, {
        include: [User_1.default]
    });
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ hostRequest });
});
exports.createHostRequest = createHostRequest;
const viewHostRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hostRequest = yield HostRequest_1.default.findOne({
        where: {
            userId: req.user.userID
        },
        // Populate the "user" property with the "userId"
        // include: [{
        //     model: User, 
        //     as: 'user',
        //     attributes: ['firstName', 'lastName', 'profilePicture']
        // }]
    });
    if (!hostRequest) {
        throw new errors_1.default.BadRequestError('No Host Request Created by this User!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ hostRequest });
});
exports.viewHostRequest = viewHostRequest;
const viewAllHostRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, country, sort, status } = req.query;
    // The queryObject for the "include"
    const queryObjectInner = {};
    // The queryObject for just general search
    const queryObjectOuter = {};
    if (search) {
        const searchTerms = search.split(' ');
        const searchConditions = searchTerms.map(term => ({
            [sequelize_1.default.Op.or]: [
                { '$user.firstName$': { [sequelize_1.default.Op.like]: `%${term}%` } },
                { '$user.lastName$': { [sequelize_1.default.Op.like]: `%${term}%` } }
            ]
        }));
        queryObjectInner[sequelize_1.default.Op.and] = searchConditions;
    }
    if (country) {
        queryObjectInner.country = { [sequelize_1.default.Op.like]: `%${country}%` };
    }
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
    let result = HostRequest_1.default.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order,
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] },
                // If you want to query based of the populated field you would pass it 
                // into the "where" inside of the include.
                where: queryObjectInner
            }]
    });
    const hostRequests = yield result;
    const totalHostRequests = (yield HostRequest_1.default.findAll({ where: queryObjectOuter, include: [{ model: User_1.default, as: 'user', attributes: { exclude: ['password'] }, where: queryObjectInner }] })).length;
    const numberOfPages = Math.ceil(totalHostRequests / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ hostRequests, totalHostRequests, numberOfPages });
});
exports.viewAllHostRequests = viewAllHostRequests;
const getSingleHostRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const hostRequest = yield HostRequest_1.default.findByPk(id, {
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
    });
    if (!hostRequest) {
        throw new errors_1.default.NotFoundError('No Host Request Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ hostRequest });
});
exports.getSingleHostRequest = getSingleHostRequest;
const updateSingleHostRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const hostRequest = (yield HostRequest_1.default.findByPk(id, {
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
    }));
    if (!hostRequest) {
        throw new errors_1.default.NotFoundError('No Host Request Found with the ID Provided!');
    }
    const { status } = req.body;
    if (status !== 'accepted' && status !== 'rejected') {
        throw new errors_1.default.BadRequestError('Status Value must be either accepted or rejected!');
    }
    if (hostRequest.status !== 'pending') {
        throw new errors_1.default.BadRequestError(`Once you've initially changed the status of a host request, it cannot be altered thereafter.`);
    }
    if (status === 'accepted') {
        // If status is accepted change status of hostRequest to match it and update
        // its user role to host. 
        hostRequest.status = 'accepted';
        const user = (yield User_1.default.findByPk(hostRequest.userId));
        user.role = 'host';
        yield hostRequest.save();
        yield user.save();
    }
    else {
        hostRequest.status = 'rejected';
        yield hostRequest.save();
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Update Single Host Request' });
});
exports.updateSingleHostRequest = updateSingleHostRequest;
