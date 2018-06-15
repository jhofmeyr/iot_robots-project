module.exports =
{
    imuAngles: function(data) {
        console.log("imuAngles:")
        console.log("  sensor:", data.pitchAngle.sensor)
        console.log("    range:", data.pitchAngle.range)
        console.log("    units:", data.pitchAngle.units)
        console.log("    value:", data.pitchAngle.value[0])

        console.log("  sensor:", data.rollAngle.sensor)
        console.log("    range:", data.rollAngle.range)
        console.log("    units:", data.rollAngle.units)
        console.log("    value:", data.rollAngle.value[0])

        console.log("  sensor:", data.yawAngle.sensor)
        console.log("    range:", data.yawAngle.range)
        console.log("    units:", data.yawAngle.units)
        console.log("    value:", data.yawAngle.value[0])
    },

    odometer: function(data) {
		console.log("odometer:")
		console.log("  sensor:", data.xOdometer.sensor)
		console.log("    range:", data.xOdometer.range)
		console.log("    units:", data.xOdometer.units)
		console.log("    value:", data.xOdometer.value[0])

		console.log("  sensor:", data.yOdometer.sensor)
		console.log("    range:", data.yOdometer.range)
		console.log("    units:", data.yOdometer.units)
		console.log("    value:", data.yOdometer.value[0])
    },

    gyroscope: function(data) {
        console.log("gyroscope:")
        console.log("  xGyro:", data.xGyro)
        console.log("  yGyro:", data.yGyro)
        console.log("  zGyro:", data.zGyro)
    },

    velocity: function(data) {
        console.log("velocity:")
        console.log("  xVelocity:", data.xVelocity)
        console.log("  yVelocity:", data.yVelocity)  
    },

    accelOne: function(data) {
        console.log("accelOne:")
        console.log("  accelOne:", data.accelOne)
    },

    accelerometer: function(data) {
        console.log("accelerometer:")
        console.log("  xAccel:", data.xAccel)
        console.log("  yAccel:", data.yAccel)
        console.log("  zAccel:", data.zAccel)
    },

    motorsBackEmf: function(data) {
        console.log("motorsBackEmf:")
        console.log("  rMotorBackEmf:", data.rMotorBackEmf)
        console.log("  lMotorBackEmf:", data.lMotorBackEmf)

    }
    
}
