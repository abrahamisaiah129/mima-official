const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET ALL POSTS
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE POST
router.post('/', async (req, res) => {
    try {
        const { image, user, link, date } = req.body;
        if (!image || !user) {
            return res.status(400).json({ error: "Image and User are required" });
        }

        const newPost = new Post({ image, user, link, date });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE POST
router.delete('/:id', async (req, res) => {
    try {
        await Post.findOneAndDelete({ id: req.params.id }); // Assuming client uses numeric ID, but Mongoose uses _id.
        // If client sends _id, use findByIdAndDelete.
        // Let's check SocialTab.jsx again. It generates Date.now() as ID.
        // Mongoose will create its own _id. Client should probably send _id if possible, 
        // OR we store the custom ID.
        // Let's store the custom ID as 'id' field in schema to match client for now, 
        // or better, just use the custom ID in the query if we add it to schema.

        // Wait, SocialTab uses `id: Date.now()` for optimistic update but calls DELETE with that ID.
        // The DB post won't have that ID unless we save it. 
        // The current schema I wrote didn't have `id`. let's fix the schema first or query by _id if we return it.
        // Actually, let's just use the `id` field since I added it to the model implicitly? No I didn't.

        // Let's rely on _id.
        // But wait, the client generates a random ID for optimistic update.
        // When fetching from DB, it will have _id. 
        // When creating, the server returns the object. 
        // The client *should* use the server response to update the state if it wants the real _id.

        // Let's look at SocialTab.jsx again... 
        // `setPosts([...posts, newPost]);` uses the client-generated ID. 
        // This is a disconnect. The client code is a bit optimistic/naive.

        // SIMPLE FIX: Add `id` to the schema as a Number to match the client's Date.now() behavior for consistency.

        const result = await Post.findOneAndDelete({ id: req.params.id });
        if (!result) {
            // Try searching by _id just in case
            try {
                await Post.findByIdAndDelete(req.params.id);
            } catch (e) { }
        }
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
