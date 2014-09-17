function showRoute() {
	var startlat = parseFloat($("#startlat").val());
	var startlon = parseFloat($("#startlon").val());
	var endlat = parseFloat($("#endlat").val());
	var endlon = parseFloat($("#endlon").val());

	var centerPoint = new google.maps.LatLng((startlat + endlat)/2,(startlon + endlon)/2);

	var map = new google.maps.Map(document.getElementById('map-canvas'), {
    	center: centerPoint,
    	zoom: 13
  	});

	
	var directions = new google.maps.DirectionsService(); 
	var maprequest = { 
		origin: new google.maps.LatLng(startlat,startlon), 
		destination: new google.maps.LatLng(endlat,endlon), 
		travelMode: google.maps.DirectionsTravelMode.TRANSIT 
	};

	var routePath = new google.maps.Polyline({
		path: [],
		strokeWeight: 4,
		strokeColor: '#33ccFF',
	});
	
	directions.route(maprequest, function(result, status) { 
		if (status == google.maps.DirectionsStatus.OK) {
			path = result.routes[0].overview_path;
			var bounds = new google.maps.LatLngBounds();

			$(path).each(function(i, k) {
				routePath.getPath().push(k);
				bounds.extend(k);
			})

			routePath.setMap(map);
			map.fitBounds(bounds);
		}
	});
}

function getJSON() {
	var routeObject = {};

	var startlat = parseFloat($("#startlat").val());
	var startlon = parseFloat($("#startlon").val());
	var endlat = parseFloat($("#endlat").val());
	var endlon = parseFloat($("#endlon").val());
	

	routeObject.route_name = $("#routeName").val();
	routeObject.bus_stops = {};

	var centerPoint = new google.maps.LatLng((startlat + endlat)/2,(startlon + endlon)/2);

	var map = new google.maps.Map(document.getElementById('map-canvas'), {
    	center: centerPoint,
    	zoom: 13
  	});

	
	var directions = new google.maps.DirectionsService(); 
	var maprequest = { 
		origin: new google.maps.LatLng(startlat,startlon), 
		destination: new google.maps.LatLng(endlat,endlon), 
		travelMode: google.maps.DirectionsTravelMode.TRANSIT 
	};
	
	directions.route(maprequest, function(result, status) { 
		if (status == google.maps.DirectionsStatus.OK) {
			path = result.routes[0].overview_path;
			var bounds = new google.maps.LatLngBounds();
			var routePath = new google.maps.Polyline({
				path: [],
				strokeWeight: 4,
				strokeColor: '#33ccFF',
			});

			$(path).each(function(i, k) {
				routePath.getPath().push(k);
				bounds.extend(k);
			})

			for(i in path) {
				console.log(path[i])
				routeObject.bus_stops[i] = {"lat" : path[i].k, "lon" : path[i].B};
			}

			routePath.setMap(map);
			map.fitBounds(bounds);
		}

		console.log(routeObject);
		var resultWindow = window.open();
		resultWindow.document.write(JSON.stringify(routeObject));
	});
}