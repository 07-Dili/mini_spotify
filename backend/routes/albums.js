const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const auth = require('../middleware/auth');

// Create Album (Protected, Admin Only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { title, artistId, release_year, cover_image } = req.body;

        const album = new Album({
            title,
            artist: artistId,
            release_year,
            imageUrl: cover_image
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

// Update Album (Admin Only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error updating album', error: err.message });
    }
});

// Delete Album (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        await Album.findByIdAndDelete(req.params.id);
        res.json({ message: 'Album deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting album', error: err.message });
    }
});

module.exports = router;
