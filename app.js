const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// Set up a new Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: 'f305ea7c9bac4e06a36383190ed86422',
  clientSecret: '6d3cdd57b933401d848b02055e31b8c2',
  redirectUri: 'http://localhost:3000/callback'
});

// Set up a simple HTTP server
const server = app.listen(3000, () => {
  console.log(`Server running on port ${server.address().port}`);
});

// Handle requests to the home page
app.get('/', (req, res) => {
  // Redirect the user to the Spotify authorization page
  const authorizeURL = spotifyApi.createAuthorizeURL(['user-top-read']);
  res.redirect(authorizeURL);
});

// Handle requests to the Spotify callback page
app.get('/callback', async (req, res) => {
  // Exchange the authorization code for an access token
  const { code } = req.query;
  const data = await spotifyApi.authorizationCodeGrant(code);
  const { access_token } = data.body;

  // Set the access token on the Spotify API client
  spotifyApi.setAccessToken(access_token);

  // Get the user's top 10 tracks and render them in the browser
  const topTracks = await spotifyApi.getMyTopTracks({ limit: 10 });
  const trackNames = topTracks.body.items.map(track => track.name);
  res.send(`<h1>Your Top 10 Tracks:</h1><ul>${trackNames.map(name => `<li>${name}</li>`).join('')}</ul>`);
});
