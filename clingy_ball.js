var sphero = require("sphero");
var spheroId = 'FA:34:A8:E7:D4:A7';
var orb = sphero(spheroId);
var xpos, ypos
var xinit, yinit

var state = "initial"

const startDelta = 2
const stopDelta = 2

orb.connect(function() {
	console.log("Connected to sphero");
	orb.color("blue")
	orb.setStabilization(1);
	
	orb.streamOdometer();
	
	orb.on("odometer", function(data) {
		updateState(data.xOdometer.value[0], data.yOdometer.value[0])
		xpos = data.xOdometer.value[0]
		ypos = data.yOdometer.value[0]
		console.log("X: " + xpos)
		console.log("Y: " + ypos)
	})
});

function updateState (x, y) {
	switch (state) {
		case "initial":
			xinit = x
			yinit = y
			state = "waiting"
			console.log(state)
			orb.color("blue")
			break;
		case "waiting":
			if (delta(x, y) > startDelta) {
				state = "pushed"
				console.log(state)
			} 
			break;
		case "pushed":
			if (delta(x, y) < stopDelta) {
				state = "stopped"
				console.log(state)
			}
			orb.color("green")
			break;
		case "stopped":
			console.log(state)
			orb.color("red")
			comeHome()
			state = "accelerating"
			break;
		case "accelerating":
			console.log(state)
			if (delta(x, y) > startDelta) {
				state = "returning"
			}
		case "returning":
			if (delta(x, y) < stopDelta) {
				state = "initial"
				console.log(state)
			}
			orb.color("green")
			break;
		default:
			party()
		
	}
}

function party() {
	
}

magnitude = (x, y) => {
	return Math.sqrt(x**2 + y**2)
}

async function comeHome () {
	console.log("Come home!")
	console.log("X: " + xpos + " Y: " + ypos + " XINIT: " + xinit + " YINIT: " + yinit)
	deltaX = xpos - xinit
	deltaY = ypos - yinit
	let distance = magnitude(deltaX, deltaY)
	let theta
	if (ypos > 0) {
		theta = 180 + Math.atan(deltaX/deltaY) * 180 / Math.PI
	} else if (ypos < 0) {
		theta = Math.atan(deltaX/deltaY) * 180 / Math.PI
	} else {
		
	}
	console.log("Theta: " + theta)
	console.log("Distance: " + distance)
	orb.roll(distance, theta)
}

function delta (x, y) {
	return magnitude(x - xpos, y - ypos)
}
