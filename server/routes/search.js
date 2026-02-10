const express = require('express');
const router = express.Router();
const Search = require('../models/Search');
const Product = require('../models/Product');

// GET ALL SEARCH TERMS (for admin dashboard)
router.get('/', async (req, res) => {
    try {
        const searches = await Search.find().sort({ count: -1 });
        res.json(searches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TRACK SEARCH TERM
router.post('/track-search', async (req, res) => {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Term required" });

    try {
        const existing = await Search.findOne({ term: term.toLowerCase() });
        if (existing) {
            existing.count += 1;
            await existing.save();
        } else {
            await new Search({ term: term.toLowerCase(), count: 1 }).save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET MOST SEARCHED PRODUCTS
router.get('/most-searched', async (req, res) => {
    try {
        const topSearches = await Search.find().sort({ count: -1 }).limit(5);

        if (topSearches.length === 0) {
            // Random fallback
            const products = await Product.aggregate([{ $sample: { size: 8 } }]);
            return res.json(products);
        }

        // Create regex queries for each search term
        const searchQueries = topSearches.map(s => ({
            $or: [
                { title: { $regex: s.term, $options: 'i' } },
                { category: { $regex: s.term, $options: 'i' } }
            ]
        }));

        // Find products matching any of the top searches
        let matchedProducts = await Product.find({ $or: searchQueries }).limit(8);

        // If we don't have enough, fill with random products
        if (matchedProducts.length < 8) {
            const idsToExclude = matchedProducts.map(p => p._id);
            const needed = 8 - matchedProducts.length;
            const fillers = await Product.aggregate([
                { $match: { _id: { $nin: idsToExclude } } },
                { $sample: { size: needed } }
            ]);
            matchedProducts = matchedProducts.concat(fillers);
        }

        res.json(matchedProducts.slice(0, 8));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
