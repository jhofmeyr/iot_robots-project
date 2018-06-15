
const awsIot = require('aws-iot-device-sdk');
const username = 'adzeeman'

const device = awsIot.device({
   keyPath: 'certificates/Pi/private.pem.key',
  certPath: 'certificates/Pi/certificate.pem.crt',
    caPath: 'certificates/Pi/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

if (process.argv.length != 3) {
  console.log(`Invalid number of arguments. Usage: ${process.argv[1]} <NAME>`);
  process.exit(1);
}


// make sure you install this first - `npm install keypress`
var keypress = require("keypress");


function handle(ch, key) {

  if (key.ctrl && key.name === "c") {
    process.stdin.pause();
    process.exit();
  }

  device.publish('/make/teams/adriaan-devin-jd/sphero', JSON.stringify(
	{
	  'name': name,
	  'action': key.name
	}
  ));

}

function listen() {
  keypress(process.stdin);
  process.stdin.on("keypress", handle);

  console.log("starting to listen for arrow key presses");

  process.stdin.setRawMode(true);
  process.stdin.resume();
}
