const express = require('express');
const isAuth = require('../middlewares/authMiddleware');
const { createCategoryController, getAllCategoryController, deleteCategoryController, updateCategoryController } = require('../controllers/categoryController');

const router = express.Router();

router.post('/create', isAuth, createCategoryController);

router.get('/get-all', getAllCategoryController);

router.delete('/delete/:id', isAuth, deleteCategoryController);

router.put('/update/:id', isAuth, updateCategoryController);

module.exports = router;