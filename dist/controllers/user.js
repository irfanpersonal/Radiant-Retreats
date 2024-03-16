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
exports.updateUserPassword = exports.updateUser = exports.getSingleUser = exports.getAllUsers = exports.getProfileData = exports.showCurrentUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../database/models/User"));
const HostRequest_1 = __importDefault(require("../database/models/HostRequest"));
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const sequelize_1 = __importDefault(require("sequelize"));
const node_path_1 = __importDefault(require("node:path"));
const cloudinary_1 = require("cloudinary");
const showCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findByPk(req.user.userID, {
        attributes: { exclude: ['password'] }
    });
    const hostRequest = yield HostRequest_1.default.findOne({
        where: {
            userId: req.user.userID
        }
    });
    user.dataValues.hostRequest = hostRequest;
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.showCurrentUser = showCurrentUser;
const getProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield User_1.default.findByPk(req.user.userID, {
        attributes: { exclude: ['password'] }
    }));
    // Did you apply for a host request
    const hostRequest = yield HostRequest_1.default.findOne({
        where: {
            userId: req.user.userID
        }
    });
    user.dataValues.hostRequest = hostRequest;
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getProfileData = getProfileData;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, role, country, sort } = req.query;
    const queryObject = {
        role: { [sequelize_1.default.Op.not]: 'admin' }
    };
    if (search) {
        const searchTerms = search.split(' ');
        const searchConditions = searchTerms.map(term => ({
            [sequelize_1.default.Op.or]: [
                { firstName: { [sequelize_1.default.Op.like]: `%${term}%` } },
                { lastName: { [sequelize_1.default.Op.like]: `%${term}%` } }
            ]
        }));
        queryObject[sequelize_1.default.Op.and] = searchConditions;
    }
    if (role) {
        queryObject.role = {
            [sequelize_1.default.Op.not]: 'admin',
            [sequelize_1.default.Op.like]: `%${role}%`
        };
    }
    if (country) {
        queryObject.country = { [sequelize_1.default.Op.like]: `%${country}%` };
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
    let result = User_1.default.findAll({
        where: queryObject,
        offset: skip,
        limit: limit,
        order: order,
        attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'country', 'role']
    });
    const users = yield result;
    const totalUsers = (yield User_1.default.findAll({ where: queryObject })).length;
    const numberOfPages = Math.ceil(totalUsers / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ users, totalUsers, numberOfPages });
});
exports.getAllUsers = getAllUsers;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.default.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    if (!user || user.role === 'admin') {
        throw new errors_1.default.NotFoundError('No User Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.getSingleUser = getSingleUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.role = undefined; // So the user can't change role
    req.body.profilePicture = undefined;
    // By default the Sequelize Validation will run so no need to specify it. 
    yield User_1.default.update(Object.assign({}, req.body), {
        where: {
            id: req.user.userID
        }
        // returning: true, This will make it so that it will return the updated row, but this only works if your database is Postgres, because were using MySQL it won't work        
    });
    // Because the database I am using is MySQL the returning option won't work. So
    // I will have to search it again just to return it. Sucks!
    const user = (yield User_1.default.findByPk(req.user.userID, {
        attributes: { exclude: ['password'] }
    }));
    // Check if Profile Picture Provided
    if ((_a = req.files) === null || _a === void 0 ? void 0 : _a.profilePicture) {
        const profilePicture = req.files.profilePicture;
        const maxSize = 1000000 * 2;
        if (!profilePicture.mimetype.startsWith('image') || profilePicture.size > maxSize) {
            throw new errors_1.default.BadRequestError('Invalid Profile Picture submission!');
        }
        if (user.profilePicture) {
            const oldImage = user.profilePicture.substring(user.profilePicture.indexOf('RADIANT'));
            yield cloudinary_1.v2.uploader.destroy(oldImage.substring(0, oldImage.lastIndexOf('.')));
        }
        const uniqueIdentifierForProfilePicture = new Date().getTime() + '_' + user.firstName + '_' + user.lastName + '_' + 'profile_picture' + '_' + profilePicture.name;
        const destinationForProfilePicture = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifierForProfilePicture);
        yield profilePicture.mv(destinationForProfilePicture);
        const resultForProfilePicture = yield cloudinary_1.v2.uploader.upload(destinationForProfilePicture, {
            public_id: uniqueIdentifierForProfilePicture,
            folder: 'RADIANT_RETREATS/PROFILE_PICTURES'
        });
        yield (0, utils_1.deleteImage)(destinationForProfilePicture);
        user.profilePicture = resultForProfilePicture.secure_url;
        yield user.save();
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.default.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = (yield User_1.default.findByPk(req.user.userID));
    const isCorrect = yield user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new errors_1.default.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    yield user.save();
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: {
            userID: user.id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            role: user.role
        } });
});
exports.updateUserPassword = updateUserPassword;
