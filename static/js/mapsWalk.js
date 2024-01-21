'use strict';

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
function initMap() {
  let outcome;
  // change to being your current location
  const map = new google.maps.Map(document.querySelector('#map'), {
    center: {
      lat: 37.601773,
      lng: -122.20287,
    },
    zoom: 11,
  });
  const origin = new google.maps.Marker({
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
    console.log(outcome);
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
        lat: 37.7887459,
        lng: -122.4115852,
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

