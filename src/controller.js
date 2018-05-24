/*
 *  OfferZen Make Day 24 May 2018
 *  Team: Brandon Piner, Josh Perry, Jason Hady
 *
 *  Controller: Central controller to control program flow
 *  Author: All
 */

const PubSubInterface = require('./pubsub.js');
const MobilityDriver  = require('./MobilityDriver.js');
const ColourController  = require('./ColourController.js');
const F = "FA:34:A8:E7:D4:A7";	// Sphero Mac Address - each device has a label on D/F
const D = 'F5:77:55:BE:40:A2';
var stdin = process.openStdin();
var sphero = -1;	// default

// Pseudo enum for Sphero type
const spheroType = {
 	"leader": 		0,
 	"follower": 	1
}

// Get the type from the user running the code
console.log("What kind of sphero are you flashing to? \nLeader:\t\t0\nFollower:\t1");

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
    const userEntry = d.toString().trim(); 
    console.log("you entered: [" + userEntry + "]");

    if (sphero === -1){
    	// Sphero isn't set up yet, try set it
    	numEntry = Number(d);
    	if (numEntry === 0) {
    		// This is a leader
    		console.log(`CONTROLLER: Setting up leader`);
    		sphero = spheroType.leader;
    		startSphero();
    	}

    	else if (numEntry === 1) {
    		console.log(`CONTROLLER: Setting up follower`);
    		sphero = spheroType.follower;
    		startSphero();
    	}

    	else {
    		console.log(`Hmmm, invalid entry ${numEntry}, please try again`);
    	}
    }
 });

startSphero = function() {
	const macAddress = sphero ===spheroType.leader ? F : D;

	// Create objects to handle the required events - drive the sphero, set colour and pubsub between 2 of them
	const pubsub = new PubSubInterface(sphero);
	const mobilityDriver = new MobilityDriver(macAddress);
	const colorDriver = new ColourController(macAddress);

	/*
	 * On init of the mobility driver pass it the 
	 * callback to fire when it updates it's speed 
	 * and position
	 */
	if(sphero === spheroType.leader) {
		mobilityDriver.Init(metrics => {
			console.log(JSON.stringify(metrics));

			// Get position and speed
			const speed = metrics.speed;
			const xNew = metrics.x;
			const yNew = metrics.y;

			// Publish update with this info
			const pubObj = {
				message: "Hey, this is what I'm doing",
				x: xNew,
				y: yNew};

			pubsub.publishMsg('sheep/leader/update', pubObj);
		});
	}

	else {
		colorDriver.Init();

		/*
		 * 	Metrics come directly from PubSub JSON
		 *  Position: (use x, y) -> set value based on quadrants
		 */

		pubsub.setupColorUpdator(metrics => {
			// Get x - y value
			const x = metrics.messageJSON.x;
			const y = metrics.messageJSON.y;
			var colour;
			console.log(`x=${x},y=${y}`);
			// Set colour based on quadrant
			if (x >= 0) {
				if (y >= 0) {
					// Quad 1
					colour = 'red';
				} else {
					// Quad 2
					colour = 'blue';
				}
			} else {
				if (y >= 0) {
					// Quad 3
					colour = 'green';
				} else {
					// Quad 4
					colour = 'orange';		// Change this, orange is lame on a sphero
				}
			}

			// Call the colour update method on the sphero
			console.log(`CONTROLLER: Setting follower to ${colour}`);
			colorDriver.SetColour(colour);
		});

		pubsub.setupManualColorUpdator(message => {
			// Manually update the colour here - for testing
			console.log(`CONTROLLER: Setting colour to ${message.colour}`);
			colorDriver.SetColour(message.colour);
		});
	}
}

