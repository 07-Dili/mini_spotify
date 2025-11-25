const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect('mongodb://localhost:27017/mini-spotify')
    .then(() => console.log('MongoDB Connected for Clearing Favorites'))
    .catch(err => console.error(err));

const clearFavorites = async () => {
    try {
        // Update all users to have empty favorites
        await User.updateMany({}, { $set: { favorites: [] } });
        console.log('All user favorites have been cleared.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearFavorites();
