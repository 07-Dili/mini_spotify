const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    preferredLanguages: [{
        type: String
    }],
    preferredArtists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    searchHistory: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
