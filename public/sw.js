// Placeholder service worker file to silence stale client requests.
// This project does not currently register a production SW.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

