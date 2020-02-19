// Ashley Kuehl, GEOG 575, Activity 5 geojsonTutorial

//
var map;

function createMap(){
  map = L.map('mapid',{
    center: [20,0],
    zoom: 2
  });

  // add OSM basetile
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);

  // call getData function
  getData();
};

function onEachFeature(feature, layer) {
  var popupContent = "";
  if (feature.properties) {
    for (var property in feature.properties){
      popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  };
};


// this will be changed to load our megaCities data
function getData(){
  $.getJSON("data/MegaCities.geojson", function(response){
    L.geoJson(response, {
      onEachFeature: onEachFeature
    }).addTo(map);
  });
};


//Example 2.3 line 22...load the data
$.getJSON("data/MegaCities.geojson", function(response){
        //create marker options
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        //create a Leaflet GeoJSON layer and add it to the map
        L.geoJson(response, {
            pointToLayer: function (feature, latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    });



$(document).ready(createMap);
