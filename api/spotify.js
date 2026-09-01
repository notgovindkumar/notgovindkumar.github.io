/*
  Vercel serverless endpoint for the Soundtrack panel.
  Required Vercel environment variables:
  SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
*/

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/me/player';

function sendJson(response, status, body) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  return response.status(status).json(body);
}

function formatTrack(track, options) {
  const artists = (track.artists || []).map(function (artist) { return artist.name; }).join(', ');
  const images = track.album && track.album.images ? track.album.images : [];
  const image = images.find(function (item) { return item.width >= 300; }) || images[0];

  return {
    title: track.name,
    artist: artists || 'Unknown artist',
    artworkUrl: image ? image.url : '',
    status: options.isPlaying ? 'Playing now' : 'Last played track',
    isPlaying: Boolean(options.isPlaying),
    source: options.isPlaying ? 'currently-playing' : 'recently-played'
  };
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Spotify environment variables are not configured.');
  }

  const basicAuth = Buffer.from(clientId + ':' + clientSecret).toString('base64');
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + basicAuth,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) throw new Error('Spotify token refresh failed.');
  const data = await response.json();
  return data.access_token;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Method not allowed.' });
  }

  try {
    const accessToken = await getAccessToken();
    const headers = { Authorization: 'Bearer ' + accessToken };
    const currentResponse = await fetch(SPOTIFY_API_URL + '/currently-playing', { headers: headers });

    if (currentResponse.status === 200) {
      const current = await currentResponse.json();
      if (current && current.item && current.item.type === 'track') {
        return sendJson(response, 200, formatTrack(current.item, { isPlaying: current.is_playing }));
      }
    }

    // Spotify returns 204 when nothing is playing, so fall back to the last track.
    const recentResponse = await fetch(SPOTIFY_API_URL + '/recently-played?limit=1', { headers: headers });
    if (!recentResponse.ok) throw new Error('Spotify playback request failed.');
    const recent = await recentResponse.json();
    const lastPlayed = recent.items && recent.items[0] && recent.items[0].track;

    if (!lastPlayed) {
      return sendJson(response, 200, { status: 'No recent Spotify playback found.', source: 'empty' });
    }

    return sendJson(response, 200, formatTrack(lastPlayed, { isPlaying: false }));
  } catch (error) {
    console.error('Spotify endpoint error:', error.message);
    return sendJson(response, 500, { error: 'Spotify playback is unavailable right now.' });
  }
};
