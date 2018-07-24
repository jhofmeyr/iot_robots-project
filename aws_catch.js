const orb_name = process.argv[2]

const spheroIds = {
  'red': '9ad1cb74ed8643d0aeb7d9567305cb5a', // These ID's change per machine.
  'green': '6b39b80a6344407eaa89f57d32d21c3b', // Follow the instructions for identifying your sphero(s)
  'blue': '8506d5bddf584c2c9f383bf4b0f14665' // in README.MD
}

var sphero = require("sphero");
var orb = sphero(spheroIds[orb_name]);
var xinit, yinit
var xpos, ypos

const awsIot = require('aws-iot-device-sdk');
const moment = require('moment')

console.log(orb_name)

// Please note all certificates in this repo have been deactivated and revoked
// you will need to generate your own certificates.
const device = awsIot.device({
  keyPath: 'certs/your_private_key',
  certPath: 'certs/your_certificate',
  caPath: 'certs/your_ca',
  clientId: `${orb_name}-pub`,
  host: 'your_iot_arn'
});

device.on('connect', () => {
  console.log('connected')
  device.subscribe('PlayingWithBalls')
});

device.on('message', (topic, payload) => {
  let message = JSON.parse(payload.toString());
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
    orb.streamOdometer();
  }, 3000);

});

orb.on("odometer", function(data) {
  setCoOrds(data.xOdometer.value[0], data.yOdometer.value[0])
})

function setCoOrds(x, y) {
  xpos = x
  ypos = y
  xinit = xinit || x
  yinit = yinit || y
}

async function handleCommand(message) {
  switch (message.action) {
    case 'register':
      publishResponse({action: 'register_ball', orb: orb_name})
    case 'run_away':
      if (message.orb == orb_name){
        await runAway()
      }
      break;
    case 'come_home':
      await comeHome()
      break;
    case 'chase_me':
      if (message.args.orb != orb_name) {
        await chaseIsOn(message.args)
      }
      break;
    default:
      console.log(message)
  }
}

async function runAway() {
  console.log(`${orb_name}: Run Away!`)
  velocity = 50 + Math.random() * 100;
  direction = Math.random() * 360;

  await orb.roll(velocity, direction, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      publishResponse({
        action: 'chase_me',
        args: {
          orb: orb_name,
          velocity: velocity,
          direction: direction
        }
      });
    }
  })
}

async function chaseIsOn(args) {
  console.log(`${orb_name}: Chasing ${args.orb}`)
  await orb.roll(args.velocity, args.direction, (err, data) => {
    if (err){
      console.log(err)
    } else {
      publishResponse({message: `Finished Chasing ${args.orb}`})
    }
  })
}

// We experienced mixed results with the accuracy of this function.
// The documentation for the roll function is a bit sparse, so it's not clear how to convert
// the velocity value to distance
async function comeHome () {
  console.log("Go home!")
  console.log("X: " + xpos + " Y: " + ypos + " XINIT: " + xinit + " YINIT: " + yinit)
  deltaX = xpos - xinit
  deltaY = ypos - yinit
  var distance = magnitude(deltaX, deltaY)
  let theta
  if (ypos > 0) {
    theta = 180 + Math.atan(deltaX/deltaY) * 180 / Math.PI
  } else if (ypos < 0) {
    theta = Math.atan(deltaX/deltaY) * 180 / Math.PI
  }
  console.log("Theta: " + theta)
  if (distance > 10) {
    // set velocity to distance / 2 .. because reasons
    orb.roll(distance / 2, theta, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        comeHome()
      }
    })
  } else {
    publishResponse({message: `${orb_name} has arrived home!`})
  }
}

function magnitude (x, y) {
  return Math.sqrt(x**2 + y**2)
}

function delta (x, y) {
  return magnitude(x - xpos, y - ypos)
}

function party() {
}
