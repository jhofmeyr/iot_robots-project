const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'artemis' // TODO: replace this
var sphero = require("sphero");
//var spheroId = process.argv[2];
var spheroId = "E0:01:D9:64:C3:45";
var orb = sphero(spheroId);

var dest_x = 0;
var dest_y = 0;
var go = false;
var current_x = 0;
var current_y = 0;

const device = awsIot.device({
   keyPath: 'certs/artemis.private.key',
  certPath: 'certs/artemis.cert.pem',
    caPath: 'certs/ca.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});

orb.connect(function () {
    orb.color("red");
    orb.startCalibration();
    console.log('start alibration')
    setTimeout(function() {
      console.log('finish calibration')
      orb.finishCalibration();
      orb.color("white")
    }, 5000);
    orb.configureLocator({flags: 0x01,x: 0x0000,y: 0x0000,yawTare: 0x0});

    device.on('connect', () => {
    console.log('Subscriber client connected to AWS IoT cloud.\n');

    device.subscribe('thing/artemis');
    });

    device.on('message', (topic, payload) => {

        let message = JSON.parse(payload.toString());

        switch (topic) {
            case 'thing/artemis':
            console.log(`Recieved message: "${message.action}", ${message.value}`);
            if (message.action == "roll") {
                orb.roll(30,message.value);
                orb.color("green");
            } else if (message.action == "stop") {
                orb.stop();
                orb.color("red");
                go = false;
            } else if (message.action == "reset") {
                orb.configureLocator({flags: 0x01,x: 0x0000,y: 0x0000,yawTare: 0x0});
                orb.stop();
                orb.color("white");
            } else if (message.action == "goto") {
                dest_x = message.value;
                dest_y = message.value2;
                go = true;            
            }
            break;

            default:
            console.log(`Message received on topic "${topic}"\n`)
        }
    });

    orb.streamOdometer();
    orb.on("odometer",function(data) {        
        current_x = data.xOdometer.value[0];
        current_y = data.yOdometer.value[0];
        device.publish('thing/artemis-odo', JSON.stringify({
            "x": current_x,
            "y": current_y       
        }));

    });

    setInterval(function() {
        if (go) {
            if ((Math.abs(dest_x - current_x) < 8) && (Math.abs(dest_y - current_y) < 8)) {
                go = false;
                orb.stop();
                orb.color("blue");
            } else {
                dis = (Math.atan2(current_x-dest_x, current_y-dest_y) * (180 / Math.PI) + 180) % 360;
                console.log("steering towards..",dis);
                orb.color("green");
                orb.roll(20,dis);
            }
        }
    },1000);

})


        


// });

