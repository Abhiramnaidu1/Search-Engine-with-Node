const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/forgot_password',ctrlUser.forgot_password);
router.post('/reset',ctrlUser.reset_password);

//router.post('/login',ctrlUser.login);
module.exports = router;
