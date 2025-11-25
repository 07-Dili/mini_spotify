const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Song = require('../models/Song');
const Album = require('../models/Album');
const Artist = require('../models/Artist');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const findMissingAlbums = async () => {
    await connectDB();

    try {
        // Find all songs and populate album and artist
        const songs = await Song.find().populate('album').populate('artist');

        const missingAlbums = songs.filter(song => !song.album);

        console.log(`Found ${missingAlbums.length} songs with missing albums.`);

        if (missingAlbums.length > 0) {
            console.log('Songs with missing albums:');
            missingAlbums.forEach(song => {
                console.log(JSON.stringify({
                    id: song._id,
                    title: song.title,
                    artist: song.artist ? song.artist.name : 'Unknown',
                    artistId: song.artist ? song.artist._id : null
                }));
            });
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

findMissingAlbums();
