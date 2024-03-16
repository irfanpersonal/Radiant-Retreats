import express from 'express';
const router: express.Router = express.Router();

import {getGeneralStats, getAdvancedStats} from '../controllers/admin';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/generalStats').get(authentication, restrictFunctionalityTo('admin'), getGeneralStats);
router.route('/advancedStats').get(authentication, restrictFunctionalityTo('admin'), getAdvancedStats);

export default router;