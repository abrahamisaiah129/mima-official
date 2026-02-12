const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        // User should already be attached by auth middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'Authorization denied' });
        }

        const user = await User.findOne({ id: req.user.id });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admins only' });
        }

        next();
    } catch (err) {
        console.error("isAdmin Error:", err.message);
        res.status(500).send('Server Error');
    }
};
