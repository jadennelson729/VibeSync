import React from 'react'
import { useNavigate } from 'react-router-dom';
import './HomeAbout.css'
import aboutImage from '../../assets/about_image.png'

const HomeAbout = () => {
  const navigate = useNavigate();

  return (
    <div className='HomeAbout'>
      <div className='aboutImage'>
        <img src={aboutImage} alt="" />
      </div>
      <div className='about-right'>
      <h3> ABOUT </h3>
      <h2> Explore your music match track by track! </h2>
      <p> Track, artist, and genre comparisons made easy with our custom algorithm. 
      Discover personalized insights and connect with your friends by comparing musical preferences effortlessly.
      </p>
      <button className='altbtn' onClick={() => navigate('/about')} > How It Works </button> 
      </div>
    </div>
  )
}

export default HomeAbout
