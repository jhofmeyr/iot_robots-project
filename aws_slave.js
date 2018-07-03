var sphero = require("sphero");
var spheroId = 'FA:34:A8:E7:D4:A7';
var orb = sphero(spheroId);

const awsIot = require('aws-iot-device-sdk');
const moment = require('moment')
const username = 'DylanBlakemore'

//sconsole.log('trying to connect to sphero...');


const device = awsIot.device({
  keyPath: 'certs/private.pem.key',
  certPath: 'certs/certificate.pem.crt',
  caPath: 'certs/ca.pem',
  clientId: `${username}-pub`,
  host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});


device.on('connect', () => {
	console.log('connected')
	device.subscribe('PlayingWithBalls')
});

device.on('message', (topic, payload) => {
	let message = JSON.parse(payload.toString());
	message.forEach(function(object) {
		sendCommand(object.action, object.args);
	});
});

orb.connect(function() {
	console.log("Connected to sphero");
	orb.startCalibration();
	setTimeout(() => {
		orb.finishCalibration();
		console.log("Finished Calibration");
		orb.color("pink");
	}, 3000);
});

const sendCommand = async (action, args) => {
	let command = "orb." + action.toString().trim() + "(" + args + ")"
	console.log(command);
	try {
		await eval(command);
	} catch(error) {
		console.log(error)
	}
}


