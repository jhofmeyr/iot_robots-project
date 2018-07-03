var net = require('net');

var nodes = ['192.168.88.198', '192.168.88.173']
var clients = {}

nodes.forEach(function(ip) {
    var c = new net.Socket(); 
    c.connect(1337, ip, function() {
        console.log('Connected to ' + ip);
    });

    c.on('close', function() {
        console.log('Connection closed');
    });

    clients[ip] = c;
})

var server = net.createServer(function(socket) {
    socket.write('Echo server\r\n')
    socket.on('data', function(data) {
        console.log('Received: ' + data);
        nodes.forEach(function(ip) {
            clients[ip].write(data);
        })
    });
});

server.listen(1337, '0.0.0.0');


// console.log('Accepting keyboard inpot');

// const stdin = process.openStdin()

// stdin.addListener("data", function(data) {

//     let command = data.toString().trim()
//         try {
//             nodes.forEach(function(ip) {
//                 clients[ip].write(command);
//             })
            
            

//         } catch(error) {
//             console.log(error)
//         }
    
// })

