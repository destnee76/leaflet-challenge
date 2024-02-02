// Store our API endpoint as queryUrl.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Add a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Perform a GET request to the query URL.
d3.json(url).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Create a GeoJSON layer containing the features array.
    // Each feature will be represented as a circle marker.

    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "crimson";
            case depth > 70:
                return "coral";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "yellowgreen";
            case depth > 10:
                return "lightgreen";
            default:
                return "turquoise";
        }
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 5, // Adjust the radius based on magnitude
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "black",
                fillOpacity: 0.5,
                stroke: 0.3,
                weight: 0.5
            });
        },
        onEachFeature: function (feature, layer) {
            // Add a popup with additional information when a marker is clicked.
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
                "<p>Magnitude: " + feature.properties.mag + "</p>"+
                "<p>Depth: " + feature.geometry.coordinates[2] + "</p>");
        }
    });

    // Add the earthquakes layer to a map.
    createMap(earthquakes);
 }

function createMap(earthquakes) {
    // Define a base layer.
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a Leaflet map object.
    let myMap = L.map("map", {
        center: [63.5888, -154.4931], // Alaska
        zoom: 3,
        layers: [streets]
    });

    // Add the base layer to the map.
    streetMap.addTo(myMap);

    // Add the earthquakes layer to the map.
    earthquakes.addTo(myMap);
    let legend =L.control({
        position:"bottomright"
       });
       legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML += '<i style="background: turquoise"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: lightgreen"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: yellowgreen"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: orange"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: coral"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: crimson"></i><span>90+</span><br>';
                
        return div;
      };
      legend.addTo(myMap);
}
