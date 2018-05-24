const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'theovn';

const device = awsIot.device({
   keyPath: 'certs/artemis.private.key',
  certPath: 'certs/artemis.cert.pem',
    caPath: 'certs/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
	console.log('Subscriber client connected to AWS IoT cloud.\n');

	device.subscribe('thing/artemis-odo');
});

device.on('message', (topic, payload) => {

	let message = JSON.parse(payload.toString());

	switch (topic) {
		case 'thing/artemis-odo':
			console.log(`Message received on topic "${topic}":\n`+payload.toString());
			break;
		default:
			console.log(`Message received on topic "${topic}":\n`+payload.toString());
	}
});
