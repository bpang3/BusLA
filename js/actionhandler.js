/*
 * filterRoutePlaces filters places to show only places associated with given route
 * @param string routeName: name of route to filter based on
 */
function filterRoutePlaces(routeName) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].routes.indexOf(routeName) == -1) {
            places[i].marker.setMap(null);
            $('div[data-placename="' + places[i].name + '"]').hide();
        }
        else {
            places[i].marker.setMap(map);
            $('div[data-placename="' + places[i].name + '"]').show();
        }
    }
}

function showPlacesByType(placeType) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].type == placeType && (!activeRoute || places[i].routes.indexOf(activeRoute) != -1)) {
            places[i].marker.setMap(map);
            $('div[data-placename="' + places[i].name + '"]').show();
        }
    }
}

function hidePlacesByType(placeType) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].type == placeType) {
            places[i].marker.setMap(null);
            $('div[data-placename="' + places[i].name + '"]').hide();
        }
    }
}

function showPlacesByCost(placeCost) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].cost == placeCost && (!activeRoute || places[i].routes.indexOf(activeRoute) != -1)
                ) {
            places[i].marker.setMap(map);
            $('div[data-placename="' + places[i].name + '"]').show();
        }
    }
}

function hidePlacesByCost(placeCost) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].cost == placeCost) {
            places[i].marker.setMap(null);
            $('div[data-placename="' + places[i].name + '"]').hide();
        }
    }
}

$(document).ready(function() {
    $('#switchView').click(function() {
        if($('#switchView').data('viewtype') == "map") {
            $('#map-canvas').hide();
            $('#listview').show();
            $('#switchView').text("Switch to Map");
            $('#switchView').data('viewtype', 'list');
        }
        else if($('#switchView').data('viewtype') == "list") {
            console.log("clicked");
            $('#map-canvas').show();
            $('#listview').hide();
            $('#switchView').text("Switch to List");
            $('#switchView').data('viewtype', 'map');
        }
    });
    
    $('#typeFilter input:checkbox').change(function() {
        if ($(this).is(":checked")) {
            showPlacesByType(this.value);
            $('#costFilter input:checkbox:not(:checked)').each(function() {
                hidePlacesByCost(this.value);
            });
        }
        else
            hidePlacesByType(this.value);
    });

    $('#costFilter input:checkbox').change(function() {
        if ($(this).is(":checked")) {
            showPlacesByCost(this.value);
            $('#typeFilter input:checkbox:not(:checked)').each(function() {
                hidePlacesByType(this.value);
            });
        }
        else
            hidePlacesByCost(this.value);
    });

    $("#showRoutes").click(function() {
        for (var i = 0; i < NUM_ROUTES; i++)
            routePaths[i].polyline.setOptions({strokeOpacity: 0.85});
        for (var i = 0; i < places.length; i++) {
            places[i].marker.setMap(map);
            $('div[data-placename="' + places[i].name + '"]').show();
        }
        $('#costFilter input:checkbox:not(:checked)').each(function() {
                hidePlacesByCost(this.value);
            });
        $('#typeFilter input:checkbox:not(:checked)').each(function() {
                hidePlacesByType(this.value);
            });
    });
    
    $("#showAll").click(function() {
        $('#costFilter input:checkbox:not(:checked)').each(function() {
                showPlacesByCost(this.value);
                this.checked = true;
            });
        $('#typeFilter input:checkbox:not(:checked)').each(function() {
                showPlacesByType(this.value);
                this.checked = true;
            });
    });
});