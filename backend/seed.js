const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/mini-spotify')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Song.deleteMany({});

        const artistsData = [
            { name: 'A.R. Rahman', bio: 'The Mozart of Madras.' },
            { name: 'Arijit Singh', bio: 'King of Playback Singing.' },
            { name: 'Shreya Ghoshal', bio: 'Melody Queen.' },
            { name: 'Sonu Nigam', bio: 'Versatile playback singer.' },
            { name: 'Lata Mangeshkar', bio: 'Nightingale of India.' },
            { name: 'Kishore Kumar', bio: 'Legendary singer and actor.' },
            { name: 'Udit Narayan', bio: 'Padma Bhushan awardee.' },
            { name: 'Mohit Chauhan', bio: 'Voice of the mountains.' },
            { name: 'Sunidhi Chauhan', bio: 'Powerhouse performer.' },
            { name: 'Badshah', bio: 'Indian rapper and singer.' },
            { name: 'Diljit Dosanjh', bio: 'Punjabi superstar.' },
            { name: 'Neha Kakkar', bio: 'Selfie Queen.' },
            { name: 'Armaan Malik', bio: 'Prince of Romance.' },
            { name: 'Jubin Nautiyal', bio: 'Soulful voice.' },
            { name: 'Sid Sriram', bio: 'Carnatic and playback singer.' },
            { name: 'Anirudh Ravichander', bio: 'Rockstar composer.' },
            { name: 'Amit Trivedi', bio: 'Innovative composer.' },
            { name: 'Pritam', bio: 'Hit machine.' },
            { name: 'Vishal-Shekhar', bio: 'Dynamic duo.' },
            { name: 'Shankar Mahadevan', bio: 'Breathless singer.' },
            { name: 'Hariharan', bio: 'Ghazal maestro.' },
            { name: 'K.K.', bio: 'Voice of love.' },
            { name: 'Shaan', bio: 'Evergreen voice.' },
            { name: 'Benny Dayal', bio: 'Funky voice.' },
            { name: 'Neeti Mohan', bio: 'Pop star.' },
            { name: 'Jonita Gandhi', bio: 'Versatile singer.' },
            { name: 'Sanctuary', bio: 'Indie band.' }, // Placeholder for variety
            { name: 'Prateek Kuhad', bio: 'Indie sensation.' },
            { name: 'Ritviz', bio: 'Electronic fusion.' },
            { name: 'Divine', bio: 'Gully Boy.' }
        ];

        const createdArtists = await Artist.insertMany(artistsData);
        console.log('Artists seeded');

        // Create 150 Songs
        const genres = ['Bollywood', 'Pop', 'Indie', 'Classical', 'Rock', 'Hip-Hop'];
        const moods = ['Happy', 'Sad', 'Romantic', 'Party', 'Chill', 'Devotional'];
        const languages = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'];

        for (let i = 0; i < 150; i++) {
            const album = createdAlbums[Math.floor(Math.random() * createdAlbums.length)];
            // Find artist of this album
            const artistId = album.artist;

            songsData.push({
                title: `Song ${i + 1} - ${album.title}`,
                duration: 180 + Math.floor(Math.random() * 120),
                genre: genres[Math.floor(Math.random() * genres.length)],
                mood: moods[Math.floor(Math.random() * moods.length)],
                language: languages[Math.floor(Math.random() * languages.length)],
                album: album._id,
                artist: artistId,
                popularity: Math.floor(Math.random() * 100)
            });
        }

        await Song.insertMany(songsData);
        console.log('Songs seeded');

        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
