const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// GET USER
router.get('/me', auth, async (req, res) => {
    try {
        // user.id from token is the custom string ID, not _id
        const user = await User.findOne({ id: req.user.id }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, address } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            address
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.id = Date.now().toString();

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ADD to wishlist
router.post('/:userId/wishlist/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();

        res.json(user.wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// REMOVE from wishlist
router.delete('/:userId/wishlist/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json(user.wishlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ADD to cart
router.post('/:userId/cart/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity, selectedSize, selectedColor } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item exists (with same size/color if applicable)
        const cartItemIndex = user.cart.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity += quantity || 1;
        } else {
            user.cart.push({
                product: productId,
                quantity: quantity || 1,
                selectedSize,
                selectedColor
            });
        }

        await user.save();

        // Populate product details before returning
        await user.populate('cart.product');

        res.json(user.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// REMOVE from cart
router.delete('/:userId/cart/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();

        // Populate product details before returning
        await user.populate('cart.product');

        res.json(user.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET cart
router.get('/:userId/cart', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('cart.product');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// UPDATE cart quantity
router.put('/:userId/cart/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity, selectedSize, selectedColor } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItemIndex = user.cart.findIndex(item =>
            item.product.toString() === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (cartItemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                user.cart.splice(cartItemIndex, 1);
            } else {
                user.cart[cartItemIndex].quantity = quantity;
            }
            await user.save();
            await user.populate('cart.product');
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;