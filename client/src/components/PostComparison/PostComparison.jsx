import React from 'react'
import { useNavigate } from 'react-router-dom';
import './PostComparison.css'

const PostComparison = () => {
  const navigate = useNavigate();

  return (
    <div className='postcomp container'>
      <div className="postcomp-text">
        <h1> Here are your comparison results: </h1>
        {/* Below replace 67% with your percent and Bob with the users username*/}
        <h2> Your music taste is </h2>
        <h1 className='percentage'> 67% </h1>
        <h2 className='bottomtext'> similar to Bob! </h2>
        <div className='postcomp-buttons'>
          <button className='btn' onClick={() => navigate('/comparisons')}> Compare Again </button> 
          <button className='altbtn' onClick={() => navigate('/home')}> Back to Home </button> 
        </div>
        <h3> Other stats: </h3>
        <div className="rectangle-container">
          <div className="rectangle rectangle-green">
            <p className="main-text">Top 5 Songs (You)</p>
            <p className="small-text"> 1. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 2. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 3. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 4. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 5. Song Name</p>
            <p className="smaller-text"> Artist </p>
          </div>
          <div className="rectangle rectangle-purple">
            {/* Replace Bob here with the username*/}
            <p className="main-text">Top 5 Songs (Bob)</p>
            <p className="small-text"> 1. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 2. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 3. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 4. Song Name</p>
            <p className="smaller-text"> Artist </p>
            <p className="small-text"> 5. Song Name</p>
            <p className="smaller-text"> Artist </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostComparison