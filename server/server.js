const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Route Imports
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletters');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const bannerRoutes = require('./routes/banners');
const categoryRoutes = require('./routes/categories');

const passwordRoutes = require('./routes/password');
const postRoutes = require('./routes/posts');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};
connectDB();

// --- ROUTES MOUNTING ---
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/admins', adminRoutes);
app.use('/banners', bannerRoutes);
app.use('/categories', categoryRoutes);
app.use('/posts', postRoutes);
app.use('/password', passwordRoutes);

// Newsletter needs special handling for singular/plural compatibility
// GET /newsletters -> list
// POST /newsletter -> subscribe
app.use('/newsletters', newsletterRoutes); // Handles GET /
app.use('/newsletter', newsletterRoutes);  // Handles POST /

// Search routes: /track-search, /most-searched at root + /searches for admin
app.use('/', searchRoutes);
app.use('/searches', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
