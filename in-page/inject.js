(() => {
    console.log('inject.js loaded');

    const proxiedHost = decodeURIComponent(new URL(window.location.href).searchParams.get('url'));

    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('__sw.js').then(registration => {
            console.log('Service Worker registered: ', registration);
        }).catch(error => {
            console.log('Service Worker registration failed: ', error);
        });
    }
})();