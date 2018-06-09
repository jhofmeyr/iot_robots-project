"use strict";
/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero = require('sphero')
var robotId = 'E8:CC:F3:D0:70:C4'
var orb = sphero(robotId)
var x
var y
orb.connect(() => {
  console.log('trying to connect to sphero')
  // orb.streamOdometer()                                                                                                                             
  // orb.detectCollisions()
  // orb.streamImuAngles()
  orb.color('green').delay(1000)
  orb.color('black')
  console.log('orb',orb)
  
  var awsIot = require('aws-iot-device-sdk')
  
  
  var device = awsIot.device({
    keyPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + 'Sonic' + '/private.pem.key',
    certPath: '/home/pi/internal/sphero-aws-client/aws_certificates/' + 'Sonic' + '/certificate.pem.crt',
    caPath: '/home/pi/internal/sphero-aws-client/aws_certificates/ca.pem',
    clientId: 'raspberry_pi-' + 'Sonic3',
    host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
  })
  
  device.on('connect', function() {
    console.log('Connected to AWS IoT');

    device.subscribe('things/' + 'Sonic' + '/commands');
  });
  
  device.on('message', function(topic, payload) {
    console.log(`message came in on ${topic}`)
    var message = JSON.parse(payload.toString())
    if (topic == 'things/' + 'Sonic' + '/commands') {
      switch (message.action) {
        case 'roll':
          orb.roll(message.speed, message.direction);
          break;
        case 'roll0':
          orb.roll(40, 45);
          break;
        case 'stop':
          orb.roll(0,0);
          break;
        case 'color':
          orb.color(message.color)
          break;
        case 'colorrgb':
          var count = message.count
          var i = 0
          var r = 0
          var g = 0
          var b = 0 
          var d = 0
          var ri = 5
          var gi = 0
          var bi = 0
          var di = 15
          console.log("pre-loop")
          orb.color("black").delay(10)
          while (i < count) {
            d = (d < 360 - di) ? d+= di : 0;
            orb.roll(50,d).delay(50)
              orb.color({red : r, green : g, blue : b}) //.delay(50)
              i++
              r+=ri
              g+=gi
              b+=bi
              if (r == 255 || r == 0) {ri = -ri;}
              if (g == 255 || g == 0) {gi = -gi;}
              if (b == 255 || b == 0) {bi = -bi;}
              if (r > 126 && gi == 0) {gi = 5;}
              if (g > 126 && bi == 0) {bi = 5;}
              
              console.log("count: ", i, "rgb: ",r,g,b,"; rolldir: ",d, "position", x,y)
            }
            orb.roll(0,0)
            orb.color("black")
          break;
        case 'rollin':
          orb.color('CA3D00').delay(100).then(()=>
            {
              return orb.roll(130,45).delay(1500)
            }).then(()=>
            {
              return orb.roll(140,0).delay(1500)
            }).then(()=>
            {
              return orb.roll(80,90).delay(1500)
            }).then(()=>
            {
              return orb.roll(90,1500)
            });
            break;
          case 'do stuff':
          orb.color('red').delay(100).then(()=>
            {
              return orb.roll(50,90).delay(1000)
            }).then(()=>
            {
              return orb.color('green').delay(100)
            }).then(()=>
            {
              return orb.roll(50,180).delay(1000)
            }).then(()=>
            {
              return orb.color('blue').delay(100)
            }).then(()=>
            {
              return orb.roll(50,270).delay(1000)
            }).then(()=>
            {
              return orb.color('purple').delay(100)
            }).then(()=>
            {
              return orb.roll(50,0)
            });
            break;
          break;
      }
    }
  });
})

// orb.on('odometer', function(data) {
//   x = data.xOdometer.value[0]
//   y = data.yOdometer.value[0]
//   // console.log('odometer',x,y)
// })

// orb.on('odometer', function(data) {
//   x = data.xOdometer.value[0]
//   y = data.yOdometer.value[0]
// console.log('odometer',x,y)
// })

// orb.on('odometer', function(data) {
//   x = data.xOdometer.value[0]
//   y = data.yOdometer.value[0]
// console.log('odometer',x,y)
// })


// device.on('message', function(topic, payload) {
//   console.log(`message came in on ${topic}`)
//   var message = JSON.parse(payload.toString())
//   var color = message['color']

// orb.roll(23,30).delay(200).then(function() {
//   orb.
// })

// for item in array (index)

// setTimeout(function() {
//  // command 1
// }, (index - 1) * 2000)


// setTimeout(function() {
//  // command 2
// }, 2000)



// setTimeout(function() {
//  // command 3
// }, 4000)

