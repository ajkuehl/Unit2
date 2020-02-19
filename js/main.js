// Ashley Kuehl, GEOG 575, Activity 5 Main: Non-Resident Arrivals by the thousands.
// dataSource: United Nations, World Tourism Data  http://data.un.org/DocumentData.aspx?id=409, Non Resident Tourists/Visitors
// years 1995 - 2016

//creation of the map object
var map;
// map properties and method to place map in HTML file
function createMap(){
  map = L.map('mapid',{
    center: [20,0],
    zoom: 2
  });
// tilelayer of map and addTo method passed to the map object
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  	subdomains: 'abcd',
  	maxZoom: 19
  }).addTo(map);

  // call getData function
  getData();
};

// function to place a popup content for all properties in the called data
function onEachFeature(feature, layer) {
  var popupContent = "";
  if (feature.properties) {
    for (var property in feature.properties){
      popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  };
};


// Function uses jquery to select the geojson file of non-resident Tourists
// the onEachFeature function is passed through the data to supply pop-up content
// this function is called above in the tilelayer supplied by leaflet
function getData(){
  $.getJSON("data/NonResidentArrivals.geojson", function(response){
    L.geoJson(response, {
      onEachFeature: onEachFeature
    }).addTo(map);
  });
};


//jquery is used to select the geojson file and pass a function to create a variable to style circlemarker below
$.getJSON("data/NonResidentArrivals.geojson", function(response){
        //create marker options
        var geojsonMarkerOptions = {
            radius: 3,
            fillColor: "#31a354",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        //creates a leaflet layer to make a circle marker for each latlng data, passes through the marker style and added it to the map
        L.geoJson(response,{
            pointToLayer: function (feature, latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    });

$(document).ready(createMap);
