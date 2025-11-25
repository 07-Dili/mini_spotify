const express = require('express');
const router = express.Router();
const Album = require('../models/Album');

// Create Album
router.post('/', async (req, res) => {
    try {
        const { title, artistId, release_year, cover_image } = req.body;
        const album = new Album({
            title,
            artist: artistId,
            release_year,
            cover_image
        });
        await album.save();
        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error creating album', error: err.message });
    }
});

// Get All Albums (optionally filter by artist)
router.get('/', async (req, res) => {
    try {
        const { artistId } = req.query;
        const query = artistId ? { artist: artistId } : {};
        const albums = await Album.find(query).populate('artist');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching albums', error: err.message });
    }
});

// Get Album by ID
router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('artist');
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching album', error: err.message });
    }
});

module.exports = router;
