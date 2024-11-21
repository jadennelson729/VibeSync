import React from 'react';
import './Comparisons.css';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import PreComparison from '../../components/PreComparison/PreComparison';

const Comparisons = () => {

  return (
    <div className='precompPage'>
        <Navbar/>    
        <PreComparison/>
        <div className="aboutCircle1"></div>
        <div className="aboutCircle2"></div>  
        <Footer/>

    </div>
  )
}

export default Comparisons

/* here is your old code @Trevor, most of the logic is implemented in PreComparison */
/* 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import './Comparisons.css';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

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

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const Comparisons = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [currentUserPlaylists, setCurrentUserPlaylists] = useState([]);
    const [otherUserInfo, setOtherUserInfo] = useState(null);
    const [otherUserPlaylists, setOtherUserPlaylists] = useState([]);
    const [currentPlaylistImage, setCurrentPlaylistImage] = useState('');
    const [otherPlaylistImage, setOtherPlaylistImage] = useState('');
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [otherPlaylist, setOtherPlaylist] = useState('');

    useEffect(() => {
        const token = getTokenFromUrl().access_token || localStorage.getItem('access_token');
        window.location.hash = '';
        if (token) {
            spotifyApi.setAccessToken(token);
            setLoggedIn(true);
            fetchCurrentUserInfo();
        }
    }, []);

    const fetchCurrentUserInfo = async () => {
        try {
            const vibesyncUsername = getCookie('username');
            if (!vibesyncUsername) {
                throw new Error('VibeSync username not found in cookies');
            }
            const vibesyncUser = await axios.get(`http://localhost:8888/getUserPlaylists/playlists/${vibesyncUsername}`);
            setCurrentUserInfo(vibesyncUser.data.user);
            await fetchCurrentUserPlaylists(vibesyncUser.data.user.spotifyId);
        } catch (error) {
            console.error('Error fetching current user info:', error);
        }
    };

    const fetchCurrentUserPlaylists = async (spotifyId) => {
        try {
            const response = await spotifyApi.getUserPlaylists(spotifyId);
            setCurrentUserPlaylists(response.items);
        } catch (error) {
            console.error('Error fetching current user playlists:', error);
        }
    };

    const fetchOtherUserPlaylists = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8888/getUserPlaylists/playlists/${username}`);
            setOtherUserPlaylists(response.data.playlists);
            setOtherUserInfo(response.data.user);
        } catch (error) {
            console.error('Error fetching other user playlists:', error);
            alert('Error fetching playlists');
        }
    };

    const fetchPlaylistImage = async (playlistId, setImage) => {
        try {
            const response = await spotifyApi.getPlaylistCoverImage(playlistId);
            setImage(response[0]?.url || '');
        } catch (error) {
            console.error('Error fetching playlist image:', error);
        }
    };

    const handleCurrentPlaylistChange = (event) => {
        const selectedPlaylistId = event.target.value;
        setCurrentPlaylist(selectedPlaylistId);
        fetchPlaylistImage(selectedPlaylistId, setCurrentPlaylistImage);
    };

    const handleOtherPlaylistChange = (event) => {
        const selectedPlaylistId = event.target.value;
        setOtherPlaylist(selectedPlaylistId);
        fetchPlaylistImage(selectedPlaylistId, setOtherPlaylistImage);
    };

    const handleCompare = async () => {
        if (!currentPlaylist || !otherPlaylist) {
            alert('Two playlists must be selected');
            return;
        }

        try {
            const vibesyncUsername = getCookie('username');
            window.location.href = `http://localhost:3000/results?currentPlaylist=${currentPlaylist}&otherPlaylist=${otherPlaylist}&currentUser=${vibesyncUsername}&otherUser=${otherUserInfo.username}`;
        } catch (error) {
            alert('Error navigating to results page');
        }
    };

    return ( 
    <div>      
            <div className="ComparisonLogic" style={{ display: 'flex', justifyContent: 'space-between' }}>
                {loggedIn && (
                    <div style={{ width: '45%' }}>
                        <h3>Current User</h3>
                        {currentUserInfo && (
                            <div>
                                <p>Username: {currentUserInfo.username}</p>
                                <p>Spotify Display Name: {currentUserInfo.spotifyDisplayName}</p>
                            </div>
                        )}
                        <div>
                            <h4>Your Playlists:</h4>
                            <div>
                                <select onChange={handleCurrentPlaylistChange}>
                                    {currentUserPlaylists.map(playlist => (
                                        <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                                    ))}
                                </select>
                                {currentPlaylistImage && <img src={currentPlaylistImage} alt="Playlist" style={{ height: 150, margin: '20px 0 0 0' }} />}
                            </div>
                        </div>
                    </div>
                )}
                <div style={{ width: '45%' }}>
                    <h3>Other User</h3>
                    <div>
                        <input type="text" placeholder="VibeSync Username" id="vibesyncUsername" />
                        <button onClick={() => fetchOtherUserPlaylists(document.getElementById('vibesyncUsername').value)}>Get Playlists</button>
                    </div>
                    {otherUserInfo && (
                        <div>
                            <p>Username: {otherUserInfo.username}</p>
                            <p>Spotify Display Name: {otherUserInfo.spotifyDisplayName}</p>
                        </div>
                    )}
                    <div>
                        <h4>Other User's Playlists:</h4>
                        <div>
                            <select onChange={handleOtherPlaylistChange}>
                                {otherUserPlaylists.map(playlist => (
                                    <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                                ))}
                            </select>
                            {otherPlaylistImage && <img src={otherPlaylistImage} alt="Playlist" style={{ height: 150, margin: '20px 0 0 0' }} />}
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={handleCompare}>Compare Playlists</button>
                </div>
            </div>                      
    </div>
    );
};

export default Comparisons;
*/