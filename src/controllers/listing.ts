import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import Listing, {IListing} from '../database/models/Listing';
import Review from '../database/models/Review';
import User from '../database/models/User';
import {ITokenPayload, deleteImage} from '../utils';
import CustomError from '../errors';
import Sequelize from 'sequelize';
import path from 'node:path';
import {v2 as cloudinary} from 'cloudinary';
import {extractPublicID} from '../utils';
import Reservation from '../database/models/Reservation';

interface ListingRequest extends Request {
    params: {
        id: string
    },
    body: IListing & {
        deletePhotos: string[]
    },
    query: {
        search: string,
        startDate: string,
        endDate: string,
        email: string,
        country: string,
        priceMin: string,
        priceMax: string,
        housingAmount: string,
        bedroomsAmount: string,
        bedsAmount: string,
        bathsAmount: string,
        propertyTypeValue: 'house' | 'apartment' | 'guesthouse' | 'hotel',
        hostLanguage: string,
        sort: 'latest' | 'oldest' | 'lowest-price' | 'highest-price',
        page: string,
        limit: string
    },
    user?: ITokenPayload
}

const getAllListings = async(req: ListingRequest, res: Response) => {
    const {search, startDate, endDate, email, country, priceMin, priceMax, housingAmount, bedroomsAmount, bedsAmount, bathsAmount, propertyTypeValue, hostLanguage, sort} = req.query;
    const queryObjectInner: {[index: string]: any, [index: symbol]: any} = {};
    const queryObjectOuter: {[index: string]: any, [index: symbol]: any} = {};
    if (search) {
        queryObjectOuter.name = {[Sequelize.Op.like]: `%${search}%`};
    }
    if (startDate && endDate) {
        // Need to implement logic here
    }
    if (email) {
        queryObjectInner.email = {[Sequelize.Op.like]: `%${email}%`};
    }
    if (country) {
        queryObjectOuter.country = {[Sequelize.Op.like]: `%${country}%`};
    }
    if (priceMin || priceMax) {
        queryObjectOuter.price = {};
        if (priceMin) {
            queryObjectOuter.price[Sequelize.Op.gte] = Number(priceMin) * 100;
        }
        if (priceMax) {
            queryObjectOuter.price[Sequelize.Op.lte] = Number(priceMax) * 100;
        }
    }
    if (housingAmount) {
        queryObjectOuter.housingCapacity = {[Sequelize.Op.gte]: housingAmount};
    }
    if (bedroomsAmount) {
        queryObjectOuter.bedrooms = {[Sequelize.Op.gte]: bedroomsAmount};
    } 
    if (bedsAmount) {
        queryObjectOuter.beds = {[Sequelize.Op.gte]: bedsAmount};
    }     
    if (bathsAmount) {
        queryObjectOuter.baths = {[Sequelize.Op.gte]: bathsAmount};
    }
    if (propertyTypeValue) {
        queryObjectOuter.propertyType = {[Sequelize.Op.like]: `%${propertyTypeValue}%`};
    }
    if (hostLanguage) {
        queryObjectInner.language = {[Sequelize.Op.like]: `%${hostLanguage}%`};
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
    let result = Listing.findAll({
        where: queryObjectOuter,
        offset: skip,
        limit: limit,
        order: order,
        attributes: {exclude: ['address']},
        include: [{
            model: User,
            as: 'user',
            attributes: ['email', 'firstName', 'lastName', 'profilePicture', 'country', 'language'],
            where: queryObjectInner
        }]
    });
    const listings = await result;
    const totalListings = (await Listing.findAll({where: queryObjectOuter, include: [{model: User, as: 'user', where: queryObjectInner}]})).length;
    const numberOfPages = Math.ceil(totalListings / limit);
    return res.status(StatusCodes.OK).json({listings, totalListings, numberOfPages});
}

const createListing = async(req: ListingRequest, res: Response) => {
    const {name, housingCapacity, bedrooms, beds, baths, price, description, amenities, maintenanceFee, propertyType, address, country} = req.body;
    if (!req.files?.photos || !name || !housingCapacity || !bedrooms || !beds || !baths || !price || !description || !amenities || !maintenanceFee || !propertyType || !address || !country) {
        throw new CustomError.BadRequestError('Please provide/check all inputs!');
    }
    // If its a single image put it in an array, if its not a single image it should already be in an array
    const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
    if (photos.length > 5) {
        throw new CustomError.BadRequestError('The maximum amount of photos is 5!');
    }
    const photosValue = [];
    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const maxSize = 1000000 * 2;
        if (!photo.mimetype.startsWith('image') || photo.size > maxSize) {
            throw new CustomError.BadRequestError('Invalid Photo Format!');
        }
        const [firstName, lastName] = req.user!.name.split(' ');
        const uniqueIdentifier = new Date().getTime() + `_${firstName}_${lastName}_listing_` + photo.name;
        const destinationForPhoto = path.resolve(__dirname, '../images', uniqueIdentifier);
        await photo.mv(destinationForPhoto);
        const resultForPhoto = await cloudinary.uploader.upload(destinationForPhoto, {
            public_id: uniqueIdentifier, 
            folder: 'RADIANT_RETREATS/LISTING_PHOTOS'
        });
        await deleteImage(destinationForPhoto);
        photosValue.push(resultForPhoto.secure_url);
    }
    req.body.photos = photosValue;
    req.body.userId = req.user!.userID;
    const listing = await Listing.create(req.body);
    return res.status(StatusCodes.CREATED).json({listing});
}

