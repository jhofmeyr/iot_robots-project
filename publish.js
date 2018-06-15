const awsIot = require('aws-iot-device-sdk');
const username = 'adzeeman'

const device = awsIot.device({
   keyPath: 'certificates/private.pem.key',
  certPath: 'certificates/certificate.pem.crt',
    caPath: 'certificates/ca.pem',
  clientId: `${username}-publish`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

if (process.argv.length != 4) {
  console.log(`Invalid number of arguments. Usage: ${process.argv[1]} <TOKEN> <ANSWER>`);
  process.exit(1);
}

const answerToken = process.argv[2];
const answer = process.argv[3];

device.on('connect', () => {
  console.log('Publisher client connected to AWS IoT cloud.\n');

  device.publish('makers/challenge/answers', JSON.stringify(
    {
      'name': username,
      'answerToken': answerToken,
      'answer': answer
    }
  ));
  setTimeout(() => { process.exit(0) }, 3000);
});
