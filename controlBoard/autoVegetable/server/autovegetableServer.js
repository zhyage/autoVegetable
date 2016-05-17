var fs = require('fs')
var Promise = require('bluebird')
var _ = require('underscore')
const dgram = require('dgram');
var Struct = require('struct')

/*var reportData = Struct()
    .chars('mac', 6)
    .word8('boardId')
    .word8('equipId')
    .word32Sle('value');*/

var reportData = Struct()
    .array('mac',6,'word8')
    .word8('boardId')
    .word8('equipId')
    .word32Sle('value');    

var driveData = Struct()
    .word8('equipId')
    .word32Sle('value');     

var existBoardList = []
/*var boardDefine = loadBoardDefine('boardDefine.json')*/

var boardDefine = []
var TOPConfigure = []
var equipTypeDefine = []
var ruleTable = []
var timerTable = []
var dataStorageTable = []
const UDPClient = dgram.createSocket('udp4');

var MAX_SAVE_DATA_NUM = 100 //pre min for one day

var UDP_LISTEN_PORT = 8877

var UDP_BOARD_LISTEN_PORT = 8888

var MAX_TIMER_NUM = 5


function loadConfigureDefine(jsonFile) {
    try {
        var  configDefine = JSON.parse(fs.readFileSync(jsonFile));
        
        return configDefine
    } catch(e) {
        console.error("error to load configDefine from ", jsonFile);
        return null
    }
}


function findEquipInfo(boardId, equipId){
/*    var boardDefine = loadBoardDefine("boardDefine.json")
    console.log(boardDefine)*/
    var findBoard = _.find(boardDefine, function(board){
        return board.boardId == boardId
    })
    if(undefined != findBoard){
        var findEquip = _.find(findBoard.boardCapablity, function(equip){
            return equip.equipId == equipId
        })
    }
    if(undefined != findEquip){
        return true;
    }else{
        return false;
    }
    /*console.log('find equip : ')
    console.log(findEquip)
    return findEquip*/

}

/*function loadExistBoard(){
    var existBoardFileContent = fs.readFileSync('existBoard.json')
    if(0 != existBoardFileContent){
        existBoard= JSON.parse(existBoardFileContent)
    }
}

function saveExistBoard(){
    if(0 != _.size(existBoard)){
        fs.writeFileSync('existBoard.json', JSON.stringify(existBoard));
    }
}*/

function showExistBoard(){
    console.log(_.size(existBoardList), "boards exist ############################");
    if(_.size(existBoardList) > 0){
        _.each(existBoardList, function(board){
            console.log('board.macAddr :', board.macAddr)
            console.log('board.ipAddr :', board.ipAddr)
            console.log('board.lastUpdateTime :', board.lastUpdateTime)
            _.each(board.data.equipList, (equip)=>{
                console.log('equipId **************:', equip.equipId)
                _.each(equip.valueList, (value)=>{
                    console.log('value : ', value.value)
                    console.log('updateTime : ', value.updateTime)
                })
            })
            console.log('-------------------------------')
        })
    }
    return ""
    
}

function verifyCollectData(data){
    if(undefined == data.boardId || undefined == data.equipId || undefined == data.value){
        return false;
    }
    return findEquipInfo(data.boardId, data.equipId);
}

function updateEquipData(existBoard, macAddr, ipAddr, lastUpdateTime, data){
    existBoard.ipAddr = ipAddr 
    existBoard.lastUpdateTime = lastUpdateTime
    existBoard.data.boardId = data.boardId
    var existEquip = _.find(existBoard.data.equipList, (equip)=>{
        return equip.equipId == data.equipId
    })
    if(undefined == existEquip){
        existBoard.data.equipList.push({'equipId':data.equipId, 'valueList':[{'value':data.value, 'updateTime':lastUpdateTime}]})
    }else{
        if(_.size(existEquip.valueList) < MAX_SAVE_DATA_NUM){
            existEquip.valueList.push({'value':data.value, 'updateTime':lastUpdateTime})
        }else{
            existEquip.valueList.shift()
            existEquip.valueList.push({'value':data.value, 'updateTime':lastUpdateTime})
        }
        
    }
}

