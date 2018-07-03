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
        console.log('Device discovered: name(' + peripheral.advertisement.localName + ') id(' + peripheral.id +')');

        deviceIds.push(peripheral.id);
        forkIt(peripheral.id);

        if(deviceIds.length >= 8 && !scanStopped) {
            scanStopped = true;
            noble.stopScanning();

            // forkAll();
        }
    }
});

noble.startScanning(); // any service UUID, no duplicates

/// NEW NODE WEBSERVER STUFFS

var net = require('net');

var server = net.createServer(function(socket) {
    socket.write('Echo server\r\n');
    socket.on('data', function(data) {
        console.log('Received: ' + data);
        propogateCommand(data);
    });
});

server.listen(1337, '0.0.0.0');

/// END NEW NODE WEBSERVER STUFFS

function propogateCommand(data){
    let command = data.toString().trim()

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