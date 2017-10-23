// JavaScript Document
var ShareLoadScene = SceneBase.extend(
{
	backgroundLayer:null,		//背景层

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
		
		
		var size = cc.director.getWinSize();
		this.backgroundLayer=new cc.LayerColor(cc.color(15,96,148, 255));
		this.backgroundLayer.ignoreAnchorPointForPosition(false);  
		this.backgroundLayer.setPosition(size.width / 2, size.height / 2);  
		this.addChild(this.backgroundLayer, 1,this.backgroundLayer.getTag());
		
		this.titleSprit=new cc.Sprite.create("res/bg_tittle.png");
		this.titleSprit.setPosition(this.width / 2, this.height / 2);
		this.titleSprit.setScale(1);
		this.addChild(this.titleSprit, 2,this.titleSprit.getTag());
		
		var self=this;
		this.showProgress();
		loadTime=new Date().getTime();
		userInfo.nickName=getQueryStringByName("userName");
		userInfo.userId=getQueryStringByName("userId");
		userInfo.matchId=getQueryStringByName("matchId");
		userInfo.matchMode=getQueryStringByName("matchType");
        if (window.parent){
            userInfo.nickName=getQueryStringByName("userName");
            userInfo.userId=getQueryStringByName("userId");
            userInfo.matchId=getQueryStringByName("matchId");
            userInfo.matchMode=getQueryStringByName("matchType");
        }
        cc.log("userId:"+self.userId);
		cc.log("matchId:"+self.matchId);

		userInfo.nickName = decodeURI(userInfo.nickName);

		if(gShareManager==null)
		{
			gShareManager=new ShareManager();
		}
		
		//var self=this;
		//if(self.userId!= && self.matchId!="")
		if(self.matchId!=null)
		{
			cc.log("userId2:"+self.userId);
			cc.log("matchId2:"+self.matchId);
			var aUserId = self.userId;
			var aMatchId = self.matchId;
			gShareManager.ShareLogin(aUserId,aMatchId,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
		}
		else
		{
			gShareManager.ShareLogin(465,467,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});;
		}
		
		this.showProgress();
	},
	
	
	connectErrorCallBack:function()
	{
		var self=this;
		//setTimeout(function(){
		//	self.stopProgress();
		//	self.showMessageBox("服务器连接失败，请稍候再试！",function(){self.messageBoxClosed();});
		//	},2000);
        self.stopProgress();
        self.showErrorBox("服务器连接失败，请稍候再试！",function(){self.errorBoxClosed();});
	},
	messageBoxClosed:function()
	{
		cc.log("服务器连接失败确认按钮。。。");
		window.location.href="http://analyse.kiiik.com/";
	},
	// messageCallback:function(packet)
	// {
	// 	cc.log("login scene message callback packet.msgType="+packet.msgType);
	// 	var self=this;
	// 	if(packet.msgType=="1")
	// 	{
	// 		gPlayerName=packet.content;
	// 		//登录成功
	// 		cc.log(packet.content);
	// 		this.OnLogined(packet.content);
	// 	}
	// 	else if(packet.msgType=="H")
	// 	{
	// 		//分享成功
	// 		cc.log("获取分享数据成功");
	// 		// cc.log("获取分享数据成功"+packet.content);
	// 		this.stopProgress();
	// 		this.moveToNextScene(packet.content);
	// 		//cc.log(packet.content);
	// 		//gLoginManager.Login(this.username,this.password,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
	// 	}
	// 	else if(packet.msgType=="I")
	// 	{
	// 		//分享成功
	// 		cc.log("获取分享数据失败"+packet.content);
	// 		this.stopProgress();
	// 		//this.moveToNextScene();
	// 		//cc.log(packet.content);
	// 		//gLoginManager.Login(this.username,this.password,null,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
	// 	}
	// },
	messageCallback:function(message)
	{
		cc.log("Share scene message callback packet.msgType="+message.messageType);
		// cc.log("login scene message callback packet.content="+packet.content);
		var self=this;
		if(message.messageType==MessageType.Type_Share)
		{
			//成功
			cc.log("分享成功 callback packet.msgType="+message.messageType);




			if(gKlineScene==null)
				gKlineScene=new KLineScene();
			gKlineScene.onEnteredFunction=function(){
				gKlineScene.showProgress();
				cc.log("gKlineScene.onEnteredFunction=====");
				gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
				gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);
				gKlineScene.messageCallBack(message);
			};


			if(null==currentScene||currentScene!="gMainMenuScene"){
				cc.director.runScene(gKlineScene);
				currentScene = "gKlineScene";
			}

			// gPlayerName=packet.content;
			// //登录成功
			// this.OnLogined(packet.content);
		}else if(message.messageType==MessageType.Type_Warn){
			cc.log("share scene message callback warnInfo msgType="+message.messageType);
			self.showErrorBox("获取分享数据失败:"+message.warn.warnInfo,function(){self.errorBoxClosed();});
		}else{
			cc.log("share scene message callback other msgType="+message.messageType);
		}

	},

	
	moveToNextScene:function(content)
	{
		cc.log("成功，准备切换到下一个场景");
		this.stopProgress();
		
		var self=this;
		var userId = self.userId;
		var matchId = self.matchId;
		
		
		var klineSceneNext=new KLineScene();
		klineSceneNext.onEnteredFunction=function(){
			klineSceneNext.showProgress();
		};
		
		gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
		gSocketConn.ShareMessage(userId,matchId);
		//cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
		cc.director.runScene(klineSceneNext);
		cc.log("切换场景调用完毕");
		/*var self=this;
		var endTime=new Date().getTime();
		if(endTime-loadTime>5000)
		{
			this.moveToNextSceneCallBack();
		}
		else
		{
			setTimeout(function(){self.moveToNextSceneCallBack(),5000-(endTime-loadTime);});
		}*/
	}
});