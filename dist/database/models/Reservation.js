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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Listing_1 = __importDefault(require("./Listing"));
const User_1 = __importDefault(require("./User"));
let Reservation = class Reservation extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", Date)
], Reservation.prototype, "startDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", Date)
], Reservation.prototype, "endDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], Reservation.prototype, "clientSecret", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", Number)
], Reservation.prototype, "total", void 0);
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
], Reservation.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Reservation.prototype, "user", void 0);
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
], Reservation.prototype, "listingId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Listing_1.default),
    __metadata("design:type", Listing_1.default)
], Reservation.prototype, "listing", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
Reservation = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'Reservation',
        tableName: 'reservations',
        freezeTableName: true,
        timestamps: true,
        paranoid: true
    })
], Reservation);
exports.default = Reservation;
