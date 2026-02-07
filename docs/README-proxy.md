# Metadata Proxy Example

Some station metadata endpoints block cross-origin requests. If the PWA can't fetch JSON metadata directly in the browser, run a tiny proxy that adds CORS headers:

Example (Dev proxy — Node built-in HTTP server):

```js
// tools/proxy.js included in this repo — run `npm run proxy`
// then use: http://localhost:8080/proxy?url=${encodeURIComponent('<stream-url>')}
```

Express example:

```js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  const r = await fetch(url);
  res.set('Access-Control-Allow-Origin','*');
  res.type(r.headers.get('content-type') || 'application/octet-stream');
  r.body.pipe(res);
});
app.listen(8080);
```

Cloudflare Worker example (deploy to `workers.dev`):

```js
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(url.pathname !== '/proxy') return event.respondWith(fetch(event.request));
  const target = url.searchParams.get('url');
  return event.respondWith(fetch(target));
});
```

Usage in the app:
- Start the proxy (dev): `npm run proxy` → `http://localhost:8080/proxy?url=<encoded_stream>`
- Or deploy the Cloudflare Worker and set `PROXY_URL` in `app.js` to `https://<your-worker>.workers.dev/proxy?url=`.

