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
        return response.data.items.map(item => ({
            trackId: item.track.id,
            artistId: item.track.artists[0].id
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

        const artistIds1 = [...new Set(tracks1.map(track => track.artistId))];
        const artistIds2 = [...new Set(tracks2.map(track => track.artistId))];

        const genreCount1 = await getArtistGenres(currentUserData.spotifyAccessToken, artistIds1);
        const genreCount2 = await getArtistGenres(otherUserData.spotifyAccessToken, artistIds2);

        const combinedGenres = Object.keys(genreCount1).concat(Object.keys(genreCount2));
        
        // Calculate the number of top genres to consider as 1/4 of the total number of tracks in both playlists
        const totalTracks = tracks1.length + tracks2.length;
        const numTopGenres = Math.ceil(totalTracks / 4);

        const topGenres = [...new Set(combinedGenres)]
            .sort((a, b) => (genreCount1[b] || 0) + (genreCount2[b] || 0) - (genreCount1[a] || 0) - (genreCount2[a] || 0))
            .slice(0, numTopGenres);

        const genreSimilarity = calculateGenreSimilarity(genreCount1, genreCount2, topGenres);

        res.json({ similarity: genreSimilarity.toFixed(2) });
    } catch (error) {
        console.error('Error comparing playlists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
