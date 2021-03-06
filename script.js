var autocomplete1, autocomplete2, city, lat, lng, map, latStart, lngStart, graph, startAddress;
var zoomLev = 13;
var result = []; // has ordering for current items in itinerary
var positions = []; // stores co-ordinates of all address
var desiredOrderPositions = []; // updates every time new result is there
var adresses = []; // stores all address
var markers = []
var getDir = false;
var addrList="";
var infowindow, res;
var names = [];

function DFSUtil(v,visited,mst)
{
    visited[v] = true;
    result.push(v);
    var len = mst[v].length;
    for (var i = 0; i < len; ++i){
    	if(!visited[mst[v][i]])
    		DFSUtil(mst[v][i], visited, mst);
    }
}

function dfs(mst, V){ // for finding right order in MST
    var visited = new Array(V);
    for (var i = 0; i < V; i++)
        visited[i] = false;
    for (var i = 0; i < V; i++)
        if (visited[i] == false)
            DFSUtil(i, visited,mst); //utility function
    return result;
}

function minKey(key, mstSet,V) //util function for finsing MST
{
   // Initialize min value
   var min = 35555, min_index;
 
   for (var v = 0; v < V; v++)
     if (mstSet[v] == false && key[v] < min)
         min = key[v], min_index = v;
 
   return min_index;
}

function createMST(parent, n, graph) // util function to create MST
{
   var mst = new Array(n);
   for(i = 0; i <n;i++)
   		mst[i] = [];

   for (var i = 1; i < n; i++){
   	mst[parent[i]].push(i);
   }
      return mst;
}

function primMST(graph,V){ //creates MST
     var parent=[]; 
     var key=[];   
     var mstSet=[];
     var mst = [];      

     for (var i = 0; i < V; i++){
        key[i] = 35555, mstSet[i] = false;
     }
 
     
     key[0] = 0;     
     parent[0] = -1; 
 
     for (var count = 0; count < V-1; count++)
     {
        
        var u = minKey(key, mstSet,V);
 
        mstSet[u] = true;

        for (var v = 0; v < V; v++){
          if (graph[u][v] && mstSet[v] == false && graph[u][v] <  key[v])
             parent[v]  = u, key[v] = graph[u][v];
        }
     }
     mst = createMST(parent, V, graph);
 	return mst;
        
}


function initialize() {
	initAutocomplete();
	initMap();
	infowindow = new google.maps.InfoWindow({});
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
	autocomplete2.addListener('place_changed', function() {
		startAddress = autocomplete2.getPlace().name;
		latStart = autocomplete2.getPlace().geometry.location.lat();
		lngStart = autocomplete2.getPlace().geometry.location.lng();
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

// Press  button
function search() {
	getDir = false;
	var startPosition = new google.maps.LatLng(latStart, lngStart);
	positions.push(startPosition);
	adresses.push(startAddress);

	document.getElementById('text').style.visibility = 'hidden';
	document.getElementById('goto').style.visibility = 'hidden';
	document.getElementById('map2').style.visibility = 'hidden';
	document.getElementById('dir').style.visibility = 'hidden';
	document.getElementById('map').style.visibility = 'visible';
	document.getElementById('itin').style.visibility = 'visible';

	var top = document.getElementById('lala').offsetTop;
	var left = document.getElementById('lala').offsetLeft;
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
	if(!getDir)
		service.nearbySearch(request, callback);
	});

	google.maps.event.addListener(map, 'center_changed', function() {
	service = new google.maps.places.PlacesService(map);
	request.location = map.getCenter();
	if(!getDir)
		service.nearbySearch(request, callback);
	});
}

//get  results
function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			if (results[i].rating > '4.0') {
				createMarker(results[i]);
			}
			createMarker(results[i], infowindow);
		}
	}
}

