import { storage, db, } from "./firebase-init.js";
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";


// VARIABLES ================================
const myButton = document.getElementById("getPositionBtn");


let map;
let infoWindow;
let marker;
let geocoder;

// FUNCTIONS ================================

async function geoQuery() {
    // Query
    const geoPosArtistQuery = query(collection(db, "artists"), where("uid", "==", "0QZE1DOE8LXDg9P50VcBoBzkNo32"));

    const artistGeoPos = await getDocs(geoPosArtistQuery);
    artistGeoPos.forEach((doc) => {
        console.log(doc.data().geoposition);
    });
}


function initMap() {

    // Map Options: set to Vacnouver Location

    let options = {
        zoom: 10,
        center: { lat: 49.2827, lng: -123.1207 },
        gestureHandling: "greedy",
    }

    // New Map

    map = new google.maps.Map(document.getElementById('map'), options);

    infoWindow = new google.maps.InfoWindow();

    getPositionBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                    })

                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    })

}


// EVENTS ================================
geoQuery ();

initMap();
