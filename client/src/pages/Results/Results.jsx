import React from 'react'
import './Results.css';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import PostComparison from '../../components/PostComparison/PostComparison'

const Results = () => {
  return (
    <div className='postcompPage'>
        <Navbar/>
        <PostComparison/>
        <div className="aboutCircle1"></div>
        <div className="aboutCircle2"></div>
        <Footer/>
    </div>
  )
}

export default Results;

/* Here's your old code @Trevor, most of the logic is implemented in PostComparison
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
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
            <p>Similarity: {similarity}%</p>
        </div>
    );
};

export default Results;
*/