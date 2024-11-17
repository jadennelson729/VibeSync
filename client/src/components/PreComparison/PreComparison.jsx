import React from 'react'
import { useNavigate } from 'react-router-dom';
import './PreComparison.css'
import dark_arrow from '../../assets/dark-arrow.png'

const PreComparison = () => {
  const navigate = useNavigate();

  return (
    <div className='precomp container'>
      <div className="precomp-text">
        <h1> Enter the VibeSync username of the person you want to compare with: </h1>
        {/* Need to add validation here that checks whether the username entered is a valid username in the database*/}
        <input className='compInputBox' type="text" name='name' placeholder='Username' required/>
        <button className='btn' onClick={() => navigate('/results')} > Compare <img src={dark_arrow} alt="" /></button> 
      </div>
    </div>
  )
}

export default PreComparison
