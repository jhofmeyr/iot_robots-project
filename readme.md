### Project Goal
We wanted to be able to control the movement of the Sphero using the mouse.

### Steps Taken:
We used a mouse event handler which gives the `delta x` and `delta y` values on the `mousemove` event.
Using this we calculate the radian and make some corrections based on the axis rotation. This is then used for the direction value. 
To get a varying for the speed we just added the absolute displacement values together.

After each `roll()` we added a small delay which improved the responsiveness and set a `stopped` flag to prevent event propagation.
This same flag was added to a mouse click event to stop the Sphero from rolling away if things got a bit out of control

### Setup
```
$ git checkout teams/olx-michael-nik

$ npm install
```

When executing, the Sphero will turn green when connected and will allow 5 seconds for calibration.

#### Move the mouse and watch the Sphero follow ;)
