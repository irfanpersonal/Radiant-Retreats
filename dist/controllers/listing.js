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
exports.deleteSingleListing = exports.updateSingleListing = exports.getSingleListingWithAuth = exports.getSingleListing = exports.createListing = exports.getAllListings = void 0;
const http_status_codes_1 = require("http-status-codes");
const Listing_1 = __importDefault(require("../database/models/Listing"));
const User_1 = __importDefault(require("../database/models/User"));
const utils_1 = require("../utils");
const errors_1 = __importDefault(require("../errors"));
const sequelize_1 = __importDefault(require("sequelize"));
const node_path_1 = __importDefault(require("node:path"));
const cloudinary_1 = require("cloudinary");
const utils_2 = require("../utils");
const Reservation_1 = __importDefault(require("../database/models/Reservation"));
const getAllListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, startDate, endDate, email, country, priceMin, priceMax, housingAmount, bedroomsAmount, bedsAmount, bathsAmount, propertyTypeValue, hostLanguage, sort } = req.query;
    const queryObjectInner = {};
    const queryObjectOuter = {};
    if (search) {
        queryObjectOuter.name = { [sequelize_1.default.Op.like]: `%${search}%` };
    }
    if (startDate && endDate) {
        // Need to implement logic here
    }
    if (email) {
        queryObjectInner.email = { [sequelize_1.default.Op.like]: `%${email}%` };
    }
    if (country) {
        queryObjectOuter.country = { [sequelize_1.default.Op.like]: `%${country}%` };
    }
    if (priceMin || priceMax) {
        queryObjectOuter.price = {};
        if (priceMin) {
            queryObjectOuter.price[sequelize_1.default.Op.gte] = Number(priceMin) * 100;
        }
        if (priceMax) {
            queryObjectOuter.price[sequelize_1.default.Op.lte] = Number(priceMax) * 100;
        }
    }
    if (housingAmount) {
        queryObjectOuter.housingCapacity = { [sequelize_1.default.Op.gte]: housingAmount };
    }
    if (bedroomsAmount) {
        queryObjectOuter.bedrooms = { [sequelize_1.default.Op.gte]: bedroomsAmount };
    }
    if (bedsAmount) {
        queryObjectOuter.beds = { [sequelize_1.default.Op.gte]: bedsAmount };
    }
    if (bathsAmount) {
        queryObjectOuter.baths = { [sequelize_1.default.Op.gte]: bathsAmount };
    }
    if (propertyTypeValue) {
        queryObjectOuter.propertyType = { [sequelize_1.default.Op.like]: `%${propertyTypeValue}%` };
    }
    if (hostLanguage) {
        queryObjectInner.language = { [sequelize_1.default.Op.like]: `%${hostLanguage}%` };
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
    let result = Listing_1.default.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order,
        attributes: { exclude: ['address'] },
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: ['email', 'firstName', 'lastName', 'profilePicture', 'country', 'language'],
                where: queryObjectInner
            }]
    });
    const listings = yield result;
    const totalListings = (yield Listing_1.default.findAll({ where: queryObjectOuter, include: [{ model: User_1.default, as: 'user', where: queryObjectInner }] })).length;
    const numberOfPages = Math.ceil(totalListings / limit);
    return res.status(http_status_codes_1.StatusCodes.OK).json({ listings, totalListings, numberOfPages });
});
exports.getAllListings = getAllListings;
const createListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, housingCapacity, bedrooms, beds, baths, price, description, amenities, maintenanceFee, propertyType, address, country } = req.body;
    if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.photos) || !name || !housingCapacity || !bedrooms || !beds || !baths || !price || !description || !amenities || !maintenanceFee || !propertyType || !address || !country) {
        throw new errors_1.default.BadRequestError('Please provide/check all inputs!');
    }
    // If its a single image put it in an array, if its not a single image it should already be in an array
    const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    if (photos.length > 5) {
        throw new errors_1.default.BadRequestError('The maximum amount of photos is 5!');
    }
    const photosValue = [];
    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const maxSize = 1000000 * 2;
        if (!photo.mimetype.startsWith('image') || photo.size > maxSize) {
            throw new errors_1.default.BadRequestError('Invalid Photo Format!');
        }
        const [firstName, lastName] = req.user.name.split(' ');
        const uniqueIdentifier = new Date().getTime() + `_${firstName}_${lastName}_listing_` + photo.name;
        const destinationForPhoto = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifier);
        yield photo.mv(destinationForPhoto);
        const resultForPhoto = yield cloudinary_1.v2.uploader.upload(destinationForPhoto, {
            public_id: uniqueIdentifier,
            folder: 'RADIANT_RETREATS/LISTING_PHOTOS'
        });
        yield (0, utils_1.deleteImage)(destinationForPhoto);
        photosValue.push(resultForPhoto.secure_url);
    }
    req.body.photos = photosValue;
    req.body.userId = req.user.userID;
    const listing = yield Listing_1.default.create(req.body);
    return res.status(http_status_codes_1.StatusCodes.CREATED).json({ listing });
});
exports.createListing = createListing;
const getSingleListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const listing = yield Listing_1.default.findByPk(id, {
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
    });
    if (!listing) {
        throw new errors_1.default.NotFoundError('No Listing Found with the ID Provided!');
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ listing });
});
exports.getSingleListing = getSingleListing;
const getSingleListingWithAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const listing = yield Listing_1.default.findByPk(id, {
        include: [{
                model: User_1.default,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
    });
    if (!listing) {
        throw new errors_1.default.NotFoundError('No Listing Found with the ID Provided!');
    }
    const myListing = listing.userId === req.user.userID;
    const didReserveAtOnePoint = yield Reservation_1.default.findOne({
        where: {
            userId: req.user.userID,
            listingId: id
        },
        order: [['createdAt', 'DESC']]
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ listing: Object.assign(Object.assign({}, listing.toJSON()), { myListing, didReserveAtOnePoint }) });
});
exports.getSingleListingWithAuth = getSingleListingWithAuth;
const updateSingleListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    const listing = yield Listing_1.default.findOne({
        where: {
            id: id,
            userId: req.user.userID
        }
    });
    if (!listing) {
        throw new errors_1.default.NotFoundError('No Listing Found with the ID Provided!');
    }
    const { name, country, address, description, housingCapacity, bedrooms, beds, baths, price, amenities, maintenanceFee, propertyType, deletePhotos } = req.body;
    // By default Sequelize runs all validators when you try to update the value of
    // one of the columns. So that is great. 
    if (name) {
        listing.name = name;
    }
    if (country) {
        listing.country = country;
    }
    if (address) {
        listing.address = address;
    }
    if (description) {
        listing.description = description;
    }
    if (housingCapacity) {
        listing.housingCapacity = Number(housingCapacity);
    }
    if (bedrooms) {
        listing.bedrooms = Number(bedrooms);
    }
    if (beds) {
        listing.beds = Number(beds);
    }
    if (baths) {
        listing.baths = Number(baths);
    }
    if (price) {
        listing.price = Number(price);
    }
    if (amenities) {
        listing.amenities = amenities;
    }
    if (maintenanceFee) {
        listing.maintenanceFee = Number(maintenanceFee);
    }
    if (propertyType) {
        listing.propertyType = propertyType;
    }
    yield listing.save();
    if (deletePhotos) {
        const deleteThese = Array.isArray(deletePhotos) ? deletePhotos : [deletePhotos];
        for (let index = 0; index < listing.photos.length; index++) {
            if (deleteThese.includes(String(index))) {
                const cloudinaryPublicID = (0, utils_2.extractPublicID)(listing.photos[index]);
                yield cloudinary_1.v2.uploader.destroy(cloudinaryPublicID);
            }
        }
        listing.photos = listing.photos.filter((value, index) => {
            return !deleteThese.includes(String(index));
        });
    }
    if (listing.photos.length) {
        yield listing.save();
    }
    if ((_b = req.files) === null || _b === void 0 ? void 0 : _b.photos) {
        const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
        const canAddThisMuchMore = 5 - listing.photos.length;
        if (photos.length > canAddThisMuchMore) {
            throw new errors_1.default.BadRequestError('You provided more images than you are allowed to have!');
        }
        for (let i = 0; i < photos.length; i++) {
            const maxSize = 1000000 * 2;
            const photo = photos[i];
            if (!photo.mimetype.startsWith('image') || photo.size > maxSize) {
                throw new errors_1.default.BadRequestError('Invalid Photo Format!');
            }
            const [firstName, lastName] = req.user.name.split(' ');
            const uniqueIdentifier = new Date().getTime() + `_${firstName}_${lastName}_listing_` + photo.name;
            const destinationForPhoto = node_path_1.default.resolve(__dirname, '../images', uniqueIdentifier);
            yield photo.mv(destinationForPhoto);
            const resultForPhoto = yield cloudinary_1.v2.uploader.upload(destinationForPhoto, {
                public_id: uniqueIdentifier,
                folder: 'RADIANT_RETREATS/LISTING_PHOTOS'
            });
            yield (0, utils_1.deleteImage)(destinationForPhoto);
            listing.photos = [...listing.photos, resultForPhoto.secure_url];
            yield listing.save();
        }
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ listing });
});
exports.updateSingleListing = updateSingleListing;
const deleteSingleListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const listing = yield Listing_1.default.findOne({
        where: {
            id: id,
            userId: req.user.userID
        }
    });
    if (!listing) {
        throw new errors_1.default.NotFoundError('No Listing Found with the ID Provided!');
    }
    // The ".destroy" method is used to delete a row from your table.
    yield listing.destroy();
    return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: 'Deleted Single Listing!' });
});
exports.deleteSingleListing = deleteSingleListing;
