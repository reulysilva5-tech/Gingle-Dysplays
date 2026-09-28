const CACHE = "gingle-display-v2"

const arquivos = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
]

self.addEventListener("install", event => {

  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(arquivos))
  )

})

self.addEventListener("fetch", event => {

  event.respondWith(

    caches
      .match(event.request)
      .then(response => response || fetch(event.request))

  )

})
