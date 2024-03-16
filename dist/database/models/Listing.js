"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
const Reservation_1 = __importDefault(require("./Reservation"));
const Review_1 = __importDefault(require("./Review"));
const zlib_1 = __importDefault(require("zlib"));
const cloudinary_1 = require("cloudinary");
const utils_1 = require("../../utils");
let Listing = class Listing extends sequelize_typescript_1.Model {
};
Listing.deleteAllReviewsAndPhotos = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (instance.toJSON().photos.length) {
        instance.toJSON().photos.forEach((value) => __awaiter(void 0, void 0, void 0, function* () {
            const cloudinaryPublicID = (0, utils_1.extractPublicID)(value);
            yield cloudinary_1.v2.uploader.destroy(cloudinaryPublicID);
        }));
    }
});
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: true
        },
        // You cannot make the "set" or "get" async. It won't work.
        set(value) {
            // The reason we are using the "this.setDataValue" instead of 
            // "this.name" is because that would just create an 
            // infinite loop of calls to the set method. Whereas if we do
            // "this.setDataValue" we avoid that infinite behavior.
            const compressedName = zlib_1.default.deflateSync(value).toString('base64');
            this.setDataValue('name', compressedName);
        },
        get() {
            // The reason we are using the "this.getDataValue" instead of 
            // "this.name" is because that would just create an 
            // infinite loop of calls to the get method. Whereas if we do
            // "this.getDataValue" we avoid that infinite behavior.
            const compressedName = this.getDataValue('name');
            const uncompressedName = zlib_1.default.inflateSync(Buffer.from(compressedName, 'base64')).toString();
            return uncompressedName;
        }
    }),
    __metadata("design:type", String)
], Listing.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        // DataType.NUMBER is not supported in MySQL. In MySQL you define it as
        // INT so DataType.INTEGER.
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value) {
                if (value <= 0) {
                    throw new Error('Housing Capacity must be 1 or more!');
                }
            }
        }
    }),
    __metadata("design:type", Number)
], Listing.prototype, "housingCapacity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value) {
                if (value <= 0) {
                    throw new Error('Bedrooms must be 1 or more!');
                }
            }
        }
    }),
    __metadata("design:type", Number)
], Listing.prototype, "bedrooms", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value) {
                if (value <= 0) {
                    throw new Error('Beds must be 1 or more!');
                }
            }
        }
    }),
    __metadata("design:type", Number)
], Listing.prototype, "beds", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value) {
                if (value <= 0) {
                    throw new Error('Baths must be 1 or more!');
                }
            }
        }
    }),
    __metadata("design:type", Number)
], Listing.prototype, "baths", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value) {
                if (value <= 0) {
                    throw new Error('Price must be 1 or more!');
                }
            }
        },
        set(value) {
            this.setDataValue('price', value * 100);
        }
    }),
    __metadata("design:type", Number)
], Listing.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: true
        },
        // You cannot make the "set" or "get" async. It won't work.
        set(value) {
            // The reason we are using the "this.setDataValue" instead of 
            // "this.description" is because that would just create an 
            // infinite loop of calls to the set method. Whereas if we do
            // "this.setDataValue" we avoid that infinite behavior.
            const compressedDescription = zlib_1.default.deflateSync(value).toString('base64');
            this.setDataValue('description', compressedDescription);
        },
        get() {
            // The reason we are using the "this.getDataValue" instead of 
            // "this.description" is because that would just create an 
            // infinite loop of calls to the get method. Whereas if we do
            // "this.getDataValue" we avoid that infinite behavior.
            const compressedDescription = this.getDataValue('description');
            const uncompressedDescription = zlib_1.default.inflateSync(Buffer.from(compressedDescription, 'base64')).toString();
            return uncompressedDescription;
        }
    }),
    __metadata("design:type", String)
], Listing.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        // In MySQL DataType.ARRAY is not supported. MySQL doesn't have a native 
        // array data type like some other databases do. To represent an array of
        // strings we can just set the type to string. Or we can also set it to
        // DataType.JSON, which can be used to store JSON Data as well as arrays 
        // of strings.
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        defaultValue: []
    }),
    __metadata("design:type", Array)
], Listing.prototype, "amenities", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            checkIfZeroOrBelow(value) {
                if (value <= 0) {
                    throw new Error('Maintenance Fee must be 1 or more!');
                }
            }
        },
        set(value) {
            this.setDataValue('maintenanceFee', value * 100);
        }
    }),
    __metadata("design:type", Number)
], Listing.prototype, "maintenanceFee", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        validate: {
            notEmpty: true,
            maxAmountOfPhotos(value) {
                if (value.length > 5) {
                    throw new Error('The maximum amount of photos is 5');
                }
            }
        },
        defaultValue: []
    }),
    __metadata("design:type", Array)
], Listing.prototype, "photos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['house', 'apartment', 'guesthouse', 'hotel']]
        }
    }),
    __metadata("design:type", String)
], Listing.prototype, "propertyType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
        defaultValue: []
    }),
    __metadata("design:type", Array)
], Listing.prototype, "bookedDates", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], Listing.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            checkIfValidCountry(value) {
                if (!(0, utils_1.isValidCountry)(value)) {
                    throw new Error('Invalid Country');
                }
            }
        }
    }),
    __metadata("design:type", String)
], Listing.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        validate: {
            notEmpty: true,
            min: 0,
            max: 5
        },
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], Listing.prototype, "averageRating", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default) // Define the Foreign Key Constraint on this column "userId"
    ,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], Listing.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Listing.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Reservation_1.default),
    __metadata("design:type", Reservation_1.default)
], Listing.prototype, "reservation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Review_1.default),
    __metadata("design:type", Review_1.default)
], Listing.prototype, "review", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Listing.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Listing.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    __metadata("design:type", Object)
], Listing, "deleteAllReviewsAndPhotos", void 0);
Listing = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'Listing',
        tableName: 'listings',
        freezeTableName: true,
        timestamps: true,
        paranoid: true
    })
], Listing);
exports.default = Listing;
