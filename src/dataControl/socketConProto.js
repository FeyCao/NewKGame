// require("src/lib/Long.min.js");
// require("src/lib/ByteBufferAB.min.js");
// require("src/lib/ProtoBuf.min.js");




function protoSocketConn()
{
    this.onopenevent=[];
    this.onmessageevent=[];
    this.oncloseevent=[];
    this.onerrorevent=[];
    // this.urlToConnect="ws://192.168.16.250:8888/Kgamefeng/websocket";
    this.isconnected=false;
}
// if(cc.sys.isNative){
//     webSocket.onDataReceived(event.data);
// }else {
//     var fileReader = new FileReader();
//     fileReader.onload  = function(progressEvent) {
//         var arrayBuffer = this.result; // arrayBuffer即为blob对应的arrayBuffer
//         webSocket.onDataReceived(arrayBuffer);
//     };
//     fileReader.readAsArrayBuffer(event.data);
// }
protoSocketConn.prototype.Connect=function(url)
{
    // this.urlToConnect=url;
    var wsImpl = window.WebSocket || window.MozWebSocket;
    var self=this;
    cc.log("WS="+url);
    // cc.log("serverURL="+cc.game.config[cc.game.CONFIG_KEY.serverURL]);

    window.ws = new wsImpl(url);
    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
        // var data = evt.data;
        // var MessageInfo = Message.decode(data);
        // console.info("收到的数据：[]");
        // console.info(MessageInfo);
        for(var i=0;i<self.onmessageevent.length;i++)
        {
            cc.log("onmessage==="+evt.data);

            // self.onmessageevent[i](evt.data);
            var data = evt.data;
            var MessageInfo = Message.decode(data);
            console.info("收到的数据：["+i+"]");
            console.info(MessageInfo);
            if(MessageInfo.messageType == MessageType.Type_Ping){
                var  message = new Message();
                message.setMessageType(MessageType.Type_Pong);
                var arrayBuf =  message.toArrayBuffer();
                arrayBuf.valueOf();
                ws.send(arrayBuf);
                // console.info("心跳请求：");
                // console.info(message);

            }
            self.onmessageevent[i](MessageInfo);
        }
    };

    // when the connection is established, this method is called
    ws.onopen =function(){
        cc.log("self.onopenevent.length="+self.onopenevent.length);
        // var ta = document.getElementById('responseText');
        ws.binaryType = 'arraybuffer'; // 这个是关键
        // ta.value = "打开WebSocket服务正常，浏览器支持WebSocket!\r\n";
        cc.log("打开WebSocket服务正常，浏览器支持WebSocket!");
        self.isconnected=true;
        for(var i=0;i<self.onopenevent.length;i++)
        {
            self.onopenevent[i]();
        }
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        self.isconnected=false;
        for(var i=0;i<self.oncloseevent.length;i++)
        {
            self.oncloseevent[i]();
        }
        //
        cc.log("WebSocket 链接已断开 close");
    };

    ws.onerror = function(evt){
        for(var i=0;i<self.onerrorevent.length;i++)
        {
            self.onerrorevent[i]();
        }
        cc.log("WebSocketError!");
    };
}

protoSocketConn.prototype.GetEventArrayByName=function(eventname)
{
    switch(eventname)
    {
        case "onopen":
            return this.onopenevent;
        case "onmessage":
            return this.onmessageevent;
        case "onclose":
            return this.oncloseevent;
        case "onerror":
            return this.onerrorevent;
    }
    return null;
}

protoSocketConn.prototype.RegisterEvent=function(eventname,callbackfunction)
{

    // cc.log("RegisterEvent eventname="+eventname+", callbackfunction="+callbackfunction);
    cc.log("RegisterEvent eventname="+eventname);
    var eventArray=this.GetEventArrayByName(eventname);
    if(eventArray==null) return;
    for(var i=0;i<eventArray.length;i++)
    {
        if(eventArray[i]==callbackfunction)
        {
            return;
        }
    }
    eventArray.push(callbackfunction);
}

protoSocketConn.prototype.UnRegisterEvent=function(eventname,callbackfunction)
{
    var eventArray=this.GetEventArrayByName(eventname);
    if(eventArray==null) return;
    for(var i=0;i<eventArray.length;i++)
    {
        if(eventArray[i]==callbackfunction)
        {
            eventArray.splice(i,1);
            return;
        }
    }
}

