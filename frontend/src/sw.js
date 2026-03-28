import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  console.log("SW installed");
});

self.addEventListener("activate", () => {
  console.log("SW activated");
});

self.addEventListener("push", (event) => {
  console.log("Push received", event);

  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || "CineWish", {
      body: data.body || "New update",
      icon: "/pwa-192x192.png",
    })
  );
});