var sphero = require("sphero");
const awsIot = require('aws-iot-device-sdk');
var spheroId = 'C7:8A:28:6D:EC:32';  // change to yours
const username = 'runningdeveloper'; // change to unique
var orb = sphero(spheroId);


console.log('trying to connect to sphero...');

const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});
    

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('makers/controll/all');
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

  switch (topic) {
    case 'makers/controll/all':
      console.log('got contol', message);
      moveCloud(message.color, message.distance, message.angle);
      break
    default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});

orb.connect(function () {
  console.log('connected to sphero')
  orb.startCalibration();
  setTimeout(() => {
    orb.finishCalibration();
    console.log('done calib');
    orb.color("green");
  }, 3000);
});

const moveCloud = async (color, distance, angle) =>{
  orb.color(color);
  await orb.roll(distance, angle);
  console.log('done move');
}