const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

const createCategoryController = async (req, res) => {
    try {
        const { category } = req.body;

        if (!category) {
            return res.status(500).send({
                success: false,
                message: 'Please provide category name'
            });
        }

        await categoryModel.create({ category });
        res.status(201).send({
            success: true,
            message: `${category} Category Created Successfully!`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Category API',
            error
        });
    }
};

const getAllCategoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Categories Fetched Successfully!",
            totalCat: categories.length,
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Category API',
            error
        });
    }
};

const deleteCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category Not Found'
            });
        }

        const products = await productModel.find({ category: category._id });

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = undefined;
            await product.save();
        }

        await category.deleteOne();
        res.status(200).send({
            success: true,
            message: 'Category Deleted Successfully!'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid ID'
            });
        }
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete Category API',
            error
        });
    }
};

const updateCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category Not Found'
            });
        }

        const { updatedCategory } = req.body;

        const products = await productModel.find({ category: category._id });
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = updatedCategory;
            await product.save();
        }

        category.category = updatedCategory;
        await category.save();
        res.status(200).send({
            success: true,
            message: 'Category Updated Successfully!'
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid ID'
            });
        }
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Category API',
            error
        });
    }
};

module.exports = { createCategoryController, getAllCategoryController, deleteCategoryController, updateCategoryController };