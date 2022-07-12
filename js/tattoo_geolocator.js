


  const myButton = document.getElementById("getPositionBtn");


  let map;
  let infoWindow;
  let marker;
  let geocoder;
  
  function initMap(){
  
      // Map Options: set to Vacnouver Location
  
      let options = {
          zoom: 10,
          center: {lat: 49.2827, lng: -123.1207}, 
          gestureHandling: "greedy",
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
  
  }
  
  
    