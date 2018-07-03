var xinit = 0.0
var yinit = 0.0

console.log(angleCalc(1,1))   // 225
console.log(angleCalc(1,-1))  // 315
console.log(angleCalc(-1,-1)) // 45
console.log(angleCalc(-1,1))  // 135


function angleCalc(x, y) {
	deltaX = x - xinit
	deltaY = y - yinit
	let theta
	if (y > 0) {
		theta = 180 + Math.atan(deltaX/deltaY) * 180 / Math.PI
	} else if (y < 0) {
		theta = Math.atan(deltaX/deltaY) * 180 / Math.PI
	} else {
		
	}
	return theta
}
