import React from 'react'
import { useNavigate } from 'react-router-dom';
import './HomeAboutUs.css'

const HomeAboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className='HomeAboutUs'> 
        <h3> ABOUT US </h3>
        <h2> Want to know more about the team? </h2>
        <p> Learn more about the minds behind VibeSync and how it started!
        </p>
        <button className='altbtn' onClick={() => navigate('/aboutus')} > Learn More </button> 
    </div>
  )
}

export default HomeAboutUs
