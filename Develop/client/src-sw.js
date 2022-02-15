// Cache warming is when websites artificially fill the cache so that real visitors will always get a cache hit
const { warmStrategyCache } = require('workbox-recipes');
/* when your service worker intercepts a request, it first uses the Cache Storage API to see whether there's a cached response available. If there is, that response is returned to the web app.
If there's a cache miss, though, then the service worker will go to the network and attempt to retrieve a response there */
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
// match a route with either a string, regular expression, or callback function
const { registerRoute } = require('workbox-routing');
/* module provides a standard way of determining whether a response should be cached based on its numeric
status code, the presence of a header with a specific value, or a combination of the two */
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
// allows you to limit the number of entries in a cache and / or remove entries that have been cached for a long period of time
const { ExpirationPlugin } = require('workbox-expiration');
// ability to save a set of files to the cache when the service worker is installing
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');


precacheAndRoute(self.__WB_MANIFEST);
// Set up page cache
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});
registerRoute(({ request }) => request.mode === 'navigate', pageCache);
// Set up asset cache
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);