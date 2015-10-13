var map = null;
var gmarkers = [];
var firstData = true;
var intervalNumber = 0;
var iconBase = 'img/';
var customIcon = new google.maps.MarkerImage("img/m4.png", null, null, null, new google.maps.Size(30,30));
var pubnub = PUBNUB.init({
	publish_key: 'pub-c-0446378e-f47a-4aa2-a7a7-374e0acc15eb',
	subscribe_key: 'sub-c-580adb24-6b3c-11e5-bcab-02ee2ddab7fe',
});
console.log("Subscring....");
pubnub.subscribe({
	channel: "hello_world",
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
//	console.log(message);
	if(gmarkers.indexOf(message.uuid) == -1){
		window[message.uuid] = new google.maps.Marker({position: latLng, map: map, title: message.uuid, icon: customIcon });
		gmarkers.push(message.uuid);
		window[message.uuid].set("id", message.uuid);
		console.log(gmarkers.length);
		checkPresence({"occupancy": gmarkers.length})
	}else{
		window[message.uuid].setPosition(latLng)
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


