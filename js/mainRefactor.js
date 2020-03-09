// Ashley Kuehl, GEOG 575
// Activity 6 Main: Non-Resident Arrivals by the thousands.
// dataSource: United Nations, World Tourism Data  http://data.un.org/DocumentData.aspx?id=409
// years 1995 - 2016, displayed as increments of three years


//creation of the map object declaired globally
var map;
// circles????? ........................updates
var dataStats = {};
// declaring the minimum value globally
var minValue;



// map properties and method to place map in HTML file
// Create Leaflet Map
function createMap(){
  map = L.map('mapid',{
    center: [0,0],
    zoom: 2
  });

// create alias
L.map = function(id, options){
  return new L.Map(id,optins);
};



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
// function calcstats(data){
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
  // get min, max, mean stats for arrays
  dataStats.min = Math.min(...allValues);
  dataStats.max = Math.max(...allValues);

  // calculate mean
  var sum = allValues.reduce(function(a,b){return a+b;});
  dataStats.mean = sum/allValues.length;

  // get minimum value of our array as a starting point to display data
  // .........................old code .............................
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
  var popupContent = new PopupContent(feature.properties,attribute);
  // bind the popup to the circle marker
  // offsetting the popupContent on map to not cover up marker
  layer.bindPopup(popupContent.formatted, {
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
  var SequenceControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function(){
      // create the control container div with a particular class name
      var container = L.DomUtil.create('div', 'sequence-control-container');

      // initializing other Dom elements
      // create range input element(slider) using jquery to select the div panel appending the slider to the div
      $(container).append('<input class="range-slider"type="range">');

      // Create step buttons using jquery to select div panel and append method to add button to the div
      $(container).append('<button class="step" id="reverse" title="Reverse">Reverse</button>');
      $(container).append('<button class="step" id="forward" title="Forward">Forward</button>');

      // disable any mouse event lisenters for the container
      L.DomEvent.disableClickPropagation(container);

      return container;
    }
  });

  map.addControl(new SequenceControl());

  // set slider attributes using jquery..............................is this code necessary?
  $('.range-slider').attr({
    max: 7,
    min: 0,
    value: 0,
    step: 1
  });

  // replace button content with images
  $('#reverse').html('<img src ="img/reverse.png">');
  $('#forward').html('<img src ="img/forward.png">');

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
};


// UPDATE THIS >>>..........................................................................................................
// reference https://cartographicperspectives.org/index.php/journal/article/view/cp76-donohue-et-al/1307
// Create Legend control, passing through attributes
function createLegend(attributes){
  var LegendControl = L.Control.extend({
    options: {
      position:'bottomright'
    },
    onAdd: function() {
      // create the control container with a particular class name
      var container = L.DomUtil.create('div', 'legend-control-container');
      // Initializing other Dom elements

      // here I want to add a popup with an index of the date, function updateLegend (written into update propSymbols) will update index year)
      // create range input element(year index) using jquery to select the div panel appending the slider to the div
      // $(container).append('<input class ="year-index"type="text">');.....................

      // add temportal legend div to container.................... is popup correct?
      $(container).append('<div id="temporal-legend">');
      $(container).append(updatePropSymbols.popupContent);




      // step 1: start  attribute legend svg String
      // var svg = '<svg id="attribute-legend" class=" " width="130px" height="130px">';
      var svg = '<svg id="attribute-legend" width="200px" height="120px">';
      // array of circles names to base loop on
      var circles = ["max", "mean", "min"];
      // Loop to add each circle adn text to svg String
      for (var i=0; i<circles.length; i++){
        // assign the r and cy attributes
        var radius = calcPropRadius(dataStats[circles[i]]);
        var cy = 100 - radius;
        // circle String
        svg += '<circle class ="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#7932a8" fill-opacity ="0.8" stroke="#000000" cx="35"/>';

        // evenly space out labels
        var textY = i *20 +54;

        // test string
        svg += '<text id="' + circles[i] + '-text" x="70" y="' + textY + '">' + Math.round(dataStats[circles[i]]*100)/100 + " thousand" + '</text>';
      };
      // clsoe svg String
      svg += "</svg>";
      // add attribute legend svg to container
      $(container).append(svg);
      // disable any mouse event lisenters for the container.................................................add
      // L.DomEvent.disableClickPropagation(container);
      return container;
    }
  });
  map.addControl(new LegendControl());


  // Input listners for updating temporal legend "number of turistis in (year)"....................Not sure what to do here
  $('.temporal-legend').append('<h2> id="legendYear"> # of tourists in (year)</h2>');

  // Calling the updateLegend function and passing through attributes indexed for sliding action
  // need to add an updateLegend function to update PropSymbols function
  // updateLegend(attributes[0]);
};



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
      var popupContent = new PopupContent(props,attribute);
      // update popup content
      popup = layer.getPopup();
      popup.setContent(popupContent.formatted).update();
    };
  });
};



// consolidating redundant code
// Object Oriented code refeactoring with a constructor function
function PopupContent(properties, attribute){
  this.properties = properties;
  this.attribute = attribute;
  this.year = attribute.split("_")[1];
  this.population = this.properties[attribute]
  this.formatted = "<p><b><Country:</b>" + this.properties.Country + "</p><p><b>Number of non-resident arrivals by the thousands " + this.year + ":</b> " + this.population + "</p>";
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



// Import Geojson data
// function below has been refractored combining two getData functions
// I found it was necessary to keep the minValue variable defined to execute the calcMinValue and calcPropRadius functions properly
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

      // getting rid of minValue takes away my proportional symbols.
      // calcStats(response);

      // passing attributes to the two functions below
      createPropSymbols(response,attributes);
      createSequenceControls(attributes);
      createLegend(attributes);
      // createTitle();
    }
  });
};

// new code
// function getData(map){
//   // load data
//   $.getJSON("data/NonResidentArrivals.geojson", function(response){
//       // define attributes with what's going on in the processData function above
//       // basially creation of an empty array to hold attributes from data
//       var attributes = processData(response);
//       calcStats(response);
//
//
//
//       // passing attributes to the two functions below
//       createPropSymbols(response,attributes);
//       createSequenceControls(attributes);
//       createLegend(attributes);
//     }
//   });
// };




// Ready, get set, view!
$(document).ready(createMap);
