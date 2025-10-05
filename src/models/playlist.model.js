import mongoose from 'mongoose';
const { Schema } = mongoose;

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String ,required: true},
        videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export const Playlist = mongoose.model('Playlist', playlistSchema);