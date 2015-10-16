var map = null;
var gmarkers = [];
var firstData = true;
var intervalNumber = 0;
var iconBase = 'img/';
var customIcon = new google.maps.MarkerImage("img/m4.png", null, null, null, new google.maps.Size(30,30));
var icon = {
   // path: "M150 0 L165 40 L135 40 Z",
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    fillColor: '#FF0000',
    fillOpacity: 1,
    anchor: new google.maps.Point(0,0),
    strokeWeight: 0,
    scale: 6,
    rotation: 0
}
var pubnub = PUBNUB.init({
	publish_key: 'pub-c-0446378e-f47a-4aa2-a7a7-374e0acc15eb',
	subscribe_key: 'sub-c-580adb24-6b3c-11e5-bcab-02ee2ddab7fe',
});
console.log("Subscring....");
pubnub.subscribe({
	channel: "tracking",
	presence: checkPresence,
	message: drawMap
	
});

function checkPresence(data){
//	console.log(data);
//	document.getElementById("online-users").innerHTML = "Hi Atul, you have "+data.occupancy+" users online"
}

function drawMap(message, env, ch, timer, magic_ch){
	var message = JSON.parse(message);
	var latLng = new google.maps.LatLng(message.latitude, message.longitude);
	console.log(message);
	if(gmarkers.indexOf(message.uuid) == -1){
		icon.fillColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		icon.rotation = message.heading;
		var infowindow = new google.maps.InfoWindow({
		  content:" Yay !!! I'm here "
		  });
		window[message.uuid] = new google.maps.Marker({position: latLng, map: map, title: message.uuid, icon: icon, animation: google.maps.Animation.DROP });
		gmarkers.push(message.uuid);
		window[message.uuid].set("id", message.uuid);
		console.log(gmarkers.length);
		checkPresence({"occupancy": gmarkers.length})
		infowindow.open(map, window[message.uuid]);
		setTimeout(function(){infowindow.close();}, '2000');
		window[message.uuid].addListener('click', function(){ showRoute(message.uuid, message.latitude, message.longitude)});
	}else{
		window[message.uuid].setPosition(latLng)
		if(message.heading > 0 && message.heading <= 360){
			icon.rotation = message.heading;
			window[message.uuid].setOptions({icon:icon})
		}
		//window[message.uuid].setRotation(message.heading);
	}
	//marker.setMap(map);
	//map.panTo(new google.maps.LatLng(message.latitude, message.longitude))
	//map.setZoom(8);
	//console.log(marker);
}


function initialize() {
	console.log("called")
    var mapOptions = {
        center: new google.maps.LatLng(35.6833, 139.6833),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    if (gmarkers.length > 0) {
        for (var i = 0; i < gmarkers.length; i++) {
            gmarkers[i].setMap(map);
        }
    }
	
}

function showRoute(arg, latitude, longitude){
	window[arg].setMap(map);
	map.setZoom(16);
	map.panTo(new google.maps.LatLng(latitude, longitude))
	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map);
	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
//	map.panTo(new google.maps.LatLng(message.latitude, message.longitude))
}



function CenterControl(controlDiv, map) {

  	// Set CSS for the control border.
	var controlUI = document.createElement('div');
	controlUI.style.backgroundColor = '#3498db';
	controlUI.style.border = '2px solid #fff';
	controlUI.style.borderRadius = '3px';
	controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';    
	controlUI.style.cursor = 'pointer';                
	controlUI.style.marginBottom = '22px';
	controlUI.style.textAlign = 'center'; 
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	var controlText = document.createElement('div');
	controlText.style.color = '#FFFFFF';
	controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';	  
	controlText.style.lineHeight = '38px';
  	controlText.style.paddingLeft = '5px';
	controlText.style.paddingRight = '5px';
	controlText.innerHTML = 'Back To Full View';
	controlUI.appendChild(controlText);

	// Setup the click event listeners: simply set the map to Chicago.
	controlUI.addEventListener('click', function() {
		map.setCenter(new google.maps.LatLng(35.6833, 139.6833));
		map.setZoom(11);
		map.controls[google.maps.ControlPosition.TOP_CENTER].clear()
	});
}
