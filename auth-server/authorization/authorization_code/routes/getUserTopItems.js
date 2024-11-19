const express = require('express');
const axios = require('axios');
const User = require('../models/user.js');

const router = express.Router();

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

const getTopItems = async (accessToken, refreshToken, userId, type) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}?limit=5&time_range=medium_term`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return response.data.items.map(item => ({
            name: item.name,
            ...(type === 'tracks' && { artist: item.artists[0].name })
        }));
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshSpotifyToken(refreshToken);
            await User.findByIdAndUpdate(userId, { spotifyAccessToken: newAccessToken });
            return getTopItems(newAccessToken, refreshToken, userId, type);
        } else {
            throw new Error(`Error fetching top ${type}: ` + error.message);
        }
    }
};

const getTopArtists = (accessToken, refreshToken, userId) => getTopItems(accessToken, refreshToken, userId, 'artists');
const getTopSongs = (accessToken, refreshToken, userId) => getTopItems(accessToken, refreshToken, userId, 'tracks');

router.get('/top-artists/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const topArtists = await getTopArtists(user.spotifyAccessToken, user.spotifyRefreshToken, user._id);
        res.status(200).json({ topArtists });
    } catch (error) {
        console.error('Error fetching top artists:', error);
        res.status(500).send('Error fetching top artists: ' + error.message);
    }
});

router.get('/top-songs/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const topSongs = await getTopSongs(user.spotifyAccessToken, user.spotifyRefreshToken, user._id);
        res.status(200).json({ topSongs });
    } catch (error) {
        console.error('Error fetching top songs:', error);
        res.status(500).send('Error fetching top songs: ' + error.message);
    }
});

module.exports = router;