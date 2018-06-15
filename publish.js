const awsIot = require('aws-iot-device-sdk');
const username = 'adzeeman'

const device = awsIot.device({
   keyPath: 'certificates/Sphero/private.pem.key',
  certPath: 'certificates/Sphero/certificate.pem.crt',
    caPath: 'certificates/Sphero/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

if (process.argv.length != 3) {
  console.log(`Invalid number of arguments. Usage: ${process.argv[1]} <COLOR>`);
  process.exit(1);
}

const color = process.argv[2];

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('/make/teams/adriaan-devin-jd/sphero', JSON.stringify(
    {
      'color': color
    }
  ));
  setTimeout(() => { process.exit(0) }, 3000);
});
