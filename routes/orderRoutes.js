const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const { createOrderController, getMyOrdersController, singleOrderDetailsController,
    paymentsController, getAllOrdersController,
    changeOrderStatusController } = require('../controllers/orderController');

const router = express.Router();

router.post('/create', isAuth, createOrderController);

router.get('/my-orders', isAuth, getMyOrdersController);

router.get('/my-orders/:id', isAuth, singleOrderDetailsController);

router.post('/payments', isAuth, paymentsController);

// =============ADMIN PART===========
router.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController);

router.put('/admin/order/:id', isAuth, isAdmin, changeOrderStatusController);

module.exports = router;