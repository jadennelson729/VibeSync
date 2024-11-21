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

const getSpotifyPlaylistTracks = async (accessToken, refreshToken, userId, playlistId) => {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return response.data.items.map(item => ({
            name: item.track.name,
            id: item.track.id,
            artist: item.track.artists[0].name,
            genre: item.track.artists[0].genres[0]
        }));
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

function calculateSimilarity(tracks1, tracks2) { // Temporary function that calculates track similarity
    const set1 = new Set(tracks1.map(t => t.id));
    const set2 = new Set(tracks2.map(t => t.id));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return (intersection.size / union.size) * 100;
}

//// TODO:: Fix and implement Genre similarity calculation
const getArtistGenres = async (accessToken, artistIds) => {
    try {
        const artistData = await axios.get(`https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return artistData.data.artists.reduce((acc, artist) => {
            artist.genres.forEach(genre => {
                acc[genre] = (acc[genre] || 0) + 1;
            });
            return acc;
        }, {});
    } catch (error) {
        throw new Error('Error fetching artist genres: ' + error.message);
    }
};

//// TODO:: Fix and implement Genre similarity calculation
const calculateGenreSimilarity = (genreCount1, genreCount2, topGenres) => {
    const totalTracks1 = Object.values(genreCount1).reduce((a, b) => a + b, 0);
    const totalTracks2 = Object.values(genreCount2).reduce((a, b) => a + b, 0);

    let similaritySum = 0;

    topGenres.forEach(genre => {
        const percentage1 = (genreCount1[genre] || 0) / totalTracks1;
        const percentage2 = (genreCount2[genre] || 0) / totalTracks2;
        const genreDifference = Math.abs(percentage1 - percentage2);
        similaritySum += (1 - genreDifference);
    });

    return (similaritySum / topGenres.length) * 100;
};

router.get('/', async (req, res) => {
    const { playlist1, playlist2, user1, user2 } = req.query;

    try {
        const user1Data = await User.findOne({ username: user1 });
        const user2Data = await User.findOne({ username: user2 });

        if (!user1Data || !user2Data) {
            return res.status(404).json({ error: 'One or both users not found' });
        }

        const [tracks1, tracks2] = await Promise.all([
            getSpotifyPlaylistTracks(user1Data.spotifyAccessToken, user1Data.spotifyRefreshToken, user1Data._id, playlist1),
            getSpotifyPlaylistTracks(user2Data.spotifyAccessToken, user2Data.spotifyRefreshToken, user2Data._id, playlist2)
        ]);

        const similarity = calculateSimilarity(tracks1, tracks2);

        res.json({ similarity: similarity.toFixed(2) });
    } catch (error) {
        console.error('Error comparing playlists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/saved-tracks', async (req, res) => {
    const { user1, user2 } = req.query;

    try {
        const user1Data = await User.findOne({ username: user1 });
        const user2Data = await User.findOne({ username: user2 });

        if (!user1Data || !user2Data) {
            return res.status(404).json({ error: 'One or both users not found' });
        }

        const [tracks1, tracks2] = await Promise.all([
            axios.get(`http://localhost:8888/getUserPlaylists/saved-tracks/${user1}`),
            axios.get(`http://localhost:8888/getUserPlaylists/saved-tracks/${user2}`)
        ]);

        const similarity = calculateSimilarity(tracks1, tracks2);

        res.json({ similarity: similarity.toFixed(2) });
    } catch (error) {
        console.error('Error comparing saved tracks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
