import express from 'express';
const router: express.Router = express.Router();

import {getSingleReservation} from '../controllers/reservation';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/:id').get(authentication, restrictFunctionalityTo('guest', 'host'), getSingleReservation);

export default router;