function updateExistBoard(macAddr, ipAddr, lastUpdateTime, data){
    var existBoard = _.find(existBoardList, function(board){
        return board.macAddr == macAddr
    })
    /*if(undefined == existBoard && true == verifyCollectData(data)){
        existBoardList.push({'macAddr':macAddr, 'ipAddr':ipAddr,
            'data':{'boardId':data.boardId, 'equipId':data.equipId, 'valueList':[{'value':data.value, 'updateTime':lastUpdateTime}]}});*/
    /*if(undefined == existBoard && true == verifyCollectData(data)){
        existBoardList.push({'macAddr':macAddr, 'ipAddr':ipAddr, 'lastUpdateTime':lastUpdateTime,
            'data':{'boardId':data.boardId, 'valueList':[{'equipId':data.equipId, [{'value':data.value, 'updateTime':lastUpdateTime}]}]}});
    }*/
    if(undefined == existBoard && true == verifyCollectData(data)){
        existBoardList.push({'macAddr':macAddr, 'ipAddr':ipAddr, 'lastUpdateTime':lastUpdateTime,
            'data':{'boardId':data.boardId, 'equipList':[{'equipId':data.equipId, 'valueList':[{'value':data.value, 'updateTime':lastUpdateTime}]}]}});
    }
    else{
        if(true == verifyCollectData(data)){
            /*existBoard.ipAddr = ipAddr
            existBoard.lastUpdateTime = lastUpdateTime
            existBoard.data.boardId = data.boardId
            existBoard.data.equipId = data.equipId
            if(_.size(existBoard.data.valueList) < MAX_SAVE_DATA_NUM){
                existBoard.data.valueList.push({'value':data.value, 'updateTime':lastUpdateTime})
            }else{
                existBoard.data.valueList.shift()
                existBoard.data.valueList.push({'value':data.value, 'updateTime':lastUpdateTime})
            }*/
            updateEquipData(existBoard, macAddr, ipAddr, lastUpdateTime, data)
        }
    }
}

var reportMsg = reportData.clone();
function startUDPServer(port){
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      server.close();
  });

    server.on('message', (msg, rinfo) => {
    reportMsg._setBuff(msg)
    var reportMsgField = reportMsg.fields;
    /*console.log(reportMsgField.mac)
    console.log(reportMsgField.boardId)
    console.log(reportMsgField.equipId)
    console.log(reportMsgField.value)*/
    //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    /*updateExistBoard(reportMsgField.mac, rinfo.address, Date.now(), 
                     {'boardId':reportMsgField.boardId, 'equipId':reportMsgField.equipId, 'value': reportMsgField.value})
    showExistBoard()*/

    /*console.log('mac length : ', _.size(reportMsgField.mac))
    console.log('mac addrss : ')
    _.each(reportMsgField.mac, (mac)=>{
        console.log(mac.toString(16), "::")
    })
    console.log(reportMsgField.boardId)
    console.log(reportMsgField.equipId)
    console.log(reportMsgField.value)*/
    var boardUID = reportMsgField.mac[0].toString(16) + ':'
                    + reportMsgField.mac[1].toString(16) + ':'
                    + reportMsgField.mac[2].toString(16) + ':'
                    + reportMsgField.mac[3].toString(16) + ':'
                    + reportMsgField.mac[4].toString(16) + ':'
                    + reportMsgField.mac[5].toString(16)
    var equipId = reportMsgField.equipId
    var collectValue = reportMsgField.value
    
    updateDataStorage(boardUID, equipId, collectValue, rinfo)
    //showDataStorageTable()

  });

    server.on('listening', () => {
      var address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
  });

    server.bind(port);
}

//startUDPServer(UDP_LISTEN_PORT);



function loadConfigure(){
    
    boardDefine = loadConfigureDefine('boardDefine.json')
    TOPConfigure = loadConfigureDefine('TOPConfigure.json')
    equipTypeDefine = loadConfigureDefine('equipTypeDefine.json')
    ruleTable = loadConfigureDefine('ruleTable.json')

    if(null == boardDefine || null == TOPConfigure || null == equipTypeDefine){
        console.error('error to loadConfigure');
    }
}



function generatorDataStorageTable(){

    _.each(TOPConfigure, (topCfg)=>{
        var defineBoard = _.find(boardDefine, (board)=>{
            return topCfg.boardType == board.boardType
        })
        if(undefined != defineBoard){
            var storageEle = {'boardUID':topCfg.boardUID, 'boardAttr':defineBoard, 'lastUpdateTime':Date.now(), 'equipList':[]}
            _.each(defineBoard.boardCapablity, (equip)=>{
                var equipTypeDef = getEquipTypeDefine(equip.equipType)
                if(undefined != equipTypeDef){
                    var equipEle = {'equipId':equip.equipId, 'equipAttr':equip, 'equipTypeAttr':equipTypeDef, 'remoteInfo':undefined, 'switchCount':0, 'valueList':[]}
                    storageEle.equipList.push(equipEle)
                }
                
            })
            dataStorageTable.push(storageEle)
        }
    })
}

