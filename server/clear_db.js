require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const clearDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        console.log('Database cleared successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing database:', err);
        process.exit(1);
    }
};

clearDb();
