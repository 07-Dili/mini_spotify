const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Song = require('../models/Song');
const Album = require('../models/Album');
const Artist = require('../models/Artist');

const fixAlbums = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const artistId = '6925d8d63ac6472bfdc622f1';
        const albumTitle = 'Aashiqui 2';
        const releaseYear = 2013;
        // Using a reliable source for the image
        const imageUrl = 'https://upload.wikimedia.org/wikipedia/en/d/d1/Aashiqui_2.jpg';

        // Check if album exists
        let album = await Album.findOne({ title: albumTitle, artist: artistId });

        if (!album) {
            console.log('Creating album...');
            album = await Album.create({
                title: albumTitle,
                artist: artistId,
                release_year: releaseYear,
                imageUrl: imageUrl
            });
            console.log('Album created:', album._id);
        } else {
            console.log('Album already exists:', album._id);
        }

        // Update songs
        const songTitles = ['Tum Hi Ho', 'Chahun Main Ya Naa', 'Milne Hai Mujhse Aayi'];

        for (const title of songTitles) {
            const result = await Song.updateMany(
                { title: title, artist: artistId },
                { $set: { album: album._id } }
            );
            console.log(`Updated ${title}: ${result.modifiedCount} documents.`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

fixAlbums();
