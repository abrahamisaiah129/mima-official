const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// GET ALL ADMINS
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE ADMIN
router.post('/', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newAdmin = new Admin({ ...req.body, password: hashedPassword });
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
