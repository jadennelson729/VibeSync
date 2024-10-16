import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react"
import SpotifyWebApi from "spotify-web-api-js";
import Login from './pages/Login/Login';

const  spotifyApi = new SpotifyWebApi(); 

// gets token from the URL, gotten from https://www.youtube.com/watch?v=bhkg2godRDc, ~14:00
const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // runs whenever the page is loaded
  useEffect(() => {
    console.log("This is what we derived from the URL: ", getTokenFromUrl())
    const spotifyToken = getTokenFromUrl().access_token
    window.location.hash = "";
    console.log("This is our spotify token", spotifyToken);

    if (spotifyToken) {
      setSpotifyToken(spotifyToken)
      // use Spotify API
      spotifyApi.setAccessToken(spotifyToken)
      spotifyApi.getMe().then((user) => {
        console.log(user)
      })
      setLoggedIn(true)
    }
  }, [])
  
  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      console.log(response);
      if (response && response.item) {
        setNowPlaying({
          name: response.item.name,
          albumArt: response.item.album.images[0].url
        });
      }
      else {
      console.log("No track is currently playing.");
      setNowPlaying({
        name: "No track currently playing",
        albumArt: ""
      });
      }
    })
    .catch((error) => {
      // Catch if the user has no song at all playing
      console.error("No song playing!");
      alert(`No song playing!`);
    });
  }

  return (
    <div className="App">
      
      {!loggedIn && <a href="http://localhost:8888"> Login to Spotify</a>}
      {loggedIn && (
        <>
          <div> Now Playing: {nowPlaying.name} </div>
          <div> 
            <img src = {nowPlaying.albumArt} style = {{height: 150}}/>
          </div>
        </>
      )}
    {loggedIn && (
      <button onClick = {() => getNowPlaying()}> Check Now Playing </button>
    )}

    {
    // Shows Login page
    }
    <Login />

    </div>
  );
}

export default App;
