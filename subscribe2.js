const awsIot = require('aws-iot-device-sdk');
const moment = require('moment'); // for DateTime formatting
const username = 'GustavAspesberger1' // TODO: replace this
const PORT = "CB:68:ED:5F:76:D8"
var sphero = require("sphero")
var orb = sphero(PORT)


let counter = 0

var statess = 1


const device = awsIot.device({
  keyPath: '00a33a53c0-private.pem.key',
  certPath: '00a33a53c0-certificate.pem.crt',
    caPath: 'RootC2.pem',
  clientId: `${username}-subscribe`,
      host: 'a2yujzh40clf9c.iot.us-east-2.amazonaws.com'
});


orb.connect(function() {
    orb.color({ red: 255, green:0, blue:255});
    orb.setMotionTimeout(1000)
})

device.on('connect', () => {
  console.log('Subscriber client connected to AWS IoT cloud.\n');

  device.subscribe('logitec/buttons/load');
  device.subscribe('logitec/movement/load');
    device.subscribe('logitec/movement/load2');
  
  // TODO subscribe to more topics here
});

device.on('message', (topic, payload) => {

  let message = JSON.parse(payload.toString());

	console.log(message)

  switch (topic) {
    case 'logitec/buttons/load':
      button = message.button
      state = message.state
      console.log('Received ', button, ' as a state: ',state)
      if(button == "BTN_THUMB") {
		orb.color("red")
		statess = 1
		console.log('state ',statess)
	  }
	  if(button == "BTN_THUMB2") {
		orb.color("blue")
		statess = 2
		console.log('state ',statess)
	  }
	  
      break;

	case ('logitec/movement/load' || 'logitec/movement/load2'):
	if (statess == 1) {
		xpos = message.x
		ypos = message.y
		
		xspeed = Math.abs(xpos)
		yspeed = Math.abs(ypos)
		
		if(xspeed >= yspeed) {
			speed = xspeed 
		}
		if(xspeed < yspeed) {
			speed = yspeed 
		} 
		

			var angle = Math.atan2(ypos+0.1,xpos+0.1);
			var degrees = 180 * angle/Math.PI;
			var dir = (360+Math.round(degrees)) % 360;
		
		
		
		console.log('Received movement: x: ', xpos, ' y: ', ypos) 
		
		if( xpos > 0 || ypos > 0 || xpos < 0 || ypos < 0) {
			if (counter % 2 == 0) {
				orb.roll(speed, dir)
				console.log('speed',speed)
				console.log('angle', dir)
			}
			counter += 1
			console.log('counter', counter)
		}
	
		if(xpos == 0 && ypos == 0){
			orb.roll(0,0)
		}
	}
	
	
	
	
	if (statess == 2){
			
		lpos = message.y
		rpos = message.motor_y
		
		console.log('state ',message)
		
		console.log('i work in state ', statess)
		
		leftspeed = Math.abs(lpos)
		rightspeed = Math.abs(rpos)
		
		ldir = (lpos >= 0) ? "0x01" : "0x02"
		rdir = (rpos >= 0) ? "0x01" : "0x02" 
		
		if( leftspeed > 0 || rightspeed > 0) {
			if (counter % 2 == 0) {
				orb.setRawMotors({lmode: ldir, lpower: leftspeed, rmode: rdir, rpower: rightspeed})
				console.log('ldir',ldir)
				console.log('ldir',leftspeed)
				console.log('ldir',rdir)
				console.log('ldir',rightspeed)
			}
			counter += 1
		} 
		}
	break;
	
	 
	
    default:
      console.log(`Message received on topic "${topic}"\n`)
  }
});

