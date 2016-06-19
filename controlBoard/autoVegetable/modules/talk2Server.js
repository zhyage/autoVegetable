const dgram = require('dgram');

const client = dgram.createSocket('udp4');

function sendAction2Server(action) {
    client.send(buf, 3001, '127.0.0.1', (err) => {
        //console.log('error to send buf')
        //client.close();
    })
}

module.exports.sendAction2Server = sendAction2Server;