import express from 'express';
import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import auth from '../middleware/auth.js';

const router = express.Router();
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

// Get All Songs / Search (Paginated)
router.get('/', async (req, res) => {
    try {
        const { search, albumId, page = 1, limit = 16 } = req.query;
        let query = {};

        if (albumId) {
            query.album = albumId;
        }

        if (search) {
            // Find matching artists
            const artists = await Artist.find({ name: { $regex: search, $options: 'i' } });
            const artistIds = artists.map(a => a._id);

            // Find matching albums
            const albums = await Album.find({ title: { $regex: search, $options: 'i' } });
            const albumIds = albums.map(a => a._id);

            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { genre: { $regex: search, $options: 'i' } },
                { artist: { $in: artistIds } },
                { album: { $in: albumIds } }
            ];
        }

        // Pagination logic (use large limit for 'all' results)

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const songs = await Song.find(query)
            .populate('album')
            .populate('artist')
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);

        const total = await Song.countDocuments(query);

        res.json({
            songs,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            totalSongs: total
        });
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

export default router;
