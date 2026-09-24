# Setting up real Spotify "Now Playing"

Your portfolio is static (GitHub Pages), and Spotify's API can't be called
securely straight from the browser — your Client Secret would be exposed to
anyone who opens dev tools. So we route it through a tiny serverless
function on Vercel (free tier is enough for this).

Total time: ~10 minutes, one-time setup.

---

## 1. Create a Spotify app

1. Go to https://developer.spotify.com/dashboard and log in.
2. Click **Create app**.
   - App name / description: anything (e.g. "Portfolio Now Playing")
   - Redirect URI: `https://open.spotify.com` (a placeholder — you only
     use this once, in step 2)
   - Check the box for the Web API.
3. Save. You'll now see a **Client ID** and can reveal a **Client Secret**.
   Keep both handy.

## 2. Get a refresh token (one-time)

This is the fiddly part but you only do it once.

1. In your browser, visit this URL — replace `YOUR_CLIENT_ID`:

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://open.spotify.com&scope=user-read-currently-playing%20user-read-recently-played
   ```

2. Log in and click **Agree**. You'll be redirected to
   `https://open.spotify.com/?code=SOME_LONG_CODE`. Copy the `code` value
   from the URL (everything after `code=`).

3. Exchange that code for a refresh token. Run this in a terminal
   (replace the placeholders), or use Postman/Insomnia if you prefer:

   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d grant_type=authorization_code \
     -d code=THE_CODE_FROM_STEP_2 \
     -d redirect_uri=https://open.spotify.com \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET
   ```

4. The response is JSON with an `access_token` (short-lived, ignore it)
   and a `refresh_token` — **that's the one you need, save it.** It
   doesn't expire unless you revoke access.

## 3. Deploy the serverless function to Vercel

1. Push this repo (including the `api/now-playing.js` file) to GitHub,
   or a separate small repo — either works, as long as `api/now-playing.js`
   is at the root's `api/` folder (Vercel auto-detects this as a function).
2. Go to https://vercel.com, sign in with GitHub, **Import Project**,
   pick this repo.
3. Before deploying, add environment variables (Project Settings →
   Environment Variables):
   - `SPOTIFY_CLIENT_ID` → from step 1
   - `SPOTIFY_CLIENT_SECRET` → from step 1
   - `SPOTIFY_REFRESH_TOKEN` → from step 2
4. Deploy. Vercel gives you a URL like `https://your-project.vercel.app`.
5. Test it: open `https://your-project.vercel.app/api/now-playing` in
   your browser — you should get back JSON with your track info.

## 4. Point spotify.html at your deployed function

Open `spotify.html` and update this line near the top of the `<script>`:

```js
const NOW_PLAYING_API = 'https://your-project.vercel.app/api/now-playing';
```

Push that change to your GitHub Pages repo. Done — `notgovindkumar.github.io/spotify.html`
now shows your real, live Spotify activity.

---

### Notes

- If nothing is currently playing, the page automatically falls back to
  your most recently played track and labels it "last played" instead
  of "now playing."
- The refresh token never expires unless you revoke the app's access
  from your Spotify account settings — so this is a true one-time setup.
- Don't commit your Client Secret or refresh token anywhere in the
  GitHub Pages repo itself — they only ever live in Vercel's environment
  variables, never in `spotify.html` or any file that ships to the browser.
