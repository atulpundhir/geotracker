var pubnub =  PUBNUB.init({
	publish_key: 'pub-c-0446378e-f47a-4aa2-a7a7-374e0acc15eb',
	subscribe_key: 'sub-c-580adb24-6b3c-11e5-bcab-02ee2ddab7fe',
	uuid: my_uuid
});

pubnub.subscribe({
	channel: "hello_world",
	presence: checkPresence,
	message: getMessage
	
});

function getMessage(data){
	console.log(data);
}

function checkPresence(data){
	console.log(data);
}
function pub(message){
	pubnub.publish({
		channel: "hello_world",
		message: message,
		callback: function(m) {console.log("publishing..."); console.log(m)}
	});	
}

var lat = document.getElementById("show_lat");
var lon = document.getElementById("show_long");
var currentLocation = '';
function getLocation(){
	currentLocation = navigator.geolocation.watchPosition(showLocation, showError);
}

function showLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var loc = {"latitude": latitude, "longitude": longitude, "uuid": my_uuid};
	pub(JSON.stringify(loc));
	lat.innerHTML = latitude; 
	lon.innerHTML = longitude; 
	
}

function showError(error){
	switch(error.code){
		case error.PERMISSION_DENIED:
			lat.innerHTML = "You have denied sharing geoLocation";
			break;
		case error.POSITION_UNAVAILABLE:
			lat.innerHTML = "GeoLocation information is unavailable";
			break;
		case error.TIMEOUT:
			lat.innerHTML = "Timedout";
			break;
		case error.UNKNOWN_ERROR:
			lat.innerHTML = "An unknown error occured";
			break;
	}
}

function clearLocation(){
	navigator.geolocation.clearWatch(currentLocation);	
}

