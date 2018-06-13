#!/usr/bin/env node

const awsIot = require('aws-iot-device-sdk');
//const moment = require('moment'); // for DateTime formatting
const username = 'arn:aws:iot:us-west-2:444146409335:thing/BullyBall' // TODO: replace this

const device = awsIot.device({
   keyPath: '/home/pi/make/iot_robots/projects/sphero-cli/certificates/4606d6ca19-private.pem.key',
  certPath: '/home/pi/make/iot_robots/projects/sphero-cli/certificates/4606d6ca19-certificate.pem.crt',
    caPath: '/home/pi/make/iot_robots/projects/sphero-cli/certificates/ca-cert.pem',
  clientId: `team-bully`,
			host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});


const sphero = require("sphero")
const spheroId = 'F5:77:55:BE:40:A2'
const orb = sphero(spheroId)

const streamData = require("./lib/dataStream")
//const stdin = process.openStdin()

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('bullyball1');
  // TODO subscribe to more topics here
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
    case 'bullyball1':
		 console.log(`Message received on topic "${topic}"\n`);
		  drawPlus();
		 break;

		default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});

// stdin.addListener("data", function(data) {

// 	let command = "orb." + data.toString().trim()

// 	try {
// 		let result = eval(command)
// 		console.log("[EXECUTING]: " + result)

// 	} catch(error) {
// 		console.log(error)
// 	}
// })

 orb.connect(() => {

	console.log("connected... waiting for input:")

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

// 	drawPlus();
 })

orb.disconnect(() => {

});

function drawPlus(){
	orb.color("green").delay(1000).then(() => {
  return forward1unit();
}).then(() => {
  return back1unit();
}).then(() => {
  return left1unit();
}).then(() => {
  return right1unit();
}).then(() => {
  return back1unit();
}).then(() => {
  return forward1unit();
}).then(() => {
  return right1unit();
}).then(() => {
  return left1unit();
})
}

var heading;
var baseunit = 50;
function forward1unit(){
	heading = 0;
	return orb.roll(baseunit,0).delay(2000);
}

function back1unit() {
	heading = 180;	
	return orb.roll(baseunit,180).delay(2000)
}

function left1unit() {
	heading = 270;
	return orb.roll(baseunit,270).delay(2000);
}

function right1unit() {
	heading = 90;
	return orb.roll(baseunit,90).delay(2000);
}






