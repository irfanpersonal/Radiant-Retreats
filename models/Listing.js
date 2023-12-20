const Sequelize = require('sequelize');
const {sequelize} = require('../database/connect.js');
const CustomError = require('../errors');
const fs = require('node:fs');
const path = require('node:path');

const Listing = sequelize.define('listings', {
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Name'
            }
        }
    },
    description: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Description'
            }
        }
    },
    address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Address'
            }
        }
    },
    city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing City'
            }
        }
    },
    country: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Country'
            }
        }
    },
    amenities: {
        type: Sequelize.DataTypes.JSON, // When we set it to Sequelize.JSON we are saying that this column can be equal to any JavaScript value so things like objects, arrays, strings, numbers, booleans, and null.
        allowNull: false,
        defaultValue: [],
        // We can set up some logic for when we get this column value and when setting
        // a value for this column. Notice how we dont just access the column value using
        // this.column_name instead we do this.getDataValue('column_name'). This is because
        // calling it directly like this: this.column_name will just invoke the get/set 
        // which makes an inifinte loop. 
        get() { // Note: This doesn't change the value in the database it just changes how its viewed. 
            return JSON.parse(this.getDataValue('amenities'));
        },
        set(value) {
            let result;
            try {
                result = value ? JSON.parse(value) : [];
            }
            catch(error) {
                throw new CustomError.BadRequestError('Invalid JSON Format');
            }
            if (Array.isArray(result)) {
                this.setDataValue('amenities', JSON.stringify(result));
            }
            else {
                throw new CustomError.BadRequestError('Must be Array!');
            }
        }
    },
    photos: {
        // type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING), // the problem with doing this is that its not supported in MySQL, but it is in PostgreSQL
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            return this.getDataValue('photos');
        },
        set(value) {
            const result = value ? JSON.parse(value) : [];
            if (Array.isArray(result)) {
                this.setDataValue('photos', result);
            }
            else {
                this.setDataValue('photos', []);
            }
        }
    },
    price: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Price'
            },
            checkIfZero() {
                if (this.price === 0) {
                    throw new Error('price cannot be 0!');
                }
            }
        },
        get() {
            return this.getDataValue('price') / 100;
        },
        set(value) {
            this.setDataValue('price', value * 100);
        }
    },
    rooms: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Room Count'
            }
        }
    },
    bathrooms: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Bathroom Count'
            }
        }
    },
    rules: {
        type: Sequelize.DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Rules'
            }
        }
    },
    user: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing User'
            }
        },
        references: { // To add a foreign key to a column we use the references property equal to an object with the key/value pairs model and key
            model: 'users', // Here we specify what table the foreign key is coming from. In this case we are saying the column user is going to be have the primary key from the table users. In simple words 'users' refers to table name
            key: 'id' // Here we are saying the column that holds the primary key is called id. In simple words 'id' refers to column name in users table
        }
    },
    maintenanceFee: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing Maintenance Fee'
            },
            checkIfZero() {
                if (this.maintenanceFee === 0) {
                    throw new Error('maintenanceFee cannot be 0!');
                }
            }
        },
        get() {
            return this.getDataValue('maintenanceFee') / 100;
        },
        set(value) {
            this.setDataValue('maintenanceFee', value * 100);
        }
    },
    averageRating: {
        type: Sequelize.DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: {
                args: [true],
                msg: 'Must Provide Listing AverageRating'
            }
        }
    }
}, {timestamps: true, freezeTableName: true, hooks: {
    afterDestroy: async(listing) => {
        if (listing.toJSON().photos.length) { // after deleting a listing check if the listing had any photos and if so delete it from the server
            for (let i = 0; i < listing.toJSON().photos.length; i++) {
                await fs.unlink(path.join(__dirname, '../images', listing.toJSON().photos[i]), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    }
}});

module.exports = Listing;