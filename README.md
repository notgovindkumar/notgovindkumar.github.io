# portfolio
Personal portfolio website — Salesforce Builder &amp; AI Enthusiast | B.Tech CSE '28, SKIT Jaipur
# Govind Kumar — Portfolio

Personal portfolio website built with vanilla HTML, CSS, and JavaScript.

🔗 **Live:** [govindkumar.dev](https://notgovindkumar.github.io/) *(update once deployed)*

## Stack

- HTML5, CSS3, Vanilla JS
- Google Fonts — Inter, DM Mono
- No frameworks, no build step (the optional Spotify page uses one small Vercel serverless function)

## Structure

portfolio/
├── index.html         # Structure
├── style.css          # All styling
├── script.js          # Interactions, animations & easter eggs
├── favicon.svg        # "GK." favicon
├── spotify.html       # Now Playing page (optional, needs the API below)
├── api/
│   └── now-playing.js # Vercel serverless function (Spotify)
├── package.json       # marks api/ as ES modules for Vercel
├── SPOTIFY_SETUP.md   # one-time Spotify + Vercel setup
└── LICENSE            # MIT

## Features

- Dark theme with animated grid background
- Scroll reveal animations (IntersectionObserver)
- Fixed nav with scroll shrink
- Responsive — mobile friendly
- Sections: Hero, About, Skills, Experience, Projects
- Rotating typewriter tagline in the hero (static text when JS is off or reduced motion is preferred)
- Footer: live IST clock, "currently working on" line, GitHub contribution graph
- Now Playing page powered by Spotify (see `SPOTIFY_SETUP.md`)
- Hidden easter eggs (right-click menu, terminal, cheatsheet, end-of-page message)

## Local Setup

Just clone and open `index.html` in a browser — no build step needed.
The Spotify page will show an "unavailable" message until you deploy `api/now-playing.js`
and point `NOW_PLAYING_API` in `spotify.html` at it (see `SPOTIFY_SETUP.md`).

```bash
git clone https://github.com/notgovindkumar/portfolio.git
cd portfolio
# open index.html
```

---

*Built with curiosity & caffeine.*
