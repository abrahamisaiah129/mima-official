const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        otp: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt
    }
);

// TTL Index: Automatically delete after 10 minutes
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("OTP", OTPSchema);
