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

const getSpotifyPlaylists = async (accessToken, refreshToken, userId) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return response.data.items.map(playlist => ({
            name: playlist.name,
            id: playlist.id
        }));
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshSpotifyToken(refreshToken);
            await User.findByIdAndUpdate(userId, { spotifyAccessToken: newAccessToken });
            return getSpotifyPlaylists(newAccessToken, refreshToken, userId);
        } else {
            throw new Error('Error fetching Spotify playlists: ' + error.message);
        }
    }
};

const getSpotifySavedTracks = async (accessToken, refreshToken, userId) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { limit: 50 }  // Limit to 50 tracks
        });

        if (!response.data || !response.data.items) {
            throw new Error('Unexpected response from Spotify API');
        }

        const artistIds = [...new Set(response.data.items.flatMap(item =>
            item.track.artists.map(artist => artist.id)
        ))];

        const artistsResponse = await axios.get(`https://api.spotify.com/v1/artists`, { // Fetch artist details
            headers: { 'Authorization': 'Bearer ' + accessToken },
            params: { ids: artistIds.join(',') }
        });

        const artistGenres = artistsResponse.data.artists.reduce((acc, artist) => { // Map artist ID to genres
            acc[artist.id] = artist.genres;
            return acc;
        }, {});

        return response.data.items.map(item => {
            if (!item || !item.track) return null;

            const mainArtist = item.track.artists[0];
            const genres = artistGenres[mainArtist.id] || [];

            return {
                name: item.track.name || 'Unknown Track',
                id: item.track.id || 'Unknown ID',
                artist: mainArtist.name || 'Unknown Artist',
                genre: genres[0] || 'Unknown Genre' // Use the first genre if available
            };
        }).filter(track => track !== null);
    } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const newAccessToken = await refreshSpotifyToken(refreshToken);
            await User.findByIdAndUpdate(userId, { spotifyAccessToken: newAccessToken });
            return getSpotifySavedTracks(newAccessToken, refreshToken, userId);
        } else {
            console.error('Error in getSpotifySavedTracks:', error);
            throw new Error('Error fetching Spotify saved tracks: ' + error.message);
        }
    }
};

router.get('/playlists/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log(`User not found: ${username}`);
            return res.status(404).send('User not found');
        }

        const playlists = await getSpotifyPlaylists(user.spotifyAccessToken, user.spotifyRefreshToken, user._id);
        res.status(200).json({ playlists, user });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).send('Error fetching playlists: ' + error.message);
    }
});

router.get('/saved-tracks/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log(`User not found: ${username}`);
            return res.status(404).send('User not found');
        }

        const savedTracks = await getSpotifySavedTracks(user.spotifyAccessToken, user.spotifyRefreshToken, user._id);
        res.status(200).json({ savedTracks });
    } catch (error) {
        console.error('Error fetching saved tracks:', error);
        res.status(500).send('Error fetching saved tracks: ' + error.message);
    }
});

module.exports = router;