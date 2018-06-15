const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'adzeeman'

if (process.argv.length != 3) {
  console.log(`Invalid number of arguments. Usage: ${process.argv[1]} <NAME>`);
  process.exit(1);
}

const name = process.argv[2];

var sphero = require("sphero");
var spheroId = name;
var orb = sphero(spheroId);

console.log('trying to connect to sphero...');

orb.connect(function () {
	console.log('connected to sphero')
});

const device = awsIot.device({
  keyPath: 'certificates/Sphero/private.pem.key',
  certPath: 'certificates/Sphero/certificate.pem.crt',
  caPath: 'certificates/Sphero/ca.pem',
  clientId: `${username}-subscribe`,
  host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');
  orb.color('white');
  device.subscribe('/make/teams/adriaan-devin-jd/sphero');
});

function handle(action) {
  var stop = orb.roll.bind(orb, 0, 0),
  roll = orb.roll.bind(orb, 60);

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

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
		case '/make/teams/adriaan-devin-jd/sphero':
    if (message.name === name) {
        console.log('message', message);
        handle(message.action);
      }
      break;

		default:
    break;
  }


});
process.stdin.setRawMode(true);
process.stdin.resume();

var keypress = require("keypress");
function handle_keypress(ch, key) {
  if (key.name === "c") {
    process.stdin.pause();
    process.exit();
  }
}

keypress(process.stdin);
process.stdin.on("keypress", handle_keypress);
