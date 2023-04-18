self.addEventListener('register', function(evt) {
    console.log('register event: ', evt);
});
  
self.addEventListener('fetch', function(evt) {
    const proxiedHost = decodeURIComponent(new URL(self.location.href).searchParams.get('url'));
    console.log('fetch event: ', evt);
    let url = new URL(evt.request.url);
    url = `${self.location.origin}/?url=${encodeURIComponent(new URL(url.pathname, proxiedHost).href)}`;
    return fetch(url, {
        method: evt.request.method,
        headers: evt.request.headers,
        body: evt.request.body,
        mode: evt.request.mode,
    });
});
