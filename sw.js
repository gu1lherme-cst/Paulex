/* Service worker Paulex — permite instalar como aplicativo e
   navegar com internet instável (os arquivos ficam em cache). */

const CACHE = "paulex-v24";
const ASSETS = [
  "./",
  "index.html",
  "style.css?v=24",
  "script.js?v=24",
  "produtos.js?v=24",
  "manifest.json",
  "img/logo.png",
  "img/px-logo.png",
  "img/favicon-192.png",
  "img/favicon-512.png",
];

self.addEventListener("install", (e) => {
  // Pré-cacheia o que der; ignora falhas individuais para não travar a instalação
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(ASSETS.map((a) => c.add(a)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Páginas: tenta a rede primeiro (para receber atualizações),
  // cai para o cache se estiver offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./", copy));
          return res;
        })
        .catch(() => caches.match("./"))
    );
    return;
  }

  // Demais arquivos: cache primeiro, rede como complemento
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && (req.url.startsWith(self.location.origin) || req.url.includes("fonts.g"))) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});
