const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const API_URL = 'http://localhost:5000';

// Simple Order Schema for creation (we'll just use the API if possible, or direct DB insert if easier)
// Using direct DB insert to speed up, but wait, if I use direct DB insert, I need the models.
// Let's use the API to create an order first, to be more realistic.

async function testCancellation() {
    try {
        console.log("--- Starting Cancellation Integration Test ---");

        // 1. Create a dummy order
        // We need a user ID first. Let's assume we have one or create a dummy one?
        // Actually, let's just create an order directly in DB to avoid auth complexity for now, 
        // OR better, use a known user ID if possible.

        // Let's connect to DB to get a user
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const User = require('../models/User');
        const Product = require('../models/Product');
        const Order = require('../models/Order');

        // Find a user
        const user = await User.findOne();
        if (!user) {
            console.error("No users found in DB to test with.");
            process.exit(1);
        }
        console.log(`Using user: ${user.email} (${user._id})`);

        // Create a dummy order
        const newOrder = new Order({
            user: user._id,
            items: [{
                product: (await Product.findOne())._id, // Grab any product
                quantity: 1,
                price: 5000,
                title: "Test Product"
            }],
            total: 5000,
            status: 'Pending',
            paymentMethod: 'cod', // Cash on Delivery to avoid wallet logic complexity for this test
            paymentStatus: 'Pending',
            shippingDetails: {
                firstName: "Test",
                lastName: "User",
                address: "123 Test St",
                phone: "08012345678",
                city: "Lagos",
                state: "Lagos"
            }
        });

        const savedOrder = await newOrder.save();
        console.log(`Created test order: ${savedOrder._id}`);

        // 2. Call the Cancel Endpoint
        console.log(`Attempting to cancel order ${savedOrder._id} via API...`);
        try {
            const res = await axios.put(`${API_URL}/orders/${savedOrder._id}/cancel`);
            console.log("API Response:", res.data);
            console.log("✅ Cancellation successful via API");
        } catch (apiErr) {
            console.error("❌ API Cancellation Failed:", apiErr.response ? apiErr.response.data : apiErr.message);
        }

        // 3. Cleanup
        // await Order.findByIdAndDelete(savedOrder._id);
        // console.log("Cleaned up test order");

    } catch (err) {
        console.error("Test Failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testCancellation();
