import mongoose from 'mongoose';

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
    imageUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('Album', albumSchema);
