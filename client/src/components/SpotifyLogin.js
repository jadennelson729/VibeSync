import React, { useEffect } from 'react';

const SpotifyLogin = () => {
    useEffect(() => {
        window.location.href = 'http://localhost:8888/login';
    }, []);

    return <div>Redirecting to Spotify...</div>;
};

export default SpotifyLogin;