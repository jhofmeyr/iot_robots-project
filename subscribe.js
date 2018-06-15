const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'adzeeman'

sphero = require("sphero");
var spheroId = "FA:34:A8:E7:D4:A7";
var orb = sphero(spheroId);

console.log('trying to connect to sphero...');

orb.connect(function () {
	console.log('connected to sphero')
});

const device = awsIot.device({
   keyPath: 'certificates/Pi/private.pem.key',
  certPath: 'certificates/Pi/certificate.pem.crt',
    caPath: 'certificates/Pi/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');
  orb.color('white');
  device.subscribe('/make/teams/adriaan-devin-jd/sphero');
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
    case '/make/teams/adriaan-devin-jd/sphero':
      console.log('message', message);
	  orb.color(message.color);
		  break;

    default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});
