const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Keep existing ID structure if possible, or migrate to _id
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    imageSrc: String,
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    sizes: [String],
    colors: [{ name: String, hex: String }],
    images: [String],
    stock: { type: Number, default: 0, min: 0 },
    comments: [Object],
    reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
