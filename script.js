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

var autocomplete, city, lat, lng, map;

function initialize() {
	initAutocomplete();
	// $('#search').click(function() {
	// 	search();
	// });
}
// Google autocomplete feature and get place name and id
function initAutocomplete() {
	autocomplete = new google.maps.places.Autocomplete(
		(document.getElementById('address')), {types:['(cities)']});
	autocomplete.addListener('place_changed', function() {
		city = autocomplete.getPlace().name;
		lat = autocomplete.getPlace().geometry.location.lat();
		lng = autocomplete.getPlace().geometry.location.lng();
	});
}

//TODO: This code is what happens when the user hits the search button. I'm having trouble
// getting the map to show but we'll also have to bring up the new page/whatever that the
// map is on


// // Press search button
// function search() {
// 	var new_map = document.createElement('div');
// 	new_map.id = "map";
// 	document.getElementById('n_row').appendChild(new_map);

// 	//var loc = new google.maps.LatLng(lat, lng);
// 	var loc = {lat: lat, lng: lng};
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: loc,
// 		zoom: 15
// 	});

// 	//TODO: add type here if selected by user
// 	var request = {
// 		location: loc,
// 		radius: 500,
// 		keyword: ['things to do']
// 	};

// 	var service = new google.maps.places.PlacesService(map);
// 	service.nearbySearch(request, callback);
// }

// function callback(results, status) {
// 	if (status === google.maps.places.PlacesServiceStatus.OK) {
// 		for (var i = 0; i < results.length; i++) {
// 			createMarker(results[i]);
// 		}
// 	}
// }

// function createMarker(place) {
// 	var placeLoc = place.geometry.location;
// 	var marker = new google.maps.Marker({
// 		map: map,
// 		position: place.geometry.location
// 	});
// }