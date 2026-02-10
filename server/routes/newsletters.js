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

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Newsletter" <${process.env.EMAIL_USER}>`,
                to: 'Undisclosed recipients: ;',  // Standard BCC trick
                bcc: recipientEmails,             // Hides recipient list (privacy)
                subject: subject,
                text: message,
                html: `<p>${message.replace(/\n/g, '<br>')}</p>`
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("Message sent: %s", info.messageId);
            res.json({ success: true, message: `Newsletter sent to ${subscribers.length} subscribers!` });
        } else {
            // Mock send
            console.log("---------------------------------------------------");
            console.log("MOCK EMAIL SEND (Missing EMAIL_USER/EMAIL_PASS in .env)");
            console.log(`BCC To: ${recipientEmails.join(', ')}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            console.log("---------------------------------------------------");
            res.json({ success: true, message: `(Mock) Newsletter sent to ${subscribers.length} subscribers! Check server console.` });
        }

    } catch (err) {
        console.error("Newsletter send error:", err);
        res.status(500).json({ error: "Failed to send newsletter: " + err.message });
    }
});

module.exports = router;