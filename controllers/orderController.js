const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

const createOrderController = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        } = req.body;

        if (!shippingInfo ||
            !orderItems ||
            !paymentMethod ||
            !paymentInfo ||
            !itemPrice ||
            !tax ||
            !shippingCharges ||
            !totalAmount
        ) {
            return res.status(500).send({
                success: false,
                message: 'Provide all fields'
            });
        }

        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount
        });

        for (let i = 0; i < orderItems.length; i++) {
            const product = await productModel.findById(orderItems[i].product);
            product.stock -= orderItems[i].quantity;
            await product.save();
        }

        res.status(201).send({
            success: true,
            message: "Order Placed Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Order API',
            error
        });
    }
};

const getMyOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id });

        if (!orders) {
            return res.status(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).send({
            success: true,
            message: "your orders data",
            totalOrder: orders.length,
            orders

        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get My Order API',
            error
        });
    }
};

const singleOrderDetailsController = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order Not Found'
            });
        }

        res.status(200).send({
            success: true,
            message: "your order fetched",
            order
        });
    } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });

    }
};

const paymentsController = async (req, res) => {
    try {
        const { totalAmount } = req.body;

        if (!totalAmount) {
            return res.status(404).send({
                success: false,
                message: "Total Amount is require",
            });
        }
        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(totalAmount * 100),
            currency: 'usd'
        });

        res.status(200).send({
            success: true,
            client_secret
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Payment API",
            error,
        });
    }
};

module.exports = { createOrderController, getMyOrdersController, singleOrderDetailsController, paymentsController };