const express = require('express');
const { getAllProductsController, getSingleProductController, createProductController,
    updateProductController, updateProductImageController,
    deleteProductImageController,
    deleteProductController,
    productReviewController,
    getTopProductController } = require('../controllers/productController');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const singleUpload = require('../middlewares/multer');

const router = express.Router();

router.get('/get-all', getAllProductsController);

router.get('/top', getTopProductController);

router.get('/:id', getSingleProductController);

router.post('/create', isAuth, isAdmin, singleUpload, createProductController);

router.put('/:id', isAuth, isAdmin, updateProductController);

router.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageController);

router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController);

router.delete('/delete/:id', isAuth, isAdmin, deleteProductController);

// Review Product
router.put('/:id/review', isAuth, productReviewController);

module.exports = router;