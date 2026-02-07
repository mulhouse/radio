// Proxy worker removed per request — code related to proxying has been cleared.
// If you need a worker proxy in the future, restore from history or add a new implementation.
addEventListener('fetch', event => { event.respondWith(new Response('Proxy worker disabled', {status:410})); });
