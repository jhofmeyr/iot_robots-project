Control a sphero via the cloud using a F310 Gamepad. 

1. Joysticks and buttons are read in and captured via a python script on a pi
2. The events are published to a few topics
3. Another pi subscribes to the topics and reads in events 
4. The raspberry pi controls the sphero via a js script.

Controls:
-> The left joystick control direction and speed with variable degrees
-> A button changes the spheros state and colour
-> The right joystick controls spin using the rmotor and lmotor
