var sphero = require("sphero");
var spheroId = '9ad1cb74ed8643d0aeb7d9567305cb5a'; // R
var orb = sphero(spheroId);
var xinit, yinit
var xpos, ypos

const awsIot = require('aws-iot-device-sdk');
const moment = require('moment')
const orb_name = process.argv[2]

console.log(orb_name)

const device = awsIot.device({
  keyPath: 'certs/private.pem.key',
  certPath: 'certs/certificate.pem.crt',
  caPath: 'certs/ca.pem',
  clientId: `${orb_name}-pub`,
  host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('connected')
  device.subscribe('PlayingWithBalls')
});

device.on('message', (topic, payload) => {
  let message = JSON.parse(payload.toString());
  console.log(message);
  handleCommand(message)
});

function publishResponse(response) {
  device.publish('PlayingWithBalls', JSON.stringify(response))
}

orb.connect(function() {
  console.log("Connected to sphero");
  orb.startCalibration();
  setTimeout(() => {
    orb.finishCalibration();
    console.log("Finished Calibration");
    orb.color(orb_name);
  }, 3000);
  orb.streamOdometer();

  orb.on("odometer", function(data) {
    setCoOrds(data.xOdometer.value[0], data.yOdometer.value[0])
  })

});

function setCoOrds(x, y) {
  xpos = x
  ypos = y
  xinit = xinit || x
  yinit = yinit || y
}

function handleCommand(message) {
  switch (message.action) {
    case 'run_away':
      if (message.orb == orb_name){
        runAway()
      }
      break;
    case 'go_home':
      comeHome()
      break;
    case 'chase_me':
      if (message.args.target_orb != orb_name) {
        chaseIsOn(message.args)
      }
      break;
    default:
      party()
  }
}

function runAway(target_orb) {
  console.log(`${orb_name}: Run Away!`)
  distance = 50 + Math.random() * 300;
  direction = Math.random() * 360;

  orb.roll(distance, direction, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      publishResponse({
        action: 'chase_me',
        args: {
          target_orb: orb_name,
          distance: distance,
          direction: direction
        }
      });
    }
  })
}

function chaseIsOn(args) {
  console.log(`${orb_name}: Chasing ${args.target_orb}`)
  orb.roll(args.distance, args.direction, (err, data) => {
    if (err){
      console.log(err)
    } else {
      publishResponse({message: `Finished Chasing ${args.target_orb}`})
    }
  })
}

function comeHome () {
  console.log("Come home!")
  console.log("X: " + xpos + " Y: " + ypos + " XINIT: " + xinit + " YINIT: " + yinit)
  deltaX = xpos - xinit
  deltaY = ypos - yinit
  let distance = magnitude(deltaX, deltaY)
  let theta
  if (ypos > 0) {
    theta = 180 + Math.atan(deltaX/deltaY) * 180 / Math.PI
  } else if (ypos < 0) {
    theta = Math.atan(deltaX/deltaY) * 180 / Math.PI
  } else {

  }
  console.log("Theta: " + theta)
  console.log("Distance: " + distance)
  orb.roll(distance, theta, (err, data) => {
    publishResponse({
      message: `${orb_name} has returned home!`
    })
  })
}

function magnitude (x, y) {
  return Math.sqrt(x**2 + y**2)
}

function delta (x, y) {
  return magnitude(x - xpos, y - ypos)
}

function party() {
}
