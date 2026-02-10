const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET ALL ORDERS
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE ORDER
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET User Orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE ORDER
router.post('/', async (req, res) => {
    try {
        const { items, user_id, total } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required." });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Order must contain items." });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.balance < total) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        const successfulUpdates = [];

        // 1. Validate & Subtract Stock Atomically
        for (const item of items) {
            // Attempt to decrement stock ONLY if sufficient stock exists
            const updatedProduct = await Product.findOneAndUpdate(
                { id: item.id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                // In a production environment with transactions, we would rollback here.
                // Manual Rollback: Restore stock for items already processed in this request
                for (const update of successfulUpdates) {
                    await Product.findOneAndUpdate(
                        { id: update.id },
                        { $inc: { stock: update.quantity } }
                    );
                }
                return res.status(400).json({ error: `Insufficient stock for item ${item.id} or product not found.` });
            }

            successfulUpdates.push(item);
        }

        user.balance -= total;

        const transaction = {
            type: 'purchase',
            amount: total,
            date: new Date(),
            items: items
        };

        user.transactions.push(transaction);

        await user.save();

        // 3. Create Order
        const newOrder = new Order(req.body); // Ensure req.body has id, user_id, items, total, etc.
        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CREATE ORDER from cart
router.post('/cart', async (req, res) => {
    try {
        const { userId, paymentMethod, reference } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const user = await User.findById(userId).populate('cart.product');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const cart = user.cart;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty." });
        }

        // Build order items from populated cart
        const orderItems = cart.map(item => ({
            product: item.product._id,
            title: item.product.title,
            quantity: item.quantity,
            price: item.product.price,
            size: item.selectedSize,
            color: item.selectedColor
        }));

        const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Payment Logic
        if (paymentMethod === 'wallet') {
            if (user.balance < total) {
                return res.status(400).json({ error: "Insufficient funds" });
            }
            user.balance -= total;
        }
        // If paystack, payment already verified on frontend via callback

        const successfulUpdates = [];

        // Validate & Subtract Stock
        for (const item of orderItems) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                // Rollback stock for items already processed
                for (const update of successfulUpdates) {
                    await Product.findOneAndUpdate(
                        { _id: update.product },
                        { $inc: { stock: update.quantity } }
                    );
                }
                if (paymentMethod === 'wallet') user.balance += total;

                return res.status(400).json({ error: `Insufficient stock for "${item.title}" or product not found.` });
            }

            successfulUpdates.push(item);
        }

        const transaction = {
            type: 'purchase',
            amount: total,
            date: new Date(),
            items: orderItems,
            method: paymentMethod || 'wallet',
            reference: reference || `ORD-${Date.now()}`
        };

        user.transactions.push(transaction);

        const newOrder = new Order({
            user: userId,
            email: user.email,
            items: orderItems,
            total: total,
            status: paymentMethod === 'paystack' ? "processing" : "pending",
            paymentMethod: paymentMethod || 'wallet',
            paymentStatus: 'Paid',
            shippingDetails: req.body.shippingDetails || {}
        });

        const savedOrder = await newOrder.save();

        user.cart = [];
        await user.save();

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// UPDATE ORDER STATUS (Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
