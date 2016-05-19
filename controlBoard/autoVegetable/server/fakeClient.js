var Struct = require('struct')
var _ = require('underscore')


/*var reportData = Struct()
    .chars('mac', 17)
    .word8('boardId')
    .word8('equipId')
    .word32Sbe('value');*/

var reportData = Struct()
    .array('mac',6,'word8')
    .word8('boardId')
    .word8('equipId')
    .word32Sle('value');       


var driveData = Struct()
    .word8('equipId')
    .word32Sle('value'); 


const dgram = require('dgram');
const buf1 = new Buffer('Some ');
const buf2 = new Buffer('bytes');
const client = dgram.createSocket('udp4');



/*reportData.allocate();
var buf = reportData.buffer();

var proxy = reportData.fields;*/
/*proxy.mac = '11:22:33:44:55:66'
proxy.boardId = 1
proxy.equipId = 1 
proxy.value = 3322
console.log(buf);*/
var gValue = 0;

/*macList = ['11:22:33:44:55:66', '11:22:33:44:55:77', '11:22:33:44:55:88', '11:22:33:44:55:99', '11:22:33:44:55:00']*/

macList = [[0xde,0xad,0xbe,0xef,0xfe,0xed]]
//equipList = [1, 2, 3, 4, 5, 6, 7, 9]
equipList = [3, 4, 5, 6, 7, 8]
bufList = []


/*for(var i = 0; i < 10; i++){
    _.each(macList, (mac)=>{
        _.each(equipList, (equipId)=>{
            reportData.allocate();
            var buf = reportData.buffer();

            var proxy = reportData.fields;
            proxy.mac = mac
            proxy.boardId = 1
            proxy.equipId = equipId
            gValue += 1
            proxy.value = gValue
            //console.log(buf);
            bufList.push(buf)
            //client.send(buf, 8877, 'localhost', (err) => {
            //console.log('error to send buf')
            //client.close();
            //})
        })
    })
}*/

for (var i = 0; i < 100; i++) {
    setTimeout(function() {
        _.each(macList, (mac) => {
            _.each(equipList, (equipId) => {
                reportData.allocate();
                var buf = reportData.buffer();

                var proxy = reportData.fields;
                proxy.mac = mac
                proxy.boardId = 1
                proxy.equipId = equipId
                gValue += 1
                proxy.value = gValue
                console.log(buf);
                client.send(buf, 8877, 'localhost', (err) => {
                    //console.log('error to send buf')
                    //client.close();
                })
            })
        })
    }, i * 1000)
}

/*client.send(buf, 3333, 'localhost', (err) => {
  client.close();
});*/
