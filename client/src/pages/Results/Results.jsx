import React, { useEffect, useState } from 'react'
import './Results.css';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import PostComparison from '../../components/PostComparison/PostComparison'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
    const [currentUserTopSongs, setCurrentUserTopSongs] = useState([]);
    const [otherUserTopSongs, setOtherUserTopSongs] = useState([]);
    const [otherUsername, setOtherUsername] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const params = new URLSearchParams(location.search);
            const currentUser = params.get('currentUser');
            const otherUser = params.get('otherUser');
            setOtherUsername(otherUser);

            try {
                const currentUserResponse = await axios.get(`http://localhost:8888/getUserTopItems/top-songs/${currentUser}`);
                const otherUserResponse = await axios.get(`http://localhost:8888/getUserTopItems/top-songs/${otherUser}`);

                console.log('Current User Top Songs:', currentUserResponse.data.topSongs);
                console.log('Other User Top Songs:', otherUserResponse.data.topSongs);

                setCurrentUserTopSongs(currentUserResponse.data.topSongs);
                setOtherUserTopSongs(otherUserResponse.data.topSongs);
            } catch (error) {
                console.error('Error fetching top songs:', error);
            }
        };

        fetchData();
    }, [location]);

    return (
        <div className='postcompPage'>
            <Navbar/>
            <PostComparison
                otherUsername={otherUsername}
                currentUserTopSongs={currentUserTopSongs}
                otherUserTopSongs={otherUserTopSongs}
            />
            <div className="aboutCircle1"></div>
            <div className="aboutCircle2"></div>
            <Footer/>
        </div>
    )
}

export default Results