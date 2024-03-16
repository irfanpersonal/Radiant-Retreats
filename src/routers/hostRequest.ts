import express from 'express';
const router: express.Router = express.Router();

import {viewAllHostRequests, createHostRequest, getSingleHostRequest, updateSingleHostRequest} from '../controllers/hostRequest';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').get(authentication, restrictFunctionalityTo('admin'), viewAllHostRequests).post(authentication, restrictFunctionalityTo('guest'), createHostRequest);
router.route('/:id').get(authentication, restrictFunctionalityTo('admin'), getSingleHostRequest).patch(authentication, restrictFunctionalityTo('admin'), updateSingleHostRequest);

export default router;