const express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const { createOrderController, getMyOrdersController, singleOrderDetailsController } = require('../controllers/orderController');

const router = express.Router();

router.post('/create', isAuth, createOrderController);

router.get('/my-orders', isAuth, getMyOrdersController);

router.get('/my-orders/:id', isAuth, singleOrderDetailsController);


module.exports = router;