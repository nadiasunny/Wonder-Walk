'use strict';
let map;
let infoWindow;
let userLat;
let userLng;
function second_point(lat1, lng1, distance){
    let bearing = Math.floor(Math.random() * (Math.floor(360) - Math.ceil(0) + 1) + Math.ceil(0)) * (Math.PI/180);
    let lat1_rad = lat1 * (Math.PI/180);
    let lng1_rad = lng1 * (Math.PI/180);
    let R = 6371;

    const lat2_rad = Math.asin( Math.sin(lat1_rad)*Math.cos(distance/R) +
  Math.cos(lat1_rad)*Math.sin(distance/R)*Math.cos(bearing) );

    const lng2_rad = lng1_rad + Math.atan2(Math.sin(bearing)*Math.sin(distance/R)*Math.cos(lat1_rad),
       Math.cos(distance/R)-Math.sin(lat1_rad)*Math.sin(lat2_rad));

    let second_point = {
    lat: parseFloat((lat2_rad * (180/Math.PI)).toFixed(6)),
    lng: parseFloat((lng2_rad *(180/Math.PI)).toFixed(6))
  }
  
  return second_point;
}

// We use a function declaration for initMap because we actually *do* need
// to rely on value-hoisting in this circumstance.
async function initMap() {
  let outcome;
  // change to being your current location
  map = new google.maps.Map(document.querySelector('#map'), {
    center: {
      lat: 37.601773,
      lng: -122.20287,
    },
    zoom: 11,
  });
  //code for user to input string address and map center on their address
  const geocoder = new google.maps.Geocoder();
  let locSubmitButton = document.getElementById('locBtn');
  let inputText = document.getElementById('userLocation')
  locSubmitButton.addEventListener("click", () =>
    geocode({ address: inputText.value }),
  );

  function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
  
        map.setCenter(results[0].geometry.location);
        userLat = results[0].geometry.location.lat;
        userLng = results[0].geometry.location.lng;
        //marker.setPosition(results[0].geometry.location);
        //marker.setMap(map);
        //responseDiv.style.display = "block";
        //response.innerText = JSON.stringify(result, null, 2);
        return results;
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }
  



  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(position);
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
        {enableHighAccuracy: true, maximumAge: 1000}
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
  }
  
  //working directions code
  let origin = new google.maps.Marker({
    position: {
      lat: 37.7887459,
      lng: -122.4115852,
    },
    title: '1st point',
    map: map,
  });
  
  function anothaOne(){
    const DISTANCE = parseFloat(document.querySelector('#distance').value);
    outcome = second_point(37.7887459, -122.4115852, DISTANCE);
    renderDirections(outcome);
  }
  document.getElementById('submitBtn').addEventListener('click', anothaOne);
  
  const directionsService = new google.maps.DirectionsService();
  // The DirectionsRenderer object is in charge of drawing directions
  // on maps
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  function renderDirections(outcome){

    const randomRoute = {
      origin: {
        lat: userLat,
        lng: userLng,
      },
      destination:{
        lat: outcome.lat, 
        lng: outcome.lng,
      },
      travelMode: 'WALKING',
    };

    directionsService.route(randomRoute, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        //replace w/func that calls second_point again
        alert(`Directions request unsuccessful due to: ${status}`);
      }
    });
  }
}

window.initMap = initMap;