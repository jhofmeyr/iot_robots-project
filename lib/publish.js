var sphero = require("sphero");

const awsIot = require('aws-iot-device-sdk');
const username = 'seymour7' // TODO: replace this

var orb = sphero('FF:AF:08:F6:7D:19');
orb.connect();

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

orb.on("accelerometer", function(data) {
	console.log("accelerometer:");
	console.log("  sensor:", data.xAccel.sensor);
	console.log("    range:", data.xAccel.range);
	console.log("    units:", data.xAccel.units);
	console.log("    value:", data.xAccel.value[0]);

	console.log("  sensor:", data.yAccel.sensor);
	console.log("    range:", data.yAccel.range);
	console.log("    units:", data.yAccel.units);
	console.log("    value:", data.yAccel.value[0]);

	console.log("  sensor:", data.zAccel.sensor);
	console.log("    range:", data.zAccel.range);
	console.log("    units:", data.zAccel.units);
	console.log("    value:", data.zAccel.value[0]);
});
