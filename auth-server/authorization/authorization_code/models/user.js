const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    spotifyId: { type: String, unique: true, sparse: true },
    spotifyDisplayName: String,
    email: { type: String, unique: true, sparse: true },
    profileImage: String,
    spotifyAccessToken: String,
    spotifyRefreshToken: String,
});

module.exports = mongoose.model('User', userSchema);