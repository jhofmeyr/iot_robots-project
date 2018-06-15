var sphero = require("sphero");

const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'randomUser123' // TODO: replace this

var orb = sphero('F5:77:55:BE:40:A2');
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
			case 'move':
				if (message.roll < 90 ) {
					orb.color('red');
				} else if (message.roll < 180 ) {
					orb.color('green');
				} else if (message.roll < 270 ) {
					orb.color('blue');
				} else {
					orb.color({red: 255, green: 0, blue: 100});
				}
				console.log('Speed Vector:');
				console.log('	Speed: ' + message.speed/255*100 + 'm/s');
				console.log('	Angle: ' + message.roll + ' degrees');
				orb.roll(message.speed, message.roll).delay(200);
				console.log(`Message received on topic "${topic}" "${message}"\n`)
				break;
			default:
				console.log(`Message received on topic "${topic}" "${message}"\n`)
		}
		  
      break;

    default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});