protoSocketConn.prototype.Login=function(username,password,source)//手机设备号登录
{
    var loginMsg="0|"+username+"#"+password+"#"+source+"|";
    cc.log("send login msg="+loginMsg);



    var messageLogin = new Use_DeviceId_Login();
    messageLogin.setUid(username);
    messageLogin.setDeviceId(password);
    messageLogin.setSource(source);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Use_DeviceId_Login);
//        message.setMessageType(MessageType.Type_Hall_Info);
    message.setUseDeviceIdLogin(messageLogin);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("手机设备号登录发送的数据：");
    console.info(message);

}

// protoSocketConn.prototype.QuickLogin=function(source)
// {
//
//     var messageFL = new Fast_Lgoin();
//     messageFL.setSource(source);
//     var  message = new Message();
// //    var hall_Info = ;
//     message.setMessageType(MessageType.Type_Fast_Lgoin);
// //        message.setMessageType(MessageType.Type_Hall_Info);
//     message.setFastLogin(messageFL);
//     var arrayBuf =  message.toArrayBuffer();
//     arrayBuf.valueOf();
//     ws.send(arrayBuf);
//     console.info("快速登录发送到的数据：");
//     console.info(message);
//
// }

protoSocketConn.prototype.QuickLogin=function(source)
{

    var messageFL = new Fast_Lgoin();
    messageFL.setSource(source);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Fast_Lgoin);
//        message.setMessageType(MessageType.Type_Hall_Info);
    message.setFastLogin(messageFL);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("快速登录发送到的数据：");
    console.info(message);

}

protoSocketConn.prototype.toLogin=function(username,password)
{
    // LOGIN|mobile#code|
    var loginMsg="LOGIN|"+username+"#"+password+"|";
    cc.log("send toLogin msg="+loginMsg);
    ws.send(loginMsg);
}

protoSocketConn.prototype.SendBeginMessage=function()
{
    cc.log("protoSocketConn send sBegin msg= BEGIN||");
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Start_Match);
//        message.setMessageType(MessageType.Type_Hall_Info);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛开始请求：");
    console.info(message);
    // ws.send("BEGIN||");
}
protoSocketConn.prototype.SendBeginFriendMessage=function()
{
    cc.log("protoSocketConn send SendBeginFriendmsg= BEGIN||");
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Entry_Game_In_Home);
//        message.setMessageType(MessageType.Type_Hall_Info);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛开始请求：");
    console.info(message);
    // ws.send("BEGIN||");
}

