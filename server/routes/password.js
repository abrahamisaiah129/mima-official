const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const { sendOTP } = require("../utils/mailer");

const router = express.Router();


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

        await sendOTP(email, otp);

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
