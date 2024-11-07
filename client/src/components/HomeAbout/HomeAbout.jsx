import React from 'react'
import './HomeAbout.css'
import aboutImage from '../../assets/about_image.png'

const HomeAbout = () => {
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
      <button className='altbtn'> How it Works </button> 
      </div>
    </div>
  )
}

export default HomeAbout
