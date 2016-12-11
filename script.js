//TODO: Make filters (use in the search API call)

//AFTER HITTING search
//TODO: if someone clicks on marker, bring up info about that place 
//TODO: be able to click on a place and add to itinerary
//TODO: allow user to mark a place as already visited

//ONCE USER CLICKS MAKE DIRECTIONS
//TODO: code to find shortest distance using distance matrix API
//TODO: code to give the user their directions


var autocomplete1, autocomplete2, city, lat, lng, map, latStart, lngStart;
var zoomLev = 13;

function initialize() {
	initAutocomplete();
	initMap();
}

// Google autocomplete feature and get place name and id
function initAutocomplete() {
	autocomplete1 = new google.maps.places.Autocomplete(
		(document.getElementById('address')), {types:['(cities)']});
	autocomplete1.addListener('place_changed', function() {
		city = autocomplete1.getPlace().name;
		lat = autocomplete1.getPlace().geometry.location.lat();
		lng = autocomplete1.getPlace().geometry.location.lng();
	});

	autocomplete2 = new google.maps.places.Autocomplete(
		(document.getElementById('start')));
	autocomplete2.addListener('start_address_updated', function() {
		latStart = autocomplete1.getPlace().geometry.location.lat();
		lngStart = autocomplete1.getPlace().geometry.location.lng();
	});
}

//Initialize the hidden map to random values
function initMap() {
	var loc = new google.maps.LatLng(-33.8665, 151.1956);
	map = new google.maps.Map(document.getElementById('map'), {
		center: loc,
		zoom: 15
	});
}

// Press search button
function search() {
	document.getElementById('map').style.visibility = 'visible';
	var top = document.getElementById('map').offsetTop;
	var left = document.getElementById('map').offsetLeft;
	window.scrollTo(left, top);

	var loc = new google.maps.LatLng(lat, lng);
	map = new google.maps.Map(document.getElementById('map'), {
		center: loc,
		zoom: zoomLev,
	});

	var types = getFilters();
	var request = {
		location: loc,
		radius: '3000',
		keyword: ['things to do'],
	};

	var service = new google.maps.places.PlacesService(map);
	
	if(types.length == 0) {
		service.nearbySearch(request, callback);
	}
	else {
		for (var i = 0; i < types.length; i++) {
		request.type = [types[i]];
		service.nearbySearch(request, callback);
		}
	}

	google.maps.event.addListener(map, 'zoom_changed', function() {
		zoomLev = map.zoom;
		service = new google.maps.places.PlacesService(map);
		request.location = map.getCenter();
		service.nearbySearch(request, callback);
	});

	google.maps.event.addListener(map, 'center_changed', function() {
		service = new google.maps.places.PlacesService(map);
		request.location = map.getCenter();
		service.nearbySearch(request, callback);
	});
}

//get search results
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

//add markers to the map
function createMarker(place) {
	// var myIcon = new google.maps.MarkerImage('https://cdn3.iconfinder.com/data/icons/map/500/restaurant-512.png',
	// 	null, null, null, new google.maps.Size(21,30));
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		//icon: myIcon
	});
	// marker.addListener('click', function() {
	// 	console.log(place.types);
	// });
	var infowindow = new google.maps.InfoWindow({
    content: ""
  });
	google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<p>Event Name: '+this.position+'</p>' +
            '<button onclick="myFunction(\''+ this.position + '\')">Add this to itinerary</button>');


    infowindow.open(map, this);
  });

}
var positions = [];
function myFunction(test) {
  positions.push(test);
  console.log(positions);
}
function getFilters() {
	var types = [];
	if (document.getElementById("arts").checked) {
		types.push('art_gallery');
		types.push('book_store');
		types.push('library');
		types.push('movie_theater');
		types.push('museum');
	}
	if (document.getElementById("food").checked) {
		types.push('bakery');
		types.push('cafe');
		types.push('restaurant');
		types.push('meal_takeaway');
	}
	if (document.getElementById("Nightlife").checked) {
		types.push('bar');
		types.push('casino');
		types.push('night_club');
	}
	if (document.getElementById("Religion").checked) {
		types.push('synagogue');
		types.push('church');
		types.push('hindu_temple');
		types.push('mosque');
	}
	if (document.getElementById("Recreation").checked) {
		types.push('amusement_park');
		types.push('aquarium');
		types.push('bowling_alley');
		types.push('park');
		types.push('shopping_mall');
		types.push('spa');
		types.push('stadium');
		types.push('zoo');
	}
	return types;
}

