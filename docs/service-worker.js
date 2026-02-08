const CACHE_NAME = 'radio-pwa-v1';
const ASSETS = [
  './', './index.html', './styles.css', './app.js', './stations.json', './manifest.json',
  './assets/logos/placeholder.svg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/France_Inter_logo_2021.svg/1200px-France_Inter_logo_2021.svg.png',
  'https://duckduckgo.com/i/035a5e15d396c67a.png',
  'https://www.francebleu.fr/client/immutable/assets/logo-ici-small.DwiLDMIK.svg',
  'https://upload.wikimedia.org/wikipedia/fr/thumb/2/22/France_Musique_-_2008.svg/1024px-France_Musique_-_2008.svg.png',
  'https://upload.wikimedia.org/wikipedia/fr/thumb/c/c9/France_Culture_-_2008.svg/1024px-France_Culture_-_2008.svg.png',
  'https://www.rts.ch/hbv7/static/images/logos/logo_rts-rouge.svg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/FIP_logo_2021.svg/250px-FIP_logo_2021.svg.png',
  'https://www.grrif.ch/wp-content/themes/grrif/img/player/logo-grrif.png',
  'https://myradioendirect.fr/public/uploads/radio_img/nostalgie/play_250_250.webp'
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




