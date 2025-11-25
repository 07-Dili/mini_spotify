const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Create Song
router.post('/', async (req, res) => {
    try {
        const { title, duration, genre, mood, albumId, artistId } = req.body;
        const song = new Song({
            title,
            duration,
            genre,
            mood,
            album: albumId,
            artist: artistId
        });
        await song.save();
        res.status(201).json(song);
    } catch (err) {
        res.status(500).json({ message: 'Error creating song', error: err.message });
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
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { genre: { $regex: search, $options: 'i' } }
            ];
            // Note: Searching by artist name would require a more complex aggregation or population query
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

module.exports = router;
