import React from 'react'
import { useNavigate } from 'react-router-dom';
import './PostComparison.css'
import { useSpring, animated } from 'react-spring'

const AnimatedPercentage = ({ value }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.span>{number.to((n) => n.toFixed(0))}</animated.span>;
};

const PostComparison = ({ otherUsername, currentUserTopSongs, otherUserTopSongs, similarityPercentage }) => {
  const navigate = useNavigate();

  return (
      <div className='postcomp container'>
        <div className="postcomp-text">
          <h1> Here are your comparison results: </h1>
          <h2> Your music taste is </h2>
          <h1 className='percentage'>
            <AnimatedPercentage value={parseFloat(similarityPercentage)} />
          </h1>
          <h2 className='bottomtext'> similar to {otherUsername}! </h2>
          <div className='postcomp-buttons'>
            <button className='btn' onClick={() => navigate('/comparisons')}> Compare Again</button>
            <button className='altbtn' onClick={() => navigate('/home')}> Back to Home</button>
          </div>
          <h3> Other stats: </h3>
          <div className="rectangle-container">
            <div className="rectangle rectangle-green">
              <p className="main-text">Top 5 Songs (You)</p>
              {currentUserTopSongs.map((song, index) => (
                  <React.Fragment key={index}>
                    <p className="small-text">{index + 1}. {song.name}</p>
                    <p className="smaller-text">{song.artist}</p>
                  </React.Fragment>
              ))}
            </div>
            <div className="rectangle rectangle-purple">
              <p className="main-text">Top 5 Songs ({otherUsername})</p>
              {otherUserTopSongs.map((song, index) => (
                  <React.Fragment key={index}>
                    <p className="small-text">{index + 1}. {song.name}</p>
                    <p className="smaller-text">{song.artist}</p>
                  </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default PostComparison