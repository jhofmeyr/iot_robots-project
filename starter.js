#!/usr/bin/env node
const spheroId = 'F5:77:55:BE:40:A2'
const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
   keyPath: '/home/pi/make/iot_robots/projects/sphero-cli/certificates/4606d6ca19-private.pem.key',
  certPath: '/home/pi/make/iot_robots/projects/sphero-cli/certificates/4606d6ca19-certificate.pem.crt',
    caPath: '/home/pi/make/iot_robots/projects/sphero-cli/certificates/ca-cert.pem',
  clientId: `team-bully`,
			host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});


const sphero = require("sphero")

const orb = sphero(spheroId)

const streamData = require("./lib/dataStream")
//const stdin = process.openStdin()

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('swarm');
  // TODO subscribe to more topics here
});

device.on('message', (topic, payload) => {
  var message = JSON.parse(payload.toString())
  if (topic == 'swarm') {
    switch (message.action) {
      case 'roll':
        orb.roll(message.speed, message.direction);
        break;
      case 'stop':
        orb.roll(0,0);
        break;
      case 'color':
        orb.color(message.color)
				break;
      case 'drawplus':
        drawPlus();
				break;
			case 'calibrate':
			    if (message.mode == 'start'){

					} else {

					}
					break;
			default:{
				orb.setRawMotors({lmode: 0x01, lpower: 255, rmode: 0x01, rpower: 255});
			}
    }
  }
  //{ action: 'roll', speed: 10, direction: 100 }
  //{ action: 'stop' }
  //{ action: 'color', color: 'blue' }
  //console.log('message from ', topic)
  //console.log('payload: ', payload.toString())
});

 orb.connect(() => {
  orb.color("red");
	 
	console.log("Awaiting swarm command...")
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






