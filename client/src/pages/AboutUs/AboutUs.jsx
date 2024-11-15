import React from 'react'
import './AboutUs.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const AboutUs = () => {
  return (
    <div>
      <Navbar/>

      <div className='aboutUsWrapper1'>
        <h1>About Us</h1>
      </div>
      
      <div className='aboutUsBackgroundImage'>
        <img src={require('../../assets/headphones_background.png')}/>
      </div>

      <div className='aboutUsWrapper2'>
        <div className='whoWeAre'>
          <h2>Who We Are</h2>
          <p>VibeSync is a project started by a team of four University of Florida students.</p>
        </div>
        <div className='ourMission'>
          <h2>Our Mission</h2>
          <p>We understand that life can be stressful. Music is an outlet for many to reduce this strain on one's life, and we aim to improve mental health for everyone. By providing an opportunity to compare music with others, we hope to 
            people find new artists that they will enjoy listening to. At the same time, we encourage people to compare their tastes with others as a way to strengthen social connections. That can be with friends, family, or even total strangers!
          </p>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default AboutUs
