const userModel = require("../models/userModel");
const getDataUri = require("../utils/features");
const cloudinary = require('cloudinary');

const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, city, country } = req.body;

        if (!name || !email || !password || !phone || !address || !city || !country) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide All Fields'
            });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'Email Already Taken'
            });
        }

        const user = await userModel.create({
            name,
            email,
            password,
            phone,
            address,
            city,
            country
        });

        res.status(201).send({
            success: true,
            message: 'User Registered Successfully!',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide email or password'
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        const token = user.generateToken();

        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'development' ? true : false,
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            sameSite: process.env.NODE_ENV === 'development' ? true : false
        }).send({
            success: true,
            message: 'Login Successful',
            token,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login API',
            error
        });
    }
};

const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        user.password = undefined;

        res.status(200).send({
            success: true,
            message: 'User Profile Fetched Successfully!',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get User Profile API',
            error
        });
    }
};

const logoutController = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === 'development' ? true : false,
            httpOnly: process.env.NODE_ENV === 'development' ? true : false,
            sameSite: process.env.NODE_ENV === 'development' ? true : false
        }).send({
            success: true,
            message: 'Logout Successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Logout API',
            error
        });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { name, email, address, city, country, phone } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;

        await user.save();
        res.status(200).send({
            success: true,
            message: 'User Profile Updated Successfully!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Profile API',
            error
        });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: 'Please provide old or new password'
            });
        }

        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Old Password'
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Password Updated Successfully!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Password API',
            error
        });
    }
};

const updateProfilePicController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const file = getDataUri(req.file);
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        };

        await user.save();

        res.status(200).send({
            success: true,
            message: 'Profile picture updated'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Update Profile Pic API',
            error
        });
    }
};

module.exports = {
    registerController, loginController, getUserProfileController,
    logoutController, updateProfileController, updatePasswordController, updateProfilePicController
};