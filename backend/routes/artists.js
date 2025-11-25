const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const auth = require('../middleware/auth');

// Create Artist (Protected, Admin Only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { name, bio, imageUrl } = req.body;
        const artist = new Artist({ name, bio, imageUrl });
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

// Update Artist (Admin Only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(artist);
    } catch (err) {
        res.status(500).json({ message: 'Error updating artist', error: err.message });
    }
});

// Delete Artist (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        await Artist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Artist deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting artist', error: err.message });
    }
});

module.exports = router;
