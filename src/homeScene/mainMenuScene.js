//var gMainMenusSceneInst;
'use strict';
var MainMenuScene =SceneBase.extend(
{
	klineScene:null,

    userId:null,
    deviceId:null,
    source:null,

	backgroundSprite:null,
    touxiangSprite:null,
	//praticeButton:null,
	//configButton:null,
	
	userNameLabel:null,				//自己的名字
    selfNameLabel:null, //自己的名字
	selfScoreLabel:null,			//自己的分数
   // "winOfMatchForOne":0,"sumOfMatchForOne":2,"winOfMatchForMore":0,"sumOfMatchForMore":0,"gainCumulation":0.0,"sumOfAllMatch":2}

    winOfMatchForOne:null,
    sumOfMatchForOne:null,
    winOfMatchForMore:null,
    gainCumulation:null,
    sumOfAllMatch:null,
    renjizhanLabel:null,


	firstMode:null,
	secondMode:null,
	thirdMode:null,
	fourthMode:null,
    zhanjiInfoLayer:null,
    rankViewLayer:null,

    controlViewLayer:null,
    helpViewLayer:null,
    matchViewLayer:null,
    loadTime:null,
    onEnteredFunction:null,	//OnEnter调用结束后的Function


    _itemMenu:null,

    ctor: function ()
    {

        this._super();
        this.backgroundLayer=null;
        this.backgroundSprite=null;
        this.selfNameLabel=null;
        this.infoLabel=null;
        this.winOneLabel=null;
        this.sumOneLabel=null;
        this.winAILabel=null;
        this.sumAILabel=null;
        // this.winOneLabel=null;
        // this.sumOneLabel=null;
        // this.winOneLabel=null;
        // this.sumOneLabel=null;
        //this.winOfMatchForMore=null;
        //this.gainCumulation=null;
        //this.sumOfAllMatch=null;
        this.renjizhanLabel=null;

        this.firstMode=null;
        this.secondMode=null;


        this.zhanjiInfoLayer=null;
       // this.klineScene=null;
        this.onEnteredFunction=null;
    },
	onEnter:function () 
	{
        cc.log("MainMenuScene onEnter begin");
		this._super();
        gMainMenuScene=this;
		//gMainMenusSceneInst=this;

        cc.view.enableRetina(userInfo.viewFlag);
        if(userInfo.bgSoundFlag==true){
            openBgSound();
        }else{
            closeBgSound();
        }
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;
        var pButtonY = 520;
        var pButtonScale = cc.p(30*fXScale,55*fYScale);

		var self=this;

        if(this.backgroundSprite==null)
        {
            this.backgroundSprite=cc.Sprite.create("res/mainMenu_bg.png");
            this.addChild(this.backgroundSprite, 1);
        }
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);
		//先入队等待
		//"res/mainMenu_bg.png","res/btn_control.png","res/btn_zhanji.png","res/btn_paihang.png","res/btn_help.png"，"res/btn_model1_u.png","res/btn_model1_d.png"，"res/btn_model2_u.png","res/btn_model2_d.png"，"res/btn_model3_u.png","res/btn_model3_d.png"，"res/btn_model4_u.png","res/btn_model4_d.png"


        this.touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
        this.touxiangSprite.setPosition(cc.p(180,500));
        this.backgroundSprite.addChild(this.touxiangSprite,2);

        var fontSize = 22;
        this.selfNameLabel = cc.LabelTTF.create(userInfo.nickName, "Arial", fontSize,cc.size(25*6,200));
        // this.selfNameLabel.setScale(0.8);
        this.selfNameLabel.setAnchorPoint(0,1);
        // this.selfNameLabel.setPosition(cc.p(240*fXScale,520*fYScale));
        this.selfNameLabel.setPosition(cc.p(240,530));
        this.backgroundSprite.addChild(this.selfNameLabel,2);


        self.infoLabel=cc.LabelTTF.create("练习场:", "Arial",fontSize);
        // self.infoLabel.setScale(0.8);
        //this.zhanjiLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        self.infoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabel.setAnchorPoint(0,0.5);
        // self.infoLabel.setColor(cc.color(0,0,0,255));
        // self.infoLabel.setPosition(cc.p(450*fXScale,pButtonY*fYScale));
        self.infoLabel.setPosition(cc.p(450,pButtonY));
        this.backgroundSprite.addChild(self.infoLabel,5);

        self.winOneLabel= cc.LabelTTF.create("", "Arial",fontSize);
        self.winOneLabel.setAnchorPoint(0,0.5);
        self.winOneLabel.setColor(YellowColor);
        self.winOneLabel.setPosition(cc.pAdd(self.infoLabel.getPosition(),cc.p(self.infoLabel.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.winOneLabel,5);
        self.sumOneLabel= cc.LabelTTF.create("", "Arial",fontSize);
        self.sumOneLabel.setAnchorPoint(0,0.5);
        self.sumOneLabel.setColor(WhiteColor);
        self.sumOneLabel.setPosition(cc.pAdd(self.winOneLabel.getPosition(),cc.p(self.winOneLabel.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.sumOneLabel,5);

        self.infoLabelAI=cc.LabelTTF.create("人机战:", "Arial",fontSize);
        // self.infoLabelAI.setScale(0.8);
        //this.zhanjiLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        self.infoLabelAI.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabelAI.setAnchorPoint(0,0.5);
        // self.infoLabelAI.setPosition(cc.p(450*fXScale,(pButtonY-30)*fYScale));
        self.infoLabelAI.setPosition(cc.p(450,(pButtonY-30)));
        this.backgroundSprite.addChild(self.infoLabelAI,5);

        self.winAILabel= cc.LabelTTF.create("", "Arial",fontSize);
        self.winAILabel.setAnchorPoint(0,0.5);
        self.winAILabel.setColor(YellowColor);
        self.winAILabel.setPosition(cc.pAdd(self.infoLabelAI.getPosition(),cc.p(self.infoLabelAI.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.winAILabel,5);
        self.sumAILabel= cc.LabelTTF.create("", "Arial",fontSize);
        self.sumAILabel.setAnchorPoint(0,0.5);
        self.sumAILabel.setColor(WhiteColor);
        self.sumAILabel.setPosition(cc.pAdd(self.winAILabel.getPosition(),cc.p(self.winAILabel.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.sumAILabel,5);


        self.infoLabelMore=cc.LabelTTF.create("多人战:", "Arial",fontSize);
        // self.infoLabelMore.setScale(0.8);
        //this.zhanjiLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        self.infoLabelMore.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabelMore.setAnchorPoint(0,0.5);
        // self.infoLabelMore.setPosition(cc.p(450*fXScale,(pButtonY-30)*fYScale));
        self.infoLabelMore.setPosition(cc.p(450,(pButtonY-60)));
        this.backgroundSprite.addChild(self.infoLabelMore,5);

        self.winMoreLabel= cc.LabelTTF.create("", "Arial",fontSize);
        self.winMoreLabel.setAnchorPoint(0,0.5);
        self.winMoreLabel.setColor(YellowColor);
        self.winMoreLabel.setPosition(cc.pAdd(self.infoLabelMore.getPosition(),cc.p(self.infoLabelMore.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.winMoreLabel,5);
        self.sumMoreLabel= cc.LabelTTF.create("", "Arial",fontSize);
        self.sumMoreLabel.setAnchorPoint(0,0.5);
        self.sumMoreLabel.setColor(WhiteColor);
        self.sumMoreLabel.setPosition(cc.pAdd(self.winMoreLabel.getPosition(),cc.p(self.winMoreLabel.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.sumMoreLabel,5);

        self.infoLabel.setVisible(userInfo.operationType==1);
        self.infoLabelAI.setVisible(userInfo.operationType==1);
        self.infoLabelMore.setVisible(userInfo.operationType==1);
        self.winAILabel.setVisible(userInfo.operationType==1);
        self.winMoreLabel.setVisible(userInfo.operationType==1);
        self.winOneLabel.setVisible(userInfo.operationType==1);
        self.sumOneLabel.setVisible(userInfo.operationType==1);
        self.sumAILabel.setVisible(userInfo.operationType==1);
        self.sumMoreLabel.setVisible(userInfo.operationType==1);

        this.setButtonInfo();
        userInfo.matchBeginFlag=false;
        if(this.onEnteredFunction!=null)
        {
            this.onEnteredFunction();
        }


        this.openSceneType();
        var loadTime=new Date().getTime();
        cc.log("MainMenuScene onEnter end");
	},

    onExit:function()
    {
        this._super();
        cc.eventManager.removeAllListeners();
        if(gSocketConn!=null)
            gSocketConn.UnRegisterEvent("onmessage",this.messageCallBack);
        this.removeAllChildrenWithCleanup(true);
        gMainMenuScene=false;
        //全部清除方法
        for(var each in pageTimer){
            clearTimeout(pageTimer[each]);
        }
        cc.log("MainMenuScene onExit end");
    },

    openSceneType:function () {
        if(currentScene!=null){
            cc.log("openSceneType currentScene=="+currentScene);
            switch(currentScene){
                case "MAINSCENE_THIEDMODE":{
                    this.thirdModeChanged();
                    currentScene=null;
                    break;
                }
                default:{
                    cc.log("default currentScene=="+currentScene);
                    currentScene=null;
                    break;
                }
            }
        }
    },

    moveTofirstMode:function()
    {

        var self=gMainMenuScene;
        var endTime=new Date().getTime();
        if(endTime-loadTime>5000)
        {
            this.firstModeChanged();
        }
        else
        {
            setTimeout(function(){self.firstModeChanged,5000-(endTime-loadTime);});
        }
    },
    firstModeChanged:function()
    {

        cc.log("Waiting for firstModeChanged");
        // this.showProgress();
        var self =gMainMenuScene;
        // if(gKlineScene==null)
        // {
        //     gKlineScene=new KLineScene();
        // }

        userInfo.matchMode = 0;
        if(this.matchViewLayer==null){
            this.matchViewLayer=new MatchViewLayer();
            this.matchViewLayer.setVisible(false);
            this.matchViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.matchViewLayer, 1,this.matchViewLayer.getTag());
            this.matchViewLayer.closeCallBackFunction=function(){self.matchViewLayer_Close()};
            // this.controlViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
        }
        this.matchViewLayer.refreshMatchViewLayer();
        this.matchViewLayer.showLayer();
        this.pauseLowerLayer();
        // if(this.firstMode.isSelected==true)
        // {
        //     cc.log("Waiting for firstModeChanged");
        //     this.showProgress();
        //     var self =gMainMenuScene;
        //     // if(gKlineScene==null)
        //     // {
        //     //     gKlineScene=new KLineScene();
        //     // }
        //
        //     var klineSceneNext=new KLineScene();
        //     klineSceneNext.onEnteredFunction=function(){
        //
        //         // klineSceneNext.showProgress();
        //     };
        //     gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
        //
        //     userInfo.matchMode = 0;
        //    // gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);
        //     gSocketConn.BeginMatch(userInfo.matchMode);
        //     //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
        //     cc.director.runScene(klineSceneNext);
        //     cc.log("切换KGameScene场景调用完毕");
        // }
    },

	secondModeChanged:function()
	{

        cc.log("Waiting for secondModeChanged");
        var self =gMainMenuScene;
        userInfo.matchMode = 2;
        if(this.matchViewLayer==null){
            this.matchViewLayer=new MatchViewLayer();
            this.matchViewLayer.setVisible(false);
            this.matchViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.matchViewLayer, 1,this.matchViewLayer.getTag());
            this.matchViewLayer.closeCallBackFunction=function(){self.matchViewLayer_Close()};
            // this.controlViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
        }
        this.matchViewLayer.refreshMatchViewLayer();
        this.matchViewLayer.showLayer();
        this.pauseLowerLayer();
        // this.showProgress();
        // var self =gMainMenuScene;
        // // if(gKlineScene==null)
        // // {
        // //     gKlineScene=new KLineScene();
        // // }
        //
        // var klineSceneNext=new KLineScene();
        // klineSceneNext.onEnteredFunction=function(){
        //
        //
        //     // klineSceneNext.showProgress();
        // };
        // gSocketConn.BeginMatch(userInfo.matchMode+"#"+userInfo.matchAiMode+"#"+userInfo.matchDayCount);
        // //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
        // cc.director.runScene(klineSceneNext);
        // cc.log("切换KGameScene场景调用完毕");
        //
		// if(this.secondMode.isSelected==true)
		// {
		// }
	},
	
	thirdModeChanged:function()
	{
        cc.log("Waiting for thirdModeChanged");
        var self = this;
        userInfo.matchMode = 1;
        if(userInfo.operationType==2){
            gSocketConn.BeginMatch("1");
        }else{
            if(this.matchViewLayer==null){
                this.matchViewLayer=new MatchViewLayer();
                this.matchViewLayer.setVisible(false);
                this.matchViewLayer.setPosition(0,0);
                this.otherMessageTipLayer.addChild(this.matchViewLayer, 1,this.matchViewLayer.getTag());
                this.matchViewLayer.closeCallBackFunction=function(){self.matchViewLayer_Close()};
                // this.controlViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
            }
            this.matchViewLayer.refreshMatchViewLayer();
            this.matchViewLayer.showLayer();
            this.pauseLowerLayer();
        }
        cc.log("Waiting for thirdModeChanged");

        // if(this.thirdMode.isSelected==true)
		// {
		// }
	},
	
	fourthModeChanged:function()
	{
        cc.log("Waiting for fourthMode...");

	},

	zhanji:function()
	{
        cc.log("Waiting for zhanji.userInfo.operationType=="+userInfo.operationType);
        //var userId=GetQueryString("userId");
        //userInfo.userId

        this.showProgress();
        if(userInfo.recordMode!=null){
            gSocketConn.SendZhanjiMessage(userInfo.userId,0,userInfo.recordMode);
        }
        cc.log("zhanji...end");

        // if(sys.isMobile==false&&sys.isNative==false&&userInfo.operationType==2) {//浏览器模式
        //     this.showLoginView();
        //
        // }else{
        //     this.showProgress();
        //     if(userInfo.recordMode!=null){
        //         gSocketConn.SendZhanjiMessage(userInfo.userId,0,userInfo.recordMode);
        //     }
        //     cc.log("zhanji...end");
        // }
	},

    rank:function()
    {

        this.showProgress();
        if(userInfo.recordMode!=null)
        {
            gSocketConn.SendRankMessage(userInfo.recordMode,userInfo.userId);
        }
        cc.log("Rank...end");
    },

	config:function()
	{
        // var musicFile = "res/sound/home_bg.mp3";
        // cc.audioEngine.playMusic(musicFile,true);

        var self = this;
        if(this.controlViewLayer==null){
            this.controlViewLayer=new ControlViewLayer();
            this.controlViewLayer.setVisible(false);
            this.controlViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.controlViewLayer, 1,this.controlViewLayer.getTag());
            this.controlViewLayer.closeCallBackFunction=function(){self.controlViewLayer_Close()};
            // this.controlViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
        }
        // this.controlViewLayer.refreshControlViewLayer();

        this.controlViewLayer.showLayer();
        this.pauseLowerLayer();

	},
    controlViewLayer_Close:function()
    {
        //关闭kongzhi界面
        this.controlViewLayer.hideLayer();
        this.resumeLowerLayer();
    },

    help:function()
    {

        cc.log("MainScene help begin");
        var self = this;
        if(this.helpViewLayer==null){
            this.helpViewLayer=new HelpViewLayer();
            this.helpViewLayer.setVisible(false);
            this.helpViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.helpViewLayer, 1,this.helpViewLayer.getTag());
            this.helpViewLayer.closeCallBackFunction=function(){self.helpViewLayer_Close()};
            // this.helpViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
        }
        // this.helpViewLayer.refreshhelpViewLayer();

        this.helpViewLayer.showLayer();
        this.pauseLowerLayer();
        // cc.audioEngine.stopMusic();
    },

    helpViewLayer_Close:function()
    {
        //关闭help界面
        this.helpViewLayer.hideLayer();
        this.resumeLowerLayer();
    },


    setButtonInfo:function()
    {
        var self =this;

        var pButtonY = 520;
        var pButtonScale = cc.p(28,60);
        var fontSize = 25;

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu, 2);

        var bgSize = this.backgroundSprite.getContentSize();
        this.zhanjiButton = new cc.MenuItemImage("res/btn_zhanji.png", "res/btn_zhanji.png", self.zhanji, this);
        // this.zhanjiButton = new cc.MenuItemImage("res/btn_zhanji.png", "res/btn_zhanji.png", self.ShowemoticonView, this);
        mu.addChild(this.zhanjiButton);
        // this.zhanjiButton=new Button("res/btn_zhanji.png");
        // // this.zhanjiButton.setScale(fXScale,fYScale);
        // this.zhanjiButton.setPosition(cc.p(780,pButtonY));
        // this.zhanjiButton.setClickEvent(function(){
        //     cc.log("zhanjiButton ClickEvent");
        //     self.zhanji();
        // });
        this.zhanjiButton.setPosition(cc.p(780,pButtonY));
        this.zhanjiLabel=cc.LabelTTF.create("战绩", "fonts/Self.ttf",fontSize);
        //this.zhanjiLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        this.zhanjiLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.zhanjiLabel.setAnchorPoint(0,0.5);
        this.zhanjiLabel.setPosition(cc.pSub(cc.p(780,pButtonY),pButtonScale));
        this.backgroundSprite.addChild(this.zhanjiLabel,5);


        this.paimingButton = new cc.MenuItemImage("res/btn_paihang.png","res/btn_paihang.png",self.rank, this);
        mu.addChild(this.paimingButton);
        // this.paimingButton=new Button("res/btn_paihang.png");
        // // this.paimingButton.setScale(fXScale,fYScale);
        // this.paimingButton.setClickEvent(function(){
        //     self.rank();
        // });
        this.paimingButton.setPosition(cc.p(890,pButtonY));
        this.paimingLabel=cc.LabelTTF.create("排名", "fonts/Arial.ttf", fontSize);
        //this.paimingLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        this.paimingLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.paimingLabel.setAnchorPoint(0,0.5);
        this.paimingLabel.setPosition(cc.pSub(cc.p(890,pButtonY),pButtonScale));
        this.backgroundSprite.addChild(this.paimingLabel,5);

        this.helpButton =new cc.MenuItemImage("res/btn_help.png","res/btn_help.png",self.help,this);//("res/btn_help.png");
        mu.addChild(this.helpButton);
        // this.helpButton=new Button("res/btn_help.png");
        // this.helpButton.setScale(fXScale,fYScale);
        this.helpButton.setPosition(cc.p(1000,pButtonY));
        // this.helpButton.setClickEvent(function(){
        //     self.help();
        // });
        this.helpLabel=cc.LabelTTF.create("帮助", "fonts/Georgia.ttf", fontSize);
        //this.helpLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        this.helpLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.helpLabel.setAnchorPoint(0,0.5);
        this.helpLabel.setPosition(cc.pSub(cc.p(1000,pButtonY),pButtonScale));
        this.backgroundSprite.addChild(this.helpLabel,5);

        // this.configButton=new Button("res/btn_control.png");
        // // this.configButton.setScale(fXScale,fYScale);
        // this.configButton.setClickEvent(function(){
        //     self.config();
        // });
        this.configButton = new cc.MenuItemImage("res/btn_control.png","res/btn_control.png",self.config,this);
        this.configButton.setPosition(cc.p(1110,pButtonY));
        mu.addChild(this.configButton);
        this.configLabel=cc.LabelTTF.create("设置", "fonts/Arial.ttf", fontSize);
        //this.configLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        this.configLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.configLabel.setAnchorPoint(0,0.5);
        this.configLabel.setPosition(cc.pSub(cc.p(1110,pButtonY),pButtonScale));
        this.backgroundSprite.addChild(this.configLabel,5);



        var pModeXdistance = 300;
        var pModeY = 220;

        // this.firstMode=new Button("res/btn_mode1_u.png");
        // this.firstMode.setPosition(cc.p((190),pModeY));
        // this.firstMode.setClickEvent(function(){
        //     self.firstModeChanged();
        // });
        //
        // // this.secondMode=new CheckButton("res/btn_mode2_u.png","res/btn_mode2_u.png");
        // this.secondMode=new Button("res/btn_mode2_u.png");
        // this.secondMode.setPosition(cc.p((190+pModeXdistance),pModeY));
        // this.secondMode.setClickEvent(function(){
        //     self.secondModeChanged();
        // });

        // this.thirdMode=new CheckButton("res/btn_mode3_u.png","res/btn_mode3_u.png");
        // this.thirdMode=new Button("res/btn_mode3_u.png");
        // this.thirdMode.setPosition(cc.p((190+2*pModeXdistance),pModeY));
        // this.thirdMode.setClickEvent(function(){
        //     self.thirdModeChanged();
        // });


        this.firstMode = new cc.MenuItemImage("res/btn_mode1_u.png", "res/btn_mode1_d.png", self.firstModeChanged, this);
        mu.addChild(this.firstMode);
        this.firstMode.setPosition(cc.p((190),pModeY));

        this.secondMode = new cc.MenuItemImage("res/btn_mode2_u.png", "res/btn_mode2_d.png", self.secondModeChanged, this);
        mu.addChild(this.secondMode);
        this.secondMode.setPosition(cc.p((190+pModeXdistance),pModeY));


        this.thirdMode = new cc.MenuItemImage("res/btn_mode3_u.png", "res/btn_mode3_d.png", self.thirdModeChanged, this);
        mu.addChild(this.thirdMode);
        this.thirdMode.setPosition(cc.p((190+2*pModeXdistance),pModeY));

        // this.fourthMode=new CheckButton("res/btn_mode4_d.png","res/btn_mode4_u.png");
        // this.fourthMode.setScale(fXScale,fYScale);
        this.fourthMode = new cc.MenuItemImage("res/btn_mode4_d.png", "res/btn_mode4_d.png", self.fourthModeChanged, this);
        mu.addChild(this.fourthMode);
        this.fourthMode.setPosition(cc.p((190+3*pModeXdistance),pModeY));
        this.fourthMode.setEnabled(false);
        // this.fourthMode.setDisabledImage( "res/btn_mode4_d.png");
        // this.fourthMode.setClickEvent(function(){
        //     self.fourthModeChanged();
        // });
        // this.fourthMode.setDisabled(true);
        // this.fourthMode.setTextureByStatus(true);


        this.btnHome=new cc.MenuItemImage("res/home.png", "res/home.png", self.toHome, this);//new Button("res/home.png");
        this.btnHome.setPosition(cc.p(35,bgSize.height-35));
        this.btnHome.setScale(0.9);
        mu.addChild(this.btnHome);
        // this.btnHome.setScale(fXScale*0.8,fYScale*0.8);
        //this.btnHome.setScale(0.8);
        // this.btnHome.setClickEvent(function(){self.toHome();});
        // this.addChild(this.btnHome,123);

        // this.backgroundSprite.addChild(this.zhanjiButton, 2);
        // this.backgroundSprite.addChild(this.configButton, 2);
        // this.backgroundSprite.addChild(this.paimingButton, 2);
        // this.backgroundSprite.addChild(this.helpButton, 2);
        // this.backgroundSprite.addChild(this.firstMode, 2);
        // this.backgroundSprite.addChild(this.secondMode, 2);
        // this.backgroundSprite.addChild(this.thirdMode, 2);
        // this.backgroundSprite.addChild(this.fourthMode, 2);
        // this.paimingButton.setDisabled(true);
        // this.helpButton.setDisabled(true);
        // this.configButton.setDisabled(true);
    },
    setDataforInfo:function()
    {

        var self =this;
        if(userInfo.headSprite!=null)
        {

            cc.log(userInfo.headSprite);
            //
            // var webView = new ccui.WebView();
            // webView.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2 -20));
            // webView.setContentSize(cc.size(this.getContentSize().width -150, this.getContentSize().height- 150));
            // cc.log("this.getContentSize().width/2" + this.getContentSize().width/2);
            // cc.log("this.getContentSize().height/2" + this.getContentSize().height/2);
            // webView.loadURL(userInfo.headSprite);
            // webView.setScalesPageToFit(false);
            // this.addChild(webView);
            // var self = this;
            // var url = userInfo.headSprite;
            var url = userInfo.headSprite;
            cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                if(err){
                    cc.log(err);
                    cc.log("fail loadImg="+userInfo.headSprite); // self.addChild(logo);
                }
                if(img)
                {
                    cc.log("img!=null"+img);
                    var headSprite = new cc.Sprite();
                    //     this.touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
                    // cc.textureCache.addImage(imgUrl);
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    headSprite.initWithTexture(texture2d);

                    // this.touxiangSprite.setScale(fXScale,fYScale);

                    var size = headSprite.getContentSize();
                    headSprite.setScale(110/size.width,110/size.height);
                    headSprite.setPosition(cc.p(180,500));
                    self.backgroundSprite.addChild(headSprite,2);

                    cc.log("success loadImg="+userInfo.headSprite); // self.addChild(logo);
                    // self.touxiangSprite.setValue(false);
                }
            });
          }

        if(userInfo.nickName!=null&&self.selfNameLabel!=null)
        {
            self.selfNameLabel.setString(userInfo.nickName);
        }
        if(userInfo.winOfMatchForOne!=null&&self.winOneLabel!=null)
        {
            cc.log("setDataforInfoW="+userInfo.winOfMatchForOne);
            self.winOneLabel.setPosition(cc.pAdd(self.infoLabel.getPosition(),cc.p(self.infoLabel.getContentSize().width,0)));
            self.winOneLabel.setString(userInfo.winOfMatchForOne);

            cc.log("setDataforInfoS="+ userInfo.sumOfMatchForOne);
            self.sumOneLabel.setString("/"+userInfo.sumOfMatchForOne);
            self.sumOneLabel.setPosition(cc.pAdd(self.winOneLabel.getPosition(),cc.p(self.winOneLabel.getContentSize().width,0)));
        }
        if(userInfo.winOfMatchForAI!=null&&self.winAILabel!=null)
        {
            cc.log("setDataforInfoW="+userInfo.winOfMatchForAI);
            self.winAILabel.setPosition(cc.pAdd(self.infoLabelAI.getPosition(),cc.p(self.infoLabelAI.getContentSize().width,0)));
            self.winAILabel.setString(userInfo.winOfMatchForAI);

            cc.log("setDataforInfoS="+ userInfo.sumOfMatchForAI);
            self.sumAILabel.setString("/"+userInfo.sumOfMatchForAI);
            self.sumAILabel.setPosition(cc.pAdd(self.winAILabel.getPosition(),cc.p(self.winAILabel.getContentSize().width,0)));
        }
        if(userInfo.winOfMatchForMore!=null&&self.winMoreLabel!=null)
        {
            cc.log("setDataforInfoW="+userInfo.winOfMatchForMore);
            self.winMoreLabel.setPosition(cc.pAdd(self.infoLabelMore.getPosition(),cc.p(self.infoLabelMore.getContentSize().width,0)));
            self.winMoreLabel.setString(userInfo.winOfMatchForMore);

            cc.log("setDataforInfoS="+ userInfo.sumOfMatchForMore);
            self.sumMoreLabel.setString("/"+userInfo.sumOfMatchForMore);
            self.sumMoreLabel.setPosition(cc.pAdd(self.winMoreLabel.getPosition(),cc.p(self.winMoreLabel.getContentSize().width,0)));
        }
    },
    setMainMenuScenedata:function(jsonText)
    {
        var data=JSON.parse(jsonText);
        cc.log("setMainMenuScenedata jsonText parse over");
        // "winOfMatchForOne":0,"sumOfMatchForOne":3,"winOfMatchForMore":0,"sumOfMatchForMore":0,"winOfMatchForAI":8,"sumOfMatchForAI":11,"gainCumulation":"-6.223","sumOfAllMatch":3}

        userInfo.userId = data["uid"];
        userInfo.nickName=data["nickName"];
        userInfo.headSprite=data["headPicture"];
        userInfo.winOfMatchForOne=data["winOfMatchForOne"];
        userInfo.sumOfMatchForOne=data["sumOfMatchForOne"];
        userInfo.winOfMatchForMore=data["winOfMatchForMore"];
        userInfo.sumOfMatchForMore=data["sumOfMatchForMore"];
        userInfo.winOfMatchForAI=data["winOfMatchForAI"];
        userInfo.sumOfMatchForAI=data["sumOfMatchForAI"];
        userInfo.gainCumulation=data["gainCumulation"];
        userInfo.sumOfAllMatch=data["sumOfAllMatch"];

        if(this.backgroundSprite==null)
        {
            this.backgroundSprite=cc.Sprite.create("res/mainMenu_bg.png");
            this.addChild(this.backgroundSprite, 1);
        }
        this.setDataforInfo();
        //this.onShareklinedata(data);
    },
	messageCallBack:function(message)
	{
		var self=gMainMenuScene;
		var packet=Packet.prototype.Parse(message);
        cc.log("messageCallBack mainScene message callback message");
		if(packet==null) return;
        switch(packet.msgType)
        {
            case "1"://切换登录
            {
                cc.log("gMainMenuScene packet.msgType ="+packet.msgType);
                if(self.loginViewLayer!=null){
                    self.LoginViewLayer_Close();
                }

                // userId:null,//
                // 	deviceId:null,//设备号
                // userInfo.username=gPlayerName;
                // userInfo.password=packet.content.split("#")[1];
                //更新用户信息
                userInfo.userId=packet.content.split("#")[0];
                userInfo.source=packet.content.split("#")[1];
                userInfo.operationType=1;//登录方式记录为
                // self.setMainMenuScenedata(packet.content);
                // cc.log("get MainMenuScene passed");
                // self.stopProgress();

                break;
            }
            case "P"://接收到了大厅数据的消息
            {
                cc.log("call get MainMenuScene data");
                if(gMainMenuScene==false){
                    gMainMenuScene==new MainMenuScene();
                }
                self.setMainMenuScenedata(packet.content);
                cc.log("get MainMenuScene passed");
                self.stopProgress();
                break;
            }

            case "Z"://接收到战绩的数据
            {
                self.showZhanjiInfo(packet.content);
                self.stopProgress();
                break;
            }

            case "M"://人机对战结束信息
            {
                //收到对方买入的信息
                // if(gKlineScene==null)
                //     gKlineScene=new KLineScene();
                // if(gKlineScene!=null) {
                //     gKlineScene.showMatchEndInfo(packet.content);
                // }
                // self.stopProgress();
                break;
            }
            case "Matching"://人人人对战信息Matching|"playerList":["http://7xpfdl.com1.z0.glb.clouddn.com/M1 E__1480588002710__166279_3596","http://ohfw64y24.bkt.clouddn.com/54"]|###
            {
                cc.log("gMainMenuScene 人人机对战信息");
                if(self.matchViewLayer!=null) {

                    cc.log("gMainMenuScene 人人机对战信息2");
                    userInfo.matchBeginFlag=true;
                    self.matchViewLayer.stopHeadChange();
                    self.matchViewLayer.refreshMatchViewByData(packet.content);
                }
                // self.stopProgress();
                break;
            }
            // case "":
            // {
            //     cc.log("gMainMenuScene packet.msgType =''");
            //     break;
            // }
            // case "":
            // {
            //     cc.log("gMainMenuScene packet.msgType =''");
            //     break;
            // }
            case "8":
            {
                //收到对方买入的信息
                if(gKlineScene==null)
                    gKlineScene=new KLineScene();
                if(gKlineScene!=null) {
                    var buyOperationIndex=parseInt(packet.content.split("#")[1]);
                    gKlineScene.opponentOperations.push(buyOperationIndex);
                    gKlineScene.refreshScores();
                }
                //alert("8="+packet.content);


            }

            case "9":
            {
                //收到对方卖出的信息
                //alert("9="+packet.content);
                if(gKlineScene==null)
                    gKlineScene=new KLineScene();
                if(gKlineScene!=null) {
                    var sellOperationIndex=parseInt(packet.content.split("#")[1]);
                    gKlineScene.opponentOperations.push(-sellOperationIndex);
                    gKlineScene.refreshScores();
                }
                break;
            }

            case "4":
            {
                //
                //cc.director.runScene(cc.TransitionSlideInL.create(0.5,klineScene));
                self.opponentsInfo.push(packet.content);
                self.stopProgress();
                break;
            }
            case "5"://K线数据
            {
                if(gKlineScene==null){
                    gKlineScene=new KLineScene();
                }

                gSocketConn.UnRegisterEvent("onmessage",gMainMenuScene.messageCallBack);
                gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);
                if(gKlineScene!=null)
                {
                    cc.log("call get kline data");
                    if(userInfo.matchMode==1&&userInfo.matchBeginFlag==true){
                        cc.log("get kline userInfo.matchMode==1 passed");
                        pageTimer["runScene"] = setTimeout(function(){cc.director.runScene(gKlineScene);},1000);
                    }
                    if(userInfo.matchMode!=1){
                        cc.log("get kline userInfo.matchMode!=1 passed");
                        cc.director.runScene(gKlineScene);
                    }
                    cc.log("get kline passed");
                }
                gKlineScene.getklinedata(packet.content);
                gKlineScene.setDataForLlineLayer();
                self.stopProgress();
                break;
            }
            case "S":
            {
                if(gKlineScene==null)
                    gKlineScene=new KLineScene();
                //接收到了K线数据的分享消息
                gKlineScene.share(packet.content);
                cc.log("get kline K线数据的分享消息passed"+packet.content);
                break;
            }
            case "H":
            {
                //成功接收到了K线数据的分享数据
                if(gKlineScene==null)
                    gKlineScene=new KLineScene();
                //接收到了分享的K线数据的消息
                // gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
                if(gKlineScene!=null)
                {
                    cc.log("call get kline data");
                    gKlineScene.getShareKlinedata(packet.content);
                    cc.log("get kline passed");
                }
                self.stopProgress();
                cc.log("成功接收到了K线数据的分享数据");
                break;
            }
            case "O"://观看记录
            {

                if(gKlineScene==null)
                    gKlineScene=new KLineScene();
                //接收到了分享的K线数据的消息
                // gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
                if(gKlineScene!=null)
                {
                    cc.log("begin to parse 观看记录json text");
                    var data=JSON.parse(packet.content);
                    cc.log("jsonText parse 观看记录over");
                    gKlineScene.toSetklinedata(data);

                    if(gKlineScene.klineLayerMain!=null && gKlineScene.klineLayerPrev!=null)
                    {
                        gKlineScene.advanceToMainKLine_Record();
                    }
                    cc.director.runScene(gKlineScene);

                }
                self.stopProgress();
                break;
            }
            // case "F":
            // {
            //     //接收到对局结束
            //     //接收到对局结束
            //     //alert("接收到对局结束");
            //     if(gKlineScene==null)
            //         gKlineScene=new KLineScene();
            //     gKlineScene.showMatchEndInfo(packet.content);
            //     break;
            // }
            case "G":
            {
                if(gKlineScene==null)
                    gKlineScene=new KLineScene();
                gKlineScene.showPlayerInfo(packet.content);
                break;
            }
            case "RANK"://排名信息
            {
                // cc.log("messageCallBack.mainScene..packet.msgType="+packet.msgType);
                self.showRankViewInfo(packet.content);
                self.stopProgress();
                break;
            }

            case "2":
            {
                //登录失败
                self.stopProgress();
                self.showErrorBox(packet.content,function(){self.errorBoxClosed();});
                break;
            }

            case "D":
            {
                //其他地方登陆
                self.stopProgress();
                self.showErrorBox(packet.content,function(){self.errorBoxClosed();});
                break;
            }

            case "ERROR":
            {
                //登录失败
                self.stopProgress();
                self.showMessageBox(packet.content,function(){self.messageBoxClosed();});
                break;
            }
            case "UNMATCH":
            {
                if(packet.content=="SUCCESS"){
                    userInfo.matchBeginFlag=false;
                    cc.log("messageCallBack.mainScen.packet.msgType="+packet.msgType+"=== UNMATCH SUCCESSpacket.content=="+ packet.content);
                }else {
                    cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=== packet.content=="+ packet.content);
                }

                break;
            }

            case "SENDCODE"://获取验证码test
            {
                cc.log("messageCallBack.mainScenepacket.msgType="+packet.msgType+"packet.content=="+ packet.content);
                break;
            }


            case "LOGIN"://获取验证码test
            {
                cc.log("messageCallBack.mainScenepacket.msgType="+packet.msgType+"packet.content=="+ packet.content);
                // gSocketConn.toLogin(packet.content);
                // self.login();toLogin
                self.stopProgress();
                gSocketConn.SendToHMessage(packet.content);
                break;
            }

            default:
            {
                cc.log("messageCallBack.mainScene.default.packet.msgType="+packet.msgType+"=====");
                break;
            }
        }

	},

    showZhanjiInfo:function(content)
    {
        cc.log("showZhanjiInfo  visible = true");
        // cc.log(content);
        var self=this;
        // ###Z|{"uid":"3434343770","totalCount":189,"winRate":"52.91","AvgGain":"0.70","historyMatchList":[{"matchId":7661,"uid":3434343770,"nickName":"誓约者艾琳诺","score":"0.00","matchTime":"11-16 16:36","playerNum":1,"matchType":2,"playerList":[{"userName":"誓约者艾琳诺","score":"0.00","ranking":1},{"userName":"唐奇安通道","score":"-1.22","ranking":2}]},{"matchId":7643,"uid":3434343770,"nickName":"誓约者艾琳诺","score":"21.14","matchTime":"11-16 12:59","playerNum":1,"matchType":2,
        var data=JSON.parse(content);
        userInfo.userId = data["uid"];
        userInfo.totalCount=data["totalCount"];
        userInfo.winRate=data["winRate"];
        userInfo.AvgGain=data["AvgGain"];
        var historyMatchListData=data["historyMatchList"];
        cc.log("historyMatchListData="+historyMatchListData);
        userInfo.MatchListData=[];
        for(var i=0;i<historyMatchListData.length;i++)
        {
            var matchData=historyMatchListData[i];
            cc.log("MatchListData.matchId="+matchData["matchId"]);
            userInfo.MatchListData.push(matchData);
        }


        if(this.zhanjiInfoLayer==null){
            this.zhanjiInfoLayer=new ZhanjiViewLayer();
            this.zhanjiInfoLayer.setVisible(false);
            this.zhanjiInfoLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.zhanjiInfoLayer, 1,this.zhanjiInfoLayer.getTag());
            this.zhanjiInfoLayer.closeCallBackFunction=function(){self.zhanjiInfoLayer_Close()};
            // this.zhanjiInfoLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
        }
        this.zhanjiInfoLayer.refreshZhanjiViewLayer();

        this.zhanjiInfoLayer.showLayer();
        this.pauseLowerLayer();

    },
    zhanjiInfoLayer_Close:function()
    {
        //关闭战绩界面
        this.zhanjiInfoLayer.hideLayer();
        this.resumeLowerLayer();
    },

    showRankViewInfo:function(content)
    {
        cc.log("showRankViewInfo  visible = true");
        var self=this;

        var data=JSON.parse(content);
        userInfo.myRanking = data["myRanking"];
        var rankListData=data["rankList"];
        // cc.log("rankListData="+rankListData);
        userInfo.rankList=[];
        for(var i=0;i<rankListData.length;i++)
        {
            var rankData=rankListData[i];
            cc.log("rankListData.rank="+rankData["rank"]);
            userInfo.rankList.push(rankData);
        }

        if(this.rankViewLayer==null){
            this.rankViewLayer=new RankViewLayer();
            this.rankViewLayer.setVisible(false);
            this.rankViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.rankViewLayer, 1,this.rankViewLayer.getTag());
            //this.zhanjiInfoLayer.applyParamsFromContent(content);
            //content的内容为:   总用户个数(假设为2)#用户名A#收益率A#得分A#用户名B#收益率B#得分B#品种名字#起始日期#终止日期
            this.rankViewLayer.closeCallBackFunction=function(){self.rankViewLayer_Close()};
        }
        pageTimer["rank"] = setTimeout(function(){self.rankrefreshRViewLayer();},100);
    },
    rankrefreshRViewLayer:function()
    {
        //刷新显示排名界面
        this.rankViewLayer.refreshRankViewLayer();
        this.rankViewLayer.showLayer();
        this.pauseLowerLayer();
    },

    rankViewLayer_Close:function()
    {
        //关闭战绩界面
        this.rankViewLayer.hideLayer();
        this.resumeLowerLayer();
    },

    matchViewLayer_Close:function()
    {
        //关闭matchViewL界面
        if(this.matchViewLayer!=null){
            this.matchViewLayer.hideLayer();
            this.resumeLowerLayer();
        }
    },
    toHome:function()
    {
        //window.close();
        window.location.href="http://analyse.kiiik.com";
    },
    messageBoxClosed:function()
    {
        this.messageBoxLayer.setVisible(false);
        this.resumeLowerLayer();
        // window.location.href="http://analyse.kiiik.com/";
    },
    errorBoxClosed:function()
    {
        this.errorLayer.setVisible(false);
        this.resumeLowerLayer();
        // window.location.href="http://analyse.kiiik.com/";
    },
	//moveToNextScene:function()
	//{
	//	cc.director.runScene(this.klineScene);
	//	cc.log("run scene called");
	//}

});