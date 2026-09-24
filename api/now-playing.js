/**
 * GET /api/now-playing
 *
 * Returns your real, live Spotify "currently playing" track,
 * falling back to your most recently played track if nothing
 * is playing right now.
 *
 * Requires these environment variables to be set in your
 * Vercel project (Settings → Environment Variables):
 *
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 *   SPOTIFY_REFRESH_TOKEN
 *
 * See SPOTIFY_SETUP.md for how to get these.
 */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

function shapeNowPlaying(track, isPlaying, progressMs) {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    albumArt: track.album.images?.[0]?.url || '',
    songUrl: track.external_urls?.spotify || 'https://open.spotify.com',
    progressMs: progressMs || 0,
    durationMs: track.duration_ms || 0,
  };
}

export default async function handler(req, res) {
  // CORS — allow your GitHub Pages origin (or any origin) to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const accessToken = await getAccessToken();
    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // Try "currently playing" first
    const nowRes = await fetch(NOW_PLAYING_URL, { headers: authHeader });

    if (nowRes.status === 200) {
      const nowData = await nowRes.json();
      if (nowData && nowData.item) {
        return res.status(200).json(
          shapeNowPlaying(nowData.item, nowData.is_playing, nowData.progress_ms)
        );
      }
    }

    // Nothing playing right now → fall back to most recently played
    const recentRes = await fetch(RECENTLY_PLAYED_URL, { headers: authHeader });
    if (!recentRes.ok) {
      throw new Error(`Recently-played fetch failed: ${recentRes.status}`);
    }
    const recentData = await recentRes.json();
    const lastTrack = recentData.items?.[0]?.track;

    if (!lastTrack) {
      return res.status(200).json({
        isPlaying: false,
        title: 'Nothing here yet',
        artist: '',
        album: '',
        albumArt: '',
        songUrl: 'https://open.spotify.com',
        progressMs: 0,
        durationMs: 0,
      });
    }

    return res.status(200).json(shapeNowPlaying(lastTrack, false, 0));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch Spotify data', detail: String(err) });
  }
}
