import express from 'express';
const router: express.Router = express.Router();

import {showCurrentUser, getProfileData, getAllUsers, getSingleUser, updateUser, updateUserPassword} from '../controllers/user';
import {viewHostRequest} from '../controllers/hostRequest';
import {getAllUserReservations} from '../controllers/reservation';
import {authentication, restrictFunctionalityTo} from '../middleware/authentication';

router.route('/').get(getAllUsers);
router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/profileData').get(authentication, getProfileData);
router.route('/allUserReservations').get(authentication, restrictFunctionalityTo('guest', 'host'), getAllUserReservations);
router.route('/updateUser').patch(authentication, updateUser);
router.route('/updateUserPassword').patch(authentication, updateUserPassword);
router.route('/viewHostRequest').get(authentication, restrictFunctionalityTo('guest'), viewHostRequest);
router.route('/:id').get(getSingleUser);

export default router;