const express = require('express');
const { registerController, loginController, getUserProfileController, logoutController, updateProfileController, updatePasswordController } = require('../controllers/userController');
const isAuth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/profile', isAuth, getUserProfileController);

router.get('/logout', isAuth, logoutController);

router.put('/profile-update', isAuth, updateProfileController);

router.put('/update-password', isAuth, updatePasswordController);

module.exports = router;