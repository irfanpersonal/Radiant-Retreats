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
const validator_1 = __importDefault(require("validator"));
const User_1 = __importDefault(require("./User"));
let HostRequest = class HostRequest extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], HostRequest.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default) // Define the Foreign Key Constraint
    ,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], HostRequest.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], HostRequest.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            // When creating a custom validator you must throw the error yourself.
            // Or even if you don't pass the check the creation will go through as
            // usual. Which is no good. If you don't pass the checks you should get
            // an error.
            notEmpty: true,
            checkIfValidPhoneNumber: (value) => {
                if (!validator_1.default.isMobilePhone(value)) {
                    throw new Error('Invalid Phone Number');
                }
            }
        }
    }),
    __metadata("design:type", String)
], HostRequest.prototype, "phoneNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], HostRequest.prototype, "governmentIssuedID", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], HostRequest.prototype, "backgroundCheck", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['accepted', 'rejected', 'pending']]
        },
        defaultValue: 'pending'
    }),
    __metadata("design:type", String)
], HostRequest.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], HostRequest.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], HostRequest.prototype, "updatedAt", void 0);
HostRequest = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'HostRequest',
        tableName: 'hostrequests',
        freezeTableName: true,
        timestamps: true
    })
], HostRequest);
exports.default = HostRequest;
