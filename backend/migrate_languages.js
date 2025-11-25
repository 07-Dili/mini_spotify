const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Song = require('./models/Song');

dotenv.config();

const languages = ['Hindi', 'English', 'Punjabi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'];

const migrate = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-spotify';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        const songs = await Song.find({ language: { $exists: false } });
        console.log(`Found ${songs.length} songs to update.`);

        // Drop the existing text index to avoid "language override unsupported" error
        try {
            await Song.collection.dropIndex('title_text_genre_text_mood_text');
            console.log('Dropped existing text index.');
        } catch (e) {
            console.log('Index might not exist or already dropped:', e.message);
        }

        if (songs.length === 0) {
            console.log('No songs need updating.');
            process.exit();
        }

        let updatedCount = 0;
        const updates = songs.map(song => {
            const randomLang = languages[Math.floor(Math.random() * languages.length)];
            return {
                updateOne: {
                    filter: { _id: song._id },
                    update: { $set: { language: randomLang } }
                }
            };
        });

        if (updates.length > 0) {
            await Song.bulkWrite(updates);
            updatedCount = updates.length;
        }

        console.log(`Successfully updated ${updatedCount} songs with random languages.`);
        process.exit();
    } catch (err) {
        console.error('Migration Error:', err);
        process.exit(1);
    }
};

migrate();
