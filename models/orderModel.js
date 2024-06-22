const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, 'address is required']
        },
        city: {
            type: String,
            required: [true, 'city is required']
        },
        country: {
            type: String,
            required: [true, 'country is required']
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'product name is required']
            },
            price: {
                type: Number,
                required: [true, 'product price is required']
            },
            quantity: {
                type: String,
                required: [true, 'product quantity is required']
            },
            image: {
                type: String,
                required: [true, "product image is require"],
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true,
            },
        }
    ],
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: [true, "user id is require"],
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String,
    },
    itemPrice: {
        type: Number,
        required: [true, "item price is require"],
    },
    tax: {
        type: Number,
        required: [true, "tax price is require"],
    },
    shippingCharges: {
        type: Number,
        required: [true, "item shippingCharges  is require"],
    },
    totalAmount: {
        type: Number,
        required: [true, "item totalAmount price is require"],
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "deliverd"],
        default: "processing",
    },
    deliverdAt: Date,
}, { timestamps: true });

const orderModel = mongoose.model("Orders", orderSchema);
module.exports = orderModel;