function updateDataStorage(boardUID, equipId, value, rinfo) {
    console.info("boardUID : ", boardUID, 'equipId : ', equipId, 'value : ', value)
    var currentTime = Date.now()
    var storageEle = _.find(dataStorageTable, (Bele) => {
        /*console.info('Bele.boardUID : ', Bele.boardUID)
        console.info('boardUID : ', boardUID)*/
        return Bele.boardUID == boardUID
    })
    if (undefined != storageEle) {
        console.info('found storageEle')
        var equipEle = _.find(storageEle.equipList, (Eele) => {
            return Eele.equipId == equipId
        })
        if (undefined != equipEle) {
            console.info('found equipEle')
            equipEle.remoteInfo = rinfo
            var insertValue = {
                'value': value,
                'updateTime': currentTime
            }
            if (_.size(equipEle.valueList) < MAX_SAVE_DATA_NUM) {

                if (equipEle.equipTypeAttr.type != 'SWITCH') {
                    equipEle.valueList.push(insertValue)
                } else {
                    var valueSize = _.size(equipEle.valueList)
                    if (0 == valueSize) { //empty
                        equipEle.valueList.push(insertValue)
                    } else {
                        var preVal = equipEle.valueList[_.size(equipEle.valueList) - 1]
                        if (preVal.value != value) {
                            equipEle.valueList.push(insertValue)
                            if(equipEle.switchCount > 0){
                                equipEle.switchCount -= 1 //count only valid for SWITCH equip
                            }
                        }
                    }
                }
            } else {
                if (equipEle.equipTypeAttr.type != 'SWITCH') {
                    equipEle.valueList.shift()
                    equipEle.valueList.push(insertValue)
                } else {
                    var valueSize = _.size(equipEle.valueList)
                    if (0 == valueSize) { //empty
                        equipEle.valueList.push(insertValue)
                    } else {
                        var preVal = equipEle.valueList[_.size(equipEle.valueList) - 1]
                        if (preVal.value != value) {
                            equipEle.valueList.shift()
                            equipEle.valueList.push(insertValue)
                            if(equipEle.switchCount > 0){
                                equipEle.switchCount -= 1 
                            }
                        }
                    }
                }
            }
            storageEle.lastUpdateTime = currentTime
        }
    }
}

function getEquipFromStorage(boardUID, equipId){
    var equipEle = undefined
    var storageEle = _.find(dataStorageTable, (Bele) => {
        return Bele.boardUID == boardUID
    })
    if(undefined != storageEle){
        equipEle = _.find(storageEle.equipList, (Eele) => {
            return Eele.equipId == equipId
        })
    }
    return equipEle
}

function setEquipCount(boardUID, equipId, count){
    var equipEle = getEquipFromStorage(boardUID, equipId)
    if(undefined == equipEle || 'SWITCH' != equipEle.equipTypeAttr.type){
        console.error("setEquipCount error : no such equip or not the SWITCH equip");
    }
    equipTypeId.switchCount = count
}

function driveEquip(boardUID, equipId, value) {
    var equipEle = getEquipFromStorage(boardUID, equipId)
    if (undefined == equipEle || equipEle.equipTypeAttr.direct != 'OUTPUT') {
        console.info("can't drive undefined equip")
        return
    }
    if (undefined == equipEle.remoteInfo) {
        console.info("can't drive no remoteInfo equip")
        return
    }
    sendUDPDriveMsg(equipEle.remoteInfo.address, equipId, value)
}

function showDataStorageTable(){
    _.each(dataStorageTable, (storageEle)=>{
        console.info('boardUID : ', storageEle.boardUID)
        console.info('lastUpdateTime : ', storageEle.lastUpdateTime)
        _.each(storageEle.equipList, (equip)=>{
            console.info('      equipId : ', equip.equipId)
            console.info('      sizeof equip data : ', _.size(equip.valueList))
            _.each(equip.valueList, (value)=>{
                console.info('              value : ', value.value)
                console.info('              updateTime : ', value.updateTime)
            })
        })
    })
}

