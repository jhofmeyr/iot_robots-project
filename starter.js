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
			case 'popo':
				spinning = true;
				flipflop = true;
				spin(10);
				break;
			case 'rasta':
				spinning = true;
				rasta(15,'green');
				break;
				case '8':
				figureEight();
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

var spinning;
var flipflop;
var spinCount=0;
function spin(times){
	spinCount++;
	if (flipflop)	orb.color('red'); else 	orb.color('blue');
	flipflop = !flipflop;
	orb.setRawMotors({lmode: 0x01, lpower: 0, rmode: 0x01, rpower: 180});
	if (spinning && spinCount < times) setTimeout(() => {spin(times)},2000);
}

var figureEightFlipFlop=false;
function figureEight() {
	if(figureEightFlipFlop){
		orb.setRawMotors({lmode: 0x01, lpower: 30, rmode: 0x01, rpower: 100});
	} else {
		orb.setRawMotors({lmode: 0x01, lpower: 100, rmode: 0x01, rpower: 30});
	}
	figureEightFlipFlop = !figureEightFlipFlop;
	setTimeout(() => {figureEight()},2000);
}

function rasta(times,rastaColor){
	spinCount++;
	switch(rastaColor){
		case 'green':
		rastaColor = 'yellow';
		break;
		case 'yellow':
		rastaColor = 'red';
		break;
		case 'red':
		rastaColor = 'green';
		break;
	}

	orb.color(rastaColor);
	orb.setRawMotors({lmode: 0x01, lpower: 0, rmode: 0x01, rpower: spinCount*30});
	if (spinning && spinCount < times) setTimeout(() => {rasta(times,rastaColor)},2000);
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






