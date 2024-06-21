const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email already taken']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [6, 'password length should be greater than 6 character']
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    city: {
        type: String,
        required: [true, 'city name is required']
    },
    country: {
        type: String,
        required: [true, 'country name is required']
    },
    phone: {
        type: String,
        required: [true, 'phone no is required']
    },
    profilePic: {
        type: String
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = function () {
    return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;