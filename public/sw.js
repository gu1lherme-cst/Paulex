/* Service worker "kill-switch".
   Versões antigas do site usavam PWA (vite-plugin-pwa), que registrou um
   service worker com precache. Como o PWA foi removido, aquele SW antigo
   continuaria servindo a versão velha em cache para sempre. Este arquivo
   substitui o SW antigo (mesmo caminho /Paulex/sw.js): ele limpa todos os
   caches, se cancela e recarrega as abas abertas para buscar a versão atual.
   Pode ser removido no futuro, quando todos os visitantes já tiverem limpo. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) {
          client.navigate(client.url);
        }
      } catch (e) {
        /* silencioso */
      }
    })()
  );
});
