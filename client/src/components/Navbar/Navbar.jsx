import React, { useEffect, useState} from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import logo from '../../assets/VibeSync.png'
import menu_icon from '../../assets/menu-icon.png'

const Navbar = () => {

    const [sticky, setSticky] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
      window.addEventListener('scroll', () =>{
        window.scrollY > 50 ? setSticky(true) : setSticky(false);
      })
    },[])

    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMenu = ()=>{
        mobileMenu? setMobileMenu(false) : setMobileMenu(true);
    }

  return (
    /* condition that checks whether or not the user has scrolled, if so make opaque */
    <nav className={`container ${sticky? 'dark-nav' : ''}`}>
      <img src= {logo} alt="" className='logo' />
      <ul className={mobileMenu?'':'hide-mobile-menu'}>
        <li onClick={() => navigate('/Home')} > Home </li>
        <li onClick={() => navigate('/comparisons')}> Compare </li>
        <li onClick={() => navigate('/about')}> About </li>
        <li> <Link to='contact' smooth={true} offset={-245} duration={500}>Contact</Link></li>
        <li><button className='btn' onClick={() => navigate('/login')}>Login/Signup</button> </li>
      </ul>
      <img src={menu_icon} alt="" className='menu_icon' onClick={toggleMenu}/>
    </nav>
  )
}

export default Navbar
