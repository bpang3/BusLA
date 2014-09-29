/*
 * globals
 */
var map;
var infowindow = new google.maps.InfoWindow({maxWidth: 420});
var businfo = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0, -5)});
var routePaths = [];
var activeRoute = false;
var places = [];
const NUM_ROUTES = 11;


/*
 * initializeMap initializes the map
 */
function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(34.0722, -118.4441), // map centered at UCLA, go Bruins!
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapTheme,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
    routePaths[0] = drawRoute("data/maproutes/big_blue_bus_1.json", "#186BCB");
    routePaths[1] = drawRoute("data/maproutes/big_blue_bus_12.json", "#26FF00");
    routePaths[2] = drawRoute("data/maproutes/big_blue_bus_2.json", "#FFF824");
    routePaths[3] = drawRoute("data/maproutes/big_blue_bus_3.json", "#C7361C");
    routePaths[4] = drawRoute("data/maproutes/culver_city_6.json", "#E32B7E");
    routePaths[5] = drawRoute("data/maproutes/metro_20.json", "#12BEFF");
    routePaths[6] = drawRoute("data/maproutes/metro_2_302.json", "#8143F7");
    routePaths[7] = drawRoute("data/maproutes/metro_534.json", "#00C8EB");
    routePaths[8] = drawRoute("data/maproutes/metro_720.json", "#06C472");
    routePaths[9] = drawRoute("data/maproutes/metro_761.json", "#FA5204");
    routePaths[10] = drawRoute("data/maproutes/metro_expo_806.json", "#F514F5");
    drawEvents("data/places.json");
}

/*
 * drawRoute creates a Polyline from a JSON with the bus route
 * and stores a route object as a global variable
 * @param string filePath: path to JSON bus route
 * @param string color: hex color of the path
 * @returns routeObj
 */
function drawRoute(filePath, color) {
    var routeObj = {};
    $.getJSON(filePath, function(routeJSON) {
        var routeCoordinates = [];
        for (i in routeJSON.bus_stops) {
            routeCoordinates[i] = new google.maps.LatLng(
                    routeJSON.bus_stops[i].lat, routeJSON.bus_stops[i].lon);
        }
        routeObj.polyline = new google.maps.Polyline({
            path: routeCoordinates,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.85,
            strokeWeight: 10
        });
        routeObj.polyline.setMap(map);
        routeObj.name = routeJSON.route_name;
        // event listener to hide all other routes and associated places on click
        google.maps.event.addListener(routeObj.polyline, 'click', function() {
            for (var i = 0; i < NUM_ROUTES; i++)
                routePaths[i].polyline.setOptions({strokeOpacity: 0.25});
            routeObj.polyline.setOptions({strokeOpacity: 0.85});
            filterRoutePlaces(routeObj.name);
            activeRoute = routeObj.name;
            $('#costFilter input:checkbox:not(:checked)').each(function() {
                hidePlacesByCost(this.value);
            });
            $('#typeFilter input:checkbox:not(:checked)').each(function() {
                hidePlacesByType(this.value);
            });
        });
        // event listener to show name of route on mouseover
        google.maps.event.addListener(routeObj.polyline, 'mouseover', function(event) {
            businfo.setContent("<div style='line-height: 1.35;overflow: hidden;white-space: nowrap;'><h4>"
                    + routeObj.name + "</h4></div>");
            businfo.setPosition(event.latLng);
            businfo.open(window.map);
        });
        google.maps.event.addListener(routeObj.polyline, 'mousemove', function(event) {
            businfo.setPosition(event.latLng);
        });
        google.maps.event.addListener(routeObj.polyline, 'mouseout', function(event) {
            businfo.close();
        });
    });
    return routeObj;
}

/*
 * drawEvents draws markers for all events stored in given JSON and stores them
 * in global array
 * @param string filePath: path to JSON with all places
 */
function drawEvents(filePath) {
    $.getJSON(filePath, function(eventJSON) {
        for (var i = 0; i < eventJSON.length; i++) {
            function addMarker(place) {
                var contentString = '<div><h4>' + place.name + ' | '
                        + place.district + ' | ' + place.cost;
                contentString = contentString + '</h4><p>'
                if ('link' in place) {
                    contentString = contentString + '<a href=\''
                            + place.link + '\'>website</a> | ';
                }
                contentString = contentString + '<a href=\'http://maps.google.com/maps?\n\saddr='
                        + 'University+of+California,+Los+Angeles,+Los+Angeles,+CA+90095&daddr='
                        + place.lat + ',' + place.lng + '&dirflg=r/' + '\'>get me there</a></p>';
                contentString = contentString + '</p><p>' + place.description + '</p>' +
                        '<img src=\'img/places/' + place.picture_path + '\' \n\
                            style=\'width:100%;max-height:250px\'></div>';
                var pinIcon = new google.maps.MarkerImage(
                        "img/pinicons/" + place.type + ".png",
                        null, /* size is determined at runtime */
                        null, /* origin is 0,0 */
                        null, /* anchor is bottom center of the scaled image */
                        new google.maps.Size(22, 29)
                        );
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(place.lat, place.lng),
                    map: map,
                    title: place.name,
                    draggable: false,
                    icon: pinIcon
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(contentString);
                    infowindow.open(window.map, marker);
                    //pan to center to marker then pan down to center infowindow
                    map.panTo(marker.getPosition());
                    map.panBy(0, -130);
                });
                placeObj = place;
                placeObj.marker = marker;
                places[places.length] = placeObj;
                
                //append content to list view
                
                $('<div data-placename = "' + place.name + '" class="listviewitem">' 
                        + contentString + '</div>').appendTo('#listview');
            }
            addMarker(eventJSON[i]);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initializeMap);