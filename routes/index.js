const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const dashboardController = require('./../controllers/dashboardController');
const adminController = require('../controllers/admin/adminController');
const pagesController = require('../controllers/admin/pagesController');
const blockController = require('../controllers/admin/blockController');
const landingController = require('../controllers/landingController');

router.get('/', landingController.home);
router.post('/',
    landingController.saveEmail,
    landingController.home
);

router.get('/admin/login', userController.loginForm);
router.post('/admin/login', authController.login);
router.get('/admin/register', userController.registerForm);
// 1. validate the user
// 2. register the user
// 3. login the user
router.post('/admin/register',
    userController.validateRegister,
    userController.register
);
router.get('/admin/logout', authController.logout);

/* Admin routes */
router.get('/admin', authController.isLoggedIn, authController.isAdmin, adminController.home);
router.get('/admin/pages',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(pagesController.home)
);
router.get('/admin/pages/:id',
    authController.isLoggedIn,
    authController.isAdmin,
    pagesController.edit
);
router.post('/admin/pages',
    authController.isLoggedIn,
    authController.isAdmin,
    pagesController.validate,
    pagesController.save
);

router.get('/admin/block-add/:id',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(blockController.add)
);

router.get('/admin/block-edit/:blockId',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(blockController.edit)
);

router.get('/admin/block-content/:pageId/:blockId',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(blockController.editContent)
);

router.post('/admin/block-edit/:blockId',
    authController.isLoggedIn,
    authController.isAdmin,
    catchErrors(blockController.update)
);

router.post('/admin/block-add/:id',
    authController.isLoggedIn,
    authController.isAdmin,
    blockController.upload,
    blockController.resize,
    blockController.save
);

router.get('/admin/block-remove/:blockId',
    authController.isLoggedIn,
    authController.isAdmin,
    blockController.remove
)
module.exports = router;
