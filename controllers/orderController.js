const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

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

module.exports = { createOrderController };