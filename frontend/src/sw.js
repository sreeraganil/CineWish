import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("SW installed");
});

self.addEventListener("activate", () => {
  console.log("SW activated");
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  self.registration.showNotification(data.title || 'Cinewish', {
    body: data.body || 'Click to open',
    icon: data.icon || '/logo/pwa-192x192.png',
    image: data.image || null,
    data: {
      url: data.url ? `https://cinewish.deno.dev/${data.url}` : null,
    },
  });
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || 'https://cinewish.deno.dev';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});