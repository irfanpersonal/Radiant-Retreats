const Sequelize = require('sequelize');
const {sequelize} = require('../database/connect.js');

const Reservation = sequelize.define('reservations', {
    startDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Reservation Start Date'
            }
        }
    },
    endDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Reservation End Date'
            }
        }
    },
    listing: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Reservation Listing'
            }
        },
        references: { // To add a foreign key to a column we use the references property equal to an object with the key/value pairs model and key
            model: 'listings', // Here we specify what table the foreign key is coming from. In this case we are saying the column user is going to be have the primary key from the table users. In simple words 'users' refers to table name
            key: 'id' // Here we are saying the column that holds the primary key is called id. In simple words 'id' refers to column name in users table
        }
    },
    user: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Reservation User'
            }
        },
        references: { // To add a foreign key to a column we use the references property equal to an object with the key/value pairs model and key
            model: 'users', // Here we specify what table the foreign key is coming from. In this case we are saying the column user is going to be have the primary key from the table users. In simple words 'users' refers to table name
            key: 'id' // Here we are saying the column that holds the primary key is called id. In simple words 'id' refers to column name in users table
        }
    },
    clientSecret: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Reservation clientSecret'
            }
        }
    }
}, {timestamps: true, freezeTableName: true, hooks: {
    
}});

module.exports = Reservation;