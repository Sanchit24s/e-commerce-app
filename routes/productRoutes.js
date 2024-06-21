const express = require('express');
const { getAllProductsController, getSingleProductController, createProductController } = require('../controllers/productController');
const isAuth = require('../middlewares/authMiddleware');
const singleUpload = require('../middlewares/multer');

const router = express.Router();

router.get('/get-all', getAllProductsController);

router.get('/:id', getSingleProductController);

router.post('/create', isAuth, singleUpload, createProductController);

module.exports = router;