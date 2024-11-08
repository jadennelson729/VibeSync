import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import HomeAbout from '../../components/HomeAbout/HomeAbout'
import HomeAboutUs from '../../components/HomeAboutUs/HomeAboutUs'
import HomeContact from '../../components/HomeContact/HomeContact'
import Title from '../../components/Title/Title'
import HomeActualContact from '../../components/HomeActualContact/HomeActualContact'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <HomeAbout/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginLeft: '40px' }}>
        <HomeAboutUs/> 
        <HomeContact/>
      </div>
      <Title subTitle='Contact Us' title='Get in Touch'/>
      <HomeActualContact/>
      <Footer/>
    </div>
  )
}

export default Home
