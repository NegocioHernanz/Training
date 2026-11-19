// v3: la página se pide primero a internet (así ves siempre la última versión) y, sin conexión, se usa la copia guardada.
const CACHE='training-block-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const same=new URL(req.url).origin===location.origin;
  if(!same)return; // el lector de capturas (CDN) va directo a internet
  e.respondWith(fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
