import express from 'express';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';
import auth from '../middleware/auth.js';

const router = express.Router();
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

// Get All Artists (Paginated)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        const artists = await Artist.find(query)
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);

        const total = await Artist.countDocuments(query);

        res.json({
            artists,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            totalArtists: total
        });
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

        const artistId = req.params.id;

        // Find all albums by this artist
        const albums = await Album.find({ artist: artistId });
        const albumIds = albums.map(a => a._id);

        // Delete all songs by this artist (using the direct artist reference)
        await Song.deleteMany({ artist: artistId });

        // Delete all albums by this artist
        await Album.deleteMany({ artist: artistId });

        // Delete the artist
        await Artist.findByIdAndDelete(artistId);

        res.json({ message: 'Artist and associated data deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting artist', error: err.message });
    }
});

export default router;
