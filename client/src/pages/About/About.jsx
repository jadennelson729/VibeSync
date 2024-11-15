import React from 'react'
import './About.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'


const About = () => {
  return (
    <div>
      <Navbar/>

      <div className='aboutWrapper'>
        <h1>About VibeSync</h1>
        <h2>Explore your music match track by track!</h2>
        <p>
        Compare your favorite music today! By connecting to your Spotify account and using our custom algorithm, our site allows you to see how similar your tastes are to anyone you know. 
        </p>
      </div>  

      <div className='aboutBackgroundImage'>
        <img src={require('../../assets/about_background.jpg')} alt=''/>
      </div>

      <div className = 'aboutGridContainer'>

        <div className = 'aboutColumn1'>
          <img src={require('../../assets/music_note.png')} alt=''/>
          <div className = 'text'>
            <p>Compare your favorite Spotify playlists, albums, songs, genres, and more!</p>
          </div>
        </div>

        <div className = 'aboutColumn2'>
          <div className = 'symbol'>
            <p>%</p>
          </div>
          <div className = 'text'>
            <p>Receive similarity scores based on your own and other's music tastes!</p>
          </div>
        </div>

        <div className = 'aboutColumn3'>
          <img src={require('../../assets/person.png')} alt=''/>
          <div className = 'text'>
            <p>Make an account, link your Spotify account, and begin comparing with your friends!</p>
          </div>
        </div>

      </div>
      
      <div className="aboutCircle1"></div>
      <div className="aboutCircle2"></div>

      <Footer/>
    </div>
  )
}

export default About
