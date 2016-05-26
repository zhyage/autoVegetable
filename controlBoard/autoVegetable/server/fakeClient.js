var Struct = require('struct')
var _ = require('underscore')


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
const server = dgram.createSocket('udp4');


var gValue = 0;

macList = [[0xde,0xad,0xbe,0xef,0xfe,0xed]]
//equipList = [1, 2, 3, 4, 5, 6, 7, 9]
//equipList = [1, 2, 3, 4, 5, 6, 7, 8]

equipList = 
[
    {
        "equipId":1, "name":"temperature_1", "value":20
    },
    {
        "equipId":2, "name":"moisture_1", "value":50
    },
    {
        "equipId":3, "name":"soilMoisture_1", "value":50
    },
    {
        "equipId":4, "name":"luminace_1", "value":0
    },
    {
        "equipId":5, "name":"valve_1", "value":0
    },
    {
        "equipId":6, "name":"fan_1", "value":0
    },
    {
        "equipId":7, "name":"light_1", "value":0
    },
    {
        "equipId":8, "name":"warmer_1", "value":0
    },
]


bufList = []


function fackData(inEquip){

    var valve = _.find(equipList, (equip)=>{
        return equip.name == "valve_1"
    })
    var fan =  _.find(equipList, (equip)=>{
        return equip.name == "fan_1"
    })

    var light =  _.find(equipList, (equip)=>{
        return equip.name == "light_1"
    })

    var warmer =  _.find(equipList, (equip)=>{
        return equip.name == "warmer_1"
    })

    if("temperature_1" == inEquip.name){
        if(valve.value == 1 ){
            inEquip.value -= 0.2
        }
        if(warmer.value == 1){
            inEquip.value += 0.5
        }

        inEquip += 0.1

    }

    if("moisture_1" == inEquip.name){
        if(valve.value == 1){
            inEquip.value += 1
        }
        inEquip.value -= 0.1
    }

    if("soilMoisture_1" == inEquip.name){
        if(valve.value == 1){
            inEquip.value += 11
        }

        inEquip.value -= 0.056
    }

}

var driveMsg = driveData.clone();
function startUDPServer(port){
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      server.close();
  });

    server.on('message', (msg, rinfo) => {
    driveMsg._setBuff(msg)
    var driveMsgField = driveMsg.fields;

    var equipId = driveMsgField.equipId
    var collectValue = driveMsgField.value
    
    var ee = _.find(equipList, (equip)=>{
        return equip.equipId == equipId
    })
    if(undefined == ee){
        console.info("incorrect drive data")
    }else{
        console.info("xxxxxxxxxxxxxxxxxxcomes drive data")
        ee.value = collectValue
    }

  });

    server.on('listening', () => {
      var address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
  });

    server.bind(port);
}



for (var i = 0; i < 100000; i++) {
    setTimeout(function() {
        _.each(macList, (mac) => {
            _.each(equipList, (equip) => {
                reportData.allocate();
                var buf = reportData.buffer();

                var proxy = reportData.fields;
                proxy.mac = mac
                proxy.boardId = 1
                proxy.equipId = equip.equipId
                fackData(equip)
                proxy.value = equip.value
                console.log(buf);
                client.send(buf, 8877, '192.168.199.151', (err) => {
                    //console.log('error to send buf')
                    //client.close();
                })
                client.send(buf, 8877, 'localhost', (err) => {
                    //console.log('error to send buf')
                    //client.close();
                })
            })
        })
    }, i * 1000)
}

var UDP_BOARD_LISTEN_PORT = 8888

startUDPServer(UDP_BOARD_LISTEN_PORT)

/*client.send(buf, 3333, 'localhost', (err) => {
  client.close();
});*/
