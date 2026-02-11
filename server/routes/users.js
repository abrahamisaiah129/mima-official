const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one user
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

// CREATE a user
router.post('/', async (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a user
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.password != null) {
        res.user.password = req.body.password;
    }
    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName;
    }
    if (req.body.balance != null) {
        res.user.balance = req.body.balance;
    }
    if (req.body.phone != null) {
        res.user.phone = req.body.phone;
    }
    if (req.body.address != null) {
        res.user.address = req.body.address;
    }
    if (req.body.transactions != null) {
        res.user.transactions = req.body.transactions;
    }
    if (req.body.orderHistory != null) {
        res.user.orderHistory = req.body.orderHistory;
    }
    if (req.body.wishlist != null) {
        res.user.wishlist = req.body.wishlist;
    }
    if (req.body.cart != null) {
        res.user.cart = req.body.cart;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a user
router.delete('/:id', getUser, async (req, res) => {
    try {
        await User.deleteOne({ _id: res.user._id });
        res.json({ message: 'Deleted User' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// VERIFY PAYMENT and ADD FUNDS
router.post('/verify-payment', auth, async (req, res) => {
    const { reference, amount } = req.body;

    if (!reference || !amount) {
        return res.status(400).json({ message: 'Reference and amount are required' });
    }

    try {
        console.log(`[Verify Payment] Request received for Ref: ${reference}, Amount: ${amount}`);
        console.log(`[Verify Payment] User ID from token: ${req.user.id}`);

        const secretKey = process.env.PAYSTACK_SECRET_KEY ? process.env.PAYSTACK_SECRET_KEY.trim() : '';
        console.log(`[Verify Payment] KEY DEBUG: Using Key starting with: '${secretKey.substring(0, 15)}...' (Length: ${secretKey.length})`);

        // 1. Check for Duplicate Reference (Prevent Double-Funding)
        const existingUserWithRef = await User.findOne({
            'transactions.reference': reference
        });

        if (existingUserWithRef) {
            console.warn(`[Verify Payment] Duplicate Reference: ${reference}`);
            return res.status(400).json({ message: 'Duplicate Reference: Transaction already processed' });
        }

        // 2. Locate User from Auth Token
        const user = await User.findOne({ id: req.user.id });
        if (!user) {
            console.error(`[Verify Payment] User not found matching ID: ${req.user.id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        // 3. Verify with Paystack API
        console.log(`[Verify Payment] Calling Paystack API...`);
        let paystackResponse;
        try {
            paystackResponse = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY.trim()}`
                    }
                }
            );
        } catch (axiosErr) {
            console.error(`[Verify Payment] Paystack API Failed:`, axiosErr.response?.data || axiosErr.message);
            return res.status(400).json({ message: 'Payment verification failed with gateway', details: axiosErr.response?.data });
        }

        const data = paystackResponse.data.data;
        console.log(`[Verify Payment] Paystack Response Status: ${data.status}`);

        // 4. Security Checks
        if (paystackResponse.data.status !== true || data.status !== 'success') {
            return res.status(400).json({ message: 'Transaction was not successful' });
        }

        // Amount Check (Paystack is in kobo, convert to Naira)
        const paidAmount = data.amount / 100;
        if (paidAmount !== Number(amount)) {
            console.error(`[Verify Payment] Amount Mismatch. Paid: ${paidAmount}, Requested: ${amount}`);
            return res.status(400).json({
                message: 'Amount Mismatch: The amount paid does not match the request',
                paid: paidAmount,
                requested: amount
            });
        }

        // 5. Update Wallet
        user.balance += Number(amount);

        const transaction = {
            type: 'deposit',
            amount: Number(amount),
            status: 'SUCCESS',
            date: new Date(),
            method: 'paystack',
            reference: reference
        };

        user.transactions.push(transaction);
        await user.save();

        console.log(`[Verify Payment] Success! Wallet updated for user: ${user.email}`);

        res.json({
            success: true,
            message: 'Wallet funded successfully',
            balance: user.balance,
            user: user
        });

    } catch (err) {
        console.error('Payment Verification Error:', err.response?.data || err.message);
        res.status(500).json({
            message: 'Gateway Error: Could not verify payment',
            error: err.response?.data?.message || err.message
        });
    }
});

// ADD FUNDS to a user's account (Legacy/Manual)
router.patch('/:id/add-funds', getUser, async (req, res) => {
    const { amount, reference, method } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        res.user.balance += Number(amount);

        const transaction = {
            type: 'deposit',
            amount: Number(amount),
            status: 'SUCCESS',
            date: new Date(),
            method: method || 'paystack',
            reference: reference || `DEP-${Date.now()}`
        };

        res.user.transactions.push(transaction);

        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            user = await User.findById(req.params.id);
        } else {
            user = await User.findOne({ id: req.params.id });
        }

        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;