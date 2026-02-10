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

        const user = await User.findOne({ email });

        // Prevent user enumeration: always respond the same way
        if (!user) {
            return res.json({ message: 'OTP sent to your email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        let sendSuccess = false;

        console.log("Attempting to send OTP...");
        console.log("EMAIL_USER Present:", !!process.env.EMAIL_USER);
        console.log("EMAIL_PASS Present:", !!process.env.EMAIL_PASS);

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log("Email sent successfully:", info.messageId);
                sendSuccess = true;
            } catch (emailError) {
                console.error("Nodemailer Error:", emailError);
                sendSuccess = false;
            }
        } else {
            // MOCK SEND (Fallback) - only when user exists
            console.log("---------------------------------------------------");
            console.log(`[MOCK EMAIL] To: ${email}`);
            console.log(`[MOCK EMAIL] Subject: Password Reset OTP`);
            console.log(`[MOCK EMAIL] OTP: ${otp}`);
            console.log("---------------------------------------------------");
            sendSuccess = true;
        }

        // Only save OTP if the email was successfully "sent" (real or mock)
        if (sendSuccess) {
            await OTP.deleteMany({ email }); // Invalidate any previous OTPs
            const newOTP = new OTP({ email, otp });
            await newOTP.save();
        }

        // Always give the same success message (hides failures and non-existent users)
        res.json({ message: 'OTP sent to your email' });

    } catch (err) {
        console.error("Send OTP Logic Error:", err);
        res.status(500).json({ message: 'Server Error' });
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