"use strict";
/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */

var sphero = require('sphero')
var robotId = 'FD:94:C6:CA:0E:C0'
var orb = sphero(robotId)

orb.connect(() => {
  console.log('trying to connect to sphero')
  orb.color('red').delay(100).then(()=>
    {
      return orb.color('purple')
    })
  

  
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
          var ri = 1
          var gi = 0
          var bi = 0
          while (i < count) {
            // orb.color({red : message.red, green : message.green, blue : message.blue}).delay(100)
            setTimeout(() => {orb.color({red : r, green : g, blue : b})
              i++
              r+=ri
              g+=gi
              b+=bi
              if (r == 255 || r == 0) {ri = -ri;}
              if (g == 255 || g == 0) {gi = -gi;}
              if (b == 255 || b == 0) {bi = -bi;}
              if (r > 126 && gi == 0) {gi = 1;}
              if (g > 126 && bi == 0) {bi = 1;}
              
              console.log(i,r,g,b)
            },100*i)
          }
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