function getEquipTypeDefine(equipTypeId){
    var equipTypeDef = _.find(equipTypeDefine, (equipType)=>{
        return equipType.Id == equipTypeId
    })
    return equipTypeDef
}

function initTimerTable(){
    var i = 0;
    for(i = 0; i < MAX_TIMER_NUM; i++){
        timerTable.push({'timerId':i, 'timerFd':undefined, 'state':['STOP', 'STOP']})
    }
}

function compareRuleValue(compareValue, ruleCompareValue, logic){
    switch(logic){
        case "EQUAL":{
            return (compareValue == ruleCompareValue)
            break
        }
        case "INEQUAL":{
            return (compareValue != ruleCompareValue)
            break
        }
        case "GREATER":{
            return (compareValue > ruleCompareValue)
            break
        }
        case "LESS":{
            return (compareValue < ruleCompareValue)
            break
        }
        case "EQUAL_GREATER":{
            return (compareValue >= ruleCompareValue)
            break
        }
        case "EQUAL_LESS":{
            return (compareValue <= ruleCompareValue)
            break
        }
        case "ANYWAY":{
            return true
            break
        }
        default:{
            return false
        }

    }
}

function matchEquipRule(rule){
    var equipEle = getEquipFromStorage(rule.boardUID, rule.equipId)
    if(undefined == equipEle){
        console.error("matchEquipRule error : no such equip in storage")
        return false
    }
    var compareValue = undefined
    if("AVERAGEVAL" == rule.dataType){
        if('SWITCH' == equipEle.equipTypeAttr.type){
            console.error("matchEquipRule error : SWITCH type equip no AVERAGEVAL type data")
            return false
        }//SWITCH type equip didn't have average value
        if(0 == _.size(equipEle.valueList)){
            console.error("matchEquipRule error : equip storage is empty")
            return false
        }
        var latestTime = _.last(equipEle.valueList).updateTime
        var firstTime = equipEle.valueList[0].updateTime
        if(latestTime - firstTime < rule.duration *1000){
            console.error("matchEquipRule error : no enough time duration")
            return false
        }//no enough time duration
        var sumVal = 0;
        var count = 0;
        console.info("size of equipEle.valueList : ", _.size(equipEle.valueList))
        console.info("latestTime : ", latestTime)
        console.info("firstTime : ", firstTime)
        for(var i = _.size(equipEle.valueList) - 1; i >= 0; i--){
            //console.info("i : ", i)
            //console.info("equipEle.valueList[i] : ", equipEle.valueList[i])
            var value = equipEle.valueList[i].value
            var updateTime = equipEle.valueList[i].updateTime
            sumVal += value
            count += 1
            if(latestTime - updateTime >= rule.duration *1000){
                break
            }
        }
        compareValue = sumVal / count
    }else if("CURVAL" == rule.dataType){
        compareValue = equipEle.valueList[_.size(equipEle.valueList) - 1].value
    }else if("PREVAL" == rule.dataType){
        compareValue = equipEle.valueList[_.size(equipEle.valueList) - 2].value
    }else if("COUNT" == rule.dataType){
        if("SWITCH" != equipEle.equipTypeAttr.type){
            console.error("matchEquipRule error : only SWITCH type equip could compare count")
            return false
        }
        compareValue = equipEle.switchCount
    }else{
        return false
    }
    return compareRuleValue(compareValue, rule.compareVal, rule.logic)
}

function matchTimerRule(rule){
    var timerEle = getTimerEle(rule.timerId)
    if(undefined == timerEle){
        console.error("no such timer in timerTable")
        return false 
    }
    if("CURVAL" == rule.dataType){
        compareValue = timerEle.state[1]
    }else if("PREVAL" == rule.dataType){
        compareValue = timerEle.state[0]
    }else{
        return false
    }
    return compareRuleValue(compareValue, rule.compareVal, rule.logic)
}

function sendUDPDriveMsg(ipaddress, equipId, value) {
    console.info("sendUDPDriveMsg : ")
    console.info("      ipaddress : ", ipaddress)
    console.info("      equipId : ", equipId)
    console.info("      value : ", value)

    driveData.allocate();
    var buf = driveData.buffer();

    var proxy = driveData.fields;
    proxy.equipId = equipId
    proxy.value = value
    console.log(buf);
    UDPClient.send(buf, UDP_BOARD_LISTEN_PORT, ipaddress, (err) => {
        //console.log('error to send buf')
    })
}

