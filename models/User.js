const Sequelize = require('sequelize');
const {sequelize} = require('../database/connect.js');
// const validator = require('validator'); // No need to install the validator third module library as Sequelize uses this internally for its validate properties (for example isEmail, notEmpty, isIn, etc...)
const bcrypt = require('bcryptjs');
const path = require('node:path');
const fs = require('node:fs');

const User = sequelize.define('users', {
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false, // Setting allowNull to false will make it so that you will get an error if you don't pass anything in for name. 
        unique: true,
        validate: {
            notEmpty: { // Setting notEmpty to true will throw an error if you set the value for name equal to an empty string.
                args: [true], 
                msg: 'Must Provide User Name'
                // args is equal to the value of the validator in square brackets, msg is equal to the error message returned upon failed validation
            }
        }
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false, 
        unique: true,
        validate: {
            notEmpty: { 
                args: [true],
                msg: 'Must Provide User Email'
            },
            isEmail: { // Setting isEmail to true will throw an error if the email is not valid 
                args: [true],
                msg: 'Invalid Email Address'
            }
        }
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false, 
        validate: {
            notEmpty: { 
                args: [true],
                msg: 'Must Provide User Password'
            }
        }
    },
    role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false, 
        defaultValue: 'customer', // if no value is entered in for the role column by default it will be set to customer
        validate: {
            notEmpty: { 
                args: [true],
                msg: 'Must Provide User Role'
            },
            isIn: { // isIn is basically the enum property from mongoose, where you specify what values it can be and throw a custom msg if validation failed
                args: [['customer', 'owner']],
                msg: 'Invalid User Role'
            }
        }
    },
    bio: {
        type: Sequelize.DataTypes.STRING(500), // upon invoking the STRING and passing in 500 I am telling MySQL I would like a column called bio with the data type VARCHAR which supports 500 characters
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide User Bio'
            }
        }
    },
    profilePicture: {
        type: Sequelize.DataTypes.STRING,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide User Profile Picture'
            }
        }
    }
}, {timestamps: true, freezeTableName: true, hooks: {
    beforeSave: async(user) => { // so during creation of user or updating execute the logic inside. Note: the user is equal to the row data
        if (user.changed('password')) { // the .changed method will return whether or not the column specified has been changed
            const randomBytes = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, randomBytes);
        }
    },
    afterDestroy: async(user) => { // so after invoking the destroy method execute the following logic
        if (user.toJSON().profilePicture) { // after deleting a user check if the user had a profile picture and if so delete it from the server
            await fs.unlink(path.join(__dirname, '../images', user.profilePicture), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
}});

User.prototype.comparePassword = async function(guess) {
    const isCorrect = await bcrypt.compare(guess, this.password);
    return isCorrect;
}

module.exports = User;