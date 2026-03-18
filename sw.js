/* =====================================================
   SERVICE WORKER — PromptCraft AI PWA v2.0
   ===================================================== */
const CACHE = 'promptcraft-v2';
const FILES = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES).catch(()=>{}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(r => {
        if(r && r.status===200){
          const cl = r.clone();
          caches.open(CACHE).then(c=>c.put(e.request,cl));
        }
        return r;
      }).catch(()=>cached);
      return cached || net;
    })
  );
});

self.addEventListener('message', e => {
  if(e.data && e.data.type==='SKIP_WAITING') self.skipWaiting();
});
