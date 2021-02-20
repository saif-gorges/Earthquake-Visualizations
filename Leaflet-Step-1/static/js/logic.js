// Creating map object
var myMap = L.map("map", {
    center: [38.89511, -77.03637],
    zoom: 6
  });
console.log("Earthquakes")

// Add tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Geojson link
var geodata_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Parse data using D3
d3.json(geodata_url, function(data) {
    console.log("Inside function to grab geojson data")
  
  // Return style data
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Determines the color of the marker based on magnitude
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
   // Determines radius of the earthquake marker based on magnitude.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
        }
      // Creating a geoJSON layer with the retrieved data
    L.geoJSON(data, {
    pointToLayer: function (feature, latlong) {
        return L.circleMarker(latlong);
        },

    style: styleInfo,

    onEachFeature: function(feature, layer) {

    layer.bindPopup("Earthquake Magnitude: " + feature.properties.mag + "<br>Earthquake Location:<br>" + feature.properties.place);
  }
}).addTo(myMap);
//add legend 
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),

    grades = [0, 1, 2, 3, 4, 5];

  //Legend Label Earthquake <break> Magnitude  
  div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'

  // loop through  intervals and generate label
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=

      '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};
//Add legend
legend.addTo(myMap);
});