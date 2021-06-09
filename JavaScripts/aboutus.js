// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow, directionsService, directionsRenderer, pos, destination;

function initMap() {
  //generates the map
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  destination = new google.maps.LatLng(41.90803112880615, -71.04840536282173);
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: destination,
  });

  directionsRenderer.setMap(map);
  //generates map popup window
  infoWindow = new google.maps.InfoWindow();

  // creates directions button
  const directionsButton = document.createElement("button");
  directionsButton.textContent = "Get Directions";
  directionsButton.style =
    "font-family: Roboto, Arial, sans-serif; font-size: 18px; border-radius: 2px; min-width: 35px; font-weight: 500;";
  directionsButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(directionsButton);

  // handler for location button
  directionsButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // format the result from the geolocation
          pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log(pos);
          infoWindow.setPosition(map.getCenter());
          infoWindow.setContent("Location found.");
          console.log("location found");
          infoWindow.open(map);
          calculateAndDisplayRoute(directionsService, directionsRenderer);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
          console.log("location error");
        }
      );
    } else {
      // if browser doesn't support Geolocation
      console.log("unsupported");
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}




//error message to infowindow and rerender default map on error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: Please enable Geolocation service."
      : "Error: Your browser doesn't support geolocation."
  );
  console.log("Error in Location");
  infoWindow.open(map);
}

//caculates and displays the new map/route
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  //generate the route using inputs
  directionsService.route(
    {
      origin: pos, // this will be the result from the geolocation
      destination: destination, // this will be our address new google.maps.LatLng(41.9196378, -71.0135904)
      travelMode: google.maps.TravelMode.DRIVING, //ok
    },
    //error handling
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        console.log("error in response");
        infoWindow.setContent("Directions request failed due to " + status);
        infoWindow.open(map);
      }
    }
  );
}
