const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number, // in seconds
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist', // Added direct ref to Artist per spec
        required: true
    },
    popularity: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Text index for search
songSchema.index({ title: 'text', genre: 'text', mood: 'text' }, { language_override: 'dummy_language' });

module.exports = mongoose.model('Song', songSchema);
