const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// GET ALL SUBSCRIBERS
router.get('/', async (req, res) => {
    try {
        const subs = await Newsletter.find();
        res.json(subs.map(s => s.email));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SUBSCRIBE
router.post('/', async (req, res) => {
    try {
        let { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: "Email is required and must be a string" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Basic email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existing = await Newsletter.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ error: "Already subscribed" });
        }

        const newSub = new Newsletter({ email: normalizedEmail });
        await newSub.save();
        res.status(201).json({ success: true, message: "Subscribed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SEND NEWSLETTER
router.post('/send', async (req, res) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        const subscribers = await Newsletter.find();
        if (subscribers.length === 0) {
            return res.status(400).json({ error: "No subscribers found to send to." });
        }

        const recipientEmails = subscribers.map(s => s.email);

        const { sendNewsletter } = require('../utils/mailer');
        await sendNewsletter(recipientEmails, subject, message);
        res.json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers!` });


    } catch (err) {
        console.error("Newsletter send error:", err);
        res.status(500).json({ error: "Failed to send newsletter: " + err.message });
    }
});

module.exports = router;