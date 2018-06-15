// CONST
const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'kowalski_sphero'

/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */


// cmd line arguments (mac address)
if (process.argv.length != 3) {
  console.log(`Invalid number of arguments. Usage: ${process.argv[1]} <NAME>`);
  process.exit(1);
}
const name = process.argv[2];

// create sphero object
var sphero = require("sphero");
var spheroId = name;
var orb = sphero(spheroId);

// connect to sphero
console.log('trying to connect to sphero...');
orb.connect(function () {
	console.log('connected to sphero');

	// register of acc stream
	orb.streamAccelerometer(100);

	// acc data callback
	orb.on("accelerometer", function(data)
	{
//		console.log("accelerometer:");
//		console.log("  sensor:", data.xAccel.sensor);
//		console.log("    range:", data.xAccel.range);
//		console.log("    units:", data.xAccel.units);
//		console.log("    value:", data.xAccel.value[0]);

		if (data.xAccel.value[0] > 16000)
		{
			console.log("MASSIVE");
		}
		else if (data.xAccel.value[0] > 8000)
		{
			console.log("Crash");
		}
		else if (data.xAccel.value[0] > 4000)
		{
			console.log("Fender Bender");
		}
	
	});

	// configure and detect collision
	var opts = {
		meth: 0x02,
	    xt: 0x01,
	    xs: 0x01,
	    yt: 0x01,
	    ys: 0x01,
	    dead: 0x0A};
	orb.configureCollisions(opts);
	orb.detectCollisions();
	
	orb.on("collision", function(data)
	{
		console.log("collision detected");
		console.log("  data:", data);
	});

});

// certificates 
const device = awsIot.device({
   keyPath: 'certificates/Sphero/private.pem.key',
  certPath: 'certificates/Sphero/certificate.pem.crt',
    caPath: 'certificates/Sphero/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

// connect sphero with aws
device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');
  orb.color('white');
  device.subscribe('/make/teams/adriaan-devin-jd/sphero');
});


// handler controller sphero based in incoming messages
function handle(action) {
  console.log(action);
  var stop = orb.roll.bind(orb, 0, 0),
      roll = orb.roll.bind(orb, 160);

  if (action === "c") {
    process.stdin.pause();
    process.exit();
  }

  if (action === "e") {
    orb.startCalibration();
  }

  if (action === "q") {
    orb.finishCalibration();
  }

  if (action === "up") {
    roll(0);
  }

  if (action === "down") {
    roll(180);
  }

  if (action === "left") {
    roll(270);
  }

  if (action === "right") {
    roll(90);
  }

  if (action === "space") {
    stop();
  }
}

// handles incomming messages from aws
device.on('message', (topic, payload) =>
{

	let message = JSON.parse(payload.toString());

	switch (topic)
	{
		case '/make/teams/adriaan-devin-jd/sphero':
			console.log('message', message);
			if (message.name === name)
			{
				handle(message.action);
			}
		break;

		default:
			console.log(`Message received on topic "${topic}"\n`)
			break;
	}


});


// erm - from example - was in "listen" function
process.stdin.setRawMode(true);
process.stdin.resume();
