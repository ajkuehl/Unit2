// Ashley Kuehl, GEOG 575
// Activity 6 Main: Non-Resident Arrivals by the thousands.
// dataSource: United Nations, World Tourism Data  http://data.un.org/DocumentData.aspx?id=409
// years 1995 - 2016, displayed as increments of three years


//creation of the map object declaired globally
var map;
// declaring the minimum value globally
var minValue;



// map properties and method to place map in HTML file
// Create Leaflet Map
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
  getData();
};



// data passed through to calcMinValue function
function calcMinValue(data){
  // create an empty array  to store data values
  var allValues = [];
  // loop through each country in data set
  for (var country of data.features){
    // data set starts at year 95 and goes through 2016, intervals of 3 years
    for(var year=1995; year <=2016; year+=3){
      // get # of arrivals for current year
      var value = country.properties["Non-Resident Arrivals_" + String(year)];
      // add values to empty allValues array above
      allValues.push(value);
    }
  }
  // get minimum value of our array as a starting point to display data
  var minValue = Math.min(...allValues)
  return minValue;
}



// calculate the radius of each proportional symbol, passing through allValues array
function calcPropRadius(attValue){
  // constant factor adjusts symbol sizes evenly
  // working with large numbers, therefore minradius is adjusted in size to not overwhelm user
  var minRadius = 1;
  // flannery appearance compensation formula
  var radius = 1.0083*Math.pow(attValue/minValue,0.5715)* minRadius
  return radius;
};



// Add circle markers for point features to the map
function pointToLayer(feature,latlng,attributes){
  // Determine the attribute for scaling the proportional symbols, starting with first year/index 0
  var attribute = attributes[0];
  // create marker styling options
  var options ={
      fillColor: "#7932a8",
      color: "#000",
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

  // build popup content String starting with country
  var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

  // add formatted attribute to popup content String
  var year= attribute.split("_")[1];
  popupContent += "<p><b> Number of non-resident arrivals by the thousands " + year +":</b> " + feature.properties[attribute] + "</p>";

  // bind the popup to the circle marker
  // offsetting the popupContent on map to not cover up marker
  layer.bindPopup(popupContent, {
    offset: new L.Point(0,-options.radius)
  });

  // return the circle marker to the L.geoJson pointToLayeroption
  return layer;
};



// Add circle makrers for point features to the map, passing through data and attributes(defined below in getdata function)
function createPropSymbols(data,attributes){
  // create a leaflet GeoJSONlayer and add it to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature,latlng,attributes);
    }
  }).addTo(map);
};



// Create new sequence controls, passing through attributes defined below
function createSequenceControls(attributes){
  // create range input element(slider) using jquery to select the div panel appending the slider to the div
  $('#panel').append('<input class="range-slider" type="range">');

  // set slider attributes using jquery
  $('.range-slider').attr({
    max: 14,
    min: 0,
    value: 0,
    step: 1
  });

  // Input listener for buttons
  // create step using jquery click function
  $('.step').click(function(){
    // Index vakue of data is set to the slider element
    var index = $('.range-slider').val();
    // Conditional statement to increment or decrement depending on forward or reverse button selection
    if ($(this).attr('id')=='forward'){
      index++;
      // If user selects past last attribute, wrap around to first attribute to start over
      // data contains 8 years to pull from
      index = index > 7 ? 0: index;
    } else if ($(this).attr('id')=='reverse'){
      index--;
      // If user selects prior to first attribute, wrap around to the last attribute
      index = index < 0 ? 7 : index;
    };
    // Calling the updatePropSymbols function and passing through attributes indexed for clicking action
    updatePropSymbols(attributes[index]);
    // As user selects index values, update slider
    $('.range-slider').val(index);
  });


  // Create input listener for slider using jquery on function
  $('.range-slider').on('input',function(){
    // Get the new index values
    var index = $(this).val();
    // check log to see if working correctly, it is!
    console.log(index);
    // Calling the updatePropSymbols function and passing through attributes indexed for sliding action
    updatePropSymbols(attributes[index]);
  });



// Resize proportional symbols according to new attribute values, new map layer for each indexed attribute
function updatePropSymbols(attribute){
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      // access feature properties
      var props = layer.feature.properties;
      // update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);
      // add country to popup content string
      var popupContent = "<p><b><Country:</b>" + props.Country + "</p>";
      // add formatted attribute to panel conent String
      var year = attribute.split("_")[1];
      popupContent += "<p><b>Number of non-resident arrivals by the thousands " + year + ":</b> " + props[attribute] + "</p>";
      // update popup content
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
    };
  });
};


};



// Changing attributes using processData function
function processData(data){
  // create emplty array to hold attributes
  var attributes =[];
  // properties of the first feature in the dataset, index 0 (year 1995)
  var properties = data.features[0].properties;
  // loop through data to push each attribute name into attributes array
  for (var attribute in properties){
    if (attribute.indexOf("Non-Resident Arrivals") > -1){
      attributes.push(attribute);
    };
  };
  // check result. Hey it works!
  console.log(attributes);
  return attributes;
};



// Create step buttons using jquery to select div panel and append method to add button to the div
$('#panel').append('<button class="step" id="reverse">Reverse</button>');
$('#panel').append('<button class="step" id="forward">Forward</button>');

// replace button content with images
$('#reverse').html('<img src ="img/reverse.png">');
$('#forward').html('<img src ="img/forward.png">');



// Import Geojson data, here I deviated from lab instructions as I ended up with two getData functions
// function below combines the two functions. I found it was necessary to keep the minValue defined
function getData(map){
  // load data
  $.ajax("data/NonResidentArrivals.geojson", {
    dataType: "json",
    success: function(response){
      // define attributes with what's going on in the processData function above
      // basially creation of an empty array to hold attributes from data
      var attributes = processData(response);
      // minValue needs to stay defined as used in calcMinValue function
      minValue = calcMinValue(response);
      // passing attributes to the two functions below
      createPropSymbols(response,attributes);
      createSequenceControls(attributes);
    }
  });
};


// Ready, get set, view!
$(document).ready(createMap);
