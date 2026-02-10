const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    title: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    size: String,
    color: String
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'pending'
    },
    shippingDetails: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String
    },
    paymentMethod: String,
    paymentStatus: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
