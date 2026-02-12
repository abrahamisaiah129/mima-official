const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { sendWelcomeEmail, sendNewsletter } = require('../utils/mailer');

const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

/* ===============================
   GET ALL SUBSCRIBERS
================================ */
router.get('/', async (req, res) => {
    try {
        const subs = await Newsletter
            .find()
            .sort({ createdAt: -1 })
            .select('email -_id');

        res.json(subs.map(s => s.email));
    } catch (err) {
        console.error("[Newsletter] Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch subscribers" });
    }
});

/* ===============================
   SUBSCRIBE
================================ */
router.post('/', async (req, res) => {
    try {
        let { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: "Email is required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const newSub = await Newsletter.create({ email: normalizedEmail });

        // Fire & Forget Welcome Email
        sendWelcomeEmail(normalizedEmail)
            .catch(err => console.error("Welcome Email Error:", err));

        res.status(201).json({
            success: true,
            message: "Subscribed successfully"
        });

    } catch (err) {

        // Duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ error: "Already subscribed" });
        }

        console.error("[Newsletter] Subscribe Error:", err);
        res.status(500).json({ error: "Subscription failed" });
    }
});

/* ===============================
   UNSUBSCRIBE (RESTFUL VERSION)
================================ */
router.delete('/:email', async (req, res) => {
    try {
        const email = req.params.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const deleted = await Newsletter.findOneAndDelete({ email });

        if (!deleted) {
            return res.status(404).json({ error: "Email not found" });
        }

        res.json({
            success: true,
            message: "Unsubscribed successfully"
        });

    } catch (err) {
        console.error("[Newsletter] Unsubscribe Error:", err);
        res.status(500).json({ error: "Unsubscribe failed" });
    }
});

/* ===============================
   SEND NEWSLETTER (Admin Only)
================================ */
router.post('/send', auth, isAdmin, async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ error: "Subject and message are required" });
        }

        const subscribers = await Newsletter.find().select('email -_id');

        if (!subscribers.length) {
            return res.status(400).json({ error: "No subscribers found" });
        }

        const emails = subscribers.map(s => s.email);

        // Send in batches (safer for large lists)
        const batchSize = 50;

        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            await sendNewsletter(batch, subject, message);
        }

        res.json({
            success: true,
            message: `Newsletter sent to ${emails.length} subscribers`
        });

    } catch (err) {
        console.error("[Newsletter] Send Error:", err);
        res.status(500).json({ error: "Failed to send newsletter" });
    }
});

module.exports = router;
