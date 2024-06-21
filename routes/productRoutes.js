const express = require('express');
const { getAllProductsController, getSingleProductController } = require('../controllers/productController');

const router = express.Router();

router.get('/get-all', getAllProductsController);

router.get('/:id', getSingleProductController);

module.exports = router;