function callAction(action) {
    console.info("come into callAction, action : ", action)
    if (undefined == action) {
        console.info("no such action : ")
        return
    }
    switch (action.outputType) {
        case 'DRIVE_DEV':
            {
                driveEquip(action.boardUID, action.equipId, action.value)
                break
            }
        case 'START_TIMER':
            {
                createTimer(action.timerId, action.value*1000)
                break
            }
        case 'STOP_TIMER':
            {
                clearTimer(action.timerId)
                break
            }
        case 'SET_COUNT':
            {
                setEquipCount(action.boardUID, action.equipId, action.value)
                break
            }
        default:
            {
                return
            }
    }
}

function performRule(ruleList, actionList) {
    console.info("******************************************")
        //console.info("ruleList : ", ruleList)
        //console.info("actionList : ", actionList)

    if (true == _.every(ruleList, (rule) => {
            if ("EQUIP" == rule.inputType) {
                return matchEquipRule(rule)
            } else if ("TIMER" == rule.inputType) {
                return matchTimerRule(rule)
            }
        })){
        console.info("--------------------------------fit ruleList : ", ruleList)
        console.info("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~perform actionList : ", actionList)
        _.each(actionList, (action)=>{
            callAction(action)
        })
    }
}


function judgeAndAction(inputType, inputId) {
    if ('EQUIP' != inputType && 'TIMER' != inputType) {
        return
    }

    _.each(ruleTable, (ruleEle) => {
        var matchRule = undefined
        var ruleList = ruleEle.ruleList
        var actionList = ruleEle.actionList
        if(inputType == 'EQUIP'){
                var boardUID = inputId.boardUID
                var equipId = inputId.equipId   
                matchRule = _.find(ruleList, (rule)=>{
                    return (rule.boardUID == boardUID && rule.equipId == equipId)
                })
                if(matchRule != undefined){
                    performRule(ruleList, actionList)
                }
            }else if('TIMER == inputType'){
                var timerId = inputId.timerId
                matchRule = _.find(ruleList, (rule)=>{
                    return (rule.timerId == timerId)
                }) 
                if(matchRule != undefined){
                    performRule(ruleList, actionList)
                }
            }

    })
}



function getTimerEle(timerId){
    var timerEle = _.find(timerTable, (ele)=>{
        return timerId == ele.timerId
    })
    if(undefined == timerEle){
        console.error('invalid timerId : ', timerId)
        return undefined
    }
    return timerEle
}

function timeoutCallback(timerId){
    var timer = getTimerEle(timerId)
    if(undefined != timer){
        timer.state.shift()
        timer.state[1] = 'TIMEOUT'
        timer.timerFd = undefined
    }

}

function clearTimer(timerId){
    var timer = getTimerEle(timerId)
    if(undefined != timer){
        if(undefined != timer.timerFd){
            clearTimeout(timer.timerFd)
        }
        timer.state.shift()
        timer.state[1] = 'STOP'
        timer.timerFd = undefined
    }
}

function createTimer(timerId, delay){
    var timerEle = getTimerEle(timerId)
    if(undefined == timerEle){
        return
    }
    if(undefined != timerEle.timerFd){
        clearTimeout(timerEle.timerFd)
    }
    timerEle.state.shift()
    timerEle.state[1] = 'RUNNING'
    timerEle.timerFd = setTimeout(timeoutCallback, delay, timerId)
}

function showTimerTable(){
    console.info("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    _.each(timerTable, (timerEle)=>{
        console.info("timerId : ", timerEle.timerId)
        console.info("timerState : ", timerEle.state)
    })
}

function monitorTimerTable(){
    setInterval(showTimerTable, 1000)
}


initTimerTable()
loadConfigure()
generatorDataStorageTable()
showDataStorageTable()
startUDPServer(UDP_LISTEN_PORT)
/*monitorTimerTable()
createTimer(0, 7000)
createTimer(1, 3000)

setTimeout(function(){
    clearTimer(0)
    clearTimer(1)
}, 10000)*/


/*setInterval(function(){
    judgeAndAction('EQUIP', {"boardUID":"de:ad:be:ef:fe:ed", "equipId":3})
}, 1000)*/

setInterval(function(){
    judgeAndAction('TIMER', {"timerId":2})
}, 1000)
createTimer(2, 7000)
//judgeAndAction('EQUIP', {"boardUID":"de:ad:be:ef:fe:ed", "equipId":3})
//judgeAndAction('TIMER', {"timerId":1})


