const productModel = require("../models/productModel");
const getDataUri = require("../utils/features");
const cloudinary = require('cloudinary');

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

const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name || !description || !price || !stock) {
            return res.status(500).send({
                success: false,
                message: 'Please provide all fields'
            });
        }

        if (!req.file) {
            return res.status(500).send({
                success: false,
                message: 'Please provide product images'
            });
        }

        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        };

        await productModel.create({
            name, description, price, category, stock, images: [image]
        });

        res.status(201).send({
            success: true,
            messages: 'Product Created Successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Product API',
            error
        });
    }
};

module.exports = { getAllProductsController, getSingleProductController, createProductController };