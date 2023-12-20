const express = require('express');
const router = express.Router();

const {showCurrentUser, getSingleUser, updateSingleUser, updateSingleUserPassword} = require('../controllers/user.js');
const {authentication} = require('../middleware/authentication.js');

router.route('/showCurrentUser').get(authentication, showCurrentUser);
router.route('/updateSingleUser').patch(authentication, updateSingleUser);
router.route('/updateSingleUserPassword').patch(authentication, updateSingleUserPassword);
router.route('/:id').get(authentication, getSingleUser);

module.exports = router;