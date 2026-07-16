const CACHE_VERSION = "drive-mental-web-v36";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css",
  "/runtime-config.js",
  "/supabase-client.js",
  "/app.js",
  "/platform.js",
  "/manifest.webmanifest",
  "/privacy.html",
  "/terms.html",
  "/icons/drive-astral-icon.svg",
  "/icons/drive-astral-maskable.svg",
  "/icons/drive-astral-192.png",
  "/icons/drive-astral-512.png",
  "/icons/apple-touch-icon.png",
  "/assets/landing/dashboard-drive-astral.png",
  "/assets/landing/leitura-drive-astral.png",
  "/src/domain/cosmic-timeline.js",
  "/src/domain/sincronario/engine.js",
  "/src/domain/sincronario/thirteen-moons-engine.js",
  "/src/domain/sincronario/kin-cycle-engine.js",
  "/src/domain/sincronario/synchronization-engine.js",
  "/src/domain/sincronario/coordinates-engine.js",
  "/src/domain/sincronario/area-application-knowledge.js",
  "/src/domain/sincronario/area-knowledge.js",
  "/src/domain/sincronario/knowledge.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (
          await caches.match(request)
          || await caches.match("/index.html")
        )),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});
