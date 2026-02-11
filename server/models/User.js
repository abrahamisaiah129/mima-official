const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['deposit', 'purchase'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        default: 'SUCCESS'
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [Object],
    method: { type: String, default: 'wallet' },
    reference: { type: String, sparse: true }
});

const userSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    role: { type: String, default: 'user' },
    balance: { type: Number, default: 0 },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    transactions: [transactionSchema],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        selectedSize: String,
        selectedColor: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
