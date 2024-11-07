import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/VibeSync.png'

const Navbar = () => {

    const [sticky, setSticky] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
      window.addEventListener('scroll', () =>{
        window.scrollY > 50 ? setSticky(true) : setSticky(false);
      })
    },[])

  return (
    /* condition that checks whether or not the user has scrolled, if so make opaque */
    <nav className={`container ${sticky? 'dark-nav' : ''}`}>
      <img src= {logo} alt="" className='logo' />
      <ul>
        <li> Home </li>
        <li> Compare </li>
        <li> About </li>
        <li> Contact </li>
        <li><button className='btn' onClick={() => navigate('/login')}>Login/Signup</button> </li>
      </ul>
    </nav>
  )
}

export default Navbar
