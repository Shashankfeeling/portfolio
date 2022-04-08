'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "404.html": "0a27a4163254fc8fce870c8cc3a3f94f",
"assets/AssetManifest.json": "c64dbfd1dddf8db9a0e86fcde0a9e978",
"assets/assets/assets/b.png": "9c59e0d7b9da7336819146407b2b38f0",
"assets/assets/assets/c.png": "a2568acca10a778b05e71fd959b09137",
"assets/assets/assets/d.png": "047795a497523dccffcd73daeb69f9eb",
"assets/assets/assets/fav.png": "82c27863bcaf26fab47a7063431859ef",
"assets/assets/assets/favicon.ico": "f03fb7778dea445d4304738bb3955c3c",
"assets/assets/assets/g.png": "2cbba8f7d084246539697a35124067a8",
"assets/assets/assets/h.png": "5d7913dabbfded52a2b04aa80d06ebf3",
"assets/assets/assets/in.png": "f7ee5e62b27aeb8f33adb426a3924695",
"assets/assets/assets/ins.png": "e2511815d86fc4db63d5b28101bea166",
"assets/assets/assets/is.png": "92e1b3ccb0076ed165d1ae65460b30f6",
"assets/assets/assets/me.png": "7344823e930401f601e5ce7d4509a17a",
"assets/assets/assets/r.png": "688c0f04c3ad90ff90fb10ce6aef5669",
"assets/assets/assets/sp.png": "2d4b612a8be1a5d2c99df864c1b3b3a0",
"assets/assets/assets/t.png": "6bfc8a3867a70694a3d56f1c47c3061d",
"assets/assets/assets/ww.png": "6b24fe293e2dbc3cf9d6546a41781073",
"assets/assets/b.png": "9c59e0d7b9da7336819146407b2b38f0",
"assets/assets/c.png": "a2568acca10a778b05e71fd959b09137",
"assets/assets/d.png": "047795a497523dccffcd73daeb69f9eb",
"assets/assets/fav.png": "82c27863bcaf26fab47a7063431859ef",
"assets/assets/favicon.ico": "f03fb7778dea445d4304738bb3955c3c",
"assets/assets/g.png": "2cbba8f7d084246539697a35124067a8",
"assets/assets/h.png": "5d7913dabbfded52a2b04aa80d06ebf3",
"assets/assets/in.png": "f7ee5e62b27aeb8f33adb426a3924695",
"assets/assets/ins.png": "e2511815d86fc4db63d5b28101bea166",
"assets/assets/is.png": "92e1b3ccb0076ed165d1ae65460b30f6",
"assets/assets/me.png": "7344823e930401f601e5ce7d4509a17a",
"assets/assets/r.png": "688c0f04c3ad90ff90fb10ce6aef5669",
"assets/assets/sp.png": "2d4b612a8be1a5d2c99df864c1b3b3a0",
"assets/assets/t.png": "6bfc8a3867a70694a3d56f1c47c3061d",
"assets/assets/ww.png": "6b24fe293e2dbc3cf9d6546a41781073",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "5585653b4ca16a0433d50c68119cacb0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"index.html": "076e2e31c13c8728608a3b6d3ad44c92",
"/": "076e2e31c13c8728608a3b6d3ad44c92",
"main.dart.js": "2f5a7887303303ab4271a0505539702c",
"manifest.json": "a22d4fb285804867df29ad7079bd5c98",
"version.json": "9b818ca9511483c901bed1545384376c"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
