import express from 'express';
const router: express.Router = express.Router();

import {getAllCashOuts, getAllMyCashOuts, createCashOut, getSingleCashOut, updateSingleCashOut, getEarningsData} from '../controllers/cashout';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').get(authentication, restrictFunctionalityTo('admin'), getAllCashOuts).post(authentication, restrictFunctionalityTo('host'), createCashOut);
router.route('/getEarningsData').get(authentication, restrictFunctionalityTo('host'), getEarningsData);
router.route('/myCashOuts').get(authentication, restrictFunctionalityTo('host'), getAllMyCashOuts);
router.route('/:id').get(authentication, restrictFunctionalityTo('admin', 'host'), getSingleCashOut).patch(authentication, restrictFunctionalityTo('admin'), updateSingleCashOut);

export default router;