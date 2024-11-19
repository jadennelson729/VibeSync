/**
 * This app performs Authorization Code oAuth2 flow to authenticate against the Spotify Accounts.
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 */

const express = require('express');
const app = express(); // Initialize express app
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db.js")
const vibeAuth = require('./routes/vibeAuth')
const User = require("./models/user");
const getUserPlaylists = require('./routes/getUserPlaylists');
const comparePlaylists = require('./routes/comparePlaylists');
const getUserTopItems = require('./routes/getUserTopItems');
require("dotenv").config();

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/vibeAuth', vibeAuth);
app.use('/getUserPlaylists', getUserPlaylists);
app.use('/comparePlaylists', comparePlaylists);
app.use('/getUserTopItems', getUserTopItems);

connectDB(); // Connect to MongoDB

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback';
const stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) { // Login route to initiate an authorization request
  const state = crypto.randomBytes(60).toString('hex').slice(0, 16);
  res.cookie(stateKey, state);

  const scope = 'user-top-read user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', async function(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            }
        };

        try {
            const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
            const { access_token, refresh_token } = response.data;

            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token }
            };

            const userProfile = await axios.get(options.url, { headers: options.headers });
            const body = userProfile.data;

            try {
                const user = await User.findOneAndUpdate(
                    { username: req.cookies.username },
                    {
                        spotifyId: body.id,
                        spotifyDisplayName: body.display_name,
                        email: body.email,
                        profileImage: body.images[0]?.url,
                        spotifyAccessToken: access_token,
                        spotifyRefreshToken: refresh_token
                    },
                    { upsert: true, new: true }
                );

                console.log('User saved:', user);
            } catch (error) {
                console.error('Error saving user:', error);
            }

            res.redirect('http://localhost:3000/comparisons#' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } catch (error) {
            res.redirect('http://localhost:3000/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    }
});

// Start the server
console.log('Listening on 8888');
app.listen(8888);