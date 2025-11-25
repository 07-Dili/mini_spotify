const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    release_year: {
        type: Number
    },
    cover_image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    }
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
