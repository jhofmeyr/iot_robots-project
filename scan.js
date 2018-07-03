const noble = require('noble');
const { fork } = require('child_process');

var deviceIds = [];
var forks = {};
var readyDevices = [];

async function forkIt(device) {
    var orbFork = fork('connect.js');
    forks[device] = orbFork
        
    orbFork.on('message', (msg) => {
      console.log('Device is ready:', msg);
      readyDevices.push(msg);
    });

    orbFork.send('connect-' + device);
}

var scanStopped = false;

function forkAll() {
    deviceIds.forEach(function(device) {
        forkIt(device);
    });
}

noble.on('discover', function(peripheral) {
    if(peripheral.advertisement.localName != undefined && peripheral.advertisement.localName.substr(0, 2) == 'SK') {
        console.log('Device discovered: name(' + peripheral.advertisement.localName + ') id(' + peripheral.id +') address(' + peripheral.address +')');

        deviceIds.push(peripheral.id);
        // forkIt(peripheral.id);

        if(deviceIds.length >= 8 && !scanStopped) {
            scanStopped = true;
            noble.stopScanning();

            // forkAll();
        }
    }
});
noble.startScanning();

console.log('Accepting keyboard inpot');

const stdin = process.openStdin()

stdin.addListener("data", function(data) {
    let command = data.toString().trim()

    if(command == 'q') {
        console.log('Forking...')
        forkAll();
    } else {
        try {
            readyDevices.forEach(function(device) {
                try {
                    forks[device].send(command);
                } catch(error) {
                    console.log('Error executing command (' + command + ') on Orb (' + device + ')')
                }
            });
        } catch(error) {
            console.log(error)
        }
    }
})


