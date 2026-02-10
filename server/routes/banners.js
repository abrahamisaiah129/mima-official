const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// GET ALL BANNERS
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort({ id: 1 });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE OR CREATE BANNER (ID based)
router.put('/:id', async (req, res) => {
    try {
        const { url, type, text, pillText } = req.body;
        const id = parseInt(req.params.id);

        const updatedBanner = await Banner.findOneAndUpdate(
            { id },
            { url, type, text, pillText },
            { new: true, upsert: true } // Create if doesn't exist
        );
        res.json(updatedBanner);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
