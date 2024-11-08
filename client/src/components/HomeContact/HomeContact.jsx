import React from 'react'
import './HomeContact.css'
import { Link } from 'react-scroll';

const HomeContact = () => {
  return (
    <div className='HomeContact'>
        <h3> CONTACT </h3>
        <h2> Have any questions? Reach out to us! </h2>
        <p> Contact us to ask questions or to give suggestions!
        </p>
        <button className='altbtn'> <Link to='contact' smooth={true} offset={-245} duration={500}>Contact Us</Link></button> 
    </div>
  )
}

export default HomeContact
