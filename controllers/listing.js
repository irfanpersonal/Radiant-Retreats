const {StatusCodes} = require('http-status-codes');
const {Listing, User} = require('../models');
// const {sequelize} = require('../database/connect.js'); // If you want to do some regular/complex query you can use the .query method attached to the sequelize instance
const fs = require('node:fs');
const path = require('node:path');
const CustomError = require('../errors');
const Sequelize = require('sequelize');

const getAllListings = async(req, res) => {
    // const sql = 'SELECT * FROM listings'; // Here we have the sql query we would like to execute
    // const listings = await sequelize.query(sql); // In the .query method we pass in the sql query 
    // return res.status(StatusCodes.OK).json({listings: listings[0], count: listings[0].length}); // You will notice that this query returns an array of two things. The first array is the actual result and the second array is metadata.
    const {search, country, priceMin, priceMax} = req.query;
    // Define query object for filtering
    const queryObject = {};
    // Include search functionality
    if (search) {
        queryObject.name = {[Sequelize.Op.like]: `%${search}%`};
    }
    // Include country filter
    if (country) {
        queryObject.country = {[Sequelize.Op.like]: `%${country}%`};
    }
    // Price Range Functionality
    if (priceMin || priceMax) {
        queryObject.price = {};
        if (priceMin) {
            queryObject.price[Sequelize.Op.gte] = priceMin * 100;
        }
        if (priceMax) {
            queryObject.price[Sequelize.Op.lte] = priceMax * 100;
        }
    }
    // Pagination Logic
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let listings = await Listing.findAll({
        include: [{ 
            model: User, // We are going to fetch the data from the User Model
            as: 'userDetails', // The alias we set for the Listing.belongsTo
            attributes: ['name', 'email'] // The specific data we want from the User table is the name and email, and they will be saved in a property called userDetails
        }],
        where: queryObject,
        // offset: skip, // offset is a property that takes in the amount of items in the return we should skip
        // limit: limit // limit is a property that takes in the amount of items in the returns we should get and exclude the rest
    });
    const totalListings = listings.length;
    const numberOfPages = Math.ceil(totalListings / limit);
    listings = listings.slice(skip, skip + limit);
    return res.status(StatusCodes.OK).json({listings, totalListings, numberOfPages});
}

const getOwnerSpecificListings = async(req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let listings = await Listing.findAll({
        where: {user: req.user.userID},
        include: [{ 
            model: User, 
            as: 'userDetails', 
            attributes: ['name', 'email'] 
        }],
    });
    const totalListings = listings.length;
    const numberOfPages = Math.ceil(totalListings / limit);
    listings = listings.slice(skip, skip + limit);
    return res.status(StatusCodes.OK).json({listings, totalListings, numberOfPages});
}

const createListing = async(req, res) => {
    // Addition of Multiple Images Good, Single Image Addition Bad
    let arrayOfImages = [];
    req.body.user = req.user.userID;
    const listing = await Listing.create(req.body);
    if (req?.files?.photos) {
        const photosArray = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
        for (let i = 0; i < photosArray.length; i++) {
            const theImage = photosArray[i];
            const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'listing' + '_' + theImage.name;
            const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
            await theImage.mv(destination);
            arrayOfImages.push(`/${uniqueIdentifier}`);
        }
        listing.photos = JSON.stringify(arrayOfImages);
        await listing.save();
    }
    return res.status(StatusCodes.CREATED).json({listing});
}

const getSingleListing = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findOne({
        where: {id},
        include: [{ 
            model: User, // 
            as: 'userDetails', 
            attributes: ['name', 'email'] 
        }]
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the Information Provided!');
    }
    return res.status(StatusCodes.OK).json({listing});
}

const updateSingleListing = async(req, res) => {
    const {id} = req.params;
    let arrayOfImages = [];
    const listing = await Listing.findOne({
        where: {id, user: req.user.userID}
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the Information Provided!');
    }
    const {name, address, city, country, price, bathrooms, rooms, description, rules, amenities, deletePhotos, maintenanceFee} = req.body;
    if (req?.files?.photos) {
        const photosArray = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];
        for (let i = 0; i < photosArray.length; i++) {
            const theImage = photosArray[i];
            const uniqueIdentifier = new Date().getTime() + '_' + req.user.name + '_' + 'listing' + '_' + theImage.name;
            const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
            await theImage.mv(destination);
            arrayOfImages.push(`/${uniqueIdentifier}`);
        }
        listing.photos = JSON.stringify([...listing.photos, ...arrayOfImages]);
    }
    if (name) {
        listing.name = name;
    }
    if (address) {
        listing.address = address;
    }
    if (city) {
        listing.city = city;
    }
    if (country) {
        listing.country = country;
    }
    if (price) {
        listing.price = price;
    }
    if (bathrooms) {
        listing.bathrooms = bathrooms;
    }
    if (rooms) {
        listing.rooms = rooms;
    }
    if (description) {
        listing.description = description;
    }
    if (rules) {
        listing.rules = rules;
    }
    if (amenities) {
        listing.amenities = amenities;
    }
    if (price) {
        listing.price = price;
    }
    if (maintenanceFee) {
        listing.maintenanceFee = maintenanceFee;
    }
    if (deletePhotos) {
        let result;
        try {
            result = deletePhotos ? JSON.parse(deletePhotos) : [];
        }
        catch(error) {
            throw new CustomError.BadRequestError('Invalid JSON Format for deletePhotos');
        }
        if (Array.isArray(result)) {
            for (let i = 0; i < result.length; i++) {
                await fs.unlink(path.join(__dirname, '../images', result[i]), (err) => {
                    console.log(err);
                });
                const updatedResult = result.map(value => '/' + value);
                const updatedListingPhotos = listing.photos.filter(photo => !updatedResult.includes(photo));
                listing.photos = JSON.stringify(updatedListingPhotos);
            }
        }
        else {
            throw new CustomError.BadRequestError('Must be Array for deletePhotos!');
        }
    }
    await listing.save();
    return res.status(StatusCodes.OK).json({listing});
}

const deleteSingleListing = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findOne({
        where: {id, user: req.user.userID}
    });
    if (!listing) {
        throw new CustomError.NotFoundError('No Listing Found with the Information Provided!');
    }
    await listing.destroy();
    return res.status(StatusCodes.OK).json({msg: 'Deleted Single Listing!'});
}

module.exports = {
    getAllListings,
    getOwnerSpecificListings,
    createListing,
    getSingleListing,
    updateSingleListing,
    deleteSingleListing
};