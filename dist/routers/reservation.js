"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const reservation_1 = require("../controllers/reservation");
const authentication_1 = require("../middleware/authentication");
router.route('/:id').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('guest', 'host'), reservation_1.getSingleReservation);
exports.default = router;
