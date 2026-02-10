const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    image: { type: String, required: true },
    user: { type: String, required: true },
    link: { type: String },
    date: { type: String, default: "Just now" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
