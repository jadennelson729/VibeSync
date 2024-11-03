const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user.js');

const refreshSpotifyToken = async (refreshToken) => {
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')
        },
        data: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    };

    try {
        const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
        return response.data.access_token;
    } catch (error) {
        throw new Error('Error refreshing Spotify token: ' + error.message);
    }
};

const getSpotifyPlaylists = async (accessToken, refreshToken, userId, playlistId) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return response.data.items.map(item => item.track.id);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshSpotifyToken(refreshToken);
            await User.findByIdAndUpdate(userId, { spotifyAccessToken: newAccessToken });
            return getSpotifyPlaylists(newAccessToken, refreshToken, userId, playlistId);
        } else {
            throw new Error('Error fetching Spotify playlists: ' + error.message);
        }
    }
};

router.get('/', async (req, res) => {
    const { playlist1, playlist2, currentUser, otherUser } = req.query;

    try {
        const currentUserData = await User.findOne({ username: currentUser });
        const otherUserData = await User.findOne({ username: otherUser });

        if (!currentUserData || !otherUserData) {
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const [tracks1, tracks2] = await Promise.all([
            getSpotifyPlaylists(currentUserData.spotifyAccessToken, currentUserData.spotifyRefreshToken, currentUserData._id, playlist1),
            getSpotifyPlaylists(otherUserData.spotifyAccessToken, otherUserData.spotifyRefreshToken, otherUserData._id, playlist2)
        ]);

        const commonTracks = tracks1.filter(track => tracks2.includes(track));
        const totalTracks = new Set([...tracks1, ...tracks2]).size;
        const similarity = (commonTracks.length / totalTracks) * 100;

        res.json({ similarity: similarity.toFixed(2) });
    } catch (error) {
        console.error('Error comparing playlists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;