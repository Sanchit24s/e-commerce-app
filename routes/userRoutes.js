const express = require('express');
const { registerController, loginController, getUserProfileController, logoutController,
    updateProfileController, updatePasswordController, updateProfilePicController,
    passwordResetController } = require('../controllers/userController');
const { isAuth } = require('../middlewares/authMiddleware');
const singleUpload = require('../middlewares/multer');
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

const router = express.Router();

router.post('/register', limiter, registerController);

router.post('/login', limiter, loginController);

router.get('/profile', isAuth, getUserProfileController);

router.get('/logout', isAuth, logoutController);

router.put('/profile-update', isAuth, updateProfileController);

router.put('/update-password', isAuth, updatePasswordController);

router.put('/update-picture', isAuth, singleUpload, updateProfilePicController);

router.post('/reset-password', passwordResetController);

module.exports = router;