const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const OTP = require("../models/OTP");

const router = express.Router();

// ============================
// Create Email Transporter (Verified)
// ============================
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Or service: 'gmail'
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter at server start
transporter.verify((error) => {
    if (error) {
        console.error("  Email server not ready:", error);
    } else {
        console.log("  Email server ready to send OTP");
    }
});

// ============================
// SEND OTP
// ============================
router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: "No account found with that email" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete previous OTP
        await OTP.deleteMany({ email });

        // Save new OTP
        await OTP.create({ email, otp });

        // Email template
        const mailOptions = {
            from: `"MIMA Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Password Reset OTP",
            html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Password Reset Request</h2>
          <p>Use the OTP below to reset your password:</p>
          <h1 style="letter-spacing:6px;">${otp}</h1>
          <p>This OTP expires in <b>10 minutes</b>.</p>
          <br/>
          <small>If you did not request this, ignore this email.</small>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to email",
        });

    } catch (error) {
        console.error(" Send OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Try again.",
        });
    }
});

// ============================
// RESET PASSWORD
// ============================
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Check expiration (10 mins) - Redundant if TTL index works, but safe to keep
        if (otpRecord.createdAt) {
            const isExpired = Date.now() - new Date(otpRecord.createdAt).getTime() > 10 * 60 * 1000;
            if (isExpired) {
                await OTP.deleteMany({ email });
                return res.status(400).json({ message: "OTP expired" });
            }
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        await user.save();

        await OTP.deleteMany({ email });

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.error(" Reset Password Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
