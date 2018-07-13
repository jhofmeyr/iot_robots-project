## IoT-Robots Projects Repo for Makers

Have an interesting idea or looking for inspiration? This is the place to share your code with other Makers or to find ideas for things you can do on a Make Day.


### How it works

<i>To see</i> one of the projects listed below, do:

`$ git checkout branch-name`

To push your code, we suggest using the convention `teams/name1-name2-name3` where the names are your Github handles or your names. It's good to share!

### Connecting Sphero to a mac

* Install the sphero package `npm install sphero --save`
* Install the noble package `npm install noble --save` _this may have errors, but you can ignore them_
* Run `sudo node ./node_modules/noble/examples/advertisement-discovery.js` This scans for bluetooth devices and prints out their details. e.g.
  ```shell
    peripheral discovered (47c344a073a049019fd590b30b6f208b with address <unknown, unknown>, connectable true, RSSI -69:
      hello my local name is:
        SK-2368
      can I interest you in any of the following advertised services:
        []
      here is my manufacturer data:
        "3530"
      my TX power level is:
        -10
  ```
  You're looking for devices with local name starting `SK-`, and the id you need is the hash value like
* Use the peripheral ID (`47c344a073a049019fd590b30b6f208b` above) as your `spheroID` to connect

### List of Projects

| Project Description | Branch | Makers | Make Day |
| -------------| -------------- | ----------------- | ------ |
| You shake a Sphero and the harder you shake it the brighter the other one gets | teams/erik-emile-andile | erikbotes, emile-jumo, amkhuma | Quebec |
| Dual Sphero PubSub: One Sphero (leader) rolls around with keystrokes and then publishes its coordinates to a topic. The other Sphero (follower) changes colour depending on the <i>quadrant</i> of the leader. | teams/peza8-jasohardy007-brandon2255p | peza8, jasohardy007, brandon255p| Quebec |
| Control Sphero in interesting ways via AWS (e.g. Sphero rolls in a circle and changes colour :D ) | teams/cornelia | Echochi, shenine| Sierra |
| Control the movement of the Sphero using the mouse | teams/olx-michael-nik | mmsamuel, nikmakan-olx | Sierra |
| Controll a bunch of Spheros via AWS IOT if a bunch of teams download this branch you can issue commands to the topic 'makers/controll/all'. Replace the certificates and spheroId. | teams/geoffrey-nipho | runningdeveloper, nhlakani | Tango |
| Use Sphero as a controller - control a Sphero with the IMU of another Sphero | teams/super-sphero | James, Michael | Yankee |
| Control Sphero via the Cloud| teams/otto-phillip| Otto, Phillip | Yankee |
| Live control of Sphero via the Cloud with (some) collision detection | teams/adriaan-devin-jd | Adriaan, Devin, JD | Yankee |


### Other Ideas

* Control Sphero with voice - Using DialogFlow from previous course or an Amazon Echo
* One Sphero mimicks the movement of the other
* A "Tom and Jerry" game where one (Tom) tries to catch the other (Jerry) :)
* A competitive PubSub "king of the hill" game
