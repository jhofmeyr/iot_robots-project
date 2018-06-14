var sphero = require("sphero");
const awsIot = require('aws-iot-device-sdk');
var spheroId = 'E6:EA:05:40:23:68';
var orb = sphero(spheroId);

const username = 'runningdeveloper';
console.log('trying to connect to sphero...');

/*
const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});
    

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('makers/apples/color');
  device.subscribe('makers/apples/control');
  // device.subscribe('makers/challenge/clues');
  // device.subscribe('makers/challenge/answers/errors');
  // device.subscribe('makers/challenge/answers/accepted');
  // TODO subscribe to more topics here
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());
  console.log('msg', message);
  switch (topic) {
    case 'makers/apples/color':
      console.log('got color', message);
      orb.color(message.color);
      break;
    case 'makers/apples/control':
      console.log('got contol', message);
      // moveJump();
      moveCloud(message.color, message.distance, message.angle, message.motors);
      break
    default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});


// orbE.connect(function () {
//   console.log('connected to sphero E')
//   orbE.startCalibration();
//   setTimeout(() => {
//     orbE.finishCalibration();
//     console.log('done calib E');
//     orbE.color("red");
//   }, 3000);
  
// });*/

orb.connect(function () {
  console.log('connected to sphero')
  orb.startCalibration();
  setTimeout(() => {
    orb.finishCalibration();
    console.log('done calib');
    orb.color("green");
    console.log('Done');
    return moveTrack()
    .then(() => {
		return moveJump();
	});
    
    //orb.detectCollisions();
    //orb.on('collision', (data) =>{
    //  console.log('collision', data);
    //})


  }, 3000);
  
});

const move = async (distance, angle) =>{
	await orb.roll(distance,angle).delay(2000);
}

const moveTest = async () =>{
  orb.color("red");
  await orb.roll(100,0).delay(2000);
  await orb.roll(100,180).delay(2000);
}

const moveTrack = async () =>{
  console.log('Going to Move Track');
  orb.color('green');
  await orb.roll(50,315).delay(2000);
  await orb.roll(50,315).delay(2000);
  //await orb.roll(60,45).delay(2000);
  //await orb.roll(60,180).delay(2000);
  console.log('Done Move Track');
}

const moveCloud = async (color, distance, angle, motors) =>{
  orb.color(color);
  if(motors){
    await orb.setRawMotors(motors);
  }else{
    await orb.roll(distance, angle);
  }
 
  console.log('Done Cloud Move');
}

const moveJump = async () =>{

	console.log('Going to Jump');
  orb.color('red');
  await orb.setRawMotors({lmode: 0x01, lpower:100, rmode:0x02, rpower:100});
  console.log('Done Jumping');
}