const getSingleListing = async(req: ListingRequest, res: Response) => {
    const {id} = req.params;
    const listing = await Listing.findByPk(id, {
        include: [{
            model: User,
            as: 'user',
            attributes: {exclude: ['password']}
        }]
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    return res.status(StatusCodes.OK).json({listing});
}

const getSingleListingWithAuth = async(req: ListingRequest, res: Response) => {
    const {id} = req.params;
    const listing = await Listing.findByPk(id, {
        include: [{
            model: User,
            as: 'user',
            attributes: {exclude: ['password']}
        }]
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    const myListing = listing.userId === req.user!.userID;
    const didReserveAtOnePoint = await Reservation.findOne({
        where: {
            userId: req.user!.userID,
            listingId: id
        },
        order: [['createdAt', 'DESC']]
    });
    return res.status(StatusCodes.OK).json({listing: {...listing.toJSON(), myListing, didReserveAtOnePoint}});
}

const updateSingleListing = async(req: ListingRequest, res: Response) => {
    const {id} = req.params;
    const listing = await Listing.findOne({
        where: {
            id: id,
            userId: req.user!.userID
        }
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    const {name, country, address, description, housingCapacity, bedrooms, beds, baths, price, amenities, maintenanceFee, propertyType, deletePhotos} = req.body;
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
    await listing.save();
    if (deletePhotos) {
        const deleteThese = Array.isArray(deletePhotos) ? deletePhotos : [deletePhotos];
        for (let index = 0; index < listing.photos.length; index++) {
            if (deleteThese.includes(String(index))) {
                const cloudinaryPublicID = extractPublicID(listing.photos[index]);
                await cloudinary.uploader.destroy(cloudinaryPublicID);
            }
        }
        listing.photos = listing.photos.filter((value, index) => {
            return !deleteThese.includes(String(index));
        });
    }
    if (listing.photos.length) {
        await listing.save();
    }
    if (req.files?.photos) {
        const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
        const canAddThisMuchMore = 5 - listing.photos.length;
        if (photos.length > canAddThisMuchMore) {
            throw new CustomError.BadRequestError('You provided more images than you are allowed to have!');
        }
        for (let i = 0; i < photos.length; i++) {
            const maxSize = 1000000 * 2;
            const photo = photos[i];
            if (!photo.mimetype.startsWith('image') || photo.size > maxSize) {
                throw new CustomError.BadRequestError('Invalid Photo Format!');
            }
            const [firstName, lastName] = req.user!.name.split(' ');
            const uniqueIdentifier = new Date().getTime() + `_${firstName}_${lastName}_listing_` + photo.name;
            const destinationForPhoto = path.resolve(__dirname, '../images', uniqueIdentifier);
            await photo.mv(destinationForPhoto);
            const resultForPhoto = await cloudinary.uploader.upload(destinationForPhoto, {
                public_id: uniqueIdentifier, 
                folder: 'RADIANT_RETREATS/LISTING_PHOTOS'
            });
            await deleteImage(destinationForPhoto);
            listing.photos = [...listing.photos, resultForPhoto.secure_url];
            await listing.save();
        }
    }
    return res.status(StatusCodes.OK).json({listing});
}

const deleteSingleListing = async(req: ListingRequest, res: Response) => {
    const {id} = req.params;
    const listing = await Listing.findOne({
        where: {
            id: id,
            userId: req.user!.userID
        }
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the ID Provided!');
    }
    // The ".destroy" method is used to delete a row from your table.
    await listing.destroy();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Single Listing!'});
}

export {
    getAllListings,
    createListing,
    getSingleListing,
    getSingleListingWithAuth,
    updateSingleListing,
    deleteSingleListing
};