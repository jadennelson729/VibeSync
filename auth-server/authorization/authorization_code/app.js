/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 */

require("dotenv").config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db.js")
const User = require('./models/user.js');

const app = express(); // Initialize Express app

app.use(express.static(__dirname + '/public')) // Middleware setup
    .use(cors())
    .use(cookieParser());

connectDB(); // Connect to MongoDB

const client_id = '6c78d46c29404727951858ead2209bc3'; // Your clientId
const client_secret = '18c68a89e35e4765945c5fb761831a50'; // Your client secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect URI

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

const stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  // added a few authorizations here that have to do with getting the user's playlists. Here is the documentation: https://developer.spotify.com/documentation/web-api/concepts/scopes
  const scope = 'user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public';
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

      const userResponse = await axios.get(options.url, { headers: options.headers });
      const body = userResponse.data;

      // Save or update user in MongoDB
      try {
        const user = await User.findOneAndUpdate(
            { spotifyId: body.id },
            {
              displayName: body.display_name,
              email: body.email,
              profileImage: body.images[0]?.url,
            },
            { upsert: true, new: true }
        );

        console.log('User saved:', user);
      } catch (error) {
        console.error('Error saving user:', error);
      }

      // we can also pass the token to the browser to make requests from there
      res.redirect('http://localhost:3000/#' +
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

app.get('/refresh_token', function(req, res) {

  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token,
          refresh_token = body.refresh_token;
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);