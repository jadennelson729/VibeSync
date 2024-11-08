import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import './Footer.css'

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <div className='footer'>
        <p>© 2024 VibeSync. All rights reserved.</p>
        <ul>
            <li onClick={() => navigate('/aboutus')} >About Us</li>
            <li><Link to='contact' smooth={true} offset={-245} duration={500}>Contact</Link></li>
            <li>Privacy Policy</li>
        </ul>
    </div>
  )
}

export default Footer