protoSocketConn.prototype.SendRecordMessage=function(matchId,matchType)//查看对战记录
{
    var recordMsg = "O|"+matchId+"#"+matchType+"#"+userInfo.userId+"|";
    cc.log("send Recordmsg=="+recordMsg);
    // ws.send(recordMsg);

    var matchID = parseInt(matchId);
    var  message = new Message();
    var messageSend = new MatchRecord();
    messageSend.setMatchId(matchID);
    messageSend.setMatchType(parseInt(matchType));
    message.setMessageType(MessageType.Type_Match_Record);
    message.setMatchRecord(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛对战记录请求：");
    console.info(message);

}


// protoSocketConn.prototype.SendRecordMatchMessage=function(matchId,userId)//查看比赛的对战记录
// {
//     var recordMsg = "Y|"+matchId+"#"+userId+"#"+userInfo.userId+"|";
//     cc.log("send SendRecordMatchMessage=="+recordMsg);
//     ws.send(recordMsg);
// }



// protoSocketConn.prototype.BeginMatch=function(mode)
// {
//     cc.log("send BeginMatchMessage=="+"3|"+mode+"|");
//     ws.send("3|"+mode+"|");
// }
protoSocketConn.prototype.BeginMatch=function(matchType,handleDays,aiInfo)
{
    cc.log("send BeginMatchMessage=="+matchType+"|"+handleDays+"|"+aiInfo+"|");
   /* enum MatchType{
    Type_Practice_Match=0;
    Type_ArtificialMatch=1;
    Type_PlainMultiplayer_Match=2;
    Type_Tool_Match=3;
    Type_Friend_Match=4;
}*/

    if(typeof (handleDays)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        handleDays=120;
    }
    var messageSend = new Request_Match();
    messageSend.setMatchType(matchType);
    if(typeof (aiInfo)!="undefined"){//typeof(gMainMenuScene)=="undefined"
        messageSend.setAiInfo(aiInfo);
    }
    messageSend.setHandleDays(handleDays);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Request_Match);
//        message.setMessageType(MessageType.Type_Hall_Info);
    message.setRequestMatch(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛历史数据的请求：");
    console.info(message);

    // ws.send("3|"+mode+"|");
}
protoSocketConn.prototype.BeginMatchForMC=function(matchType,handleDays,codeList,year)//测试MC
{
    // cc.log("send BeginMatchMessage=="+matchType+"|"+handleDays+"|"+codeList+"|"+year+"|");

    if(typeof (handleDays)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        handleDays=120;
    }
    if(typeof (codeList)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        codeList=["BU","AU","HC"];
    }
    if(typeof (year)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        year=2015;
    }
    var messageSend = new Request_Match();
    messageSend.setMatchType(matchType);
    if(typeof (codeList)!="undefined"){//typeof(gMainMenuScene)=="undefined"
        messageSend.setVariety(codeList);
    }
    if(typeof (year)!="undefined"){//typeof(gMainMenuScene)=="undefined"
        messageSend.setStartyear(parseInt(year));
    }
    messageSend.setHandleDays(handleDays);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Request_Match);
//        message.setMessageType(MessageType.Type_Hall_Info);
    message.setRequestMatch(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛历史数据的请求：");
    console.info(message);

    // ws.send("3|"+mode+"|");
}

protoSocketConn.prototype.ChangeCode=function(code)
{

    cc.log("ChangeCode=function(code)=="+code);

    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Change_Code);
    message.setChangeCode(code);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("切换合约：");
    console.info(message);

    // ws.send(buyMsg);
}
protoSocketConn.prototype.Buy=function(index,lots)
{
    var buyMsg = "6|"+index+"|";
    cc.log("send Buymsg=="+buyMsg);
    var messageSend = new BuyOrSell();
    if(typeof (lots)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        lots=1;
    }
    messageSend.setLots(lots);
    messageSend.setIsBuy(true);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Buy_Or_Sell);
//        message.setMessageType(MessageType.Type_Hall_Info);
    message.setBuyOrSell(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("买操作请求：");
    console.info(message);

    // ws.send(buyMsg);
}

protoSocketConn.prototype.Sell=function(index)
{
    var sellMsg = "7|"+index+"|";
    //
    cc.log("send Sellmsg=="+sellMsg);
    var messageSend = new BuyOrSell();
    if(typeof (lots)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        lots=1;
    }
    messageSend.setLots(lots);
    messageSend.setIsBuy(false);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Buy_Or_Sell);
//        message.setMessageType(MessageType.Type_Hall_Info);
    message.setBuyOrSell(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("卖操作请求：");
    console.info(message);
    //ws.send("7|"+index+"|");
}

protoSocketConn.prototype.Step=function(index)
{
    var stepMsg = "8|"+index+"|";

    cc.log("send Stepmsg=="+stepMsg);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_New_Day);
//        message.setMessageType(MessageType.Type_Hall_Info);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛进度请求：");
    console.info(message);
    // ws.send(stepMsg);
    //ws.send("8|"+index+"|");
}

protoSocketConn.prototype.SendEndMessage=function()//
{
    cc.log("send Endmsg==E||");
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Operation_End);
//        message.setMessageType(MessageType.Type_Hall_Info);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛结束请求：");
    console.info(message);
    // ws.send("E||");
}

protoSocketConn.prototype.SendEndErrorMessage=function(errorInfo)
{
    var EndErrorMsg="ENDERROR|"+errorInfo+"|";

    var  message = new Message();
    cc.log("send error msg= "+EndErrorMsg);
    message.setMessageType(MessageType.Type_Home_In_Game);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛中结束请求：");
    console.info(message);
    // ws.send(EndErrorMsg);
}

protoSocketConn.prototype.SendShareMessage=function()
{
    cc.log("send share msg= S||");
    var  message = new Message();
    message.setMessageType(MessageType.Type_Share);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛分享请求：");
    console.info(message);
    // ws.send("S||");
}

