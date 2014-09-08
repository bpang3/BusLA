var map;
var infowindow = new google.maps.InfoWindow({maxWidth: 350});

function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(34.0722, -118.4441),
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

    drawRoute("data/maproutes/big_blue_bus_1.json", "#779ecb");
    drawRoute("data/maproutes/big_blue_bus_12.json", "#ffb347");
    drawRoute("data/maproutes/big_blue_bus_2.json", "#fdfd96");
    drawRoute("data/maproutes/big_blue_bus_3.json", "#c23b22");
    drawRoute("data/maproutes/culver_city_6.json", "#f49ac2");
    drawRoute("data/maproutes/metro_20.json", "#aec6cf");
    drawRoute("data/maproutes/metro_2_302.json", "#b19cd9");
    drawRoute("data/maproutes/metro_534.json", "#966fd6");
    drawRoute("data/maproutes/metro_720.json", "#b39eb5");
    drawRoute("data/maproutes/metro_761.json", "#dea5a4");
    drawRoute("data/maproutes/metro_expo_806.json", "#03c03c");
    drawEvents("data/events.json");
}

function drawRoute(filePath, color) {
    $.getJSON(filePath, function(routeJSON) {
        var routeCoordinates = [];
        for (i in routeJSON.bus_stops) {
            routeCoordinates[i] = new google.maps.LatLng(routeJSON.bus_stops[i].lat, routeJSON.bus_stops[i].lon);
        }
        var routePath = new google.maps.Polyline({
            path: routeCoordinates,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.9,
            strokeWeight: 10
        });
        routePath.setMap(map);
    });
}

function drawEvents(filePath) {
    $.getJSON(filePath, function(eventJSON) {
        for (var i = 0; i < eventJSON.length; i++) {
            addMarker(eventJSON[i]);
        }
    });
}

function addMarker(event) {
    /* TODO: add more event fields to description */
    var contentString = '<div id="content">' +
            '<h1>' + event.name + '</h1>' +
            '<h2>' + event.district + '</h2>' +
            '<p>' + event.description + '</p></div>';
    var pinIcon = new google.maps.MarkerImage(
            "img/pinicons/" + event.type + ".png",
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(22, 29)
        );
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(event.lat, event.lng),
        map: map,
        title: event.name,
        draggable: false,
        icon: pinIcon
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(window.map, marker);
    });
}

google.maps.event.addDomListener(window, 'load', initializeMap);
