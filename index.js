"use strict";
/* eslint no-use-before-define: 0 */
/* eslint no-process-exit: 0 */
 
var sphero = require('sphero');
var Mouse = require('node-mouse');
var m = new Mouse();

var orb = sphero('E6:EA:05:40:23:68');

var stopped = false;

const move = (event) => {
  if(!stopped) {
    var radian = Math.atan2( event.yDelta, event.xDelta);
    var angle = (radian*180)/Math.PI;
    var direction = angle;
    var color = 'red';

    if(angle >= -90 && angle <= 90) {
      direction = 90 - angle
      color = 'green'
    }
    else if(angle < -90 && angle > -180) {
      direction = 90 + Math.abs(angle)
      color = 'purple'
    }
    else if(angle > 90 && angle < 180) {
      direction = 180 + angle;
      color = 'yellow'
    }
    
    if ( direction % 1 !== 0  ) {
      // console.log(direction);
      orb.color(color);
      var speed = ( Math.abs(event.yDelta) + Math.abs(event.xDelta) );
      stopped = true;
      orb.roll(speed, direction).delay(300).then(() => {
          stopped = false;
      });

    }
    
  }
};

const stop = () => {
  if(!stopped) {
    console.log('stopped... click again to resume');
    stopped = true;
    orb.roll(0, 0);
    orb.setRawMotors({
      "lmode": "0x00",
      "lpower": "0",
      "rmode": "0x00",
      "rpower": "0",
    });
  } else {
    console.log('resumed');
    stopped = false;
  }
  
};

orb.connect(() => {
  orb.color('green')
  
  console.log("calibrating...");
  orb.startCalibration().delay(3000).then(() => {
    orb.finishCalibration();
    console.log("calibration successful!");
    console.log("move mouse to control sphero");

    m.on("mousemove", (event) => {
      move(event);
    })

    m.on("mousedown", (event) => {
      stop();
    })
  });

});

 

 
