import React, { useEffect, useState} from 'react';
import './Navbar.css';
import {Link, useNavigate} from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import logo from '../../assets/VibeSync.png';
import menu_icon from '../../assets/menu-icon.png';

const Navbar = () => {

    const [sticky, setSticky] = useState(false);
    const navigate = useNavigate();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const username = localStorage.getItem('username');
            setIsLoggedIn(!!username);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                setSticky(true);
            } else {
                setSticky(false);
            }
        });

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('scroll', () => {});
        };
    }, []);

    const toggleMenu = ()=> {
        mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
    }

    const handleLogout = () => {
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        navigate('/home');
    };

    const handleStartComparing = () => {
        const username = localStorage.getItem('username');
        if (username) {
            navigate('/comparisons');
        } else {
            navigate('/login');
        }
    };

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
        <Link to="/home">
            <img src={logo} alt="Logo" className="logo" />
        </Link>
        <ul className={mobileMenu ? '' : 'hide-mobile-menu'}>
            <li onClick={() => navigate('/home')}> Home</li>
            <li onClick={handleStartComparing}> Compare </li>
            <li onClick={() => navigate('/about')}> About</li>
            {/* Special: Switches to home page then scrolls to the contact section */}
            <li>
                <ScrollLink to="contact" smooth={true} offset={-100} duration={500} onClick={() => navigate('/home')}>
                    Contact
                </ScrollLink>
            </li>
            <li>
                {isLoggedIn ? (
                    <button className="btn" onClick={handleLogout}>Log out</button>
                ) : (
                    <button className="btn" onClick={() => navigate('/login')}>Login/Signup</button>
                )}
            </li>
        </ul>
        <img src={menu_icon} alt="Menu Icon" className="menu_icon" onClick={toggleMenu}/>
    </nav>
  );
};

export default Navbar;
