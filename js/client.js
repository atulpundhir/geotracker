var pubnub =  PUBNUB.init({
	publish_key: 'pub-c-0446378e-f47a-4aa2-a7a7-374e0acc15eb',
	subscribe_key: 'sub-c-580adb24-6b3c-11e5-bcab-02ee2ddab7fe',
        heartbeat: 15,
	uuid: my_uuid
});

pubnub.subscribe({
	channel: "tracking",
	presence: checkPresence,
	message: getMessage
	
});


function getMessage(data){
	console.log(data);
}

function checkPresence(data){
	console.log(data);
}
function pub(message, chan){
        pubnub.publish({
		channel: chan,
		message: message,
		callback: function(m) {console.log("publishing..."); console.log(m)}
	});	

}

var lat = document.getElementById("show_lat");
var lon = document.getElementById("show_long");
var currentLocation = '';
function getLocation(){
	currentLocation = navigator.geolocation.getCurrentPosition(showLocation, showError);
}

function showLocation(position){
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var heading = position.coords.heading;
	var loc = {"latitude": latitude, "longitude": longitude, "uuid": my_uuid, "heading" : heading };
	if(my_uuid == 'route'){
		pub(JSON.stringify(loc), 'user2_tracking');
	}else{
		pub(JSON.stringify(loc), 'tracking');
	}
	lat.innerHTML = latitude; 
	lon.innerHTML = longitude; 
	
}

function sendMessage(){
   var msg = document.getElementById("sel_message").value;
   var payload = {"msg": msg, "uuid": my_uuid};
   pub(JSON.stringify(payload), 'message');
}


/*Only for simulator*/
function publish(latitude, longitude, heading, chan){
	chan = typeof chan !== 'undefined' ? chan: 'tracking';
	var loc = {"latitude": latitude, "longitude": longitude, "uuid": my_uuid, "heading" : heading};
	console.log(chan);
	pub(JSON.stringify(loc), chan);
	
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

function disconnect(){
    console.log("Disconnecting...")

    /*Added subscribe to make sure leave event is fired. https://www.pubnub.com/knowledge-base/discussion/324/do-client-disconnects-trigger-leave-events*/
    pubnub.subscribe({
        channel: "disconnecting",
	message: getMessage
    }); 
	
    if(my_uuid == 'route'){
         pubnub.unsubscribe({
           channel : 'user2_tracking',
       });
    
    }     
     pubnub.unsubscribe({
       channel : 'tracking',
   });

   window.location.href = "thanks.html"
}


/*
function unsubscribe(){
     pubnub.unsubscribe({
       channel : 'tracking',
   });
   return "Let's go" 
}

window.onbeforeunload = function(){
    pubnub.unsubscribe({
       channel : 'tracking',
   });
   return 'Are you sure';
}

*/
