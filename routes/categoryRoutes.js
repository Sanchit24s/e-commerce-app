const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, getAllCategoryController, deleteCategoryController, updateCategoryController } = require('../controllers/categoryController');

const router = express.Router();

router.post('/create', isAuth, isAdmin, createCategoryController);

router.get('/get-all', getAllCategoryController);

router.delete('/delete/:id', isAuth, isAdmin, deleteCategoryController);

router.put('/update/:id', isAuth, isAdmin, updateCategoryController);

module.exports = router;