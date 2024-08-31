import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, AfterDestroy, HasMany
} from 'sequelize-typescript';
import User from './User';
import Reservation from './Reservation';
import Review from './Review';
import zlib from 'zlib';
import {v2 as cloudinary} from 'cloudinary';
import {extractPublicID, isValidCountry} from '../../utils';

export interface IListing {
    id: string,
    name: string,
    housingCapacity: number,
    bedrooms: number,
    beds: number,
    baths: number,
    price: number,
    description: string,
    amenities: string[],
    maintenanceFee: number,
    photos: string[],
    propertyType: string,
    bookedDates: [string, string][],
    country: string,
    address: string,
    averageRating: string,
    userId: string,
    user: User
}

@Table({ 
    modelName: 'Listing',
    tableName: 'listings',
    freezeTableName: true,
    timestamps: true,
    paranoid: true
})
class Listing extends Model<IListing> {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: true
        },
        // You cannot make the "set" or "get" async. It won't work.
        // set(value: string) {
            // The reason we are using the "this.setDataValue" instead of 
            // "this.name" is because that would just create an 
            // infinite loop of calls to the set method. Whereas if we do
            // "this.setDataValue" we avoid that infinite behavior.
            // const compressedName = zlib.deflateSync(value).toString('base64');
            // this.setDataValue('name', compressedName);
        // },
        // get() {
            // The reason we are using the "this.getDataValue" instead of 
            // "this.name" is because that would just create an 
            // infinite loop of calls to the get method. Whereas if we do
            // "this.getDataValue" we avoid that infinite behavior.
            // const compressedName = this.getDataValue('name');
            // const uncompressedName = zlib.inflateSync(Buffer.from(compressedName, 'base64')).toString();
            // return uncompressedName;
        // }
    })
    declare name: string;
    @Column({
        // DataType.NUMBER is not supported in MySQL. In MySQL you define it as
        // INT so DataType.INTEGER.
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value: number) {
                if (value <= 0) {
                    throw new Error('Housing Capacity must be 1 or more!');
                }
            }
        }
    })
    declare housingCapacity: number;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value: number) {
                if (value <= 0) {
                    throw new Error('Bedrooms must be 1 or more!');
                }
            }
        }
    })
    declare bedrooms: number;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value: number) {
                if (value <= 0) {
                    throw new Error('Beds must be 1 or more!');
                }
            }
        }
    })
    declare beds: number;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value: number) {
                if (value <= 0) {
                    throw new Error('Baths must be 1 or more!');
                }
            }
        }
    })
    declare baths: number;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value: number) {
                if (value <= 0) {
                    throw new Error('Price must be 1 or more!');
                }
            }
        },
        set(value: number) {
            this.setDataValue('price', value * 100);
        }
    })
    declare price: number;
    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: true
        },
        // You cannot make the "set" or "get" async. It won't work.
        set(value: string) {
            // The reason we are using the "this.setDataValue" instead of 
            // "this.description" is because that would just create an 
            // infinite loop of calls to the set method. Whereas if we do
            // "this.setDataValue" we avoid that infinite behavior.
            const compressedDescription = zlib.deflateSync(value).toString('base64');
            this.setDataValue('description', compressedDescription);
        },
        get() {
            // The reason we are using the "this.getDataValue" instead of 
            // "this.description" is because that would just create an 
            // infinite loop of calls to the get method. Whereas if we do
            // "this.getDataValue" we avoid that infinite behavior.
            const compressedDescription = this.getDataValue('description');
            const uncompressedDescription = zlib.inflateSync(Buffer.from(compressedDescription, 'base64')).toString();
            return uncompressedDescription;
        }
    })
    declare description: string;
    @Column({
        // In MySQL DataType.ARRAY is not supported. MySQL doesn't have a native 
        // array data type like some other databases do. To represent an array of
        // strings we can just set the type to string. Or we can also set it to
        // DataType.JSON, which can be used to store JSON Data as well as arrays 
        // of strings.
        type: DataType.JSON,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        defaultValue: []
    })
    declare amenities: string[];
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value: number) {
                if (value <= 0) {
                    throw new Error('Maintenance Fee must be 1 or more!');
                }
            }
        },
        set(value: number) {
            this.setDataValue('maintenanceFee', value * 100);
        }
    })
    declare maintenanceFee: number;
    @Column({
        type: DataType.JSON,
        allowNull: false,
        validate: {
            notEmpty: true,
            maxAmountOfPhotos(value: string[]) {
                if (value.length > 5) {
                    throw new Error('The maximum amount of photos is 5');
                }
            }
        },
        defaultValue: []
    })
    declare photos: string[];
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['house', 'apartment', 'guesthouse', 'hotel']]
        }
    })
    declare propertyType: string;
    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: []
    })
    declare bookedDates: [string, string][];
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare address: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            checkIfValidCountry(value: string) {
                if (!isValidCountry(value)) {
                    throw new Error('Invalid Country');
                }
            }
        }
    })
    declare country: string;
    @Column({
        type: DataType.INTEGER,
        validate: {
            notEmpty: true,
            min: 0,
            max: 5
        },
        defaultValue: 0
    })
    declare averageRating: number;
    @ForeignKey(() => User) // Define the Foreign Key Constraint on this column "userId"
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare userId: string;
    @BelongsTo(() => User) 
    declare user: User; // Now when I need to populate I will do include: ['user'], which is what I named it.
    @HasMany(() => Reservation)
    declare reservation: Reservation[];
    @HasMany(() => Review)
    declare review: Review[];
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
    @AfterDestroy
    static deleteAllReviewsAndPhotos = async(instance: Listing) => {
        if (instance.toJSON().photos.length) {
            instance.toJSON().photos.forEach(async(value: string) => {
                const cloudinaryPublicID = extractPublicID(value);
                await cloudinary.uploader.destroy(cloudinaryPublicID);
            });
        }
    }
}

export default Listing;