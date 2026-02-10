const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');

// @route   POST /send-otp
// @desc    Send OTP to user's email
// @access  Public
// @route   POST /send-otp
// @desc    Send OTP to user's email
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database
        const newOTP = new OTP({ email, otp });
        await newOTP.save();

        // Send OTP via Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail', // or your preferred service
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
            res.json({ message: 'OTP sent to your email' });
        } else {
            // MOCK SEND (Fallback)
            console.log("---------------------------------------------------");
            console.log(`[MOCK EMAIL] To: ${email}`);
            console.log(`[MOCK EMAIL] Subject: Password Reset OTP`);
            console.log(`[MOCK EMAIL] OTP: ${otp}`);
            console.log("---------------------------------------------------");
            res.json({ message: 'OTP generated (Check Server Console for Code)' });
        }

    } catch (err) {
        console.error("Send OTP Error:", err);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// @route   POST /reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find OTP in database
        const otpEntry = await OTP.findOne({ email, otp });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
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

        // Delete OTP from database
        await OTP.deleteOne({ _id: otpEntry._id });

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
