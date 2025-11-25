const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Song = require('./models/Song');

dotenv.config();

const LOCAL_URI = 'mongodb://localhost:27017/mini-spotify';
const REMOTE_URI = process.env.MONGO_URI;

const migrate = async () => {
    try {
        console.log('🚀 Starting Migration...');

        // 1. Connect to Local DB
        console.log('Connecting to Local DB...');
        await mongoose.connect(LOCAL_URI);
        console.log('✅ Connected to Local DB');

        // 2. Fetch all data
        console.log('Fetching data from Local DB...');
        const users = await User.find();
        const artists = await Artist.find();
        const albums = await Album.find();
        const songs = await Song.find();

        console.log(`Found: ${users.length} Users, ${artists.length} Artists, ${albums.length} Albums, ${songs.length} Songs`);

        // 3. Disconnect Local
        await mongoose.disconnect();
        console.log('Disconnected from Local DB');

        // 4. Connect to Remote DB
        console.log('Connecting to Remote DB...');
        await mongoose.connect(REMOTE_URI);
        console.log('✅ Connected to Remote DB');

        // 5. Clear Remote DB (Optional: to avoid duplicates if running multiple times)
        console.log('Clearing existing data in Remote DB...');
        await User.deleteMany({});
        await Artist.deleteMany({});
        await Album.deleteMany({});
        await Song.deleteMany({});

        // 6. Insert Data
        console.log('Inserting data into Remote DB...');
        if (users.length > 0) await User.insertMany(users);
        if (artists.length > 0) await Artist.insertMany(artists);
        if (albums.length > 0) await Album.insertMany(albums);
        if (songs.length > 0) await Song.insertMany(songs);

        console.log('✅ Data Migration Successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
};

migrate();
