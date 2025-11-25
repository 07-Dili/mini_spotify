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

// Get Recommendations
router.get('/recommendations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        const favorites = user.favorites;

        if (favorites.length === 0) {
            // If no favorites, return random songs
            const randomSongs = await Song.aggregate([{ $sample: { size: 5 } }]);
            // Populate artist and album for random songs
            await Song.populate(randomSongs, { path: 'artist album' });
            return res.json(randomSongs.map(song => ({ ...song.toObject(), reason: 'Popular on Mini-Spotify' })));
        }

        // Simple Content-Based Filtering: Recommend songs with same Genre or Mood
        const genres = [...new Set(favorites.map(f => f.genre))];
        const moods = [...new Set(favorites.map(f => f.mood))];
        const favoriteIds = favorites.map(f => f._id.toString());

        const recommendations = await Song.find({
            _id: { $nin: favoriteIds }, // Exclude songs already in favorites
            $or: [
                { genre: { $in: genres } },
                { mood: { $in: moods } }
            ]
        })
            .limit(5)
            .populate('artist album');

        // Add reason
        const result = recommendations.map(song => {
            let reason = '';
            if (genres.includes(song.genre)) reason = `Because you like ${song.genre}`;
            else if (moods.includes(song.mood)) reason = `Because you like ${song.mood} music`;
            else reason = 'Recommended for you';

            return { ...song.toObject(), reason };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error generating recommendations', error: err.message });
    }
});

module.exports = router;
