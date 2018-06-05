"use strict";
/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero = require('sphero')
var robots = {
	'Sonic': 'E8:CC:F3:D0:70:C4',
	'Shadow': 'CC:A9:1E:50:B7:DC',
	'Silver': ''
}

var robotName = process.argv[2]
var robotId = robots[robotName]
var orb = sphero(robotId)

var awsIot = require('aws-iot-device-sdk')


var device = awsIot.device({
  keyPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + robotName + '/private.pem.key',
  certPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + robotName + '/certificate.pem.crt',
  caPath: '/home/pi/internal/sphero-aws-client/aws_certificates/ca.pem',
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

});


var thingShadows = awsIot.thingShadow({
  keyPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + robotName + '/private.pem.key',
  certPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + robotName + '/certificate.pem.crt',
  caPath: '/home/pi/internal/sphero-aws-client/aws_certificates/ca.pem',
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
//  orb.streamOdometer();
//  orb.on('odometer', function(data) {
//    thingShadows.update(robotName, {
//	  'state': {
//		'reported': {
//		  'odometerX': data.xOdometer.value[0],
//		  'odometerY': data.yOdometer.value[0]
//	    }
//	  }
//	});
 // });

 orb.streamVelocity();

  orb.on("velocity", function(data) {
    var x = data.xVelocity.value[0];
    var y = data.yVelocity.value[0];
    var max = Math.max(Math.abs(x), Math.abs(y));
    var color;
    if (max < 10) {
      color = "white";
    } else if (max < 100) {
      color = "lightyellow";
    } else if (max < 150) {
      color = "yellow";
    } else if (max < 250) {
      color = "orange";
    } else if (max < 350) {
      color = "orangered";
    } else if (max < 450) {
      color = "red";
    } else {
      color = "darkred";
    }
    device.publish("things/Shadow/commands", JSON.stringify({
		action: "color",
		color: color
    }))
  });
 
  keypress(process.stdin);
  process.stdin.on("keypress", function(ch, key) { 
	if (key.ctrl && key.name == 'c') { process.stdin.pause(); process.exit(); }
  });

  orb.color('green')

  process.stdin.setRawMode(true);
  process.stdin.resume();
}
