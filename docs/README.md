# Radio PWA 🎧

Client-side Progressive Web App for quick access to favourite web radio stations. Built for GitHub Pages deployment.

## Features
- 9-station quick launch grid
- Persistent bottom control bar with play/pause/volume, station and metadata display
- Metadata polling (when station exposes an API)
- Offline-capable app shell and logo caching via Service Worker
- Touch-friendly, responsive UI
- Background audio via the HTML5 Audio and MediaSession APIs

## Setup & Run (local)
1. Serve the folder with a static server (recommended: `npx serve` or `npx http-server -c-1`)
2. Open in browser and install as PWA from the toolbar

## Stations
Stations are defined in `stations.json`. Add a `stream` property with the direct stream URL (HLS/MP3/etc.) for each station — the app no longer auto-fetches streams via the Radio-Browser API. Keep `metadata_url` if the station exposes a JSON metadata API. Example entry:

{
  "name": "France Inter",
  "query": "France Inter",
  "logo": "/assets/logos/france-inter.svg",
  "stream": "https://stream.example.org/franceinter.mp3",
  "metadata_url": "https://api.radiofrance.fr/v1/nowplaying/franceinter/1"
}

Note: the app attempts to resolve a playable stream using the Radio-Browser public API when `stream` is not provided.

## CORS & Metadata
- Many streaming servers and metadata endpoints block CORS. If metadata requests fail, provide your own `metadata_url` or set up a simple proxy that adds CORS headers.

## Deployment (GitHub Pages)
A GitHub Action workflow is included to deploy the `main` branch to `gh-pages` automatically.

## Limitations & Notes
- Streaming audio cannot be cached for offline listening; only the app assets and logos are cached.
- Some stations do not provide real-time metadata. The app displays a friendly message when metadata is not available.
- Mobile OS limitations: background playback is supported in most browsers but iOS Safari may suspend the page under system constraints — using the Media Session API improves behavior but is not a guarantee.
- CORS: Many stream endpoints and metadata APIs block cross-origin requests. If metadata fetches fail, you can either provide an already CORS-enabled `metadata_url` or run a small proxy (a tiny server that fetches metadata, adds CORS headers, and serves JSON). See `README-proxy.md` for an example.
- Icons: The manifest points to `/icons/icon-192.png` and `/icons/icon-512.png`. Replace the provided SVG placeholders with properly sized PNGs for best cross-browser compatibility.

## Contributing
Open a PR with improvements, station fixes, or better metadata integrations.

---
