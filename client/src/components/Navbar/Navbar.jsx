import React, { useEffect, useState} from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import logo from '../../assets/VibeSync.png';
import menu_icon from '../../assets/menu-icon.png';

const Navbar = () => {

    const [sticky, setSticky] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        window.addEventListener('scroll', () =>{
          if (window.scrollY > 50) {
            setSticky(true);
          } else {
            setSticky(false);
          }
        })
    },[])

    const [mobileMenu, setMobileMenu] = useState(false);
    const toggleMenu = ()=> {
        mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
    }

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
        <img src={logo} alt="Logo" className="logo" />
        <ul className={mobileMenu ? '' : 'hide-mobile-menu'}>
            <li onClick={() => navigate('/home')} > Home </li>
            <li onClick={() => navigate('/comparisons')}> Compare </li>
            <li onClick={() => navigate('/about')}> About </li>
            {/* Special: Switches to home page then scrolls to the contact section */}
            <li>
                <ScrollLink to="contact" smooth={true} offset={-100} duration={500} onClick={() => navigate('/home')}>
                    Contact
                </ScrollLink>
            </li>
            <li>
                <button className="btn" onClick={() => navigate('/login')}>Login/Signup</button>
            </li>
        </ul>
        <img src={menu_icon} alt="Menu Icon" className="menu_icon" onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
