//// Service Worker

//// Note: This if is an instruction to execute the content only if the browser
//// (representend by the navigator object) support service workers.
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
    .then((reg) => console.log("service worker registered", reg))
    .catch((err) => console.log("service worker not registered", err));
}