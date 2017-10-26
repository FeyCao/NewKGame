// JavaScript Document
var TempLoadScene = SceneBase.extend(
    {
        backgroundLayer:null,		//背景层

        username:null,
        password:null,
        source:null,

        titleSprite:null,

        loadTime:null,

        ctor: function ()
        {
            this._super();
            this.backgroundLayer=null;
        },

        onEnter:function ()
        {
            this._super();

            //清除保存的账号信息
            this.removeLocalStorageItems();

            var size = cc.director.getWinSize();
            this.backgroundLayer=new cc.LayerColor(cc.color(15,96,148, 255));
            this.backgroundLayer.ignoreAnchorPointForPosition(false);
            this.backgroundLayer.setPosition(size.width / 2, size.height / 2);
            this.addChild(this.backgroundLayer, 1,this.backgroundLayer.getTag());

            this.titleSprit=new cc.Sprite.create("res/bg_tittle.png");
            this.titleSprit.setPosition(this.width / 2, this.height / 2);
            this.titleSprit.setScale(1);
            this.addChild(this.titleSprit, 2,this.titleSprit.getTag());


            if(gLoginManager==null)
            {
                // gLoginManager=new LoginManager();
                gLoginManager=new LoginManagerProtoBuf();
            }

            var self=this;
            userInfo.weChatCode = getQueryStringByName("code");
            userInfo.userId=getQueryStringByName("userId");
            userInfo.deviceId=getQueryStringByName("deviceId");
            userInfo.source=getQueryStringByName("source");
            userInfo.token=getQueryStringByName("token");
            userInfo.inviterUid=getQueryStringByName("inviterUid");
            userInfo.inviterCode=getQueryStringByName("inviteCode");
            var weChatLoginInfo =   codeWeChatData.getItem("WeChatCode");
            cc.log("从本地获取微信登录信息：");
            cc.log(weChatLoginInfo);
            if (window.parent){
                userInfo.weChatCode = window.parent.getQueryStringByName("code");
                userInfo.userId=window.parent.getQueryStringByName("userId");
                userInfo.deviceId=window.parent.getQueryStringByName("deviceId");
                userInfo.source=window.parent.getQueryStringByName("source");
                userInfo.token=window.parent.getQueryStringByName("token");
                userInfo.inviterUid=window.parent.getQueryStringByName("inviterUid");
                userInfo.inviterCode=window.parent.getQueryStringByName("inviteCode");
                isWeChat = window.parent.isWeChat;
                weChatLoginInfo =   window.parent.codeWeChatData.getItem("WeChatCode");
            }
            cc.log("userId="+userInfo.userId+"deviceId="+userInfo.deviceId+"source="+userInfo.source);


                // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6c8f3344605a07fc&redirect_uri=http://kgame.kiiik.com/KGame/index.html&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
                // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxab385c9110dc72a3&redirect_uri=http://kgt.kiiik.com/KGame/index.html&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect
            cc.log("userInfo.weChatCode==");
            cc.log(userInfo.weChatCode);


            if(isWeChat&&null!=weChatLoginInfo&&weChatLoginInfo!=""){
                if(cc.game.config["testFlag"]==true){
                    alert('weChat微信token授权登录');
                }
                // this.weChatcode = userInfo.weChatCode;
                // cc.log(wechatLoginByCode.accessToken);
                // cc.log(wechatLoginByCode.refreshToken);
                // cc.log(wechatLoginByCode.openId);
                // weChatLoginInfo.accessToken,weChatLoginInfo.refreshToken,weChatLoginInfo.openId
                if(weChatLoginInfo.wechatLoginType==1){
                    var wechatLoginByCode = weChatLoginInfo.wechatLoginByCode;
                    gLoginManager.weChatLoginByToken(wechatLoginByCode.accessToken,wechatLoginByCode.refreshToken,wechatLoginByCode.openId,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
                }else if(weChatLoginInfo.wechatLoginType==2){
                    var wechatLoginByCode = weChatLoginInfo.wechatLoginByToken;
                    gLoginManager.weChatLoginByToken(wechatLoginByCode.accessToken,wechatLoginByCode.refreshToken,wechatLoginByCode.openId,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
                }

            }
            else if(userInfo.weChatCode!=null&&userInfo.weChatCode!=""){
                if(cc.game.config["testFlag"]==true){
                    alert('weChat微信code授权登录');
                }
                this.weChatcode = userInfo.weChatCode;
                gLoginManager.weChatLogin(this.weChatcode,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
            }
            else if(isWeChat&&userInfo.weChatCode==""){
                if(cc.game.config["testFlag"]==true){
                    alert('weChat获取微信授权code');
                }
                var weChatURL = cc.game.config["serverWechatURL"];
                //记录测试模式信息
                if(cc.game.config["testFlag"]==true){
                    weChatURL = cc.game.config["serverTestWechatURL"];
                }
                var  urlEncode =  encodeURI(window.location.href);
                var url = weChatURL+"&redirect_uri="+urlEncode+"&response_type=code&scope=snsapi_login&state="+window.location.search+"#wechat_redirect";//"index.html?" + "tittle=room&&source=" + userInfo.inviteType +"&inviterUid=" + inviteInfo.inviterUid + "&inviteCode=" + inviteInfo.inviteCode + "&head=趋势突击&subtitle=" + content + "subtitleEnd";
                // var url = weChatURL+window.location.search+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";//"index.html?" + "tittle=room&&source=" + userInfo.inviteType +"&inviterUid=" + inviteInfo.inviterUid + "&inviteCode=" + inviteInfo.inviteCode + "&head=趋势突击&subtitle=" + content + "subtitleEnd";
                cc.log("url");
                // alert('获取微信code');
                if (window.parent){
                    window.parent.window.location.href = url;
                    // return;
                }
                window.location.href = url;
            // return;
            }
            else if(userInfo.userId!=null&&userInfo.deviceId!=null)
            {
                this.username=userInfo.userId;
                this.password=userInfo.deviceId;
                this.source=userInfo.source;
                if(this.username!=""&&this.password!=""&&this.source!="")
                {
                    gLoginManager.Login(this.username,this.password,this.source,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
                }else
                {
                    gLoginManager.QuickLogin(this.source,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
                }
                //cc.director.runScene(new MainMenuScene());
            } else
            {
                gLoginManager.QuickLogin(this.source,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
            }
            // gSocketConn.RegisterEvent("onmessage",this.messageCallBack);
            this.showProgress();
            loadTime=new Date().getTime();
        },

        removeLocalStorageItems:function()
        {
            localStorage.removeItem("remPwd");
            localStorage.removeItem("autologin");
            localStorage.removeItem("lastusername");
            localStorage.removeItem("usrnamepwdDict");
        },

        getPasswordFromLocalStorage:function(username)
        {
            var dict=localStorage.usrnamepwdDict;
            if(dict==undefined || dict==null) return null;
            var fields=dict.split("#");
            for(var i=0;i<fields.length;i=i+2)
            {
                if(fields[i]==username)
                {
                    if(i+1<fields.length)
                    {
                        return fields[i+1];
                    }
                }
            }
            return null;
        },


        connectErrorCallBack:function()
        {
            var self=this;
            //setTimeout(function(){
            //	self.stopProgress();
            //	self.showMessageBox("服务器连接失败，请稍候再试！",function(){self.messageBoxClosed();});
            //	},2000);
            // this.stopProgress();
            self.stopProgress();
            self.showErrorBox("服务器连接失败，请稍候再试！",function(){self.errorBoxClosed();});
        },

        // messageCallback:function(packet)
        // {
        //    //
        // 	// cc.log("login scene message callback packet.msgType="+packet.msgType);
        // 	// cc.log("login scene message callback packet.content="+packet.content);
        // 	var self=this;
        // 	if(packet.msgType=="1")
        // 	{
        // 		//登录成功
        // 		gPlayerName=packet.content.split("#")[0];
        //
        // 		// userId:null,//
        // 		// 	deviceId:null,//设备号
        // 		// userInfo.username=gPlayerName;
        // 		// userInfo.password=packet.content.split("#")[1];
        // 		userInfo.userId=gPlayerName;
        // 		userInfo.deviceId=packet.content.split("#")[1];
        //
        // 		//
        // 		if(userInfo.source!='DHJK'&&userInfo.source!='ZKQQ'){//
        // 			cc.log("userInfo.source before=="+userInfo.source);
        // 			userInfo.source=packet.content.split("#")[2];
        // 		}
        //
        // 		this.stopProgress();
        //
        //
        // 		if(gMainMenuScene==null)
        // 			gMainMenuScene=new MainMenuScene();
        // 		gMainMenuScene.onEnteredFunction=function(){
        // 			gMainMenuScene.showProgress();
        // 			cc.log("gMainMenuScene.onEnteredFunction=====");
        // 			gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
        // 			gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);
        // 			gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
        // 		};
        //
        //
        // 		if(null==currentScene||currentScene!="gMainMenuScene"){
        // 			cc.director.runScene(gMainMenuScene);
        // 			currentScene = "gMainMenuScene";
        // 		}
        //
        // 		// gPlayerName=packet.content;
        // 		// //登录成功
        // 		// this.OnLogined(packet.content);
        // 	}
        //    //else if(packet.msgType=="WEBL")
        //    //{
        //    //    //WEB登录成功
        //    //    this.stopProgress();
        //    //    this.showMessageBox("登录失败:"+packet.content,function(){self.messageBoxClosed();});
        //    //}
        //    //else if(packet.msgType=="APPL")
        //    //{
        //    //    //APP登录成功
        //    //    this.stopProgress();
        //    //    cc.director.runScene(new MainMenuScene());
        //    //    //this.showMessageBox("登录失败:"+packet.content,function(){self.messageBoxClosed();});
        //    //}
        // 	else if(packet.msgType=="2")
        // 	{
        // 		//登录失败
        //        self.stopProgress();
        //        self.showErrorBox("登录失败:"+packet.content,function(){self.errorBoxClosed();});
        // 	}
        // 	else if(packet.msgType=="B")
        // 	{
        // 		//快速登录成功
        // 		gPlayerName=packet.content.split("#")[0];
        //
        // 		// userId:null,//
        // 		// 	deviceId:null,//设备号
        // 		// userInfo.username=gPlayerName;
        // 		// userInfo.password=packet.content.split("#")[1];
        // 		userInfo.userId=gPlayerName;
        // 		userInfo.deviceId=packet.content.split("#")[1];
        // 		if(userInfo.source!='DHJK'&&userInfo.source!='ZKQQ'){
        //            userInfo.source=packet.content.split("#")[2];
        //        }
        // 		// userInfo.source=packet.content.split("#")[2];
        // 		this.stopProgress();
        //
        //
        // 		if(gMainMenuScene==null)
        // 			gMainMenuScene=new MainMenuScene();
        // 		gMainMenuScene.onEnteredFunction=function(){
        // 			gMainMenuScene.showProgress();
        // 			cc.log("gMainMenuScene.onEnteredFunction=====");
        // 			gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
        // 			gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);
        // 			gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
        // 		};
        //
        // 		if(null==currentScene||currentScene!="gMainMenuScene"){
        // 			cc.director.runScene(gMainMenuScene);
        // 			currentScene = "gMainMenuScene";
        // 		}
        // 		// gSocketConn.SendEHMessage(this.username,this.password);
        //
        // 		// gLoginManager.Login(this.username,this.password,this.source,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
        //
        // 	}
        // 	else if(packet.msgType=="C")
        // 	{
        // 		//注册失败
        //        self.stopProgress();
        //        self.showErrorBox("快速登录失败:"+packet.content,function(){self.errorBoxClosed();});
        // 	}
        // 	else if(packet.msgType=="S")
        // 	{
        // 		//分享成功
        // 		this.stopProgress();
        // 		//gLoginManager.Login(this.username,this.password,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
        // 	}
        // 	else if(packet.msgType=="PLAYERNUM")
        // 	{
        // 		//
        // 		this.stopProgress();
        // 		//gLoginManager.Login(this.username,this.password,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
        // 	}
        // 	else if(packet.msgType=="S")
        // 	{
        // 		//分享成功
        // 		this.stopProgress();
        // 		//gLoginManager.Login(this.username,this.password,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
        // 	}else {
        // 		cc.log("login scene message callback packet.msgType="+packet.msgType);
        // 	}
        // },
        messageCallback:function(message)
        {
            //
            cc.log("login scene message callback packet.msgType="+message.messageType);
            // cc.log("login scene message callback packet.content="+packet.content);
            var self=this;
            if(message.messageType==MessageType.Type_Wechat_Login)
            {

                var wechatMessage = new WechatLogin();
                wechatMessage = message.wechatLogin;
                cc.log("weChat保存微信登录信息");
                // cc.log(wechatMessage);
                codeWeChatData.setItem("WeChatCode",wechatMessage);


                // userInfo.accessToken=wechatMessage.wechatLoginByToken.accessToken;
                // userInfo.refreshToken=wechatMessage.wechatLoginByToken.refreshToken;
                // userInfo.openId=wechatMessage.wechatLoginByToken.openId;

            }else if(message.messageType==MessageType.Type_Hall_Info){
                //登录成功
                cc.log("登录成功 callback packet.msgType="+message.messageType);
                if(null!=gLoginManager){
                    gLoginManager.UnRegisterEvent();
                }
                var hallMessage = new HallInfo();
                hallMessage = message.hallInfo;
                // userId:null,//
                // 	deviceId:null,//设备号
                // userInfo.username=gPlayerName;
                // userInfo.password=packet.content.split("#")[1];
                userInfo.userId=hallMessage.uid;
                userInfo.deviceId=hallMessage.uid;;

                //
                if(userInfo.source==null){//
                    cc.log("userInfo.source before=="+userInfo.source);
                    userInfo.source='TEST';
                }
                this.stopProgress();

                if(gMainMenuScene==null)
                    gMainMenuScene=new MainMenuScene();
                gMainMenuScene.onEnteredFunction=function(){
                    gMainMenuScene.showProgress();
                    cc.log("gMainMenuScene.onEnteredFunction=====");
                    gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
                    gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);
                    gMainMenuScene.messageCallBack(message);
                    // gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
                };


                if(null==currentScene||currentScene!="gMainMenuScene"){
                    cc.director.runScene(gMainMenuScene);
                    currentScene = "gMainMenuScene";
                }

                // gPlayerName=packet.content;
                // //登录成功
                // this.OnLogined(packet.content);

            }else if(message.messageType==MessageType.Type_Warn){
                cc.log("login scene message callback warnInfo msgType="+message.messageType);
                if(message.warn.code==-406){
                    self.showErrorBox("登录失败:"+message.warn.warnInfo,function(){self.errorBoxClosed();});
                }if(message.warn.code==-424){//授权失败
                    codeWeChatData.clearItem();
                    if(window.parent){
                        window.parent.codeWeChatData.clearItem();
                    }
                    alert('weChat微信token授权登录失败');
                    if(isWeChat){
                        var weChatURL = cc.game.config["serverWechatURL"];
                        //记录测试模式信息
                        if(cc.game.config["testFlag"]==true){
                            weChatURL = cc.game.config["serverTestWechatURL"];
                        }
                        alert('weChat获取微信授权code');
                        var  urlEncode =  encodeURI(window.location.href);
                        var url = weChatURL+"&redirect_uri="+urlEncode+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";//"index.html?" + "tittle=room&&source=" + userInfo.inviteType +"&inviterUid=" + inviteInfo.inviterUid + "&inviteCode=" + inviteInfo.inviteCode + "&head=趋势突击&subtitle=" + content + "subtitleEnd";
                        // var url = weChatURL+window.location.search+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";//"index.html?" + "tittle=room&&source=" + userInfo.inviteType +"&inviterUid=" + inviteInfo.inviterUid + "&inviteCode=" + inviteInfo.inviteCode + "&head=趋势突击&subtitle=" + content + "subtitleEnd";
                        cc.log("url");
                        // alert('获取微信code');
                        if (window.parent){
                            window.parent.window.location.href = url;
                            // return;
                        }
                        window.location.href = url;
                        // return;

                    };
                }else {
                    self.showErrorBox(""+message.warn.warnInfo,function(){self.errorBoxClosed();});
                    cc.log("login scene message message.warn.code="+message.warn.code);
                }

            }else{
                cc.log("login scene message callback other msgType="+message.messageType);
            }


        },

        OnLogined:function(content)
        {


            this.username=content.split("#")[0];
            //this.password=packet.content.split("#")[1];
            this.source=content.split("#")[1];

            //this.saveCheckboxState();
            cc.log( "packet.content="+content+"|this.username="+this.username+"|this.source="+this.source);

            this.moveToNextScene();

        },
        onExit:function()
        {
            this._super();
            cc.eventManager.removeAllListeners();
            if(gSocketConn!=null)
                gSocketConn.UnRegisterEvent("onmessage",this.messageCallBack);+
            this.removeAllChildrenWithCleanup(true);
            //全部清除方法
            for(var each in pageTimer){
                clearTimeout(pageTimer[each]);
            }
            cc.log("login scene onExit end");
        },

        //一般是登录名或者密码错误之类的框关闭以后
        messageBoxClosed:function()
        {
            //this.showOrHideTextBoxUILabel(false);
            window.location.href="http://analyse.kiiik.com/";
        },

        saveCheckboxState:function()
        {
            localStorage.remPwd="true"
            localStorage.autologin="true"
            localStorage.lastusername=this.username;
            var fields=null;
            if(localStorage.remPwd=="true")
            {
                var dict=localStorage.usrnamepwdDict;
                if(dict==undefined)
                {
                    dict="";
                }
                fields=dict.split("#");
                var bFound=false;
                for(var i=0;i<fields.length;i=i+2)
                {
                    if(fields[i]==this.username)
                    {
                        fields[i+1]=this.password;
                        bFound=true;
                        break;
                    }
                }
                if(bFound==false)
                {
                    fields.push(this.username);
                    fields.push(this.password);
                }
            }

            if(fields!=null)
            {
                dict="";
                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i]!="")
                    {
                        dict=dict+fields[i]+"#";
                    }
                }
                localStorage.usrnamepwdDict=dict;
            }
        },

        moveToNextScene:function()
        {

            var self=this;
            var endTime=new Date().getTime();
            if(endTime-loadTime>5000)
            {
                this.moveToNextSceneCallBack();
            }
            else
            {
                setTimeout(function(){self.moveToNextSceneCallBack(),5000-(endTime-loadTime);});
            }
        },

        moveToNextSceneCallBack:function()
        {
            cc.log("登录成功，准备切换到下一个场景");
            this.stopProgress();

            if(this.source=="SWEB"){
                var klineSceneNext=new KLineScene();
                klineSceneNext.onEnteredFunction=function(){
                    klineSceneNext.showProgress();
                    gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
                    gSocketConn.BeginMatch(0);
                };
                //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
                cc.director.runScene(klineSceneNext);
                cc.log("SWEB切换场景调用完毕");
            }else if(this.source=="DHJK"){
                if(gMainMenuScene==null)
                    gMainMenuScene=new MainMenuScene();
                gMainMenuScene.onEnteredFunction=function(){
                    gMainMenuScene.showProgress();
                    gSocketConn.SendEHMessage(this.username,this.password);
                    gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);
                };
                cc.director.runScene(gMainMenuScene);
                //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));

                cc.log("DHJK切换场景调用完毕");
            }


        }
    });