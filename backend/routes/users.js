const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
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

            // Increment popularity
            await Song.findByIdAndUpdate(req.params.songId, { $inc: { popularity: 1 } });
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
        if (user.favorites.includes(req.params.songId)) {
            user.favorites = user.favorites.filter(id => id.toString() !== req.params.songId);
            await user.save();

            // Decrement popularity
            await Song.findByIdAndUpdate(req.params.songId, { $inc: { popularity: -1 } });
        }
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error removing favorite', error: err.message });
    }
});

// Get All Favorite IDs (for checking status)
router.get('/favorites/ids', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('favorites');
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorite IDs', error: err.message });
    }
});

// Get Favorites (Paginated with details)
router.get('/favorites', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.user.id);
        const totalFavorites = user.favorites.length;
        const totalPages = Math.ceil(totalFavorites / limit);

        // Slice favorites array for pagination
        const paginatedFavoritesIds = user.favorites.slice(skip, skip + limit);

        const populatedUser = await User.findOne({ _id: req.user.id })
            .populate({
                path: 'favorites',
                match: { _id: { $in: paginatedFavoritesIds } },
                populate: { path: 'artist album' }
            });

        // Fetch populated songs for the current page
        const favorites = await Song.find({ _id: { $in: paginatedFavoritesIds } }).populate('artist album');

        res.json({
            favorites,
            currentPage: page,
            totalPages,
            totalFavorites
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites', error: err.message });
    }
});

// Get Search History
router.get('/history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.searchHistory);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching history', error: err.message });
    }
});

// Add to Search History
router.post('/history', auth, async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const user = await User.findById(req.user.id);

        // Remove duplicate if exists
        user.searchHistory = user.searchHistory.filter(item => item !== query);

        // Add to top
        user.searchHistory.unshift(query);

        // Keep max 5
        if (user.searchHistory.length > 5) {
            user.searchHistory = user.searchHistory.slice(0, 5);
        }

        await user.save();
        res.json(user.searchHistory);
    } catch (err) {
        res.status(500).json({ message: 'Error updating history', error: err.message });
    }
});

// Clear Search History
// Clear Search History or Delete Specific Item
router.delete('/history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { item } = req.query;

        if (item) {
            user.searchHistory = user.searchHistory.filter(h => h !== item);
        } else {
            user.searchHistory = [];
        }

        await user.save();
        res.json(user.searchHistory);
    } catch (err) {
        res.status(500).json({ message: 'Error clearing history', error: err.message });
    }
});

module.exports = router;
