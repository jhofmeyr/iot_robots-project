#!/usr/bin/env node

//SPHERE ORB STUFf
const sphero = require("sphero")
const keypress = require("keypress")

//keypress(process.stdin);
 
// process.stdin.on('keypress', function (ch, key) {
//   //console.log('got "keypress"', key);
//     if (key && key.ctrl && key.name == 'c') {
//         process.stdin.pause();
//	 process.exit();
//     }
//	 if (key.name == 'c') {
//		 console.log("C KEY PRESSED")
//	 }
//});

//process.stdin.setRawMode(true);
//process.stdin.resume();

//const spheroId = process.argv[2]

// G: FD:94:C6:CA:0E:C0
const spheroId = 'E6:EA:05:40:23:68'
const orb = sphero(spheroId)

const streamData = require("./lib/dataStream")
//const stdin = process.openStdin()



// AWS IOT STUFFS
const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'ottoes'

const device = awsIot.device({
	   keyPath: 'certificates/9a5279bde6-private.pem.key',
	  certPath: 'certificates/9a5279bde6-certificate.pem.crt',
	    caPath: 'certificates/pp.pem',
	  clientId: `${username}-subscribe`,
	      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
	console.log('Subscriber client connected to AWS IoT cloud.\n');
	//orb.streamAccelerometer();

	device.publish('OP_ORB_DATA', JSON.stringify(
		{
			"GYRO": ""
		}
	));

	device.subscribe('OP_ORB');
});

device.on('message', (topic, payload) => {
	let message = JSON.parse(payload.toString());
	switch (topic) {
		case 'OP_ORB':
			//orb.streamGyroscope()
			console.log(`message: ${payload.toString()}` + ' , date' + Date.now())
			//let command = "orb." + message.cmd + "('" + message.arg1 + "'" + addArg(message.arg2) + ")"
			let command = "orb." + message.cmd
			console.log("test: " + command)
			try {
				let result = eval(command)
				//let result = eval("orb.color('red')")
				console.log("[EXECUTING]: " + result)
			} catch(error) {
				console.log(error)
			}
			break;
	}
});

function addArg(arg) {
	if (arg != "") {
		return ", '" + arg + "'"
	}
	return ""
}

//stdin.addListener("data", function(data) {
//
//	let command = "orb." + data.toString().trim()
//
//	try {
//		let result = eval(command)
//		console.log("[EXECUTING]: " + result)
//
//	} catch(error) {
//		console.log(error)
//	}
//})

orb.connect(() => {

	console.log("connected... waiting for input:")
	orb.configureCollisions((meth=3, xt=30, xs=30, yt=200, ys=0, dead=.2))
	orb.setMotionTimeout(200)
	orb.detectCollisions();

	orb.on("collision", function(data) {
		orb.color('red')

		  console.log("data:");
		  console.log("  x:", data.x);
		  console.log("  y:", data.y);
		  console.log("  z:", data.z);
		  console.log("  axis:", data.axis);
		  console.log("  xMagnitud:", data.xMagnitud);
		  console.log("  yMagnitud:", data.yMagnitud);
		  console.log("  speed:", data.timeStamp);
		  console.log("  timeStamp:", data.timeStamp);
		setTimeout(function() {
			      orb.color("blue");
			    }, 1000);
	});

	// output sphero sensor data
	// below is in sphero/lib/devices/custom.js
	orb.on("imuAngles", function(data) {
		streamData.imuAngles(data)
	})

	orb.on("odometer", function(data) {
		streamData.odometer(data)
	})

	orb.on("gyroscope", function(data) {
		streamData.gyroscope(data)
	})

	orb.on("velocity", function(data) {
		streamData.velocity(data)
	})

	orb.on("accelOne", function(data) {
		streamData.accelOne(data)
	})
	orb.on("accelerometer", function(data) {
		streamData.accelerometer(data)
	})
	orb.on("motorsBackEmf", function(data) {
		streamData.motorsBackEmf(data)
	})

})

orb.disconnect(() => {

});

