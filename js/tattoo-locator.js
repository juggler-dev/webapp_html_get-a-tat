/////////////// IMPORT FIREBASE HERE
import { auth, db, storage } from "./firebase-init.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

var coordinates = [];
const myButton = document.getElementById("getPositionBtn");
// const locationStudiosQuery = query(collection(db, "artists"), where("location", "==", true));

const ARTISTS_COLLECTION_REFERENCE = collection(db, 'artists');


const artistsStudiosLocation = await getDocs(ARTISTS_COLLECTION_REFERENCE);
artistsStudiosLocation.forEach((artist) => {
    coordinates.push(artist.data().location);
});

console.log(coordinates);


    let map;
    let infoWindow;
    let marker;

  function initMap(){

      // Map Options: set to Vacnouver Location

      let options = {
          zoom: 12,
          center: {lat: 49.2827, lng: -123.1207}, 
      }

      // New Map

      map = new google.maps.Map(document.getElementById('map'), options);

      infoWindow = new google.maps.InfoWindow();

      myButton.addEventListener("click", () => {
          if(navigator.geolocation){
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


  let locations = coordinates;
     
      for (let i = 0; i < locations.length; i++) {  
          console.log(locations[i]._lat);
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(locations[i]._lat, locations[i]._long),
          map: map
        });
        
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.open(map, marker);
          }
        })(marker, i));
      }
  }

  initMap();