const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'UnAthorized User'
        });
    }

    const decodedUser = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodedUser._id);

    next();
};

const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).send({
            success: false,
            message: 'Admin only'
        });
    }

    next();
};

module.exports = { isAuth, isAdmin };