"use strict";
/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero = require('sphero')
var robots = {
	//'Sonic': 'E8:CC:F3:D0:70:C4',
	'Sonic': 'CB:68:ED:5F:76:D8',
	'Shadow': 'CC:A9:1E:50:B7:DC',
	'Gold': 'CB:68:ED:5F:76:D8'
}

var robotName = process.argv[2]
var robotId = robots[robotName]
var orb = sphero(robotId)

var awsIot = require('aws-iot-device-sdk')


var device = awsIot.device({
  keyPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + robotName + '/private.pem.key',
  certPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + robotName + '/certificate.pem.crt',
  caPath: '/home/pi/internal/sphero-aws-client/aws_certificates/ca.pem',
  clientId: 'jksdhfdksjfhaspberry_pi-' + robotName,
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
  clientId: 'uajksdhakjsdhakssphero-' + robotName,
  host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
})


var keypress = require("keypress");


thingShadows.on('connect', function() {
  console.log('shadow connected');
  thingShadows.register('Thing2', {}, function() {
	  console.log('asdasdadasdasd')
    orb.connect(listen);
  })
})

function dec2hex(i) {
  return (i+0x10000).toString(16).substr(-2).toUpperCase();
}

function listen() {

	console.log('XXXXXXXXXXXXXXXX')
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
	orb.streamAccelerometer();


orb.on("accelerometer", function(data) {
  const ACCEL_MAX = 10000
  let r = dec2hex(Math.round(Math.abs(data.xAccel.value)/ACCEL_MAX * 255))
  let g = dec2hex(Math.round(Math.abs(data.yAccel.value)/ACCEL_MAX * 255))
  let b = dec2hex(Math.round(Math.abs(data.zAccel.value)/ACCEL_MAX * 255))
//  console.log('#'+r+g+b)
  let payload = {"action": "color",
            "color": '#'+r+g+b
            }
	
 device.publish('things/Shadow/commands', JSON.stringify(payload))
  
})


  orb.on("velocity", function(data) {
  const V_SCALE = 0.4
    var x = data.xVelocity.value[0];
    var y = data.yVelocity.value[0];
    var max = Math.max(Math.abs(x), Math.abs(y));
	  let v = Math.sqrt(x**2 + y**2)
	  let theta_rad = Math.atan(x/y)
	  console.log('x: ' + x + '  y: ' + y + '  t: ' + theta_rad)
	  let theta_deg = theta_rad * 180 / Math.PI;
	  if (theta_deg < 0) { theta_deg = 360 + theta_deg; }
   let payload = {"action": "roll",
	   "speed": v * V_SCALE,
	   "direction": theta_deg
            }
	  console.log(payload)
 device.publish('things/Shadow/commands', JSON.stringify(payload))
  });
 
  keypress(process.stdin);
  process.stdin.on("keypress", function(ch, key) { 
	if (key.ctrl && key.name == 'c') { process.stdin.pause(); process.exit(); }
  });

  orb.color('yellow')

  process.stdin.setRawMode(true);
  process.stdin.resume();
}
