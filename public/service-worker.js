self.addEventListener('install', e => {
  e.waitUntil(
    caches.open("zbiorkom").then(cache => {
      return cache.addAll([
        "/", "/index.html", "/manifest.json"
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open("zbiorkom")
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(async(response) => {
        if(!response) {
          response = await fetch(event.request);
          let url = new URL(event.request.url);
          if(url.pathname !== "/loadVehicles" && url.pathname !== "/tripInfo") event.waitUntil(caches.open("zbiorkom").then(cache => cache.put(event.request, response).then(() => self.skipWaiting())))
        }
        return response;
    })
  );
});
