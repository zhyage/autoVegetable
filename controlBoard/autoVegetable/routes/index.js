var express = require('express');
var router = express.Router();
const dgram = require('dgram');

//const webUDPClient = dgram.createSocket('udp4');
//var UDP_FOR_WEB_LISTEN_PORT = 8899

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AutoVegetable' });
});


function webSendUDPDriveMsg(content) {
	console.info("content : ", content)
	const webUDPClient = dgram.createSocket('udp4');

    //var buf = new Buffer(content)
    //console.log(buf);
    webUDPClient.send(content, 8899, '127.0.0.1', (err) => {
    	console.info("err : ", err)
        if (err) throw err;
    })
}

router.post('/submitControl', function(req, res, next){
    var submitBody = req.body;

    var submitBodyString = JSON.stringify(submitBody);

    console.info("get submitBodyString : ", submitBodyString);
    webSendUDPDriveMsg(submitBodyString);
    res.send("got you");
   

/*    function sendResBack(res, resultMsg)
    {
        console.info("here message back from python:", resultMsg);
        res.send(resultMsg);
    }

    submit2Python.sendMsg2Py(submitBodyString, sendResBack, res);*/


});


module.exports = router;
