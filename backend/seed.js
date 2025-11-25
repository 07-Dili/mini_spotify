const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/mini-spotify', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Song.deleteMany({});

        // Artists
        const artist1 = await new Artist({ name: 'The Weekend', bio: 'Canadian singer, songwriter, and record producer.' }).save();
        const artist2 = await new Artist({ name: 'Dua Lipa', bio: 'English singer and songwriter.' }).save();
        const artist3 = await new Artist({ name: 'Tame Impala', bio: 'Australian psychedelic music project.' }).save();

        // Albums
        const album1 = await new Album({ title: 'After Hours', artist: artist1._id, release_year: 2020, cover_image: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png' }).save();
        const album2 = await new Album({ title: 'Future Nostalgia', artist: artist2._id, release_year: 2020, cover_image: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png' }).save();
        const album3 = await new Album({ title: 'Currents', artist: artist3._id, release_year: 2015, cover_image: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png' }).save();

        // Songs
        const songs = [
            { title: 'Blinding Lights', duration: 200, genre: 'Synth-pop', mood: 'Energetic', album: album1._id, artist: artist1._id },
            { title: 'Save Your Tears', duration: 215, genre: 'Synth-pop', mood: 'Melancholic', album: album1._id, artist: artist1._id },
            { title: 'Levitating', duration: 203, genre: 'Disco-pop', mood: 'Happy', album: album2._id, artist: artist2._id },
            { title: 'Don\'t Start Now', duration: 183, genre: 'Nu-disco', mood: 'Empowered', album: album2._id, artist: artist2._id },
            { title: 'The Less I Know The Better', duration: 216, genre: 'Psychedelic Pop', mood: 'Groovy', album: album3._id, artist: artist3._id },
            { title: 'Let It Happen', duration: 467, genre: 'Psychedelic Rock', mood: 'Trippy', album: album3._id, artist: artist3._id },
        ];

        await Song.insertMany(songs);

        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
