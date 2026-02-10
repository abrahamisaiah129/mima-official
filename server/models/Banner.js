const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // 1, 2, 3
    url: { type: String, required: false },
    text: { type: String, required: false },
    pillText: { type: String, required: false },
    type: { type: String, enum: ['image', 'video'], default: 'image' }
});

module.exports = mongoose.model('Banner', bannerSchema);
