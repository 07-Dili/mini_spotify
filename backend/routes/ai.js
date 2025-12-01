const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Get Recommendations
router.get('/recommendations', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        const favorites = user.favorites || [];
        const favoriteIds = favorites.map(f => f._id.toString());

        // Gather user preferences and favorites
        const preferredArtistIds = (user.preferredArtists || []).map(id => id.toString());
        const preferredLanguages = user.preferredLanguages || [];

        const favArtistIds = favorites.map(f => f.artist.toString());
        const favGenres = favorites.map(f => f.genre);
        const favMoods = favorites.map(f => f.mood);

        // Merge favorite and preferred artists
        const targetArtistIds = [...new Set([...favArtistIds, ...preferredArtistIds])];

        // Build query excluding existing favorites
        let query = { _id: { $nin: favoriteIds } };

        // Fetch candidates for scoring
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

        // Apply filters if signals exist
        if (orConditions.length > 0) {
            query.$or = orConditions;
        }

        // Fetch up to 50 candidates
        let candidates = await Song.find(query)
            .populate('artist album')
            .limit(50);

        // Fill with popular songs if under 7 candidates
        if (candidates.length < 7) {
            const existingIds = [...favoriteIds, ...candidates.map(c => c._id.toString())];
            const fallbackSongs = await Song.find({ _id: { $nin: existingIds } })
                .sort({ popularity: -1 })
                .limit(7)
                .populate('artist album');
            candidates = [...candidates, ...fallbackSongs];
        }

        // Score candidates based on relevance
        const maxPopularity = Math.max(...candidates.map(s => s.popularity || 0), 1);

        const scoredSongs = candidates.map(song => {
            let score = 0;
            let reasons = [];

            const songArtistId = song.artist?._id.toString();
            const songLanguage = song.language;
            const songGenre = song.genre;
            const songMood = song.mood;

            // High priority: Matches favorites
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

            // Medium priority: Matches registration prefs
            if (preferredArtistIds.includes(songArtistId) && !favArtistIds.includes(songArtistId)) {
                score += 4;
                reasons.push('From your selected artists');
            }
            if (preferredLanguages.includes(songLanguage)) {
                score += 3;
                reasons.push(`In ${songLanguage}`);
            }

            // Low priority: Popularity tie-breaker
            const popScore = (song.popularity || 0) / maxPopularity;
            score += popScore;

            // Deduplicate reasons and format
            const uniqueReasons = [...new Set(reasons)];
            const reasonStr = uniqueReasons.length > 0 ? uniqueReasons[0] : 'Popular right now';

            return { ...song.toObject(), score, reason: reasonStr };
        });

        // Sort by score and paginate
        scoredSongs.sort((a, b) => b.score - a.score);

        // Remove duplicates
        const uniqueScoredSongs = scoredSongs.filter((song, index, self) =>
            index === self.findIndex((t) => t._id.toString() === song._id.toString())
        );

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 7;
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
