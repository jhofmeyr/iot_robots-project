# Dual Sphero PubSub IoT Application

In this **OfferZen** Make Day, we used 2 sphero robots to implement a PubSub IoT system. 
One Sphero (the *leader*) was set up to roll around commande by keystrokes, while doing so it published a JSON object containing it's speed and (x, y) position to the AWS Cloud. The second Sphero (*The follower*) was made to change it's colour based on the quadrant position of the first. 

This illustrates how a device's state can be controlled based on another's using AWS's PubSub cloud product. It could be applied to many different IoT applications

------ Project Structure

All the project's file's are in the **src** folder. It consists of a controller - which is the main script that handle's program initialization and flow. This script instantiates the following objects to handle requirements modularly:

- **PubSubInterface** - Handles are PubSub events and subscriptions
- **MobilityDriver** - Fancy name Brandon gave the class that controls driving the leader Sphero and feeding back it's metrics
- **ColourController** - A super simple class to set the colour of the Sphero

------ Controller

This is a script that just calls the inits on each class and handles the routing of data. It starts by taking a keyboard input (0 or 1) to initialize either a *leader* or *follower*.

------ PubSub Interface

The PubSubInterface initializes itself based on what type of sphero it's running on (the code actually runs on the Raspberry Pi that connects to the Sphero via Blutooth, but you know what we mean). 

#### Follower
##### `initDevice()`

Initializes the device with the correct certs, and registers 3 listeners on that `device` object:
- onConnect - When fired sets up the device to subscribe to the topics it needs to (based on whether it's a *follower* or *leader*) as stored in the `subTopics` array. 
- onError - Simply just logs the error, but important to register when this happens (we dodn't have this issue though)
- onMessage - This is fired every time the a message is posted to the topic the device subscribes to. The `PubSubInterface` class actually passes the message straight to the `handleNewMsg` class to handle this (for modularity). 

Note that optional binding is used - `var self = this` - and is necessary because when the callback's fire, the context is different and the `this` instance object actually refers to the `device` object, not the instance of the `PubSubInterface` class. 

#### Handling message routing

Message routing is handled simply. After initialization, the `Controller` script will call 2 methods - `setupColorUpdator` and `setupManualColorUpdator` - to register callback functions/event handlers/listeners (what ever you like to call them) to be invoked when the `device` gets a new message. 

#### Publishing

The publish method is so simple there isn't much to explain. We had a weird thing happen where on unwrapping published JSON strings using `JSON.parse()` the original name of the JSON object was included. E.g:

```javascript
{
  messageJSON: {
    // Here was the actual json
  }
}
```

This could have been because of the call to `stringify` before publishing, maybe remove that. 

------ Mobility Driver

The `MobilityDriver` class initializes a sphero to move based on key commands:
- <-- as you'd imagine
- --> as you'd imagine
- ^   as you'd imagine
- Down as you'd imagine (couldn't find a text-icon for it)
- m - go faster / increase speed
- n - reduce speed (Woah denise!)
- q - Complete calibration (which it will automatically start)

The `MobilityDriver` passes data up to the controller at set intervals using a timer function. 

------ Colour Controller

What's life without a bit of mystery? We'll leave this for you to figure out.

------ Certificates

We put the certification in two different folders (as they are named), and the are referenced to init the devices based on whether the given device is the leader or follower. 

------ Caveat

We were messing around at the end of the day with the `MobilityController` class to effectivly build an acceleration based high-pass filter (i.e. collision detection), but didn't quite finish it. None of that code should have made it's way onto this branch, but we're sorry if it did and if it breaks the running of this code. But hey, solving problems is always good, so it's a win win for you. 

Happy hacking. 
Peza, Brandon and Jason x

