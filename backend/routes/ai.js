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
        const favorites = user.favorites || [];
        const favoriteIds = favorites.map(f => f._id.toString());

        // 1. Gather User Signals
        const preferredArtistIds = (user.preferredArtists || []).map(id => id.toString());
        const preferredLanguages = user.preferredLanguages || [];

        const favArtistIds = favorites.map(f => f.artist.toString());
        const favGenres = favorites.map(f => f.genre);
        const favMoods = favorites.map(f => f.mood);

        // Combine signals (Favorites > Preferences)
        const targetArtistIds = [...new Set([...favArtistIds, ...preferredArtistIds])];

        // 2. Build Query
        // Exclude songs already in favorites
        let query = { _id: { $nin: favoriteIds } };

        // We want to fetch a broad set of candidates to score
        const orConditions = [];

        if (targetArtistIds.length > 0) {
            orConditions.push({ artist: { $in: targetArtistIds } });
        }

        if (preferredLanguages.length > 0) {
            orConditions.push({ language: { $in: preferredLanguages } });
        }

        if (favGenres.length > 0) {
            orConditions.push({ genre: { $in: favGenres } });
        }

        if (favMoods.length > 0) {
            orConditions.push({ mood: { $in: favMoods } });
        }

        // If we have signals, use them. Otherwise, we'll fall through to fallback.
        if (orConditions.length > 0) {
            query.$or = orConditions;
        }

        // Fetch Candidates (limit to 100 to avoid performance hit)
        let candidates = await Song.find(query)
            .populate('artist album')
            .limit(100);

        // 3. Fallback if not enough candidates
        // We need at least 7 recommendations
        if (candidates.length < 10) {
            const existingIds = [...favoriteIds, ...candidates.map(c => c._id.toString())];
            const fallbackSongs = await Song.find({ _id: { $nin: existingIds } })
                .sort({ popularity: -1 })
                .limit(20)
                .populate('artist album');
            candidates = [...candidates, ...fallbackSongs];
        }

        // 4. Scoring Algorithm
        const maxPopularity = Math.max(...candidates.map(s => s.popularity || 0), 1);

        const scoredSongs = candidates.map(song => {
            let score = 0;
            let reasons = [];

            const songArtistId = song.artist?._id.toString();
            const songLanguage = song.language;
            const songGenre = song.genre;
            const songMood = song.mood;

            // A. Favorites Match (Highest Priority)
            if (favArtistIds.includes(songArtistId)) {
                score += 5;
                reasons.push('Similar to your favorite artists');
            }
            if (favGenres.includes(songGenre)) {
                score += 3;
                reasons.push(`Because you like ${songGenre}`);
            }
            if (favMoods.includes(songMood)) {
                score += 2;
                reasons.push(`Matches your mood`);
            }

            // B. Registration Preferences (Medium Priority)
            if (preferredArtistIds.includes(songArtistId) && !favArtistIds.includes(songArtistId)) {
                score += 4;
                reasons.push('From your selected artists');
            }
            if (preferredLanguages.includes(songLanguage)) {
                score += 3;
                reasons.push(`In ${songLanguage}`);
            }

            // C. Popularity (Tie-breaker)
            const popScore = (song.popularity || 0) / maxPopularity; // 0 to 1
            score += popScore;

            // Deduplicate reasons and format
            const uniqueReasons = [...new Set(reasons)];
            const reasonStr = uniqueReasons.length > 0 ? uniqueReasons[0] : 'Popular right now';

            return { ...song.toObject(), score, reason: reasonStr };
        });

        // 5. Sort and Paginate
        scoredSongs.sort((a, b) => b.score - a.score);

        // Remove duplicates
        const uniqueScoredSongs = scoredSongs.filter((song, index, self) =>
            index === self.findIndex((t) => t._id.toString() === song._id.toString())
        );

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7; // Default to 7 as requested
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedResults = uniqueScoredSongs.slice(startIndex, endIndex);
        const totalPages = Math.ceil(uniqueScoredSongs.length / limit);

        res.json({
            recommendations: paginatedResults,
            currentPage: page,
            totalPages,
            totalRecommendations: uniqueScoredSongs.length
        });

    } catch (err) {
        res.status(500).json({ message: 'Error generating recommendations', error: err.message });
    }
});

module.exports = router;
