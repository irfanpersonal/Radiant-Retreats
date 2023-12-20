/* 
    In order for associations to work we can't define them in the individual models.
    The reason why is because during execution when it performs these associations, at
    that moment it doesn't recognize the other models. But by putitng them into one 
    file and then doing the assocation we fix the error 
    "the provided model is not a subclass."

    Instead we need to implement a 4 step process. Where first we import both models 
    in, secondly we then define the associations, thirdly we sync the tables up, and 
    lastly we export the models.
*/ 

// First Step - Import the Models
const User = require('./User.js');
const Listing = require('./Listing.js');
const Reservation = require('./Reservation.js');
const Review = require('./Review.js');

// Second Step - Define the Associations
Listing.belongsTo(User, {foreignKey: 'user', as: 'userDetails'});
/*
    "Listing.belongsTo(User)" - This line of code means we would like to form
    a relationship between Listing and User (Listing" belongs to a "User)

    "{...}"" - The object inside of the .belongsTo method is specifying some details
    about how this relationship works.

    "foreignKey: user" - This means that the "Listing" model has a foreign key 
    called "user" that connects it to the "User" entity. 

    "as: userDetails" - We are giving a nickname to the returned column as userDetails,
    so that we don't have a name collision with the already existing column user.
*/

User.hasMany(Listing, {foreignKey: 'user', as: 'listings'});
/*
    "User.hasMany(Listing)" - This line of code means we would like to form
    a relationship between User and Listing ("User" can have many "Listings")

    "{...}"" - The object inside of the .hasMany method is specifying some details
    about how this relationship works.

    "foreignKey: user" - This means that the "Listing" model has a foreign key 
    called "user" that connects it to the "User" entity. 

    "as: listings" - We are giving a nickname to the returned column as userDetails,
    so that we don't have a name collision with the already existing column user.
*/

User.hasMany(Reservation, {foreignKey: 'user', as: 'reservations'});

Reservation.belongsTo(User, {foreignKey: 'user', as: 'userDetails'});

Review.belongsTo(User, {foreignKey: 'user', as: 'userDetails'});

User.hasMany(Review, {foreignKey: 'user', as: 'reviews'});

Reservation.belongsTo(Listing, {foreignKey: 'listing', as: 'listingDetails', onDelete: 'CASCADE'}); // By setting the onDelete property to 'CASCADE', when you delete a listing, all associated reservations will be deleted automatically. 

Review.belongsTo(Listing, {foreignKey: 'listing', as: 'listingDetails'});

// Third Step = Sync All Tables
async function syncTables() {
    await User.sync();
    await Listing.sync();
    await Reservation.sync();
    await Review.sync();
    console.log(`Created All Tables if it doesn't exist. And doing nothing if it already exists`);
}

syncTables();

// Fourth Step - Export the Models
module.exports = {
    User,
    Listing,
    Reservation,
    Review
};