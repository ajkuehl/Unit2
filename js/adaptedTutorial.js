// Ashley Kuehl, GEOG 575, Activity 5 geojsonTutorial

// initialize the map using the l.map method and the "mapid" div in my html document.
// The additioanl chained on setView method contains an array with two coordinates where center is followed by the zoom leevl of 5
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
            // console.log('hello');
        };

        //create a Leaflet GeoJSON layer and add it to the map
        L.geoJson(response, {
            pointToLayer: function (feature, latlng){
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(map);
    });

// function onEachFeature(feature, layer) {
//         //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//             //loop to add feature property names and values to html string
//         for (var property in feature.properties)
//           popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// // };
//
// //function to retrieve the data and place it on the map
// function getData(map){
//         //load the data
//     $.getJSON("data/MegaCities.geojson", function(response){
//
//                 //create a Leaflet GeoJSON layer and add it to the map
//             L.geoJson(response, {
//                 onEachFeature: onEachFeature
//             }).addTo(map);
//     });
// };


$(document).ready(createMap);




//
// // creating a feature variable
// var geojsonFeature = {
//     "type": "Feature",
//     "properties": {
//         "cities": "Tokyo",
//         "pop_1985": 30.30,
//         "pop_1990": 32.53,
//         "pop_1995": 33.59,
//         "pop_2000": 34.45,
//         "pop_2005": 35.62,
//         "pop_2010": 36.83,
//         "pop_2015": 38
//     },
//     "geometry": {
//         "type": "Point",
//         "coordinates": [139.8089447, 35.6832085]
//     }
// };

// // how to pass geojson objects as an array
// var myLines = [{
//     "type": "LineString",
//     "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
// }, {
//     "type": "LineString",
//     "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// }];
//
// var myStyle = {
//     "color": "#ff7800",
//     "weight": 5,
//     "opacity": 0.65
// };
//
//
// // L.geoJSON method creates a geoJSON layer and passes through the myLines object which contains linestring arrays
// // the myStyle variable is passed through to myLines
// // the addTo method adds myLines as a new layer to the map
// L.geoJSON(myLines, {
//     style: myStyle
// }).addTo(mymap);
//
//
// var states = [{
//     "type": "Feature",
//     "properties": {"party": "Republican"},
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [[
//             [-104.05, 48.99],
//             [-97.22,  48.98],
//             [-96.58,  45.94],
//             [-104.03, 45.94],
//             [-104.05, 48.99]
//         ]]
//     }
// }, {
//     "type": "Feature",
//     "properties": {"party": "Democrat"},
//     "geometry": {
//         "type": "Polygon",
//         "coordinates": [[
//             [-109.05, 41.00],
//             [-102.06, 40.99],
//             [-102.03, 36.99],
//             [-109.04, 36.99],
//             [-109.05, 41.00]
//         ]]
//     }
// }];
//
//
// // L.geoJSON method creates a geoJSON layer and passes through the states object which contains features with properties and geomentry of polygons which contain arrays for each feature
// // within the states ofject, party is selected within properties and a color is assigned to each individual party
// // the addTo method adds states as a new layer to the map
// L.geoJSON(states, {
//     style: function(feature) {
//         switch (feature.properties.party) {
//             case 'Republican': return {color: "#ff0000"};
//             case 'Democrat':   return {color: "#0000ff"};
//         }
//     }
// }).addTo(mymap);


// var geojsonMarkerOptions = {
//     radius: 8,
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };
//
//
// // L.geoJSON method creates a geoJSON layer and passes through the geojsonFeature object
// // the pointToLayer function passes through the gojsonFeature object and selects coordinates
// // the circleMarker method creates a circle marker at the selected coordinates and passes through the geojsonMarkerOptions, making an orange circle at the location
// // the addTo method adds the geojsonFeature object selection as a new layer to the map
// L.geoJSON(geojsonFeature, {
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//     }
// }).addTo(mymap);
//
//
// // the onEachFeature function is called for each created Feature. Seen below.
// function onEachFeature(feature, layer) {
// // a conditional statement is created. If a feature has properties that contain popup html content, then the content will added to the map using a bindPopup method when the location is clicked
// // the popupContent is also logged to the console
//     if (feature.properties && feature.properties.popupContent) {
//         layer.bindPopup(feature.properties.popupContent);
//         console.log(feature.properties.popupContent)
//     }
// }
//
//
//
// // L.geoJSON method creates a geoJSON layer and passes through the geojsonFeature object
// // the onEachFeature function is called and the conditional statement starts
// // the resulting condition is added to the map with the addTo method
// L.geoJSON(geojsonFeature, {
//     onEachFeature: onEachFeature,
// }).addTo(mymap);
//
//
// // creation of a someFeatures object with type, properties, and geometry
// var someFeatures = [ {
//     "type": "Feature",
//     "properties": {
//         "name": "Busch Field",
//         "show_on_map": false
//     },
//     "geometry": {
//         "type": "Point",
//         "coordinates": [-104.98404, 39.74621]
//     }
// }];
//
//
// // L.geoJSON method creates a geoJSON layer and passes through the someFeatures object
// // a filter function is used to return poperties show_on_map from someFeatures. However, it does not show up because show_on_map is false in the someFeatures object
// // the addTo method adds the someFeatures object and filtered selection as a new layer to the map
// L.geoJSON(someFeatures, {
//     filter: function(feature, layer) {
//         return feature.properties.show_on_map;
//     }
// }).addTo(mymap);
