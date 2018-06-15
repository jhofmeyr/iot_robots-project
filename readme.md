## Description

Control a sphero with the IMU of another sphero.

Use one sphero as the controller (the IoT publisher). Start it using node lib/publish.js. Change the MAC address that is hard-coded in publish.js. To start the receiving sphero, run lib/publish.js on another pi, again changing the hardcoded MAC address. The IMU axes of both the receiver and controller must be aligned in the same direction (forward must be the same direction for both spheros). The speed and direction of the receiving sphero is controlled by tilting the controller sphero in a specific direction. The angle the controller sphero is tilted controls the direction of the reciver sphero, and the magnitude of the tilt controls the speed.

When the pitch or roll of the controller is < 10 degrees, the receiving sphero will not move. This is the safety zone to bring the sphero to a stop.

The subscriber consumes move messages and moves accordingly.
