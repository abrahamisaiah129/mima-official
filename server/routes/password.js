const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// @route   POST /send-otp
// @desc    Send OTP to user's email
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("EMAIL_USER or EMAIL_PASS not configured in environment variables");
            return res.status(500).json({ message: 'Email service is not configured. Please contact support.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No account found with that email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP via Email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"MIMA Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
            html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);

        // Save OTP only after email is successfully sent
        await OTP.deleteMany({ email });
        const newOTP = new OTP({ email, otp });
        await newOTP.save();

        res.json({ message: 'OTP sent to your email' });

    } catch (err) {
        console.error("Send OTP Error:", err.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
    }
});

// @route   POST /reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find matching OTP
        const otpEntry = await OTP.findOne({ email, otp });

        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Check expiration (assumes OTP model has timestamps enabled, which adds createdAt)
        if (otpEntry.createdAt) {
            const otpAge = Date.now() - new Date(otpEntry.createdAt).getTime();
            if (otpAge > 10 * 60 * 1000) { // 10 minutes
                await OTP.deleteOne({ _id: otpEntry._id });
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Clean up all OTPs for this email
        await OTP.deleteMany({ email });

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;