

    function submithReq() {
        this.userName = '';
        this.passwd = '';
        this.sessionId = 0;
        this.submitType = 0;
        this.submitContent = '';

        this.generateSubmitReq = function(userName, passwd, sessionId, submitType, submitContent) {
            this.userName = userName;
            this.passwd = passwd;
            this.sessionId = sessionId;
            this.submitType = submitType;
            this.submitContent = submitContent;
        }
    }


    function handleMathRes(data){
        /*var resData = JSON.parse(data);
        //console.info(" resData.reason = ", resData.reason);
        if (resData.result == "success") {
            saveMatrixStr2LocalStorage("computedMatrix", resData.matrix)
        } else {
                    var origDataStr = "";
                    origDataStr = loadMatrixStrFromLocalStorage("localMatrix");
                    if(origDataStr){
                        saveMatrixStr2LocalStorage("computedMatrix", origDataStr);
                        alert(resData.result);
                    }else{
                        alert("error to handle local storage");
                    }
        }
                console.info("now complete submitComputExpressAndData");
                //location.replace("http://192.168.56.101:3000");
                window.close();*/
                alert("submit done");
    }

    function submit2Server(userName, passwd, submitType, submitContent) {
        console.info("entry submitMath2Server");

        var sessionId = 1;

        var submitBody = new submithReq();

        submitBody.generateSubmitReq(userName, passwd, sessionId, submitType, submitContent);
        var bodyData = JSON.stringify(submitBody);

        $.ajax({
            type: "POST",
            url: "/submitControl",
            data: bodyData,
            contentType: "application/json; charset=utf-8",
            async: "false",
            success: function(data) {
                handleMathRes(data);
            },
            failure: function(errMsg) {
                alert(errMsg);
            }
        });

    }