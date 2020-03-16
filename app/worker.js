"use strict";
self.addEventListener("fetch", (evt) => {
    const manager = new CacheManager();
    evt.respondWith(manager.cacheFirst(evt));
});
class CacheManager {
    constructor() {
        this.CACHE_NAME = "WHERAMI";
    }
    async cacheFirst(evt) {
        const cache = await caches.open(this.CACHE_NAME);
        const cachedResponse = await cache.match(evt.request);
        if (!cachedResponse) {
            const webResponse = await fetch(evt.request);
            if (200 === webResponse.status) {
                cache.put(evt.request.url, webResponse.clone());
            }
            else {
                console.log(evt.request);
            }
            return webResponse;
        }
        return cachedResponse;
    }
}
