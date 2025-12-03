import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    bio: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.model('Artist', artistSchema);
