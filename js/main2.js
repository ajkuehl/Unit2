// Ashley Kuehl, GEOG 575, Activity 6 Main: Non-Resident Arrivals by the thousands.
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
  for (var country of data.features){
    for(var year=1995; year <=2016; year+=3){
      // get # of arrivals for current year
      // console.log(country.properties)
      var value = country.properties["Non-Resident Arrivals " + String(year)];

      // add values to array
      allValues.push(value);
    }
  }
  // get minimum value of our array
  var minValue = Math.min(...allValues)

// play with the min value depending on data. Larger countries may look nuts.
  return minValue;

}

// calculate the radius of each proportional symbol
function calcPropRadius(attValue){
  //console.log(attValue);
  // constant factor adjusts symbol sizes evenly
  var minRadius = 1;
  // flannery appearance compensation formula
  var radius = 1.0083*Math.pow(attValue/minValue,0.5715)* minRadius
  // console.log(radius);
  return radius;
};

// step 3 add circle markers for point features to the map
function createPropSymbols(data){
  // step 4 determine the attribute for scaling the proportional symbols
  var attribute = "Non-Resident Arrivals 2016";
  // create marker options
  var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };
  // create a Leaflet GeoJSON layer and add it to the map
  L.geoJson(data,{
      pointToLayer: function (feature,latlng){

        // step 5 for each feature, determine its value for the selected attribute, number function makes the string attribute into a number
        var attValue = Number(feature.properties[attribute]);

        // step 6 Give each feature's circle marker a radius based on its attribute value
        geojsonMarkerOptions.radius = calcPropRadius(attValue);

        // create circle markers
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
  }).addTo(map);
};

// step 2 import geoJson data
function getData(map){
  // load data
  $.getJSON("data/NonResidentArrivals2.geojson", function(response){
    // calculate minimum data value
    minValue = calcMinValue(response);

    // call function to create proportional symbols
    createPropSymbols(response);
  });
};


$(document).ready(createMap);
