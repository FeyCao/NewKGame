// JavaScript Document
function ShareManager()
{
	this.userId="";
	this.matchId="";
	this.socrce="";
	this.messageCallBackFunction=null;
	this.connectErrorCallBackFunction=null;	//服务器连接失败的回调函数
	ShareManager.instance=this;
}

ShareManager.prototype.instance=null;

//通过URL地址传递分享参数
ShareManager.prototype.ShareLogin=function(userId,matchId,source,messageCallBackFunction,connectErrorCallBackFunction)
{
	
	cc.log("userId3:"+userId);
	cc.log("matchId3:"+matchId);
	this.userId=userId;
	this.matchId=matchId;
	this.source=source;
	
	this.messageCallBackFunction=messageCallBackFunction;
	this.connectErrorCallBackFunction=connectErrorCallBackFunction;
	this.ConnectServer();
}

//通过URL登录都是走的这个函数
ShareManager.prototype.ConnectServer=function()
{
	if(gSocketConn==null)
	{
		gSocketConn=new SocketConn();
	}
	
	if(gSocketConn.isconnected==false)
	{
		gSocketConn.RegisterEvent("onopen",this.ConnectedCallBack);
		gSocketConn.RegisterEvent("onerror",this.ErrorConnectCallBack);
		gSocketConn.Connect(wsURL);
	}
	else
	{
		cc.log("链接服务器失败！！！！！ ConnectServer");
		
	}
}

//连接失败，可能服务器开启
ShareManager.prototype.ErrorConnectCallBack=function()
{
	var self=ShareManager.instance;
	gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
	gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
	if(self.connectErrorCallBackFunction!=null)
	{
		self.connectErrorCallBackFunction();
	}
}

//连接成功
ShareManager.prototype.ConnectedCallBack=function()
{
	cc.log("connectedCallBack");
	var self=ShareManager.instance;
	gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
	gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
	self.ShareMessage();
}

ShareManager.prototype.ShareMessage=function()
{
	
	//gSocketConn.UnRegisterEvent("onmessage");
	var self=ShareManager.instance;
	cc.log("userId4:"+self.userId);
	cc.log("matchId4:"+self.matchId);
	var aUserId = self.userId;
	var aMatchId = self.matchId;
	gSocketConn.RegisterEvent("onmessage",this.ShareMessageCallback);
	gSocketConn.ShareMessage(aUserId,aMatchId);
}

ShareManager.prototype.ShareMessageCallback=function(message)
{
	
	var packet=Packet.prototype.Parse(message);
	if(packet==null) return;
	var self=ShareManager.instance;
	gSocketConn.UnRegisterEvent("onmessage",self.ShareMessageCallback);
	if(self.messageCallBackFunction!=null)
	{
		if(packet.msgType=="H" || packet.msgType=="I" || packet.msgType=="S")
		{
			self.messageCallBackFunction(packet);
		}
	}
}



	
