const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

connectDB();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/order', orderRoutes);

app.get('/', (req, res) => {
    return res.status(200).send("<h1>Welcome to Node Server</h1>");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running On PORT ${PORT} on ${process.env.NODE_ENV}`);
});