const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to authenticate user
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Add to Favorites
router.post('/favorites/:songId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.favorites.includes(req.params.songId)) {
            user.favorites.push(req.params.songId);
            await user.save();
        }
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error adding favorite', error: err.message });
    }
});

// Remove from Favorites
router.delete('/favorites/:songId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(id => id.toString() !== req.params.songId);
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error removing favorite', error: err.message });
    }
});

// Get Favorites
router.get('/favorites', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'favorites',
            populate: { path: 'artist album' }
        });
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites', error: err.message });
    }
});

module.exports = router;
