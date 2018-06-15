"use strict";

/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

const moment = require('moment'); // for DateTime formatting
const username = 'adzeeman'

if (process.argv.length != 3) {
  console.log(`Invalid number of arguments. Usage: ${process.argv[1]} <NAME>`);
  process.exit(1);
}

sphero = require("sphero");
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

function listen() {

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
    case '/make/teams/adriaan-devin-jd/sphero':
      console.log('message', message);
	  handle(message.action);
		  break;

    default:
      console.log(`Message received on topic "${topic}"\n`)
  }

  console.log("starting to listen for arrow key presses");

  process.stdin.setRawMode(true);
  process.stdin.resume();
}
