var sphero = require("sphero");

const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'jamescushway' // TODO: replace this

var orb = sphero('C1:EA:BB:43:E8:F5');
orb.connect();

const device = awsIot.device({
   keyPath: 'certificates/56c0d5a792-private.pem.key',
  certPath: 'certificates/56c0d5a792-certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  // TODO subscribe to more topics here
  device.subscribe('makers/challenge/wizard');
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
    case 'makers/challenge/wizard':
    
		switch (message.cmd) {
			case 'randomColour':
			  //orb.color('red');
			  orb.color({
				  red: Math.floor((Math.random() * 255) + 1),
				  green: Math.floor((Math.random() * 255) + 1),
				  blue: Math.floor((Math.random() * 255) + 1)
			  });
			  break;
		    case 'moveForward':
				console.log(message.speed);
				orb.roll(message.speed, 0).delay(500);
				orb.color({red: 0,green: 0, blue: message.speed});
				console.log(`Message received on topic "${topic}" "${message}"\n`)
				break;
		    case 'moveBackward':
				console.log(message.speed);
				orb.roll(message.speed, 180).delay(500);
				orb.color({red: message.speed,green: 0,blue: 0});
				break;
		    case 'moveLeft':
				console.log(message.speed);
				orb.roll(message.speed, 270).delay(500);
				orb.color({red: 0, green: speed, blue: speed});
				console.log(`Message received on topic "${topic}" "${message}"\n`)
				break;
		    case 'moveRight':
				console.log(message.speed);
				orb.roll(message.speed, 90).delay(500);
				orb.color({red: speed, green: 0, blue: speed});
				break;
			default:
				console.log(`Message received on topic "${topic}" "${message}"\n`)
		}
		  
      break;

    default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});

