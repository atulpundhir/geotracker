from pubnub import Pubnub
import json

pubnub = Pubnub(publish_key='pub-c-0446378e-f47a-4aa2-a7a7-374e0acc15eb', subscribe_key='sub-c-580adb24-6b3c-11e5-bcab-02ee2ddab7fe');

def callback(message, channel):
    print(message);

def error(messagae):
    print("ERROR : " + str(message))

def connect():
    print("Connected")
    loc = {"latitude": 35.526426, "longitude": 139.695614, "uuid": 'python_client'};
    print pubnub.publish(channel='tracking', message=json.dumps(loc));

def reconnect(message):
    print('Reconnect')

def disconnect(message):
    print('Disconnected')

#pubnub.subscribe(channels="tracking", callback=callback, error=error, connect=connect, reconnect=reconnect, disconnect=disconnect)

if __name__ == "__main__":
    connect()
