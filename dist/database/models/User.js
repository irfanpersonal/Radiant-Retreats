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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../../utils");
const HostRequest_1 = __importDefault(require("./HostRequest"));
const Listing_1 = __importDefault(require("./Listing"));
const Reservation_1 = __importDefault(require("./Reservation"));
const CashOut_1 = __importDefault(require("./CashOut"));
// The @SOMETHING is referred to as a decorator. Think of it as a setting we can
// apply to a class, the classes properties, the classes methods, the classes
// accessors, or the classes parameters. 
// For example the @Table decorator allows us to specify settings for this model/table
// we are about to create. And inside of it we have set some values for modelName, 
// tableName, freezeTableName, and timestamps.
let User = class User extends sequelize_typescript_1.Model {
    // Instance Method 
    comparePassword(guess) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCorrect = yield bcryptjs_1.default.compare(guess, this.password);
            return isCorrect;
        });
    }
};
// The @BeforeCreate is a decorator which allows us to specify a method we would
// like to run when an instance of a User is made or updated
User.hashPasswordOnCreationOfUserOrPasswordChange = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    if (instance.changed('password')) {
        const randomBytes = yield bcryptjs_1.default.genSalt(10);
        instance.password = yield bcryptjs_1.default.hash(instance.password, randomBytes);
    }
});
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4
    })
    // The declare word used here simply means we are specifying a TYPE not the 
    // implementation.
    ,
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", Date)
], User.prototype, "birthdate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: 'customer',
        validate: {
            notEmpty: true,
            isIn: [['guest', 'host', 'admin']]
        }
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        defaultValue: ''
    }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            // When creating a custom validator you must throw the error yourself.
            // Or even if you don't pass the check the creation will go through as
            // usual. Which is no good. If you don't pass the checks you should get
            // an error.
            checkIfValidCountry(value) {
                if (!(0, utils_1.isValidCountry)(value)) {
                    throw new Error('Invalid Country');
                }
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            checkIfValidLanguage(value) {
                if (!(0, utils_1.isValidLanguage)(value)) {
                    throw new Error('Invalid Language');
                }
            }
        }
    }),
    __metadata("design:type", String)
], User.prototype, "language", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0
    }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => HostRequest_1.default),
    __metadata("design:type", HostRequest_1.default)
], User.prototype, "hostRequest", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Listing_1.default),
    __metadata("design:type", Listing_1.default)
], User.prototype, "listing", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Reservation_1.default),
    __metadata("design:type", Reservation_1.default)
], User.prototype, "reservation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => CashOut_1.default),
    __metadata("design:type", CashOut_1.default)
], User.prototype, "cashout", void 0);
__decorate([
    sequelize_typescript_1.BeforeSave,
    __metadata("design:type", Object)
], User, "hashPasswordOnCreationOfUserOrPasswordChange", void 0);
User = __decorate([
    (0, sequelize_typescript_1.Table)({
        modelName: 'User',
        tableName: 'users',
        freezeTableName: true,
        timestamps: true
    })
], User);
exports.default = User;
