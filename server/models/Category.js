const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // "Heels", "Sneakers"
    title: { type: String, required: true },
    image: { type: String, required: true },
    count: { type: String, default: "0+ Items" }
});

module.exports = mongoose.model('Category', categorySchema);
