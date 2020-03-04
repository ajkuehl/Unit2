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
  getData();
};

function calcMinValue(data){
  // create an empty array  to store data values
  var allValues = [];
  // loop through each country
  for (var country of data.features){

    for(var year=1995; year <=2016; year+=3){
      // get # of arrivals for current year
      var value = country.properties["Non-Resident Arrivals_" + String(year)];

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
  // console.log(minValue);

  // constant factor adjusts symbol sizes evenly
  var minRadius = 1;
  // flannery appearance compensation formula
  var radius = 1.0083*Math.pow(attValue/minValue,0.5715)* minRadius
  // console.log(radius);
  return radius;
};

// step 3 add circle markers for point features to the map
function pointToLayer(feature,latlng,attributes){
  // step 4 determine the attribute for scaling the proportional symbols
  var attribute = attributes[0];
  console.log(attribute);
  // create marker options
  var options ={
      // radius: 8,.......... old code
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
  };

  // for each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]);
  // console.log(attValue);

  // give each feature's circle marker a radius based on its attribute value
  options.radius = calcPropRadius(attValue);
// console.log(options.radius);
  // create circle marker Layer
  var layer = L.circleMarker(latlng, options);
  // console.log(layer);

  // build popup content String starting with country
  var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
  // <p><b>"+ attribute + ":</b>" + feature.properties[attribute]+"</p>";
  // console.log(popupContent);

  // add formatted attribute to popup content String
  var year= attribute.split("_")[1];
  popupContent += "<p><b> Number of non-resident arrivals in " + year +":</b> " + feature.properties[attribute] + " in the thousands.</p>";
  // console.log(year);

  // bind the popup toteh circle marker
  // offsetting the popupContent
  layer.bindPopup(popupContent, {
    offset: new L.Point(0,-options.radius)
  });
  // console.log(layer.bindPopup(popupContent));
  // console.log(layer);

  // return the circle marker to the L.geoJson pointToLayeroption
  return layer;

};

// Add circle makrers for point features to the map
function createPropSymbols(data,attributes){
  // console.log(data);
  // create a leaflet GeoJSONlayer and add it to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature,latlng,attributes);
    }
  }).addTo(map);
};


// Step 1: Create new sequence controls
// functioncreateSequenceControls(attributes){................... recommended by hayley
function createSequenceControls(attributes){
  // create range input element(slider)
  $('#panel').append('<input class="range-slider" type="range">');
  // set slider attributes
  $('.range-slider').attr({
    max: 14,
    min: 0,
    value: 0,
    step: 1
  });

  $('.step').click(function(){
    // get old index value
    var index = $('.range-slider').val();

    // step 6 increment or decrement depending on button selected
    if ($(this).attr('id')=='forward'){
      index++;
      // step 7 if past the last attribute, wrap around to first attribute
      index = index > 7 ? 0: index;
    } else if ($(this).attr('id')=='reverse'){
      index--;
      // step 7 if past the frist attribute, wrap around to the last attribute
      index = index < 0 ? 7 : index;
    };
    updatePropSymbols(attributes[index]);

    // step 8 update slider
    $('.range-slider').val(index);
    // createSequenceControls
  });

  // step 5: input listener for slider
  $('.range-slider').on('input',function(){
    // step 6: get the new index values
    var index = $(this).val();
    console.log(index);
    // console.log('hello');

  // Step 9 pass new attribute to update symbols
  updatePropSymbols(attributes[index]);
    // console.log('hello');
  });

// step 10 Resize proportional symbols according to new attribute values
// this function not working
function updatePropSymbols(attribute){
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      // access feature properties
      var props = layer.feature.properties;
      console.log(props);

      // update each feature's radius based on new attribute values
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);

      // add country to popup content string
      var popupContent = "<p><b><Country:</b>" + props.Country + "</p>";

      // add formatted attribute to panel conent String
      var year = attribute.split("_")[1];
      popupContent += "<p><b>Number of non-resident arrivals in " + year + ":</b>" + props[attribute] + " thousands</p>";
      // update popup content
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
    };
  });
};


};

// step 3.1 Changing Attributes
function processData(data){
  // emplty array to hold attributes
  var attributes =[];
  // properties of the first feature in the dataset
  var properties = data.features[0].properties;
  // loop to push each attribute name into attributes array
  for (var attribute in properties){
    // only take attributes with population allValues
    if (attribute.indexOf("Non-Resident Arrivals") > -1){
      attributes.push(attribute);
    };
  };
  // check result
  console.log(attributes);

  return attributes;
};

// Step 2 make step buttons
$('#panel').append('<button class="step" id="reverse">Reverse</button>');
$('#panel').append('<button class="step" id="forward">Forward</button>');

// replace button content with images
// this isn't working..................fix
// $('#reverse').html('img src ="img/reverse.png">');
// $('#forward').html('img src ="img/forward.png">');



// Import Geojson data
// function getData()
function getData(map){
  // load data
  $.ajax("data/NonResidentArrivals.geojson", {
    dataType: "json",
    success: function(response){
      // create an attributes array
      var attributes = processData(response);
      // minValue needs to stay defined
      minValue = calcMinValue(response);

      createPropSymbols(response,attributes);
      createSequenceControls(attributes);
    }
  });
};



$(document).ready(createMap);
