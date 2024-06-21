const express = require('express');
const { registerController, loginController, getUserProfileController, logoutController } = require('../controllers/userController');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/profile', isAuth, getUserProfileController);

router.get('/logout', isAuth, logoutController);

module.exports = router;