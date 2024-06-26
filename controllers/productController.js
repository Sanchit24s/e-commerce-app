const productModel = require("../models/productModel");
const getDataUri = require("../utils/features");
const cloudinary = require('cloudinary');

const getAllProductsController = async (req, res) => {
    const { keyword, category } = req.query;
    try {
        const products = await productModel.find({
            name: {
                $regex: keyword ? keyword : '',
                $options: 'i'
            },
            // category: category ? category : undefined
        }).populate('category');
        res.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            totalProducts: products.length,
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

const getTopProductController = async (req, res) => {
    try {
        const products = await productModel.find().sort({ rating: -1 }).limit(3);
        res.status(200).send({
            success: true,
            message: 'Top 3 Products',
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get Top Products API',
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

const updateProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found'
            });
        }

        const { name, description, category, price, stock } = req.body;

        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;
        if (price) product.price = price;
        if (stock) product.stock = stock;

        await product.save();

        res.status(200).send({
            success: true,
            message: 'Product Updated Successfully!'
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
            message: 'Error in Create Product API',
            error
        });
    }
};

const updateProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found'
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

        product.images.push(image);
        await product.save();
        res.status(200).send({
            success: true,
            message: 'Product Image Updated Successfully'
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
            message: 'Error in Create Product API',
            error
        });
    }
};

const deleteProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found'
            });
        }

        const id = req.query.id;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Product Image Not Found'
            });
        }

        let isExist = -1;
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) isExist = index;
        });

        if (isExist < 0) {
            return res.status(404).send({
                success: false,
                message: "Image Not Found",
            });
        }

        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
        product.images.splice(isExist, 1);
        await product.save();

        res.status(200).send({
            success: true,
            message: 'Product Image Deleted Successfully'
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
            message: 'Error in Delete Product Image API',
            error
        });
    }
};

const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found'
            });
        }

        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);
        }

        await product.deleteOne();
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully",
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
            message: 'Error in Delete Product Image API',
            error
        });
    }
};

const productReviewController = async (req, res) => {
    try {
        const { comment, rating } = req.body;

        const product = await productModel.findById(req.params.id);
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            return res.status(400).send({
                success: false,
                message: 'Product Already Reviewed'
            });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        // passing review object to reviews array
        product.reviews.push(review);
        // number or reviews
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;
        // save
        await product.save();
        res.status(200).send({
            success: true,
            message: "Review Added!",
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
            message: 'Error in Review Product API',
            error
        });
    }
};

module.exports = {
    getAllProductsController, getSingleProductController, createProductController,
    updateProductController, updateProductImageController, deleteProductImageController,
    deleteProductController, productReviewController, getTopProductController
};