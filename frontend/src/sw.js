import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("SW installed");
});

self.addEventListener("activate", () => {
  console.log("SW activated");
});

self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    try {
      // Try to parse the incoming stream as JSON
      data = event.data.json();
    } catch (e) {
      // If parsing fails (Unexpected token 'T' error), treat it as plain text
      console.warn("Received non-JSON push data:", event.data.text());
      data = {
        title: 'Cinewish',
        body: event.data.text()
      };
    }
  }

  const title = data.title || 'Cinewish';
  const options = {
    body: data.body || 'Click to open',
    icon: data.icon || '/logo/pwa-192x192.png',
    image: data.image || null,
    badge: '/logo/pwa-64x64.png', // Recommended for mobile status bars
    data: {
      // Ensure the URL is absolute or fallback to base
      url: data.url ? `https://cinewish.deno.dev/${data.url}` : 'https://cinewish.deno.dev',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
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