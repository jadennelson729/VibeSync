import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
    return window.location.hash
        .substring(1)
        .split("&")
        .reduce((initial, item) => {
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
};

const Comparisons = () => {
    const [spotifyToken, setSpotifyToken] = useState('');
    const [nowPlaying, setNowPlaying] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = getTokenFromUrl().access_token;
        window.location.hash = '';
        if (token) {
            setSpotifyToken(token);
            spotifyApi.setAccessToken(token);
            setLoggedIn(true);
            getNowPlaying();
        }
    }, []);

    const getNowPlaying = () => {
        spotifyApi.getMyCurrentPlaybackState().then((response) => {
            if (response && response.item) {
                setNowPlaying({
                    name: response.item.name,
                    albumArt: response.item.album.images[0].url
                });
            } else {
                setNowPlaying({
                    name: 'No track currently playing',
                    albumArt: ''
                });
            }
        }).catch((error) => {
            console.error('No song playing!', error);
            alert('No song playing!');
        });
    };

    return (
        <div>
            {!loggedIn && <a href="http://localhost:8888">Login to Spotify</a>}
            {loggedIn && (
                <>
                    <div>Now Playing: {nowPlaying.name}</div>
                    <div>
                        <img src={nowPlaying.albumArt} style={{ height: 150 }} alt="Album Art" />
                    </div>
                    <button onClick={getNowPlaying}>Check Now Playing</button>
                </>
            )}
        </div>
    );
};

export default Comparisons;