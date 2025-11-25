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
        const favoriteIds = favorites.map(f => f._id.toString());

        // Collect Metadata from Favorites OR Preferences
        let genres = favorites.map(f => f.genre);
        let moods = favorites.map(f => f.mood);
        let artistIds = favorites.map(f => f.artist.toString());

        // Cold Start: Use Preferences if no favorites
        if (favorites.length === 0) {
            if (user.preferredArtists && user.preferredArtists.length > 0) {
                artistIds = [...user.preferredArtists.map(id => id.toString())];
                // Fetch artist details to maybe get genres? For now, we rely on artist ID match.
            }
            // We don't have explicit genres from preferences unless we fetch artists. 
            // But we can use languages if we had language metadata on songs. 
            // For now, let's rely heavily on Artist match for cold start.
        }

        // Fetch all candidate songs (excluding favorites)
        // In a large DB, we would filter this query more. For "Mini-Spotify", fetching all is acceptable or limit to 100.
        const candidates = await Song.find({ _id: { $nin: favoriteIds } }).populate('artist album');

        // Calculate Max Popularity for normalization
        const maxPopularity = Math.max(...candidates.map(s => s.popularity || 0), 1);

        // Score Candidates
        const scoredSongs = candidates.map(song => {
            let score = 0;
            let reasons = [];

            // +3 if same artist
            if (artistIds.includes(song.artist._id.toString())) {
                score += 3;
                reasons.push(`Same artist as your favorites`);
            }

            // +2 if same genre
            if (genres.includes(song.genre)) {
                score += 2;
                reasons.push(`Matches genre '${song.genre}'`);
            }

            // +1 if same mood
            if (moods.includes(song.mood)) {
                score += 1;
                reasons.push(`Matches mood '${song.mood}'`);
            }

            // +Popularity Normalized (0 to 1)
            const popScore = (song.popularity || 0) / maxPopularity;
            score += popScore;

            // Construct reason string
            let reasonStr = reasons.length > 0 ? reasons.join(', ') : 'Recommended for you';

            return { ...song.toObject(), score, reason: reasonStr };
        });

        // Sort by Score DESC, then Popularity DESC
        scoredSongs.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.popularity || 0) - (a.popularity || 0);
        });

        // Return Top 5
        res.json(scoredSongs.slice(0, 5));

    } catch (err) {
        res.status(500).json({ message: 'Error generating recommendations', error: err.message });
    }
});

module.exports = router;
