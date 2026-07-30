/* Generated with the page - do not edit. Version: a5ba6eaa698b */
var CACHE = "macy-coach-a5ba6eaa698b";
var SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
var NET_TIMEOUT_MS = 1500;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var isPage = req.mode === "navigate" || req.url.indexOf("index.html") >= 0;
  if (isPage) {
    // Network-first with a short timeout: online = always the current plan;
    // offline or slow gym signal = instant cached copy.
    e.respondWith(new Promise(function (resolve) {
      var settled = false;
      var timer = setTimeout(function () {
        caches.match("./index.html").then(function (cached) {
          if (!settled && cached) { settled = true; resolve(cached); }
        });
      }, NET_TIMEOUT_MS);
      fetch(req).then(function (res) {
        clearTimeout(timer);
        if (!settled && res && res.ok) {
          settled = true;
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
          resolve(res);
        } else if (!settled) {
          caches.match("./index.html").then(function (cached) { settled = true; resolve(cached || res); });
        }
      }).catch(function () {
        clearTimeout(timer);
        if (!settled) caches.match("./index.html").then(function (cached) { settled = true; resolve(cached || Response.error()); });
      });
    }));
  } else {
    e.respondWith(caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (res) {
        if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      });
    }));
  }
});
