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
            genre: item.track.artists[0].genres[0] || 'Unknown Genre'
        }));
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const newAccessToken = await refreshSpotifyToken(refreshToken);
            await User.findByIdAndUpdate(userId, { spotifyAccessToken: newAccessToken });
            return getSpotifyPlaylistTracks(newAccessToken, refreshToken, userId, playlistId);
        } else {
            throw new Error('Error fetching Spotify playlists: ' + error.message);
        }
    }
};

const calculateGenreSimilarity = (genreCount1, genreCount2, topGenres) => {
    const totalTracks1 = Object.values(genreCount1).reduce((a, b) => a + b, 0);
    const totalTracks2 = Object.values(genreCount2).reduce((a, b) => a + b, 0);

    let similaritySum = 0;

    // Ensure topGenres is an array before calling forEach
    if (Array.isArray(topGenres)) {
        topGenres.forEach(genre => {
            const percentage1 = (genreCount1[genre] || 0) / totalTracks1;
            const percentage2 = (genreCount2[genre] || 0) / totalTracks2;
            const genreDifference = Math.abs(percentage1 - percentage2);
            similaritySum += (1 - genreDifference);  // Calculate similarity based on the absolute difference
        });
    } else {
        console.error('topGenres is not an array:', topGenres);
        return 0;  // Handle invalid topGenres as needed
    }

    // Return the average similarity for all genres
    return (similaritySum / topGenres.length) * 100;
};

const calculateGenrePercentages = (tracks) => {
    const genreKeywords = {
        pop: ['pop'],
        rap: ['rap'],
        rock: ['rock'],
        latino: ['latino'],
        'hip hop': ['hip hop'],
        house: ['house'],
        rnb: ['r&b'],
        jazz: ['jazz'],
        motown: ['motown'],
        country: ['country']
    };

    const genreCounts = Object.keys(genreKeywords).reduce((acc, genre) => {
        acc[genre] = 0;
        return acc;
    }, {});

    tracks.forEach(track => {
        const genre = track.genre.toLowerCase();
        Object.keys(genreKeywords).forEach(genreKey => {
            if (genreKeywords[genreKey].some(keyword => genre.includes(keyword))) {
                genreCounts[genreKey]++;
            }
        });
    });

    return genreCounts;
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

        const genreCounts1 = calculateGenrePercentages(tracks1);
        const genreCounts2 = calculateGenrePercentages(tracks2);
        const topGenres = ['pop', 'rap', 'rock', 'latino', 'hip hop', 'house', 'rnb', 'jazz', 'motown', 'country'];

        // Calculate the genre similarity as 100% of the final similarity score
        const genreSimilarity = calculateGenreSimilarity(genreCounts1, genreCounts2, topGenres);

        res.json({ similarity: genreSimilarity.toFixed(2) });
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

        const [tracks1Response, tracks2Response] = await Promise.all([
            axios.get(`http://localhost:8888/getUserPlaylists/saved-tracks/${user1}`),
            axios.get(`http://localhost:8888/getUserPlaylists/saved-tracks/${user2}`)
        ]);
        const tracks1 = tracks1Response.data.savedTracks;
        const tracks2 = tracks2Response.data.savedTracks;

        console.log('Tracks1:', tracks1);
        console.log('Tracks2:', tracks2);

        if (!Array.isArray(tracks1) || !Array.isArray(tracks2)) {
            throw new Error('Invalid tracks data received');
        }

        const genreCounts1 = calculateGenrePercentages(tracks1);
        const genreCounts2 = calculateGenrePercentages(tracks2);
        const topGenres = ['pop', 'rap', 'rock', 'latino', 'hip hop', 'house', 'rnb', 'jazz', 'motown', 'country'];

        const genreSimilarity = calculateGenreSimilarity(genreCounts1, genreCounts2, topGenres);

        res.json({ similarity: genreSimilarity.toFixed(2) });
    } catch (error) {
        console.error('Error comparing saved tracks:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
