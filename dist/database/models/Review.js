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
var Review_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
const Listing_1 = __importDefault(require("./Listing"));
const zlib_1 = __importDefault(require("zlib"));
let Review = Review_1 = class Review extends sequelize_typescript_1.Model {
};
// Upon creating a review or updating a review run the updateListingsAverageRating
// logic so we are always up to date!
Review.updateListingsAverageRating = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    let totalRating = 0;
    const reviews = yield Review_1.findAll({
        where: {
            listingId: instance.toJSON().listingId
        }
    });
    reviews.forEach(review => {
        totalRating += review.rating;
    });
    const newAverage = totalRating / reviews.length;
    const listing = (yield Listing_1.default.findByPk(instance.toJSON().listingId));
    listing.averageRating = newAverage;
    yield listing.save();
});
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            if (value) {
                const compressedTitle = zlib_1.default.deflateSync(value).toString('base64');
                this.setDataValue('title', compressedTitle);
            }
        },
        get() {
            const compressedTitle = this.getDataValue('title');
            const uncompressedTitle = zlib_1.default.inflateSync(Buffer.from(compressedTitle, 'base64')).toString();
            return uncompressedTitle;
        }
    }),
    __metadata("design:type", String)
], Review.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 1, // The minimum value that you can pass in for the rating is 1
            max: 5 // The maximum value that you can pass in for the rating is 5
        },
    }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value) {
            if (value) {
                const compressedContent = zlib_1.default.deflateSync(value).toString('base64');
                this.setDataValue('content', compressedContent);
            }
        },
        get() {
            const compressedContent = this.getDataValue('content');
            const uncompressedContent = zlib_1.default.inflateSync(Buffer.from(compressedContent, 'base64')).toString();
            return uncompressedContent;
        }
    }),
    __metadata("design:type", String)
], Review.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], Review.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Review.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Listing_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], Review.prototype, "listingId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Listing_1.default),
    __metadata("design:type", Listing_1.default)
], Review.prototype, "listing", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Review.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.AfterDestroy,
    sequelize_typescript_1.AfterSave,
    __metadata("design:type", Object)
], Review, "updateListingsAverageRating", void 0);
Review = Review_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'Review',
        tableName: 'reviews',
        freezeTableName: true,
        timestamps: true
    })
], Review);
exports.default = Review;
