const express = require('express');
const { registerController, loginController, getUserProfileController, logoutController,
    updateProfileController, updatePasswordController, updateProfilePicController,
    passwordResetController } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');
const singleUpload = require('../middlewares/multer');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/profile', isAuth, getUserProfileController);

router.get('/logout', isAuth, logoutController);

router.put('/profile-update', isAuth, updateProfileController);

router.put('/update-password', isAuth, updatePasswordController);

router.put('/update-picture', isAuth, singleUpload, updateProfilePicController);

router.post('/reset-password', passwordResetController);

module.exports = router;