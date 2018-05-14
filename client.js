"use strict";
/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero = require('sphero')
var robots = {
	'Sonic': 'F8:CC:A1:A7:51:86',
	'Shadow': 'FF:AF:08:F6:7D:19',
	'Silver': 'EB:76:90:85:BE:AD'
}

var robotName = process.argv[2]
var robotId = robots[robotName]
var orb = sphero(robotId)

var awsIot = require('aws-iot-device-sdk')


var device = awsIot.device({
  keyPath: '/home/pi/sphero-iot/aws_certificates/' + robotName + '/private.pem.key',
  certPath: '/home/pi/sphero-iot/aws_certificates/' + robotName + '/certificate.pem.crt',
  caPath: '/home/pi/sphero-iot/aws_certificates/ca.pem',
  clientId: 'raspberry_pi-' + robotName,
  host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
})

device.on('connect', function() {
  console.log('Connected to AWS IoT');
  device.subscribe('things/' + robotName + '/commands');
});

device.on('message', function(topic, payload) {
  var message = JSON.parse(payload.toString())
  if (topic == 'things/' + robotName + '/commands') {
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
    }
  }
  //console.log('message from ', topic)
  //console.log('payload: ', payload.toString())
});


var thingShadows = awsIot.thingShadow({
  keyPath: '/home/pi/sphero-iot/aws_certificates/' + robotName + '/private.pem.key',
  certPath: '/home/pi/sphero-iot/aws_certificates/' + robotName + '/certificate.pem.crt',
  caPath: '/home/pi/sphero-iot/aws_certificates/ca.pem',
  clientId: 'sphero-' + robotName,
  host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
})


var keypress = require("keypress");


thingShadows.on('connect', function() {
  console.log('shadow connected');
  thingShadows.register(robotName, {}, function() {
    orb.connect(listen);
  })
})


function listen() {
  orb.streamOdometer();
  orb.on('odometer', function(data) {
    thingShadows.update(robotName, {
	  'state': {
		'reported': {
		  'odometerX': data.xOdometer.value[0],
		  'odometerY': data.yOdometer.value[0]
	    }
	  }
	});
  });
  

  keypress(process.stdin);
  process.stdin.on("keypress", function() { console.log('key') });

  orb.color('ff0000', -0.5)

  //console.log("listening for keys...");

  process.stdin.setRawMode(true);
  process.stdin.resume();
}
