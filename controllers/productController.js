const productModel = require("../models/productModel");

const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All API',
            error
        });
    }
};

const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Product Found',
            product
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
            message: 'Error in Get Single Product API',
            error
        });
    }
};

module.exports = { getAllProductsController, getSingleProductController };