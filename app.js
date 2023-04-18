const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: 'f305ea7c9bac4e06a36383190ed86422',
  clientSecret: '6d3cdd57b933401d848b02055e31b8c2',
  redirectUri: 'http://localhost:3000/callback'
});

const server = app.listen(3000, () => {
  console.log(`Server running on port ${server.address().port}`);
});

app.get('/', (req, res) => {
  // for authorizing user
  const authorizeURL = spotifyApi.createAuthorizeURL(['user-top-read']);
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  // gets token from code
  const { code } = req.query;
  const data = await spotifyApi.authorizationCodeGrant(code);
  const { access_token } = data.body;

  // sets token
  spotifyApi.setAccessToken(access_token);

  // returns top ten songs
  const topSongs = await spotifyApi.getMyTopTracks({ limit: 10 });
  const songNames = topSongs.body.items.map(song => song.name);
  res.send(`<h1>Your Top 10 Tracks:</h1><ul>${songNames.map(name => `<li>${name}</li>`).join('')}</ul>`);
});
