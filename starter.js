#!/usr/bin/env node
const spheroId = 'F5:77:55:BE:40:A2'
const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
   keyPath: 'certificates/4606d6ca19-private.pem.key',
  certPath: 'certificates/4606d6ca19-certificate.pem.crt',
    caPath: 'certificates/ca-cert.pem',
  clientId: spheroId,
			host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

const sphero = require("sphero")
const orb = sphero(spheroId)
const streamData = require("./lib/dataStream")

device.on('connect', () => {
  console.log('Hive mind connected.\n');
  device.subscribe('swarm');
});

device.on('message', (topic, payload) => {
	console.log('Borg hive-mind message received\n')
  var message = JSON.parse(payload.toString())
  if (topic == 'swarm') {
    orb.color(message.color);					
    switch (message.action) {
      case 'roll':
        orb.roll(message.speed, message.direction);
        break;
      case 'stop':
        orb.roll(0,0);
        break;
      case 'dance':
        dance();
				break;
			case 'calibrate':
			    if (message.mode == 'start'){
						orb.startCalibration();
					} else {
						orb.finishCalibration();
					}
					break;
			default:{
				crazy();
			}
    }
  }
});

 orb.connect(() => {
  orb.color("green");
	console.log("Orb online...\n")
 })

orb.disconnect(() => {

});

function crazy(){
	orb.setRawMotors({lmode: 0x01, lpower: 255, rmode: 0x01, rpower: 255});
}

function dance(){
forward1unit().then(() => {
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

var baseunit = 50;
function forward1unit(){
	orb.color("yellow");
	crazy();
	return orb.roll(baseunit,0).delay(2000);
}

function back1unit() {
	orb.color("purple");	
	return orb.roll(baseunit,180).delay(2000)
}

function left1unit() {
	orb.color("pink");
	crazy();
	return orb.roll(baseunit,270).delay(2000);
}

function right1unit() {
	orb.color("blue");
	return orb.roll(baseunit,90).delay(2000);
}