//add markers to the map
function createMarker(place, infowindow) {
	types = place.types;
	if(document.getElementById('arts').checked || document.getElementById('food').checked ||
		document.getElementById('Nightlife').checked || document.getElementById('Religion').checked ||
		document.getElementById('Recreation').checked) {
		if (types.includes('art_gallery') || types.includes('book_store') ||
			types.includes('library') || types.includes('movie_theater') ||
			types.includes('museum')) {
			var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FF3969",
				new google.maps.Size(21,34),
				new google.maps.Point(0,0),
				new google.maps.Point(10,34));
		}
		else if (types.includes('bakery') || types.includes('cafe') ||
			types.includes('restaurant') || types.includes('meal_takeaway')) {
			var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000FF",
				new google.maps.Size(21,34),
				new google.maps.Point(0,0),
				new google.maps.Point(10,34));
		}
		else if (types.includes('bar') || types.includes('casino') ||
			types.includes('night_club')) {
			var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FF00",
				new google.maps.Size(21,34),
				new google.maps.Point(0,0),
				new google.maps.Point(10,34));
		}
		else if (types.includes('synagogue') || types.includes('church') ||
			types.includes('hindu_temple') || types.includes('mosque')) {
			var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFD700",
				new google.maps.Size(21,34),
				new google.maps.Point(0,0),
				new google.maps.Point(10,34));
		}
		else if (types.includes('amusement_park') || types.includes('aquarium') ||
			types.includes('bowling_alley') || types.includes('park') ||
			types.includes('shopping_mall') || types.includes('spa') || 
			types.includes('stadium') || types.includes('zoo')) {
			var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|ADD8E6",
				new google.maps.Size(21,34),
				new google.maps.Point(0,0),
				new google.maps.Point(10,34));
		}
	}
	else {
		var pinImage = null;
	}

	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: pinImage
	});

	google.maps.event.addListener(marker, 'click', function() {
		var open, rating, name;
		if(place.opening_hours == null)
			open =  "";
		else if(place.opening_hours.open_now == true)
			open = "OPEN NOW";
		else
			open = "CLOSED NOW";

		if(place.rating == null)
			rating = "Not enough ratings"
		else
			rating = place.rating;

		if(place.name == null)
			name = "";
		else
			name = place.name;
	
    infowindow.setContent('<p><b> '+ name +'</b></p>' + '<p>Rating: '+ rating +'</p>'+ '<p>'+ open+'</p>'+
            '<button onclick="myFunction(\''+ this.position.lat() + '\', \''+ this.position.lng() + '\', \''+ name.substring(0,12) + '\')">Add this to itinerary</button>');

    infowindow.open(map, this);
  }); 
	markers.push(marker);
}

function myFunction(lat,lng,name) { // function to add to a place in itinerary
  var loc = new google.maps.LatLng(lat, lng);
  if (adresses.includes(name)) {
  	window.alert("This location is already in your itinerary!");
  }
  else {
  	positions.push(loc);
  	adresses.push(name);
    addrList="";
    for(var i = 1; i < adresses.length; i++){
        addrList+="<option>"+adresses[i]+"</option><br/>" ;         
    }
  document.getElementById("list").innerHTML=addrList;  
    document.getElementById("list").size=adresses.length-1;   
  	distanceMatrix(); //api calling function
  }
}

function deleteThisPlace() {
    var x = document.getElementById("list");
 	positions.splice(x.selectedIndex+1, 1);
 	adresses.splice(x.selectedIndex+1, 1);
    x.remove(x.selectedIndex);
    distanceMatrix();
}

function distanceMatrix() {
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
  	{
    	origins: positions,
    	destinations: positions,
    	travelMode: 'DRIVING',
  	}, parse);
}

function parse(response, status) {
	if(status == 'OK'){
		var origins = response.originAddresses;
		graph = new Array(origins.length);
    	for(var i = 0; i < origins.length; i++){
    		var results = response.rows[i].elements;
    		var distances = new Array(results.length);
    		for(var j = 0; j < results.length; j++){
    			
    			var element = results[j];
    			distances[j] = element.distance.value;
    		}
    		graph[i] = distances;
    	}
    	desiredOrderPositions = desirableOrder(graph, origins.length);
	}
}

