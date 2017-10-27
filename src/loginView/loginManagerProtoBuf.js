// JavaScript Document
function LoginManagerProtoBuf()
{
    this.username="";
    this.password="";
    this.source="";
    this.operationType=0;	//1为登录，2为快速登录
    this.messageCallBackFunction=null;
    this.connectErrorCallBackFunction=null;	//服务器连接失败的回调函数
    LoginManagerProtoBuf.instance=this;
}

LoginManagerProtoBuf.prototype.instance=null;

//登录，分两种情况，一种是通过输入框输入用户名和密码登录
//一种是通过URL地址传递参数登录
LoginManagerProtoBuf.prototype.Login=function(username,password,source,messageCallBackFunction,connectErrorCallBackFunction)
{
    cc.log("LoginManagerProtoBuf.prototype.Login");
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
LoginManagerProtoBuf.prototype.QuickLogin=function(source,messageCallBackFunction,connectErrorCallBackFunction)
{
    this.source=source;
    this.messageCallBackFunction=messageCallBackFunction;
    this.connectErrorCallBackFunction=connectErrorCallBackFunction;
    this.operationType=2;
    userInfo.operationType=2;
    this.ConnectServer();
}
//微信登录，新用户直接注册随机帐号，然后登录
LoginManagerProtoBuf.prototype.weChatLogin=function(code,messageCallBackFunction,connectErrorCallBackFunction)
{
    this.code=code;
    this.messageCallBackFunction=messageCallBackFunction;
    this.connectErrorCallBackFunction=connectErrorCallBackFunction;
    this.operationType=3;
    userInfo.operationType=3;
    this.ConnectServer();
}
//微信token登录，
LoginManagerProtoBuf.prototype.weChatLoginByToken=function(accessToken,refreshToken,openId,messageCallBackFunction,connectErrorCallBackFunction)
{
    //wechatLoginByCode: eaccessToken: "O2dzCl0nJo_JahltYzTi0ogJSx2ytzvv6ws35vLG19rH_E8HGyVvG6_-Ca7MOzvey-x74ThidoabCAxVZ5P-4rxXI0V0XrSS-PQRNc4u55U"code: "0213pwYL1VGNW21VqTXL1C6QYL13pwY8"openId: "o03uq0mmOtpxCR5D_dIAU6TrrBJ0"refreshToken: "c3dgpuBxDZypipeZO1Doo-2IDRbxTApVqAHhq9CjPICN0rzkIT4rnYO5YKyiPAFhH-hFL3reuXJojlwRlyP7M7O2-XJPfw6js0QOqEq1H7U"
    var self=this;
    self.accessToken=accessToken;
    self.refreshToken=refreshToken;
    self.openId=openId;
    this.messageCallBackFunction=messageCallBackFunction;
    this.connectErrorCallBackFunction=connectErrorCallBackFunction;
    this.operationType=4;
    userInfo.operationType=4;
    this.ConnectServer();
}

//登录和注册的两个按钮，以及通过URL登录都是走的这个函数
LoginManagerProtoBuf.prototype.ConnectServer=function()
{
    cc.log("LoginManagerProtoBuf.prototype.ConnectServer");
    if(cc.game.config["testFlag"]==true){
        alert('链接后台ConnectServer');
    }

    if(gSocketConn==null)
    {
        gSocketConn=new protoSocketConn();
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
LoginManagerProtoBuf.prototype.ErrorConnectCallBack=function()
{
    var self=LoginManagerProtoBuf.instance;
    gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
    gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
    if(self.connectErrorCallBackFunction!=null)
    {
        self.connectErrorCallBackFunction();
    }
}

//连接成功
LoginManagerProtoBuf.prototype.ConnectedCallBack=function()
{
    cc.log("LoginManagerProtoBuf.prototype.ConnectedCallBack");
    if(cc.game.config["testFlag"]==true){
        alert('链接后台连接成功ConnectServer');
    }

    var self=LoginManagerProtoBuf.instance;
    gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
    gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
    self.LoginOrQuickLogin();
}

LoginManagerProtoBuf.prototype.LoginOrQuickLogin=function()
{
    cc.log("LoginManagerProtoBuf.prototype.LoginOrQuickLogin");
    if(this.operationType==1 || this.operationType==2|| this.operationType==3|| this.operationType==4)
    {
        var self=this;
       gSocketConn.RegisterEvent("onmessage",self.LoginOrQucikLoginMessageCallback);
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
        else if(this.operationType==3)
        {
            //注册并登录
            if(null!=userInfo.weChatCode){
                gSocketConn.weChatLoginByCode(self.code);
            }

        }
        else if(this.operationType==4)
        {
            //注册并登录
            if(null!=userInfo.weChatCode){
                gSocketConn.weChatLoginByToken(self.accessToken,self.refreshToken,self.openId)
            }

        }
    }
}

LoginManagerProtoBuf.prototype.LoginOrQucikLoginMessageCallback=function(message)
{
    cc.log("LoginManagerProtoBuf.prototype.LoginOrQucikLoginMessageCallback=="+message);

    // var MessageInfo = Message.decode(message);
    // console.info("收到的登录数据：");
    // console.info(MessageInfo);
    // var packet=Packet.prototype.Parse(message);
    // if(packet==null) return;
    cc.log("LoginManagerProtoBuf message callback packet.msgType="+message.messageType);
    // cc.log("LoginManagerProtoBuf message callback packet.content="+packet.content);

    var self=LoginManagerProtoBuf.instance;
    // gSocketConn.RegisterEvent("onmessage",self.messageCallBackFunction);
    if(self.messageCallBackFunction!=null)
    {
        self.messageCallBackFunction(message);
        if(this.operationType==1 || this.operationType==2|| this.operationType==3|| this.operationType==4){
            gSocketConn.UnRegisterEvent("onmessage",self.LoginOrQucikLoginMessageCallback);//登陆成功后再注销回调
        }

    }
}

LoginManagerProtoBuf.prototype.UnRegisterEvent=function()
{

    var self=LoginManagerProtoBuf.instance;
    gSocketConn.UnRegisterEvent("onopen",self.ConnectedCallBack);
    gSocketConn.UnRegisterEvent("onerror",self.ErrorConnectCallBack);
    gSocketConn.UnRegisterEvent("onmessage",self.LoginOrQucikLoginMessageCallback);

}


	
