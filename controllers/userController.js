const userModel = require("../models/userModel");

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

module.exports = { registerController, loginController };