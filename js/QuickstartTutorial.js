// Ashley Kuehl, GEOG 575, Activity 5 quicstartTutol

// initialize the map on the "mapid" div in my html document. The additioanl chained on setview contains an array with two coordinates where center is followed by the zoom leevl of 13
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// the l.titleLayer takes the parameters: a titleset URL and properties of the titlelayer.
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiYWprcmFzaCIsImEiOiJjazZqc2Z4cXkwMHd5M2pwMXIwYjdhejZpIn0.So4cIqt5-aXZeRFRnqC6mg'
  // the addto method adds the titlelayer to my variable mymap, ultimately adding the titlelayer to my div in my html file
}).addTo(mymap);


var marker = L.marker([51.5, -0.09]).addTo(mymap);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
circle.bindPopup("I am a circle.");


var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);


    // function onMapClick(e) {
    //     alert("You clicked the map at " + e.latlng);
    // }
    //
    // mymap.on('click', onMapClick);
    //
    // var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);
