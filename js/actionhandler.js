
/*
 * filterRoutes filters places to show only places associated with given route
 * @param string routeName: name of route to filter based on
 */
function filterRoutes(routeName) {
    for (var i = 0; i < places.length; i++) {
        if (places[i].routes.indexOf(routeName) == -1) {
            places[i].marker.setMap(null);
        }
        else
            places[i].marker.setMap(map);
    }
}

function showType(type) {
    for (var i = 0; i < places.length; i++)
        if (places[i].type == type)
            places[i].marker.setMap(map);
}

function hideType(type) {
    for (var i = 0; i < places.length; i++)
        if (places[i].type == type)
            places[i].marker.setMap(null);
}

function showCost(cost) {
    for (var i = 0; i < places.length; i++)
        if (places[i].cost == type)
            places[i].marker.setMap(map);
}

function hideType(cost) {
    for (var i = 0; i < places.length; i++)
        if (places[i].cost == type)
            places[i].marker.setMap(null);
}


$(document).ready(function() {
    $('#typeFilter input:checkbox').change(function() {
        if($(this).is(":checked"))
            showType(this.value);
        else
            hideType(this.value);
    });
});

//TODO: make sure everything has cost