function desirableOrder(graph, V) // entry function to find desired order
{
	var mst = primMST(graph, V); //first make MST of graph
	result = [];
	var final_order = dfs(mst, V); //do pre-order walk on the mst to find right order
	return final_order;
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

function makeItinerary(){
    var placesList="";
    for(var i = 0; i < desiredOrderPositions.length; i++){
		placesList+="<br/>"+adresses[desiredOrderPositions[i]];
    }
    if(!placesList){
		alert("Add places you want to visit to your itinerary!");        
    }else{
    	document.getElementById("optList").innerHTML=placesList;
    	document.getElementById("getDir").style.visibility = 'visible';
    }
}

//get both map directons and driving directions
function getDirections() {
	var map2 = new google.maps.Map(document.getElementById("map2"), {
		zoom: zoomLev,
		center: {lat: lat, lng: lng}
	});

	var top = document.getElementById('map2').offsetTop;
	var left = document.getElementById('map2').offsetLeft;
	document.getElementById('dir').innerHTML = "";
	window.scrollTo(left, top);

	getDir = true;
	var directions = new google.maps.DirectionsService();
	var directionsDisp = new google.maps.DirectionsRenderer();
	directionsDisp.setMap(map2);
	directionsDisp.setPanel(document.getElementById('dir'));

	var waypoints = [];
	for (var i = 1; i < desiredOrderPositions.length; i++) {
		waypoints.push({
			location: positions[desiredOrderPositions[i]],
		    stopover: true
		});
	}
	var request = {
		origin: positions[0],
		destination: positions[0],
		travelMode: 'DRIVING',
		waypoints:  waypoints
	};
	directions.route(request, function(result, status) {
		if (status == 'OK') {
			directionsDisp.setDirections(result);
			res = result;
		}
	});

	document.getElementById('text').style.visibility = 'visible';
	document.getElementById('map2').style.visibility = 'visible';
	document.getElementById('dir').style.visibility = 'visible';
	document.getElementById('wrapper2').style.visibility = 'visible';
	document.getElementById('save').style.visibility = 'visible';
	document.getElementById('goto').style.visibility = 'visible';
}

function loadDir(result) {
	var top = document.getElementById('map2').offsetTop;
	var left = document.getElementById('map2').offsetLeft;
	window.scrollTo(left, top);

	var loc = new google.maps.LatLng(-33.8665, 151.1956);
	map = new google.maps.Map(document.getElementById('map2'), {
		center: loc,
		zoom: 15
	});

	document.getElementById('save').style.visibility = 'hidden';
	document.getElementById('wrapper2').style.visibility = 'hidden';
	document.getElementById('add').style.visibility = 'hidden';
	document.getElementById('map').style.visibility = 'hidden';
	document.getElementById('itin').style.visibility = 'hidden';
	document.getElementById('getDir').style.visibility = 'hidden';
	document.getElementById('map2').style.visibility = 'visible';
	document.getElementById('text').style.visibility = 'visible';
	document.getElementById('goto').style.visibility = 'visible';

	document.getElementById('dir').innerHTML = "";
	var directionsDisp = new google.maps.DirectionsRenderer();
	directionsDisp.setMap(map);
	directionsDisp.setPanel(document.getElementById('dir'));
	directionsDisp.setDirections(result['dir']);
}

function saveItin() {
	var name = prompt("Please name your itinerary");
	names.push(name);

	var toSave = {
		'name': name,
		'dir': res,
	};

	localStorage.setItem(name, JSON.stringify(toSave));
	var save = document.createElement('a');
	save.innerHTML = name;
	document.getElementById('addItin').appendChild(save);
	localStorage.setItem('nameArr', names);
}

window.onload = function() {
	var nameArr = localStorage.nameArr
	if(nameArr) {
		nameArr = nameArr.split(',');
	}
	for(var i = 0; i < nameArr.length; i++) {
		var load = localStorage.getItem(nameArr[i]);
		if(load) {
			var n = document.createElement('a');
			n.innerHTML = nameArr[i] + '<br>';
			n.id = nameArr[i];
			document.getElementById('addItin').appendChild(n);
		}
	}
	names = nameArr;

	var child = document.getElementById('addItin').childNodes;
	for (var i = 0; i < child.length; i++) {
		child[i].addEventListener('click', function (){
			loadDir(JSON.parse(localStorage.getItem(this.id)));
		});
	}

}

function scroll() {
	var top = document.getElementById('itin').offsetTop;
	var left = document.getElementById('itin').offsetLeft;
	window.scrollTo(left, top);
}

