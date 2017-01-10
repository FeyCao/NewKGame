// JavaScript Document
function LoginManager()
{
	this.username="";
	this.password="";
	this.source="";
	this.operationType=0;	//1为登录，2为快速登录
	this.messageCallBackFunction=null;
	this.connectErrorCallBackFunction=null;	//服务器连接失败的回调函数
	LoginManager.instance=this;
}

LoginManager.prototype.instance=null;

//登录，分两种情况，一种是通过输入框输入用户名和密码登录
//一种是通过URL地址传递参数登录
LoginManager.prototype.Login=function(username,password,source,messageCallBackFunction,connectErrorCallBackFunction)
{
	this.username=username;
	this.password=password;
	this.source=source;
	this.messageCallBackFunction=messageCallBackFunction;
	this.connectErrorCallBackFunction=connectErrorCallBackFunction;
	this.operationType=1;
	userInfo.operationType=1;
	this.ConnectServer();
}

//快速登录，新用户直接注册随机帐号，然后登录
LoginManager.prototype.QuickLogin=function(source,messageCallBackFunction,connectErrorCallBackFunction)
{
	this.source=source;
	this.messageCallBackFunction=messageCallBackFunction;
	this.connectErrorCallBackFunction=connectErrorCallBackFunction;
	this.operationType=2;
	userInfo.operationType=2;
	this.ConnectServer();
}

//登录和注册的两个按钮，以及通过URL登录都是走的这个函数
LoginManager.prototype.ConnectServer=function()
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
		this.LoginOrQuickLogin();
	}
}

//连接失败，可能服务器开启
LoginManager.prototype.ErrorConnectCallBack=function()
{
	var self=LoginManager.instance;
	gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
	gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
	if(self.connectErrorCallBackFunction!=null)
	{
		self.connectErrorCallBackFunction();
	}
}

//连接成功
LoginManager.prototype.ConnectedCallBack=function()
{
	cc.log("connectedCallBack");
	var self=LoginManager.instance;
	gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
	gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
	self.LoginOrQuickLogin();
}

LoginManager.prototype.LoginOrQuickLogin=function()
{
	if(this.operationType==1 || this.operationType==2)
	{
		var self=this;
		gSocketConn.RegisterEvent("onmessage",this.LoginOrQucikLoginMessageCallback);
		if(this.operationType==1)
		{
			//登录
			gSocketConn.Login(this.username,this.password,this.source);
		}
		else if(this.operationType==2)
		{
			//注册并登录
			gSocketConn.QuickLogin(self.source);
		}
	}
}

LoginManager.prototype.LoginOrQucikLoginMessageCallback=function(message)
{
	var packet=Packet.prototype.Parse(message);
	if(packet==null) return;
	var self=LoginManager.instance;
	gSocketConn.UnRegisterEvent("onmessage",self.LoginOrRegisterMessageCallback);
	if(self.messageCallBackFunction!=null)
	{
		if(packet.msgType=="1" || packet.msgType=="2" || packet.msgType=="B" || packet.msgType=="C")
		{
			self.messageCallBackFunction(packet);
		}
	}
}


	
