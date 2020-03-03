// Ashley Kuehl, GEOG 575, Activity 5 Main: Non-Resident Arrivals by the thousands.
// dataSource: United Nations, World Tourism Data  http://data.un.org/DocumentData.aspx?id=409, Non Resident Tourists/Visitors
// years 1995 - 2016

//creation of the map object
var map;
// declaring the minimum value globally
var minValue;
// map properties and method to place map in HTML file
// step 1 Create Leaflet Map
function createMap(){
  map = L.map('mapid',{
    center: [0,0],
    zoom: 2
  });
// tilelayer of map and addTo method passed to the map object
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  	subdomains: 'abcd',
  	maxZoom: 19
  }).addTo(map);

  // call getData function
  getData(map);
};

function calcMinValue(data){
  // create an empty array  to store data values
  var allValues = [];
  // loop through each country
  for (var city of data.features){
    console.log(data.features)
    for(var year=1985; year <=2015; year+=5){
      // get # of arrivals for current year
      var value = city.properties["Pop_" + String(year)];
      // add values to array
      allValues.push(value);
    }
  }
  // get minimum value of our array...................is this right?.......................
  var minValue = Math.min(...allValues)
// play with the min value depending on data. Larger countries may look nuts.
  return minValue;
  // console.log(allValues);
}

// calculate the radius of each proportional symbol
function calcPropRadius(attValue){
  // constant factor adjusts symbol sizes evenly
  var minRadius = 5;
  // flannery appearance compensation formula
  var radius = 1.0083*Math.pow(attValue/minValue,0.5715)* minRadius
  return radius;
};

// New code

// replacing anonymous function within the createPropSymbols function with new pointToLayer function
function pointToLayer(feature,latlng){
  // step 4 determine the attribute for scaling the proportional symbols
  var attribute = "Pop_2015";
  // create marker options
  // var geojsonMarkerOptions = {......... old code
  var options ={
      // radius: 8,.......... old code
      fillColor: "#ff7800",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

  // for each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]);

  // give each feature's circle marker a radius based on its attribute value
  options.radius = calcPropRadius(attValue);

  // create circle marker Layer
  var layer = L.circleMarker(latlng, options);
  // console.log(layer);

  // build popup content String starting with country
  // This isn't getting read. Reading as undefined
  var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
  // "<p><b>"+ attribute + ":</b> " + feature.properties[attribute]+"</p>";
  console.log(popupContent);
  // add formatted attribute to popup content String
  var year = attribute.split("_")[1];
  popupContent += "<p><b> Population in " + year +":</b> " + feature.properties[attribute] + "million.</p>";
  console.log(year);

  // bind the popup toteh circle marker
  layer.bindPopup(popupContent);

  // return the circle marker to the L.geoJson pointToLayeroption
  return layer;
};


// Add circle makrers for point features to teh map
function createPropSymbols(data, map){
  // create a leaflet GeoJSONlayer and add it to the map
  L.geoJson(data, {
    pointToLayer: pointToLayer
  }).addTo(map);
};



// // step 3 add circle markers for point features to the map
// function createPropSymbols(data){
//   // step 4 determine the attribute for scaling the proportional symbols
//   var attribute = "Pop_2015";
//   // create marker options
//   var geojsonMarkerOptions = {
//       radius: 8,
//       fillColor: "#ff7800",
//       color: "#fff",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.8
//   };
//   // create a Leaflet GeoJSON layer and add it to the map
//   L.geoJson(data,{
//       pointToLayer: function (feature,latlng){
//
//         // step 5 for each feature, determine its value for the selected attribute, number function makes the string attribute into a number
//         // number function not working
//         var attValue = Number(feature.properties[attribute]);
//
//         // step 6 Give each feature's circle marker a radius based on its attribute value
//         geojsonMarkerOptions.radius = calcPropRadius(attValue);
//
//         //console.log(feature.properties,attValue);
//         // create circle markers
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//       }
//   }).addTo(map);
// };

// step 2 import geoJson data
// function getData(map)
function getData(map){
  // load data
  $.getJSON("data/MegaCities.geojson", function(response){
    // calculate minimum data value
    minValue = calcMinValue(response);
    // L.geoJson(response, {.........don't know what this is about. old code?.................

    // call function to create proportional symbols
    createPropSymbols(response);
      // onEachFeature: onEachFeature..... old code
    // }).addTo(map);..... old code
  });
};


$(document).ready(createMap);
