import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Hero.css'
import dark_arrow from '../../assets/dark-arrow.png'

const Hero = () => {
  const navigate = useNavigate();

    const handleStartComparing = () => {
        const username = localStorage.getItem('username');
        if (username) {
            navigate('/comparisons');
        } else {
            navigate('/login');
        }
    };

  return (
    <div className='hero container'>
      <div className="hero-text">
        <h1> Compare music with your friends! </h1>
        <p> Discover your music match—compare Spotify 
            playlists and see who's in tune with you! </p>
          <button className='btn' onClick={handleStartComparing}> Start Comparing <img src={dark_arrow} alt=""/></button>
      </div>
    </div>
  )
}

export default Hero
