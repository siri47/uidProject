//TODO: Make filters (use in the search API call)
//TODO: search places API for "things to do in" + city entered

//AFTER HITTING search
//TODO: bring up map with markers
//TODO: if someone clicks on marker, bring up info about that place 
//TODO: be able to click on a place and add to itinerary
//TODO: allow user to mark a place as already visited

//ONCE USER CLICKS MAKE DIRECTIONS
//TODO: code to find shortest distance using distance matrix API
//TODO: code to give the user their directions


var autocomplete1, autocomplete2, city, lat, lng, map, latStart, lngStart;

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

//Initialize the hidden map
function initMap() {
	var loc = new google.maps.LatLng(-33.8665, 151.1956);
	map = new google.maps.Map(document.getElementById('map'), {
		center: loc,
		zoom: 15
	});
}



//TODO: This code is what happens when the user hits the search button. I'm having trouble
// getting the map to show but we'll also have to bring up the new page/whatever that the
// map is on


// Press search button
function search() {
	document.getElementById('map').style.visibility = 'visible';
	var top = document.getElementById('map').offsetTop;
	var left = document.getElementById('map').offsetLeft;
	window.scrollTo(left, top);

	var loc = new google.maps.LatLng(lat, lng);
	map = new google.maps.Map(document.getElementById('map'), {
		center: loc,
		zoom: 13
	});

	//TODO: add type here if selected by user
	var types = '';
	var request = {
		location: loc,
		radius: '3000',
		keyword: ['things to do'],
		type: [types]
	};

	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

	google.maps.event.addListener(map, 'zoom_changed', function() {
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

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
}