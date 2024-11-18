import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <div className='footer'>
        <p>© 2024 VibeSync. All rights reserved.</p>
        <ul>
            <li onClick={() => navigate('/about-us')} >About Us</li>
            <li onClick={() => navigate('/privacy-policy')}>Privacy Policy</li>
        </ul>
    </div>
  )
}

export default Footer
