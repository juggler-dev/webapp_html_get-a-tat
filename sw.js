//Installation event
self.addEventListener('install', evt => {
    console.log('service worker has been installed');
})

//Activate event
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
})

//Fetch event
self.addEventListener('fetch', evt => {
    console.log(`Fetching ${evt.request.url}`)
})