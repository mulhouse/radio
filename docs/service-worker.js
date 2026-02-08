const CACHE_NAME = 'radio-pwa-v1';
const ASSETS = [
  './', './index.html', './styles.css', './app.js', './stations.json', './manifest.json',
  './assets/logos/placeholder.svg'
];

self.addEventListener('install', (evt)=>{
  evt.waitUntil(caches.open(CACHE_NAME)
                  .then(c=>c.addAll(ASSETS))
                  .catch(err => console.error('Cache install failed:', err))); //
  self.skipWaiting();
});

self.addEventListener('activate', (evt)=>{
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (evt)=>{
  const req = evt.request;
  // network-first for metadata JSON
  if(req.url.endsWith('/stations.json') || req.headers.get('accept')?.includes('application/json')){
    evt.respondWith(fetch(req).catch(()=>caches.match(req)));
    return;
  }
  // for app shell assets - cache first
  evt.respondWith(caches.match(req).then(cached=>cached || fetch(req).then(resp=>{
    const responseClone = resp.clone(); // 
    if(req.method === 'GET' && req.url.startsWith(self.location.origin)){
      caches.open(CACHE_NAME).then(cache=>cache.put(req, responseClone)); //
    }
    return resp;
  }).catch(()=>{
    // fallback for navigation
    if(req.mode === 'navigate') return caches.match('/index.html');
  })));

});



