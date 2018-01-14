const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
// const userController = require('./../controllers/userController');
// const authController = require('./../controllers/authController');
// const dashboardController = require('./../controllers/dashboardController');
// const adminController = require('../controllers/admin/adminController');
// const sourceController = require('../controllers/admin/sourceController');
// const importController = require('../controllers/importController');
const landingController = require('../controllers/landingController');

router.get('/', landingController.home);
// router.get('/', importController.convert);

module.exports = router;
