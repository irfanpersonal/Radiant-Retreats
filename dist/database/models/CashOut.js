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
const User_1 = __importDefault(require("./User"));
let CashOut = class CashOut extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    }),
    __metadata("design:type", String)
], CashOut.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], CashOut.prototype, "fullName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], CashOut.prototype, "accountNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], CashOut.prototype, "routingNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", Number)
], CashOut.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['pending', 'paid']]
        },
        defaultValue: 'pending'
    }),
    __metadata("design:type", String)
], CashOut.prototype, "status", void 0);
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
], CashOut.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], CashOut.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], CashOut.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], CashOut.prototype, "updatedAt", void 0);
CashOut = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'CashOut',
        tableName: 'cashouts',
        freezeTableName: true,
        timestamps: true
    })
], CashOut);
exports.default = CashOut;
