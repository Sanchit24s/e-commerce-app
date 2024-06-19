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

module.exports = { registerController };