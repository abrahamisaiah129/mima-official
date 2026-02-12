const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderConfirmation } = require('../utils/mailer');

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

        // Send Confirmation Email
        try {
            await sendOrderConfirmation(user.email, savedOrder);
        } catch (emailErr) {
            console.error("Failed to send order confirmation email:", emailErr);
        }

        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CREATE ORDER from cart
router.post('/cart', async (req, res) => {
    try {
        const { userId, paymentMethod, reference } = req.body;
        console.log(`[Order] New Cart Checkout Request:`, { userId, paymentMethod, reference });

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const user = await User.findById(userId).populate('cart.product');

        if (!user) {
            console.error(`[Order] User not found: ${userId}`);
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`[Order] Processing for User: ${user.email} | Method: ${paymentMethod}`);

        const cart = user.cart;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty." });
        }

        // Build order items from populated cart
        // Build order items from populated cart
        const validCartItems = cart.filter(item => item.product);

        if (validCartItems.length === 0) {
            return res.status(400).json({ error: "Cart contains invalid or deleted items. Please refresh your cart." });
        }

        const orderItems = validCartItems.map(item => ({
            product: item.product._id,
            title: item.product.title,
            quantity: item.quantity,
            price: item.product.price,
            size: item.selectedSize,
            color: item.selectedColor
        }));

        const SHIPPING_COST = Number(process.env.SHIPPING_FEE) || 2500;
        const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + SHIPPING_COST;

        // Payment Logic
        console.log(`[Order] Total: ${total} | User Balance: ${user.balance}`);

        if (paymentMethod === 'wallet') {
            if (user.balance < total) {
                console.warn(`[Order] Insufficient Funds. Required: ${total}, Available: ${user.balance}`);
                return res.status(400).json({ error: "Insufficient funds" });
            }
            user.balance -= total;
            console.log(`[Order] Wallet debited. New Balance: ${user.balance}`);
        } else if (paymentMethod === 'paystack') {
            console.log(`[Order] Starting Paystack Verification for Ref: ${reference}`);
            if (!reference) {
                return res.status(400).json({ error: "Payment reference is required for Paystack." });
            }

            // 1. Double-Funding Check (Ensure reference hasn't been used)
            const existingRef = await User.findOne({ 'transactions.reference': reference });
            if (existingRef) {
                console.warn(`[Order] Duplicate Reference Found: ${reference}`);
                return res.status(400).json({ error: "Duplicate Reference: This transaction has already been processed." });
            }

            // 2. Verify with Paystack API
            try {
                console.log(`[Order] Verifying with Paystack API...`);
                const paystackRes = await axios.get(
                    `https://api.paystack.co/transaction/verify/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY.trim()}`
                        }
                    }
                );

                const data = paystackRes.data.data;
                console.log(`[Order] Paystack Response Status: ${data.status}`);

                // 3. Status & Amount Verification
                if (!paystackRes.data.status || data.status !== 'success') {
                    console.warn(`[Order] Paystack Verification Failed: Status is ${data.status}`);
                    return res.status(400).json({ error: "Payment verification failed: Transaction not successful." });
                }

                const paidAmount = data.amount / 100;
                console.log(`[Order] Paid: ${paidAmount} | Expected: ${total}`);

                if (Math.abs(paidAmount - total) > 0.01) { // Floating point safe check
                    console.error(`[Order] Amount Mismatch! Paid: ${paidAmount}, Expected: ${total}`);
                    return res.status(400).json({
                        error: "Amount Mismatch: The amount paid does not match the order total.",
                        paid: paidAmount,
                        expected: total
                    });
                }
                console.log(`[Order] Payment Verified Successfully!`);
            } catch (err) {
                console.error("Paystack Verification Error:", err.response?.data || err.message);
                return res.status(500).json({ error: "Unable to verify payment with Paystack gateway." });
            }
        }

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
            status: 'SUCCESS',
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

        // Send Confirmation Email (Async)
        try {
            await sendOrderConfirmation(user.email, savedOrder);
        } catch (emailErr) {
            console.error("Failed to send order confirmation email:", emailErr);
        }

        user.cart = [];
        await user.save();

        res.status(201).json(savedOrder);

    } catch (err) {
        console.error("[Order] Finalization Error:", err);
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

// CANCEL ORDER
router.put('/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });

        // Check if order can be cancelled
        const cancellableStatuses = ['Pending', 'Processing', 'pending', 'processing'];
        if (!cancellableStatuses.includes(order.status)) {
            return res.status(400).json({ error: "Order cannot be cancelled at this stage." });
        }

        // Update status
        order.status = 'Cancelled';
        await order.save();

        // Optional: Restore Stock (Simple version)
        // In a real app, you might want to loop through items and $inc stock on Product model
        if (order.items && Array.isArray(order.items)) {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
        }

        // If money was deducted (Wallet), refund it
        if (order.paymentMethod === 'wallet' && order.paymentStatus === 'Paid') {
            const user = await User.findById(order.user);
            if (user) {
                user.balance += order.total;
                user.transactions.push({
                    type: 'refund',
                    amount: order.total,
                    date: new Date(),
                    reference: `REF-${order._id}`,
                    status: 'SUCCESS'
                });
                await user.save();
            }
        } // End if wallet payment

        // Send Cancellation Email
        try {
            // Need to fetch user email if not in order object (it should be there based on schema)
            let email = order.email;
            if (!email && order.user) {
                const userDoc = await User.findById(order.user);
                email = userDoc ? userDoc.email : null;
            }

            if (email) {
                const { sendOrderCancellation } = require('../utils/mailer');
                await sendOrderCancellation(email, order);
            }
        } catch (emailErr) {
            console.error("Failed to send cancellation email:", emailErr);
        }

        res.json({ message: "Order cancelled successfully", order });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
