// THIS WAS THE CLIENT THAT WE USED ON A COMPUTER/ ANOTHER THING TO TALK TO THE PI CONTROLLER WITH THE SPHERE THROUGH AWS IOT.
const awsIot = require('aws-iot-device-sdk');
const username = 'ottoes' // TODO: replace this

const device = awsIot.device({
   keyPath: 'certificates/262d96a0c3-private.pem.key',
  certPath: 'certificates/262d96a0c3-certificate.pem.crt',
    caPath: 'certificates/CA-G5.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('OP_ORB', JSON.stringify({
    "cmd": "color",
    "arg1": "green",
    "arg2": ""
  }));
  device.subscribe('OP_ORB_DATA/');
  device.subscribe('OP_ORB_DATA');
});


var sphero = require("sphero");


// make sure you install this first - `npm install keypress`
var keypress = require("keypress");

var speed     = 120;
var direction = 0;
//var orb = sphero(process.env.PORT);

//orb.connect(listen);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var lastt 


function  mupdate() {
  if (direction > 360) { direction -= 360 }
  if (direction <0 ) { direction += 360 }
  if (speed <0) { speed = 0 }
  //var t = new Date().getTime();
  //if (t-lastt < 110) return 
  ///lastt = t

  device.publish('OP_ORB', JSON.stringify({
    "cmd": "roll('"+speed+"','"+direction+"')"
    
  }));

}

function handle(ch, key) {
  //var stop = orb.roll.bind(orb, 0, 0),
  //    roll = orb.roll.bind(orb, 60);
  var tmp = 0
  if (key.ctrl && key.name === "c") {
    process.stdin.pause();
    process.exit();
  }

  var t = new Date().getTime();
  if (t-lastt < 110) return 
  lastt = t

  switch (key.name) {
    case "r":
          device.publish('OP_ORB', JSON.stringify({
            "cmd": "color('red')",
          }));
          break;
    case "g":
          device.publish('OP_ORB', JSON.stringify({
            "cmd": "color('green')",
          }));
          break;
    case "b":
          device.publish('OP_ORB', JSON.stringify({
            "cmd": "color('blue')",
          }));
          break;
    case "q":
          device.publish('OP_ORB', JSON.stringify({
            "cmd": "finishCalibration()",
          }));
          break;
    case "e":
          device.publish('OP_ORB', JSON.stringify({
            "cmd": "startCalibration()",
          }));
          //orb.finishCalibration();
          break;
    case "left":
          direction -= 15
          mupdate()
          break;
    case "right":
          direction += 15
          mupdate()
          break;
    case "up":
          //speed = 10
          mupdate()
          break;
    case "up":
          //speed = 10
          mupdate()
          break;
    case "down":
          direction += 180
          mupdate()
          break;
    case "space":
          tmp = speed
          speed = 0
          mupdate()
          speed = tmp
          break;
    case "s":
          speed  -= 10
          //mupdate()
          break;
    case "f":
          speed   +=10
          //mupdate()
          break;
    case "a":
          direction += 180
          //mupdate()
          break;
    case "h":
          direction += 90
          //mupdate()
          break;
    case "l":
          direction -= 90
          //mupdate()
          break;
     
  }
/*
  if (key.name === "e") {
    orb.startCalibration();
  }

  if (key.name === "q") {
    orb.finishCalibration();
  }

  if (key.name === "up") {
    roll(0);
  }

  if (key.name === "down") {
    roll(180);
  }

  if (key.name === "left") {
    roll(270);
  }

  if (key.name === "right") {
    roll(90);
  }

  if (key.name === "space") {
    stop();
  }
  */
}

function listen() {
  keypress(process.stdin);
  process.stdin.on("keypress", handle);

  console.log("starting to listen for arrow key presses");

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

listen()
