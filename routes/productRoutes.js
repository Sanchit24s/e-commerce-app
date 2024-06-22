const express = require('express');
const { getAllProductsController, getSingleProductController, createProductController,
    updateProductController, updateProductImageController,
    deleteProductImageController,
    deleteProductController } = require('../controllers/productController');
const isAuth = require('../middlewares/authMiddleware');
const singleUpload = require('../middlewares/multer');

const router = express.Router();

router.get('/get-all', getAllProductsController);

router.get('/:id', getSingleProductController);

router.post('/create', isAuth, singleUpload, createProductController);

router.put('/:id', isAuth, updateProductController);

router.put('/image/:id', isAuth, singleUpload, updateProductImageController);

router.delete('/delete-image/:id', isAuth, deleteProductImageController);

router.delete('/delete/:id', isAuth, deleteProductController);

module.exports = router;