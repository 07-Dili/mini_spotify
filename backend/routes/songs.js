const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Create Song (Protected, Admin Only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { title, duration, genre, mood, language, albumId, artistId } = req.body;
        const song = new Song({
            title,
            duration,
            genre,
            mood,
            language,
            album: albumId,
            artist: artistId
        });
        await song.save();
        res.status(201).json(song);
    } catch (err) {
        res.status(500).json({ message: 'Error creating song', error: err.message });
    }
});

// Get Top 10 Songs
router.get('/top', async (req, res) => {
    try {
        const songs = await Song.find()
            .sort({ popularity: -1 })
            .limit(10)
            .populate('artist album');
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching top songs', error: err.message });
    }
});

// Get All Songs / Search
router.get('/', async (req, res) => {
    try {
        const { search, albumId } = req.query;
        let query = {};

        if (albumId) {
            query.album = albumId;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const songs = await Song.find(query).populate('album').populate('artist');
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching songs', error: err.message });
    }
});

// Get Song by ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id).populate('album').populate('artist');
        if (!song) return res.status(404).json({ message: 'Song not found' });
        res.json(song);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching song', error: err.message });
    }
});

// Update Song (Admin Only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(song);
    } catch (err) {
        res.status(500).json({ message: 'Error updating song', error: err.message });
    }
});

// Delete Song (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        await Song.findByIdAndDelete(req.params.id);
        res.json({ message: 'Song deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting song', error: err.message });
    }
});

module.exports = router;
