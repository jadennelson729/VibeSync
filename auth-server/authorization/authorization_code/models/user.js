const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyId: String,
    displayName: String,
    email: String,
    profileImage: String,
    playlists: [{
        name: String,
        tracks: [String] // Array of track IDs
    }]
});

module.exports = mongoose.model('User', userSchema);