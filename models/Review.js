const Sequelize = require('sequelize');
const {sequelize} = require('../database/connect.js');
const Listing = require('./Listing.js');

// Add Logic to Update the Average Rating upon Addition/Modification/Deletion of Review
const updateAverageRating = async(review) => {
    let totalRating = 0;
    // Find All Reviews with the same Listing 
    const reviews = await Review.findAll({
        where: {listing: review.toJSON().listing}
    });
    // Iterate through each review and add up the Total Reviews
    reviews.forEach((value, index, array) => {
        totalRating += value.rating;
    });
    // Calculate Average
    const result = totalRating / reviews.length;
    // Find the acutal Listing
    const listing = await Listing.findOne({
        where: {id: review.toJSON().listing}
    });
    // Update the averageRating on Listing
    listing.averageRating = result;
    await listing.save();
}

const Review = sequelize.define('reviews', {
    rating: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Review Rating!'
            },
            isIn: {
                args: [[1, 2, 3, 4, 5]],
                msg: 'Invalid Review Rating'
            }
        }
    },
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Review Title'
            }
        }
    },
    content: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Review Content'
            }
        }
    },
    user: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Review User'
            }
        }
    },
    listing: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Reivew Listing'
            }
        }
    }
}, {timestamps: true, freezeTableName: true, hooks: {
    afterSave: updateAverageRating,
    afterDestroy: updateAverageRating
}});

module.exports = Review;