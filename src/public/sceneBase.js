// JavaScript Document
SceneBase = cc.Scene.extend(
{
	lowerLayer:null,		//替代原来Scene的AddChild函数的Layer，所有调用该scene的addchild函数，都添加内容添加到该layer
	messageBoxLayer:null,
	errorLayer:null,
	
	otherMessageTipLayer:null,
	loginViewLayer:null,//登陆界面
	// emoticonViewLayer:null,//发送表情界面

	confirmBtn:null,
	messageBoxSprite:null,
	messageLabel:null,
	messageLabelShadow:null,

	errorLabel:null,
	errorLabelShadow:null,

	closeCallback:null,
	
	sceneEnterTime:null,	//进入这个Scene的时间
	
	isLowerLayerPaused:false,
	
	progressLayer:null,		//进度条
	isShowingProgress:false,
	
	ctor:function()
	{
		this._super();
	},
	
	
	onEnter:function () 
	{
		this._super();
		this.sceneEnterTime=new Date().getTime();
		cc.log("SceneBase onEnter begin");
		// if(userInfo.bgSoundFlag==true){
        //
		// 	var musicFile = "res/sound/home_bg.mp3";
		// 	cc.audioEngine.playMusic(musicFile,true);
		// 	// if(cc.audioEngine.isMusicPlaying()==false)
		// 	// {
		// 	//
		// 	// }
		// }
		var self=this;
		// var size = cc.director.getWinSize();
		var fXScale = gDesignResolutionWidth/1280;
		var fYScale = gDesignResolutionHeight/720;
        // // 2.获取窗口大小
		// var winSize = cc.director.getWinSize();
        //
		// // 3.窗口中心
		// var centerpos = cc.p(winSize.width / 2, winSize.height / 2);

		var contentSize = cc.size(300,100);


		this.messageBoxLayer=new cc.LayerColor(cc.color(0,0,0,127),gDesignResolutionWidth,gDesignResolutionHeight);

		if(this.lowerLayer==null){
			this.lowerLayer=new cc.Layer();
			this.addChildEx(this.lowerLayer, 1);
		}


		this.otherMessageTipLayer=new cc.Layer();
		
		this.messageBoxSprite=cc.Sprite.create("res/bg_message.png");
		// this.messageBoxSprite=cc.Sprite.create("res/messagebox.png");
		this.messageBoxSprite.setPosition(gDesignResolutionWidth / 2, gDesignResolutionHeight / 2);
		this.messageBoxSprite.setScale(fXScale,fYScale);
		this.messageBoxLayer.addChild(this.messageBoxSprite,2);
		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		// this.messageBoxLayer.addChild(mu, 2);
		var bgSize = this.messageBoxSprite.getContentSize();

		this.messageBoxSprite.addChild(mu,3);
		// closeBtn=new Button("res/close.png");
		var closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.closeMessageBox, this);
		closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
		mu.addChild(closeBtn);
		// closeBtn.setClickEvent(function(){
		// 	if(null!=self.messageBoxLayer&&self.messageBoxLayer.isVisible()==true){
		// 		self.closeMessageBox();
		// 	}
		// });
		this.loginBtn= new cc.MenuItemImage("res/btn_login.png", "res/btn_login.png", self.login, this);//new Button("res/btn_login.png");
		this.loginBtn.setPosition(cc.p(bgSize.width/2,150));
		mu.addChild(this.loginBtn);
		// loginBtn.setClickEvent(function(){
        //
		// 	if(null!=self.messageBoxLayer&&self.messageBoxLayer.isVisible()==true){
		// 		self.closeMessageBox();
		// 		self.login();
		// 	}
        //
		// });
		// this.messageBoxSprite.addChild(loginBtn,3);

		this.messageLabelShadow=new cc.LabelTTF("登录失败", "黑体", 20,contentSize);
		this.messageLabelShadow.setColor(cc.color(0, 0, 0,100));
		this.messageLabelShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;//设置文本位置
		this.messageLabelShadow.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
		this.messageLabelShadow.setPosition(gDesignResolutionWidth / 2+2,220-2);
		this.messageBoxLayer.addChild(this.messageLabelShadow,2);

		this.messageLabel=new cc.LabelTTF("登录失败", "黑体", 20,contentSize );
		this.messageLabel.setPosition(gDesignResolutionWidth / 2,220);
		this.messageLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//设置文本位置
		this.messageLabel.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
		this.messageBoxLayer.addChild(this.messageLabel,3);



		this.errorLayer=new cc.LayerColor(cc.color(0,0,0,127),gDesignResolutionWidth,gDesignResolutionHeight);
		var errorSprite=cc.Sprite.create("res/bg_message.png");
		// this.messageBoxSprite=cc.Sprite.create("res/messagebox.png");
		errorSprite.setPosition(gDesignResolutionWidth / 2, gDesignResolutionHeight / 2);
		errorSprite.setScale(fXScale,fYScale);
		this.errorLayer.addChild(errorSprite,2);
		// errorBtn=new Button("res/close.png");
		// errorBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
		// errorBtn.setClickEvent(function(){
		// 	self.closeErrorBox();
		// });
		var Errormu = new cc.Menu();
		Errormu.x = 0;
		Errormu.y = 0;
		// this.messageBoxLayer.addChild(mu, 2);
		var bgSize = this.messageBoxSprite.getContentSize();

		errorSprite.addChild(Errormu,3);
		// closeBtn=new Button("res/close.png");
		var closeErrorBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.closeErrorBox, this);
		closeErrorBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
		Errormu.addChild(closeErrorBtn);
		// closeErrorBtn=new Button("res/close.png");
		// closeErrorBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
		// closeErrorBtn.setClickEvent(function(){
		// 	if(null!=self.errorLayer&&self.errorLayer.isVisible()==true){
		// 		self.closeErrorBox();
		// 	}
		// });
		// errorSprite.addChild(closeErrorBtn,3);
		// this.confirmBtn=new Button("res/messageboxbutton.png");
		// this.confirmBtn.setPosition(bgSize.width/2,150);
		// this.confirmBtn.setClickEvent(function(){
		// 	if(null!=self.errorLayer&&self.errorLayer.isVisible()==true){
		// 		self.closeErrorBox();
		// 	}
		// });
		// errorSprite.addChild(this.confirmBtn,3);
		this.errorLabelShadow=new cc.LabelTTF("登录失败", "黑体", 30,cc.size(300,100));
		this.errorLabelShadow.setColor(cc.color(0, 0, 0,100));
		this.errorLabelShadow.setPosition(bgSize.width/2+2,bgSize.height/2-2);
		this.errorLabelShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
		this.errorLabelShadow.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
		errorSprite.addChild(this.errorLabelShadow,2);

		this.errorLabel=new cc.LabelTTF("登录失败", "黑体", 30,cc.size(300,100));
		this.errorLabel.setPosition(bgSize.width/2,bgSize.height/2);
		this.errorLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
		this.errorLabel.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
		errorSprite.addChild(this.errorLabel,3);



		this.progressLayer=new ProgressLayer(70,70);
		this.progressLayer.setPosition(gDesignResolutionWidth / 2-this.progressLayer.width/2, gDesignResolutionHeight / 2-this.progressLayer.height/2);
		this.progressLayer.setVisible(false);
		

		this.addChildEx(this.otherMessageTipLayer,5);
		this.addChildEx(this.messageBoxLayer, 10);
		this.addChildEx(this.errorLayer, 10);
		this.addChildEx(this.progressLayer, 9);



		this.messageBoxLayer.setVisible(false);
		this.errorLayer.setVisible(false);
		cc.log("SceneBase onEnter end");
	},
	onExit:function()
	{
		// if(cc.audioEngine.isMusicPlaying()==true)
		// {
		// 	cc.audioEngine.stopMusic();
		// }
		// this.cleanup()
		this._super();
		this.removeAllChildrenWithCleanup(true);
		// this.cleanup();
		cc.log("SceneBase onExit end");
	},

	showProgress:function()
	{
		if(this.isShowingProgress==false)
		{
			this.progressLayer.rotate();
			this.isShowingProgress=true;
			this.pauseLowerLayer();
		}
	},
	
	stopProgress:function()
	{
		if(this.isShowingProgress==true)
		{
			this.progressLayer.stop();
			this.isShowingProgress=false;
			this.resumeLowerLayer();
		}
	},
	
	closeMessageBox:function()
	{
		this.messageBoxLayer.setVisible(false);
		this.resumeLowerLayer();
		// if(this.closeCallback!=null)
		// {
		// 	this.closeCallback();
		// }
		cc.log("closeMessageBox sceneBase");
	},
	
	showMessageBox:function(msg,closeCallback)
	{
		this.closeCallback=closeCallback;
		this.messageLabel.setString(msg);
		this.messageLabelShadow.setString(msg);
		cc.log("userInfo.source=="+userInfo.source);
		if(null!=userInfo.source&&userInfo.source!="DHJK"&&null!=this.loginBtn){
			this.loginBtn.setNormalSpriteFrame("res/btn_download.png");
			this.loginBtn.setSelectedSpriteFrame("res/btn_download.png");
		}else {
			this.loginBtn.setNormalSpriteFrame("res/btn_login.png");
			this.loginBtn.setSelectedSpriteFrame("res/btn_login.png");
		}
		this.loginBtn.setVisible(userInfo.operationType==2);
		this.messageBoxLayer.setVisible(true);
		this.pauseLowerLayer();
		//alert(msg);
	},

	closeErrorBox:function()
	{
		this.errorLayer.setVisible(false);
		this.resumeLowerLayer();
		// if(this.closeCallback!=null)
		// {
		// 	this.closeCallback();
		// }
		// window.location.href="http://analyse.kiiik.com";
		cc.log("closeErrorBox sceneBase");
	},

	showErrorBox:function(msg,closeCallback)
	{
		this.closeCallback=closeCallback;
		this.errorLabel.setString(msg);
		this.errorLabelShadow.setString(msg);

		this.errorLayer.setVisible(true);
		this.pauseLowerLayer();
		//alert(msg);
	},

	pauseLowerLayer:function()
	{
		if(this.isLowerLayerPaused==false)
		{
			this.scheduler.pauseTarget(this.lowerLayer);
			this.actionManager && this.actionManager.pauseTarget(this.lowerLayer);
			cc.eventManager.pauseTarget(this.lowerLayer,true);
			this.isLowerLayerPaused=true;
		}
	},
	
	resumeLowerLayer:function()
	{
		if(this.isLowerLayerPaused==true)
		{
			this.scheduler.resumeTarget(this.lowerLayer);
			this.actionManager && this.actionManager.resumeTarget(this.lowerLayer);
			cc.eventManager.resumeTarget(this.lowerLayer,true);
			this.isLowerLayerPaused=false;
		}
	},
	
	getSceneElapsedMilliSeconds:function()
	{
		return new Date().getTime()-this.sceneEnterTime;
	},
	
	 addChildEx: function (child, localZOrder, tag) {
  	    localZOrder = localZOrder === undefined ? child._localZOrder : localZOrder;
        var name, setTag = false;
        if(cc.isUndefined(tag)){
            tag = undefined;
            name = child._name;
        } else if(cc.isString(tag)){
            name = tag;
            tag = undefined;
        } else if(cc.isNumber(tag)){
            setTag = true;
            name = "";
        }
        cc.assert(child, cc._LogInfos.Node_addChild_3);
        cc.assert(child._parent === null, "child already added. It can't be added again");
        this._addChildHelper(child, localZOrder, tag, name, setTag);
	 },
	
	 addChild: function (child, localZOrder, tag) {

		 if(this.lowerLayer==null){
			 this.lowerLayer=new cc.Layer();
			 this.addChildEx(this.lowerLayer, 1);
		 }

		 this.lowerLayer.addChild(child,localZOrder,tag);
    },
	
	removeChild: function (child, cleanup) {
        this.lowerLayer.removeChild(child, cleanup);
    },
	login:function() {

		this.closeMessageBox();
		cc.log("login sceneBase::sys.os=="+sys.os);

		var url = "http://m.cesfutures.com/kiiikweixin/apppro/phoned.jsp";
		window.open(url);
		// if(sys.os===sys.OS_WINDOWS||sys.os===sys.OS_OSX) {//浏览器模式
        //
		// }

		// if(sys.isMobile==false&&sys.isNative==false&&userInfo.operationType==2) {//浏览器模式
        //
		// 	if(null!=userInfo.source&&userInfo.source!="DHJK"&&null!=this.loginBtn){
		// 		this.showLoginView();
		// 	}
        //
		// 	// if(null!=userInfo.source&&userInfo.source!="DHJK"&&null!=this.loginBtn)
		// }
		// else{
		// 	var url = "http://m.cesfutures.com/kiiikweixin/apppro/phoned.jsp";
		// 	window.open(url);
		// 	// cc.view.enableRetina(true);
		// }

	},


	showLoginView:function()
	{
		cc.log("showLoginView begin");
		var self=this;
		if(this.loginViewLayer==null){
			this.loginViewLayer=new LoginViewLayer();
			this.loginViewLayer.setVisible(false);
			this.loginViewLayer.setPosition(0,0);
			this.otherMessageTipLayer.addChild(this.loginViewLayer, 1,this.loginViewLayer.getTag());
			this.loginViewLayer.closeCallBackFunction=function(){self.LoginViewLayer_Close()};
		}
		this.loginViewLayer.showLayer();
		this.pauseLowerLayer();
	},
	LoginViewLayer_Close:function () {
		//关闭登录界面
		this.loginViewLayer.hideLayer();
		this.resumeLowerLayer();
	}
});