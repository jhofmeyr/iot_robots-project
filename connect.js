const sphero = require('sphero');

var orb = undefined;

process.on('message', (msg) => {
    if(msg.substr(0, 8) != 'connect-'){
        try {
            console.log("[EXECUTING]: " + msg)
            let result = eval(msg)            
        } catch (error) {
            console.log ('error executing: ' + msg + ' error was ' + error);
        }
    } else {
        var deviceId = msg.substr(8, (msg.length - 8))
        console.log('[DEVICE] ' + deviceId + ' trying to establish connection')
        orb = sphero(deviceId);
        orb.connect(() => {
            console.log("connected... waiting for input:")
            orb.color('red');
                
            process.send(deviceId);
        })
    }
});



