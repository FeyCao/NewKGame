// JavaScript Document

var SocketConnLogFlag = false;
function SocketConn()
{
	this.onopenevent=[];
	this.onmessageevent=[];
	this.oncloseevent=[];
	this.onerrorevent=[];
	this.urlToConnect="";
	this.isconnected=false;
}

SocketConn.prototype.Connect=function(url)
{
	this.urlToConnect=url;
	var wsImpl = window.WebSocket || window.MozWebSocket;
	var self=this;
	cc.log("WS="+url);
	window.ws = new wsImpl(url);
	 // when data is comming from the server, this metod is called
	ws.onmessage = function (evt) {
		for(var i=0;i<self.onmessageevent.length;i++)
		{
			cc.log("onmessage==="+evt.data);
			self.onmessageevent[i](evt.data);
		}
		cc.log("onmessage");
	};

	// when the connection is established, this method is called
	ws.onopen =function(){
		cc.log("self.onopenevent.length="+self.onopenevent.length);
		self.isconnected=true;
		for(var i=0;i<self.onopenevent.length;i++)
		{
			self.onopenevent[i]();
		}
		cc.log("open");
	};

	// when the connection is closed, this method is called
	ws.onclose = function () {
		self.isconnected=false;
		for(var i=0;i<self.oncloseevent.length;i++)
		{
			self.oncloseevent[i]();
		}
		window.location.reload();
		cc.log("close");
	};
	
	ws.onerror = function(evt){
		for(var i=0;i<self.onerrorevent.length;i++)
		{
			self.onerrorevent[i]();
		}
		cc.log("WebSocketError!");
	}; 
}

SocketConn.prototype.GetEventArrayByName=function(eventname)
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

SocketConn.prototype.RegisterEvent=function(eventname,callbackfunction)
{
	if(SocketConnLogFlag!=false)
	cc.log("RegisterEvent eventname="+eventname+", callbackfunction="+callbackfunction);
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

SocketConn.prototype.UnRegisterEvent=function(eventname,callbackfunction)
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


SocketConn.prototype.Login=function(username,password,source)
{
	var loginMsg="0|"+username+"#"+password+"#"+source+"|";
	cc.log("send login msg="+loginMsg);
	ws.send(loginMsg);
}

SocketConn.prototype.QuickLogin=function(source)
{
	var quickLoginMsg="A|"+source+"|";
	// if(SocketConnLogFlag!=false)
	cc.log("send QuickLogin msg="+quickLoginMsg);
	ws.send(quickLoginMsg);
}

SocketConn.prototype.toLogin=function(username,password)
{
	// LOGIN|mobile#code|
	var loginMsg="LOGIN|"+username+"#"+password+"|";
	cc.log("send toLogin msg="+loginMsg);
	ws.send(loginMsg);
}

SocketConn.prototype.SendBeginMessage=function()
{
    cc.log("SocketConn send sBegin msg= BEGIN||");
    ws.send("BEGIN||");
}

SocketConn.prototype.SendRecordMessage=function(matchId,userId)//查看对战记录
{
    var recordMsg = "O|"+matchId+"#"+userId+"#"+userInfo.userId+"|";
    cc.log("send Recordmsg=="+recordMsg);
    ws.send(recordMsg);
}


SocketConn.prototype.SendRecordMatchMessage=function(matchId,userId)//查看比赛的对战记录
{
	var recordMsg = "Y|"+matchId+"#"+userId+"#"+userInfo.userId+"|";
	cc.log("send SendRecordMatchMessage=="+recordMsg);
	ws.send(recordMsg);
}



SocketConn.prototype.BeginMatch=function(mode)
{
	cc.log("send BeginMatchMessage=="+"3|"+mode+"|");
	ws.send("3|"+mode+"|");
}

SocketConn.prototype.Buy=function(index)
{
	var buyMsg = "6|"+index+"|";
	if(SocketConnLogFlag!=false)
	cc.log("send Buymsg=="+buyMsg);
	ws.send(buyMsg);
}

SocketConn.prototype.Sell=function(index)
{
	var sellMsg = "7|"+index+"|";
	if(SocketConnLogFlag!=false)
	cc.log("send Sellmsg=="+sellMsg);
	ws.send(sellMsg);
	//ws.send("7|"+index+"|");
}

SocketConn.prototype.Step=function(index)
{
	var stepMsg = "8|"+index+"|";
	if(SocketConnLogFlag!=false)
	cc.log("send Stepmsg=="+stepMsg);
	ws.send(stepMsg);
	//ws.send("8|"+index+"|");
}

SocketConn.prototype.SendEndMessage=function()
{
	cc.log("send Endmsg==E||");
	if(SocketConnLogFlag!=false)
	cc.log("send Endmsg==E||");
	ws.send("E||");
}

SocketConn.prototype.SendEndErrorMessage=function(errorInfo)
{
	var EndErrorMsg="ENDERROR|"+errorInfo+"|";
	if(SocketConnLogFlag!=false)
		cc.log(EndErrorMsg);
	ws.send(EndErrorMsg);
}

SocketConn.prototype.SendShareMessage=function()
{
	cc.log("send share msg= S||");
	ws.send("S||");
}

SocketConn.prototype.ShareMessage=function(userId,matchId)
{
	var shareMsg="G|"+userId+"#"+matchId+"|";
	if(SocketConnLogFlag!=false)
	cc.log("send share msg="+shareMsg);
	ws.send(shareMsg);
}

SocketConn.prototype.SendEHMessage=function(userId,matchId)//进入大厅的请求
{
    var ehMsg="P|"+userId+"#"+matchId+"|";
	// if(SocketConnLogFlag!=false)
    cc.log("send H msg="+ehMsg);
    ws.send(ehMsg);
}
SocketConn.prototype.SendToHMessage=function(message)//进入大厅的请求
{
	var ehMsg="P|"+message+"|";
	// if(SocketConnLogFlag!=false)
	cc.log("send H msg="+ehMsg);
	ws.send(ehMsg);
}

SocketConn.prototype.SendZhanjiMessage=function(userId,pageIdx,matchType)//战绩请求
{
    var ehMsg="Z|"+userId+"#"+pageIdx+"#"+matchType+"|";
    cc.log("send Z msg="+ehMsg);
    ws.send(ehMsg);
}
//
SocketConn.prototype.SendRankMessage=function(matchType,userId)//查看比赛的对战记录
{
	var recordMsg = "RANK|"+matchType+"#"+userId+"|";
	// if(SocketConnLogFlag!=false)
		cc.log("send SendRANKMessage=="+recordMsg);
	ws.send(recordMsg);
}

SocketConn.prototype.SendInfoMessage=function(infoType,infoMsg)//发送不确定信息
{
	var infoTypeAndMsg = infoType+"|"+infoMsg+"|";
	// if(SocketConnLogFlag!=false)
	cc.log("send infoTypeAndMsg=="+infoTypeAndMsg);
	ws.send(infoTypeAndMsg);
}


SocketConn.prototype.SendMoblieMessage=function(mobile)
{
	var moblieMsg="SENDCODE|"+mobile+"|";
	cc.log("send moblieMsg msg="+moblieMsg);
	ws.send(moblieMsg);
}