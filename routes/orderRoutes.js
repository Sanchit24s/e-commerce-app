const express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const { createOrderController } = require('../controllers/orderController');

const router = express.Router();

router.post('/create', isAuth, createOrderController);


module.exports = router;