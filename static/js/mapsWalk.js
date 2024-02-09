'use strict';
let map;
let infoWindow;
let userLat;
let userLng;
let outcome;
let minutes;
let distance;

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

  // change to being your current location
  map = new google.maps.Map(document.querySelector('#map'), {
    center: {
      lat: 37.601773,
      lng: -122.20287,
    },
    zoom: 12,
  });
  
  let walkControls = document.getElementById('walkControls');
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(walkControls);

  //code for user to input string address and map center on their address
  const geocoder = new google.maps.Geocoder();
  let locSubmitButton = document.getElementById('locBtn');
  let inputText = document.getElementById('userLocation');
  //inputText.value = 'What is your location?'
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(inputText);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(locSubmitButton);
  locSubmitButton.addEventListener("click", () =>
    geocode({ address: inputText.value }),
  );

  function geocode(request) {
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        map.setCenter(results[0].geometry.location);
        userLat = results[0].geometry.location.lat();
        userLng = results[0].geometry.location.lng();
  
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
  locationButton.classList.add("map-control-button");
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
          userLat = position.coords.latitude;
          userLng = position.coords.longitude;
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
  

  function anothaOne(){
    distance = parseFloat(document.querySelector('#distance').value);
    outcome = second_point(userLat, userLng, distance);
    renderDirections(outcome);
  }
  let distanceBtn = document.getElementById('submitBtn');
  let distance = document.getElementById('distance')
  distanceBtn.addEventListener('click', anothaOne);
  
  
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
        console.log(response);
        let duration = 0;
        let legs = response.routes[0].legs;
        for (let leg of legs){
          duration += leg.duration.value;
        }
        minutes = Number((duration/60));
        console.log('minutes',minutes);
      } else {
        //replace w/func that calls second_point again
        alert(`Directions request unsuccessful due to: ${status}`);
      }
    });
  }

  function saveDirections(){
    if (userLat && userLng && outcome && distance && minutes) {
      let walkSpec = {start:{userLat, userLng}, outcome, distance, minutes};
      console.log(walkSpec);
      
      fetch('/savewalk', {
        method:'POST',
        body: JSON.stringify(walkSpec),
        headers: {
        'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.status);
        console.log(responseJson.success);
      });
  } else{
    console.log(userLat, userLng, outcome, distance, minutes)
  }
}
  const saveWalkBtn = document.getElementById('walkSaveBtn');
  saveWalkBtn.addEventListener('click', saveDirections);
  //map.controls[google.maps.ControlPosition.LEFT_TOP].push(saveWalkBtn);
}

window.initMap = initMap;