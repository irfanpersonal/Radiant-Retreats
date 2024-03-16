"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const cashout_1 = require("../controllers/cashout");
const authentication_1 = require("../middleware/authentication");
router.route('/').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), cashout_1.getAllCashOuts).post(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('host'), cashout_1.createCashOut);
router.route('/getEarningsData').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('host'), cashout_1.getEarningsData);
router.route('/myCashOuts').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('host'), cashout_1.getAllMyCashOuts);
router.route('/:id').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin', 'host'), cashout_1.getSingleCashOut).patch(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), cashout_1.updateSingleCashOut);
exports.default = router;
