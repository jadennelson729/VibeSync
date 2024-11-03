import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currentPlaylist = params.get('currentPlaylist');
    const otherPlaylist = params.get('otherPlaylist');
    const currentUser = params.get('currentUser');
    const otherUser = params.get('otherUser');
    const [similarity, setSimilarity] = useState(null);

    useEffect(() => {
        const fetchSimilarity = async () => {
            try {
                const response = await axios.get(`http://localhost:8888/comparePlaylists?playlist1=${currentPlaylist}&playlist2=${otherPlaylist}&currentUser=${currentUser}&otherUser=${otherUser}`);
                setSimilarity(response.data.similarity);
            } catch (error) {
                console.error('Error fetching similarity:', error);
            }
        };

        if (currentPlaylist && otherPlaylist && currentUser && otherUser) {
            fetchSimilarity();
        }
    }, [currentPlaylist, otherPlaylist, currentUser, otherUser]);

    return (
        <div>
            <h2>Comparison Results</h2>
            <p>Current Playlist ID: {currentPlaylist}</p>
            <p>Other Playlist ID: {otherPlaylist}</p>
            <p>Similarity: ${similarity}%</p>
        </div>
    );
};

export default Results;