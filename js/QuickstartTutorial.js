// Ashley Kuehl, GEOG 575, Activity 5 quicstartTutorial

// initialize the map using the l.map method and the "mapid" div in my html document.
// The additioanl chained on setView method contains an array with two coordinates where center is followed by the zoom leevl of 13
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// the l.tileLayer method takes the parameters: a tileset URL and properties of the tilelayer.
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiYWprcmFzaCIsImEiOiJjazZqc2Z4cXkwMHd5M2pwMXIwYjdhejZpIn0.So4cIqt5-aXZeRFRnqC6mg'
  // the addTo method, inherited from the L.tilelayer method, adds the tilelayer to my variable mymap
}).addTo(mymap);


// l.marker method establishes an initial Marker object at the coordinates within the array.
// the addTo method is chained on and this layer is added to the map
var marker = L.marker([51.5, -0.09]).addTo(mymap);
// the bindPopup method binds a popup message to the marker
// the openPopup method is chained on so that when the user clicks the marker, the message is revealed, previous messages are closed
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();


// the L.circle method establishes a circle object at the geographial coordinates within the array.
// below are all the L.circle's properties. An addTo method is chained on to add the object to the map.
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
// the bindPopup method is chained to the circle with a method that when clicked a message is revealed
circle.bindPopup("I am a circle.");


// the L.polygon method creates a polygon object at the geographical coordiantes within the supplied array.
//An addTo method is chained on to add the object to the map.
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);
// the bindPopup method is chained to the polygon with a method that when clicked a message is revealed
polygon.bindPopup("I am a polygon.");


// the L.popup creates an object with optional methods to describe what it does next
// the setLatLng method establishes the geographic coordinate position of the popup objects
// the setContent method sets the HTML content, a string, to the popup object
// the openOn method adds the popup object to the map and closes the previous popup
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);



// the onMapClick is a function that assigns the following methods wherever the user clicks the map
// setLatLng method establishes the coordiante location of where the user clicks on the map
// the setContent method sets the HTML content of a string + the coordinate location as a popup object of where the user clicks
// the toString method converts the clicked coordinate location into a string that is incorporated into a message to the user
// the openOn method adds the popup to the map and closes the previous popup.
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}


// the on method allows the function onMapClick to turn on when the user clicks anywhere on the map.
mymap.on('click', onMapClick);
