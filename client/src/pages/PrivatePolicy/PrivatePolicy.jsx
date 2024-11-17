import React from 'react'
import './PrivatePolicy.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const PrivatePolicy = () => {
  return (
    <div>
      <Navbar/>

      <div className='privatePolicyWrapper1'>
        <h1>Privacy Policy</h1>
      </div>

      <div className='privatePolicyWrapper2'>
        <h2>1. Data We Collect</h2>

        <h3>1.1 Data You Provide To Us</h3>
        <p>To create an account, you must provide us with data including your username and password. To use our service, you are also required to 
          link your Spotify account which includes providing us with data such as your Spotify username, email, and display name.
        </p>

        <h3>1.2 Cookies</h3>
        <p>We use cookies to recognize you and your device when you login. This is a means of operating our service. We do not use cookies to track
          your behavior on other sites or to provide targeted ads.
        </p>

        <h2>2. How We Use Your Data</h2>
        
        <h3>2.1 Operate Our Service</h3>
        <p>We use the information you provide us to operate our service. This includes authorizing your account and accessing details about your Spotify
          playlists so that you can compare them with your friends, family, coworkers, and others.
        </p>
      </div>

      <Footer/>
    </div>
  )
}

export default PrivatePolicy