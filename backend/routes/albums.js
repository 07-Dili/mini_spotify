const express = require('express');
const router = express.Router();
const Album = require('../models/Album');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Create Album (Protected, Admin Only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { title, artistId, release_year, imageUrl, cover_image } = req.body;

        const album = new Album({
            title,
            artist: artistId,
            release_year,
            imageUrl: imageUrl || cover_image
        });
        await album.save();
        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error creating album', error: err.message });
    }
});

// Get All Albums (Paginated)
router.get('/', async (req, res) => {
    try {
        const { artistId, page = 1, limit = 10, search = '' } = req.query;
        const query = {};
        if (artistId) query.artist = artistId;
        if (search) query.title = { $regex: search, $options: 'i' };

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const albums = await Album.find(query)
            .populate('artist')
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);

        const total = await Album.countDocuments(query);

        res.json({
            albums,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            totalAlbums: total
        });
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

        const albumId = req.params.id;

        // Delete all songs in this album
        await Song.deleteMany({ album: albumId });

        // Delete the album
        await Album.findByIdAndDelete(albumId);

        res.json({ message: 'Album and associated songs deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting album', error: err.message });
    }
});

module.exports = router;
