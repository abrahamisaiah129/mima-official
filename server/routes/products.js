const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0; // 0 = no limit (backward compatibility)

        let query = Product.find().sort({ createdAt: -1 });
        if (limit > 0) query = query.skip((page - 1) * limit).limit(limit);

        const products = await query;
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET TOTAL number of products
router.get('/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE PRODUCT (Admin)
router.post('/', async (req, res) => {
    try {
        const { id, title, price, ...otherFields } = req.body;
        // Generate simple ID if not provided (though frontend might provide one or use _id)
        // Best approach: Use timestamp like frontend does or let mongo _id be standard
        // Frontend sends 'id'. Let's default to Date.now() if missing but keep provided one.
        const newId = id || Date.now();

        const newProduct = new Product({
            id: newId,
            title,
            price,
            ...otherFields
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE PRODUCT (Admin)
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE PRODUCT (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
        if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD a review to a product
router.post('/:id/reviews', async (req, res) => {
    try {
        const { rating, comment, userId } = req.body;

        const product = await Product.findOne({ id: req.params.id });
        if (!product) return res.status(404).json({ error: "Product not found" });

        const review = {
            user: userId,
            rating,
            comment,
            date: new Date()
        };

        product.reviews.push(review);

        const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
        product.rating = totalRating / product.reviews.length;
        product.numReviews = product.reviews.length;

        const updatedProduct = await product.save();
        res.status(201).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET reviews for a product
router.get('/:id/reviews', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id }).populate('reviews.user', 'firstName lastName');
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.json(product.reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
