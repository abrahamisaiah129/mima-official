const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

// ADD FUNDS to a user's account
router.patch('/:id/add-funds', getUser, async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        res.user.balance += amount;

        const transaction = {
            type: 'deposit',
            amount: amount,
            date: new Date()
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
        user = await User.findById(req.params.id);
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