protoSocketConn.prototype.ShareMessage=function(userId,matchId,matchType)
{
    var shareMsg="G|"+userId+"#"+matchId+"|";
    cc.log("send share msg="+shareMsg);

    var matchID = parseInt(matchId);
    var  message = new Message();
    var messageSend = new Share();
    messageSend.setMatchId(matchID);
    messageSend.setMatchType(matchType);
    message.setMessageType(MessageType.Type_Share);
    message.setShareInfo(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛分享请求：");
    console.info(message);
    // ws.send(shareMsg);
}

protoSocketConn.prototype.SendEHMessage=function(userId,matchId)//进入大厅的请求
{
    // var ehMsg="P|"+userId+"#"+matchId+"|";


    var ahallInfo = new HallInfo();
    ahallInfo.setUid(userId);
    ahallInfo.setToken(matchId);
    var  message = new Message();
//    var hall_Info = ;
    message.setMessageType(MessageType.Type_Hall_Info);
    message.setHallInfo(ahallInfo);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送请求大厅的数据：");
    console.info(message);
    // cc.log("send H msg="+message);
    // ws.send(message);
}
protoSocketConn.prototype.SendToHMessage=function(message)//进入大厅的请求
{
    var ehMsg="P|"+message+"|";
    //
    cc.log("send H msg="+ehMsg);
    ws.send(ehMsg);
}

protoSocketConn.prototype.SendZhanjiMessage=function(userId,pageIdx,matchType)//战绩请求
{
    var ehMsg="Z|"+userId+"#"+pageIdx+"#"+matchType+"|";
    cc.log("send Z msg="+ehMsg);

    var  message = new Message();
    message.setMessageType(MessageType.Type_HistoryMatches);

    var messageSend = new HistoryMatches();
    messageSend.setMatchType(matchType);
    message.setHistoryMatches(messageSend);


    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛战绩列表请求：");
    console.info(message);

    // ws.send(ehMsg);
}
//
protoSocketConn.prototype.SendRankMessage=function(matchType,userId)//查看比赛的对战记录
{
    var recordMsg = "RANK|"+matchType+"#"+userId+"|";
    cc.log("send SendRANKMessage=="+recordMsg);
    // ws.send(recordMsg);

    var  message = new Message();
    message.setMessageType(MessageType.Type_RankList);
    var messageSend = new RankList();
    messageSend.setMatchType(matchType);
    message.setRankList(messageSend);

    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("比赛排名列表请求：");
    console.info(message);
}

protoSocketConn.prototype.SendInfoMessage=function(infoType,infoMsg)//发送不确定信息
{
    var infoTypeAndMsg = infoType+"|"+infoMsg+"|";
    //
    cc.log("send infoTypeAndMsg=="+infoTypeAndMsg);
    // ws.send(infoTypeAndMsg);
    var  message = new Message();
    message.setMessageType(MessageType.Type_UnMatch);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("取消比赛请求：");
    console.info(message);
}




protoSocketConn.prototype.SendMoblieMessage=function(mobile)
{
    var moblieMsg="SENDCODE|"+mobile+"|";
    cc.log("send moblieMsg msg="+moblieMsg);
    ws.send(moblieMsg);
}

protoSocketConn.prototype.SendUnMatchMessage=function()//发送取消比赛请求
{
    var  message = new Message();
    message.setMessageType(MessageType.Type_UnMatch);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("取消比赛请求：");
    console.info(message);
}

protoSocketConn.prototype.SendFaceMessage=function(name,num)//FACE|name#emojiNum|
{
    var faceMsg="FACE|"+name+"#"+num+"|";
    cc.log("send faceMsg msg="+faceMsg);
    // ws.send(faceMsg);
    var  message = new Message();
    var messageSend = new Face();
    messageSend.setFaceType(num);
    message.setMessageType(MessageType.Type_Face);
    message.setFaceInfo(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送表情信息请求：");
    console.info(message);
}

protoSocketConn.prototype.SendToolMessage=function(name)//TOOL|name#emojiNum|red2green,cover,ban
{
    var toolMsg="TOOL|"+name+"|";
    cc.log("send TOOLMsg msg="+toolMsg);
    var  message = new Message();
    var messageSend = new Tool();
    messageSend.setToolType(name);
    message.setMessageType(MessageType.Type_Tool);
    message.setToolInfo(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送道具信息请求：");
    console.info(message);
    // ws.send(toolMsg);
}

protoSocketConn.prototype.getFriendList=function(mode)
{
    cc.log("send getFriendList|"+mode+"|");//Type_FriendList
    var  message = new Message();
    // var messageSend = new FriendMatch_Invite();
    // messageSend.setAgree(boolean);
    // messageSend.setInviteeName(userName);
    message.setMessageType(MessageType.Type_FriendList);
    // message.setFriendMatchInvite(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送获取好友信息请求：");
    console.info(message);
    // ws.send("LISTFRIEND||");
}
protoSocketConn.prototype.addFriend=function(addFriendType,content)
{
    cc.log("send addFriendList||");//Type_FriendList
    /* enum AddFriendType{
    Type_SelectAdd_NewFriend=0;//搜索好友
    Type_SendFriend_Request=1;//好友申请
    Type_FindFriendRequest=2;//新的朋友列表
    }*/

var  message = new Message();
    var messageSend = new AddFriend();
    messageSend.setAddFriendType(addFriendType);

    if(addFriendType==AddFriendType.Type_SelectAdd_NewFriend){
        console.info("发送查询好友信息的请求：");
        messageSend.setSelectAddNewFriend(new Array(content));
    }else if(addFriendType==AddFriendType.Type_SendFriend_Request){
        console.info("发送添加好友信息的请求：");
        messageSend.setSendFriendRequest(content);
    }else if(addFriendType==AddFriendType.Type_FindFriendRequest){
        console.info("发送新的好友列表信息的请求：");
        messageSend.setFindFriendRequest(new Array(content));
    }else if(addFriendType==AddFriendType.Type_ReceiveFriendRequest){
        console.info("接受好友信息的请求：");
        messageSend.setReceiveFriendRequest(content);
    }else{
        console.info("好友请求信息错误！！！");
    }
    message.setMessageType(MessageType.Type_AddFriend);
    message.setAddFriend(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);

    console.info(message);
    // ws.send("LISTFRIEND||");
}

protoSocketConn.prototype.inviteFriend=function(userName,otherPlatformFlag,inviteeUid)//邀请好友战
{
    cc.log("send inviteFriend==INVITE|"+userName+"|");
    var  message = new Message();
    var messageSend = new FriendMatch_Invite();
    if(typeof (userName)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        userName=null;
    }
    messageSend.setInviteeName(userName);
    if(typeof (otherPlatformFlag)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        otherPlatformFlag=false;
    }
    messageSend.setOtherPlatform(otherPlatformFlag);
    if(typeof (inviteeUid)=="undefined"){//typeof(gMainMenuScene)=="undefined"
        inviteeUid=null;
    }
    messageSend.setInviteeUid(inviteeUid);
    message.setMessageType(MessageType.Type_FriendMatch_Invit);
    message.setFriendMatchInvite(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送要战信息请求：");
    console.info(message);
    // ws.send("INVITE|"+userName+"|");
}


protoSocketConn.prototype.ansInviteFriend=function(boolean,inviteInfo)//回复邀请好友战ANSINVITE｜boolean#code｜
{
    cc.log("send ANSINVITEFriend==ANSINVITE|"+boolean+"#"+inviteInfo.code+"|"+inviteInfo.inviterName+"|");
    // ws.send("ANSINVITE|"+boolean+"#"+code+"|");
    var  message = new Message();
    var messageSend = new FriendMatch_Answer();
    messageSend.setAgree(boolean);
    messageSend.setInviteCode(inviteInfo.inviteCode);
    messageSend.setInviterUid(inviteInfo.inviterUid+'');
    message.setMessageType(MessageType.Type_FriendMatch_Answer);
    message.setFriendMatchAnswer(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送回答要战信息请求：");
    console.info(message);
    // ws.send(toolMsg);
}

protoSocketConn.prototype.ansRoomFriend=function(boolean,inviterUid,inviteCode)//回复邀请好友战ANSINVITE｜boolean#code｜
{
    cc.log("send ansRoomFriend==ANSINVITE|"+boolean+"#"+inviteInfo.code+"|"+inviteInfo.inviterName+"|");
    // ws.send("ANSINVITE|"+boolean+"#"+code+"|");
    var  message = new Message();
    var messageSend = new FriendMatch_Answer();
    messageSend.setAgree(boolean);
    messageSend.setInviteCode(inviteCode);
    messageSend.setInviterUid(inviterUid+'');
    message.setMessageType(MessageType.Type_FriendMatch_Answer);
    message.setFriendMatchAnswer(messageSend);
    var arrayBuf =  message.toArrayBuffer();
    arrayBuf.valueOf();
    ws.send(arrayBuf);
    console.info("发送回答要战信息请求：");
    console.info(message);
    // ws.send(toolMsg);
}