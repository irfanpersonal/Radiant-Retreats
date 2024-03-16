"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const hostRequest_1 = require("../controllers/hostRequest");
const authentication_1 = require("../middleware/authentication");
router.route('/').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), hostRequest_1.viewAllHostRequests).post(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('guest'), hostRequest_1.createHostRequest);
router.route('/:id').get(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), hostRequest_1.getSingleHostRequest).patch(authentication_1.authentication, (0, authentication_1.restrictFunctionalityTo)('admin'), hostRequest_1.updateSingleHostRequest);
exports.default = router;
