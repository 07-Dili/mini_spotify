const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');

// Create Artist
router.post('/', async (req, res) => {
    try {
        const { name, bio } = req.body;
        const artist = new Artist({ name, bio });
        await artist.save();
        res.status(201).json(artist);
    } catch (err) {
        res.status(500).json({ message: 'Error creating artist', error: err.message });
    }
});

// Get All Artists
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching artists', error: err.message });
    }
});

// Get Artist by ID
router.get('/:id', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) return res.status(404).json({ message: 'Artist not found' });
        res.json(artist);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching artist', error: err.message });
    }
});

module.exports = router;
