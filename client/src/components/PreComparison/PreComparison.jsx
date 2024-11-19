import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PreComparison.css'
import dark_arrow from '../../assets/dark-arrow.png'

const PreComparison = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [otherUsername, setOtherUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            fetchUserProfile(storedUsername);
        }
    }, []);

    const fetchUserProfile = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8888/getUserPlaylists/playlists/${username}`);
            if (response.data.user && response.data.user.profileImage) {
                setProfileImage(response.data.user.profileImage);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleCompare = async () => {
        if (!otherUsername) {
            setError('Please enter a username');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8888/getUserPlaylists/playlists/${otherUsername}`);
            if (response.data.user) {
                navigate(`/results?currentUser=${username}&otherUser=${otherUsername}`);
            }
        } catch (error) {
            console.error('Error fetching other user:', error);
            setError('User does not exist');
        }
    };

    return (
        <div className='precomp container'>
            <div className="precomp-text">
                <h1>Hello, {username}</h1>
                {profileImage && (
                    <img
                        src={profileImage}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%', marginTop: '10px', marginBottom: '50px' }}
                    />
                )}
                <div className="comparison-input">
                    <h2>Enter the VibeSync username of the person you want to compare with:</h2>
                    <input
                        className='compInputBox'
                        type="text"
                        value={otherUsername}
                        onChange={(e) => setOtherUsername(e.target.value)}
                        placeholder='Username'
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button className='btn' onClick={handleCompare}>
                        Compare <img src={dark_arrow} alt="" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PreComparison