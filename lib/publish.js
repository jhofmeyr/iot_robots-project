var sphero = require("sphero");

const awsIot = require('aws-iot-device-sdk');
const username = 'seymour7' // TODO: replace this

var orb = sphero('FF:AF:08:F6:7D:19');
//orb.connect();

const device = awsIot.device({
   keyPath: 'certificates/56c0d5a792-private.pem.key',
  certPath: 'certificates/56c0d5a792-certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('makers/challenge/wizard', JSON.stringify({
    'cmd': 'randomColour'
  }));
});

orb.connect(function() {
	orb.setStabilization(0);
  orb.streamImuAngles(5);

  orb.on("imuAngles", function(data) {
	  
	  if (data.pitchAngle.value[0] < -10 
		|| data.pitchAngle.value[0] > 10 
		|| data.rollAngle.value[0] > 10 
		|| data.rollAngle.value[0] < -10) {
		  let speed = Math.min((Math.max(Math.abs(data.pitchAngle.value[0]),Math.abs(data.rollAngle.value[0]))-10)/80*255,255);
		  speed = Math.max(speed,0);
		  let roll = data.rollAngle.value[0];
		  let pitch = data.pitchAngle.value[0];
		  if (roll < 0 && pitch > 0) {
			  roll = 180-roll;
		  } else if (roll < 0 && pitch <= 0) {
			  roll = 360+roll;
		  } else if (roll >= 0 && pitch > 0) {
			  roll = 180-roll;
		  } else if (roll >= 0 && pitch <= 0) {
			  roll = roll;
		  }
		  console.log('move');
		  console.log('- speed: '+speed);
		  console.log('- roll: '+roll);
		  device.publish('makers/challenge/wizard', JSON.stringify({
				'cmd': 'move',
				'speed': speed,
				'roll': roll
			}));
	  }
	  
	  if (data.pitchAngle.value[0] < -10) {
			//console.log('forward');
			let speed = Math.min((Math.abs(data.pitchAngle.value[0])-10)/80*255,100);
			//console.log('- Angle:'+data.pitchAngle.value[0]);
			//console.log('- Speed:'+speed);
			orb.color({red: 0, green: 0, blue: speed});
			//device.publish('makers/challenge/wizard', JSON.stringify({
			//	'cmd': 'moveForward',
			//	'speed': speed
			//}));
	  } else if (data.pitchAngle.value[0] > 10) {
			//console.log('backward');
			let speed = Math.min((Math.abs(data.pitchAngle.value[0]-10))/80*255,100);
			//console.log('- Angle:'+data.pitchAngle.value[0]);
			//console.log('- Speed:'+speed);
			orb.color({red: speed, green: 0, blue: 0});
			//device.publish('makers/challenge/wizard', JSON.stringify({
			//	'cmd': 'moveBackward',
			//	'speed': speed
			//}));
	  } else if (data.rollAngle.value[0] > 10) {
			//console.log('right');
			let speed = Math.min((Math.abs(data.rollAngle.value[0]-10))/80*255,100);
			//console.log('- Angle:'+data.rollAngle.value[0]);
			//console.log('- Speed:'+speed);
			orb.color({red: speed, green: 0, blue: speed});
			//device.publish('makers/challenge/wizard', JSON.stringify({
			//	'cmd': 'moveRight',
			//	'speed': speed
			//}));
	  } else if (data.rollAngle.value[0] < -10) {
			//console.log('left');
			let speed = Math.min((Math.abs(data.rollAngle.value[0]-10))/80*255,100);
			//console.log('- Angle:'+data.rollAngle.value[0]);
			//console.log('- Speed:'+speed);
			orb.color({red: 0, green: speed, blue: speed});
			//device.publish('makers/challenge/wizard', JSON.stringify({
			//	'cmd': 'moveLeft',
			//	'speed': speed
			//}));
	  } else {
			orb.color('green');  
	  }

/*
    console.log("imuAngles:");
    console.log("  sensor:", data.pitchAngle.sensor);
    console.log("    range:", data.pitchAngle.range);
    console.log("    units:", data.pitchAngle.units);
    console.log("    value:", data.pitchAngle.value[0]);

    console.log("  sensor:", data.rollAngle.sensor);
    console.log("    range:", data.rollAngle.range);
    console.log("    units:", data.rollAngle.units);
    console.log("    value:", data.rollAngle.value[0]);

    console.log("  sensor:", data.yawAngle.sensor);
    console.log("    range:", data.yawAngle.range);
    console.log("    units:", data.yawAngle.units);
    console.log("    value:", data.yawAngle.value[0]);
*/


  });
});
