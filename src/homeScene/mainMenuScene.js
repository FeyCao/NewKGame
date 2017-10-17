//var gMainMenusSceneInst;
'use strict';
var MainMenuScene =SceneBase.extend(
{
    _className: "MainMenuScene",
	klineScene:null,

    userId:null,
    deviceId:null,
    source:null,

	backgroundSprite:null,
    headSprite:null,
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
    friendLayer:null,

    controlViewLayer:null,
    invitedViewLayer:null,
    addFriendViewLayer:null,
    helpViewLayer:null,
    matchViewLayer:null,
    preMatchView:null,
    loadTime:null,
    onEnteredFunction:null,	//OnEnter调用结束后的Function


    playerNumLabel:null,
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

        this.friendLayer=null;
        this.zhanjiInfoLayer=null;
       // this.klineScene=null;
        this.playerNumLabel=null;

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
        var pButtonY = 545;//var pButtonY = 550;
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


        // this.headSpritebg = new cc.Sprite(res.BG_HEAD_PNG);
        this.headSpritebg =new cc.Sprite(res.BG_FRIEND_HEAD_VS_png);
        this.headSpritebg.setPosition(cc.p(180,500));

        var size =this.headSpritebg.getContentSize();
        this.headSpritebg.setScale(120/size.width);
        this.backgroundSprite.addChild(this.headSpritebg,3);

        if(this.headSprite ==null){
            this.headSprite = new cc.Sprite(res.HEAD_NO_PNG);
            this.headSprite.setPosition(cc.p(180,500));
            var sizeHead = this.headSprite.getContentSize();
            this.headSprite.setScale(90/sizeHead.width,90/sizeHead.height);
            this.backgroundSprite.addChild(this.headSprite,2);
        }


        var fontSize = 22;
        this.selfNameLabel = cc.LabelTTF.create(userInfo.nickName, "Arial", fontSize,cc.size(25*6,200));
        // this.selfNameLabel.setScale(0.8);
        this.selfNameLabel.setAnchorPoint(0,1);
        // this.selfNameLabel.setPosition(cc.p(240*fXScale,520*fYScale));
        this.selfNameLabel.setPosition(cc.p(240,530));
        this.backgroundSprite.addChild(this.selfNameLabel,2);
        // this.playerNumLabel = new cc.LabelTTF("", "Arial", fontSize);
        // // this.selfNameLabel.setScale(0.8);
        // this.playerNumLabel.setPosition(cc.p(gDesignResolutionWidth-50,gDesignResolutionHeight-20));
        // this.backgroundSprite.addChild( this.playerNumLabel,10);
        if(self.playerNumLabel==null){
            self.playerNumLabel = new cc.LabelTTF("",res.FONT_TYPE,fontSize);
            self.playerNumLabel.setPosition(self.backgroundSprite.getContentSize().width-100,self.backgroundSprite.getContentSize().height-20);
            self.backgroundSprite.addChild(self.playerNumLabel,10);
        }



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

        self.infoLabelFriend=new cc.LabelTTF("好友战:", res.FONT_TYPE,fontSize);
        self.infoLabelFriend.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabelFriend.setAnchorPoint(0,0.5);
        self.infoLabelFriend.setPosition(cc.p(450,pButtonY-90));
        this.backgroundSprite.addChild(self.infoLabelFriend,5);

        self.winFriendLabel= new cc.LabelTTF("", res.FONT_TYPE,fontSize);
        self.winFriendLabel.setAnchorPoint(0,0.5);
        self.winFriendLabel.setColor(YellowColor);
        self.winFriendLabel.setPosition(cc.pAdd(self.infoLabelFriend.getPosition(),cc.p(self.infoLabelFriend.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.winFriendLabel,5);
        self.sumFriendLabel= new cc.LabelTTF("", res.FONT_TYPE,fontSize);
        self.sumFriendLabel.setAnchorPoint(0,0.5);
        self.sumFriendLabel.setColor(WhiteColor);
        self.sumFriendLabel.setPosition(cc.pAdd(self.winFriendLabel.getPosition(),cc.p(self.winFriendLabel.getContentSize().width,0)));
        this.backgroundSprite.addChild(self.sumFriendLabel,5);

        self.infoLabel.setVisible(userInfo.operationType==1);
        self.infoLabelAI.setVisible(userInfo.operationType==1);
        self.infoLabelMore.setVisible(userInfo.operationType==1);
        self.infoLabelFriend.setVisible(userInfo.operationType==1);
        self.winAILabel.setVisible(userInfo.operationType==1);
        self.winMoreLabel.setVisible(userInfo.operationType==1);
        self.winOneLabel.setVisible(userInfo.operationType==1);
        self.winFriendLabel.setVisible(userInfo.operationType==1);
        self.sumOneLabel.setVisible(userInfo.operationType==1);
        self.sumAILabel.setVisible(userInfo.operationType==1);
        self.sumMoreLabel.setVisible(userInfo.operationType==1);
        self.sumFriendLabel.setVisible(userInfo.operationType==1);

        this.setButtonInfo();
        userInfo.matchBeginFlag=false;
        if(this.onEnteredFunction!=null)
        {
            this.onEnteredFunction();
        }

        // gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
        // codeDataList.clearCodeData();
        this.openSceneType();
        this.setInfoBySource(userInfo.source);

        var loadTime=new Date().getTime();
        cc.log("MainMenuScene onEnter end");
	},
    setInfoBySource:function (source) {

        switch(source){
            case "ZKQQ":{
                this.fourthMode.setEnabled(false);
                this.thirdMode.setEnabled(false);
                this.paimingButton.setEnabled(false);
                this.zhanjiButton.setEnabled(false);
                // this.thirdMode.set;
                // this.paimingButton.setEnabled(false);
                // this.zhanjiButton.setEnabled(false);
            }
            case "QQ":{

                // if(sys.os===sys.OS_WINDOWS||sys.os===sys.OS_OSX) {//浏览器模式
                //
                // }

            }
            case "Wechat":{
                //
                gSocketConn.ansRoomFriend(true,userInfo.inviterUid,userInfo.inviterCode);//默认同意邀请
                userInfo.source = "ANSERED";
                userInfo.inviterUid=null;
                userInfo.inviterCode=null;
            }
            case 2:
            default:{
                cc.log("setInfoBySource source=="+source);
                break;
            }
        }
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
            self.firstModeChanged();
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

        userInfo.matchMode = MatchType.Type_Practice_Match;
        if(this.preMatchView==null){
            this.preMatchView=new preMatchView();
            this.preMatchView.setVisible(false);
            this.preMatchView.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.preMatchView, 1,this.preMatchView.getTag());
            this.preMatchView.closeCallBackFunction=function(){self.popViewLayer_Close()};
        }
        // this.matchViewLayer.refreshMatchViewLayer();
        this.preMatchView.showLayer();
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
        userInfo.matchMode = MatchType.Type_ArtificialMatch;
        if(this.matchViewLayer==null){
            this.matchViewLayer=new MatchViewLayer();
            this.matchViewLayer.setVisible(false);
            this.matchViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.matchViewLayer, 1,this.matchViewLayer.getTag());
            this.matchViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
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
        userInfo.matchMode = MatchType.Type_PlainMultiplayer_Match;
        if(userInfo.operationType==2){
            gSocketConn.BeginMatch(userInfo.matchMode);
        }else{
            if(this.matchViewLayer==null){
                this.matchViewLayer=new MatchViewLayer();
                this.matchViewLayer.setVisible(false);
                this.matchViewLayer.setPosition(0,0);
                this.otherMessageTipLayer.addChild(this.matchViewLayer, 1,this.matchViewLayer.getTag());
                this.matchViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
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

        cc.log("Waiting for thirdModeChanged");
        var self = this;
        userInfo.matchMode = MatchType.Type_Friend_Match;
        gSocketConn.BeginMatch(userInfo.matchMode);
        // if(userInfo.operationType==2){
        //     gSocketConn.BeginMatch(userInfo.matchMode);
        // }else{
        //     gSocketConn.BeginMatch(userInfo.matchMode);
        //     gSocketConn.getFriendList();
        //     if(this.friendLayer==null){
        //         this.friendLayer=new FriendViewLayer();
        //         this.friendLayer.setVisible(false);
        //         this.friendLayer.setAnchorPoint(0,0);
        //         this.friendLayer.setPosition(0,0);
        //         this.otherMessageTipLayer.addChild(this.friendLayer, 1,this.friendLayer.getTag());
        //         this.friendLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
        //     }
        //
        //     // LISTFRIEND||
        //     this.friendLayer.showLayer();
        //     this.pauseLowerLayer();
        // }
        cc.log("Waiting for thirdModeChanged");

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

        // if(sys.isMobile!=false&&sys.isNative==false&&userInfo.operationType==2) {//浏览器模式
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
        var self = this;

        // if(isWeiXin()==true){
        //     alert('是微信width=='+findDimensions().width+'||hegit=='+findDimensions().height);
        //
        //     // cc.view.resizeWithBrowserSize()
        // }else{
        //     alert('不是微信width=='+findDimensions().width+'||hegit=='+findDimensions().height);
        // }
        // if(findDimensions().width<findDimensions().height){
        //
        //     var c=document.getElementById("gameCanvas");
        //     var ctx=c.getContext("2d");
        //     ctx.save();
        //     ctx.rotate(Math.PI/2);
        //     // ctx.fillStyle="yellow";
        //     // 4 ctx.fillRect(25,25,250,100)
        //     ctx.restore();
        //     // cc.view.setFrameSize(findDimensions().height, findDimensions().width);
        //     // cc.view.setDesignResolutionSize(findDimensions().height, findDimensions().width, cc.ResolutionPolicy.SHOW_ALL);
        //     alert('切换width');
        // }
        // testScene();
       //登录接口测试
       //  if(sys.isMobile) {//浏览器模式
       //      testApp();
       //  }else{
       //
       //  }

        // var truthBeTold = window.confirm("服务断开请重新登录，单击“确定”继续。单击“取消”停止。");
        // if (truthBeTold) {
        //     window.location.reload();
        // } else {
        //     window.close();//self.toHome();
        // };


        // if(this.controlViewLayer==null){
        //     this.controlViewLayer=new ControlViewLayer();
        //     this.controlViewLayer.setVisible(false);
        //     this.controlViewLayer.setPosition(0,0);
        //     this.otherMessageTipLayer.addChild(this.controlViewLayer, 1,this.controlViewLayer.getTag());
        //     this.controlViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
        // }
        // // this.controlViewLayer.refreshControlViewLayer();
        //
        // this.controlViewLayer.showLayer();
        // this.pauseLowerLayer();
	},
    popViewLayer_Close:function()
    {
        //关闭应邀请求界面
        if(this.invitedViewLayer!=null){
            this.invitedViewLayer.hideLayer();
        }
        //关闭应邀请求界面
        if(this.addFriendViewLayer!=null){
            this.addFriendViewLayer.hideLayer();
            this.addFriendViewLayer =null;
        }
        //关闭控制界面
        if(this.controlViewLayer!=null){
            this.controlViewLayer.hideLayer();
        }
        //关闭战绩界面
        if(this.rankViewLayer!=null){
            this.rankViewLayer.hideLayer();
        }
        //关闭matchViewL界面
        if(this.matchViewLayer!=null){
            this.matchViewLayer.hideLayer();
        }
        //关闭好友界面
        if(this.friendLayer!=null){
            this.friendLayer.hideLayer();
        }
        //关闭help界面
        if(this.helpViewLayer!=null){
            this.helpViewLayer.hideLayer();
        }

        //关闭prematchViewL界面
        if(this.preMatchView!=null){
            this.preMatchView.hideLayer();
        }

        this.resumeLowerLayer();
    },
    openFriendLayer:function()
    {
        var self =this;
        this.popViewLayer_Close();//关闭所有弹出的界面
        if(true!=userInfo.inviteFlag){return;}
        if(self.friendLayer==null){
            self.friendLayer=new FriendViewLayer();
            self.friendLayer.setVisible(false);
            self.friendLayer.setAnchorPoint(0,0);
            self.friendLayer.setPosition(0,0);
            self.otherMessageTipLayer.addChild(self.friendLayer, 1,self.friendLayer.getTag());
            self.friendLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
        }
        // LISTFRIEND||
        self.friendLayer.showLayer();
        self.pauseLowerLayer();
        if(self.friendLayer!=null){
            self.friendLayer.refreshFriendViewLayer();
        }
    },
    // helpViewLayer_Close:function()
    // {
    //     //关闭help界面
    //     this.helpViewLayer.hideLayer();
    //     this.resumeLowerLayer();
    // },

    // controlViewLayer_Close:function()
    // {
    //     //关闭kongzhi界面
    //     this.controlViewLayer.hideLayer();
    //     this.resumeLowerLayer();
    // },
    // rankViewLayer_Close:function()
    // {
    //
    //     this.resumeLowerLayer();
    // },
    //
    // matchViewLayer_Close:function()
    // {
    //
    // },
    //
    // friendLayer_Close:function()
    // {
    //
    // },

    help:function()
    {

        cc.log("MainScene help begin");
        var self = this;
        if(this.helpViewLayer==null){
            this.helpViewLayer=new HelpViewLayer();
            this.helpViewLayer.setVisible(false);
            this.helpViewLayer.setPosition(0,0);
            this.otherMessageTipLayer.addChild(this.helpViewLayer, 1,this.helpViewLayer.getTag());
            this.helpViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
            // this.helpViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
        }
        // this.helpViewLayer.refreshhelpViewLayer();

        this.helpViewLayer.showLayer();
        this.pauseLowerLayer();
        // cc.audioEngine.stopMusic();
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
        this.zhanjiButton = new cc.MenuItemImage("res/btn_zhanji.png","", "res/btn_zhanji_disable.png", self.zhanji, this);
        // this.zhanjiButton = new cc.MenuItemImage("res/btn_zhanji.png", "res/btn_zhanji.png", self.ShowemoticonView, this);
        mu.addChild(this.zhanjiButton);

        this.zhanjiButton.setPosition(cc.p(780,pButtonY));
        this.zhanjiLabel=cc.LabelTTF.create("战绩", "fonts/Self.ttf",fontSize);
        //this.zhanjiLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        this.zhanjiLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.zhanjiLabel.setAnchorPoint(0,0.5);
        this.zhanjiLabel.setPosition(cc.pSub(cc.p(780,pButtonY),pButtonScale));
        this.backgroundSprite.addChild(this.zhanjiLabel,5);


        this.paimingButton = new cc.MenuItemImage("res/btn_paihang.png","","res/btn_paihang_disable.png",self.rank, this);
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


        this.thirdMode = new cc.MenuItemImage("res/btn_mode3_u.png", "","res/btn_mode3_d.png", self.thirdModeChanged, this);
        mu.addChild(this.thirdMode);
        this.thirdMode.setPosition(cc.p((190+2*pModeXdistance),pModeY));

        // this.fourthMode=new CheckButton("res/btn_mode4_d.png","res/btn_mode4_u.png");
        // this.fourthMode.setScale(fXScale,fYScale);
        this.fourthMode = new cc.MenuItemImage(res.BTN_MATCH_MODE4_U_png,"", res.BTN_MATCH_MODE4_D_png, self.fourthModeChanged, this);
        mu.addChild(this.fourthMode);
        this.fourthMode.setPosition(cc.p((190+3*pModeXdistance),pModeY));
        // this.fourthMode.setEnabled(false);
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

            var url = userInfo.headSprite;
            cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                if(err){
                    cc.log(err);
                    cc.log("fail loadImg="+userInfo.headSprite); // self.addChild(logo);
                }
                if(img)
                {
                    cc.log("img!=null"+img);
                    // var headSprite = new cc.Sprite();
                    //     this.touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
                    // cc.textureCache.addImage(imgUrl);
                    if(self.headSprite ==null){
                        self.headSprite = new cc.Sprite(res.HEAD_NO_PNG);
                        self.headSprite.setPosition(cc.p(180,500));
                        var sizeHead = self.headSprite.getContentSize();
                        self.headSprite.setScale(90/sizeHead.width,90/sizeHead.height);
                        self.backgroundSprite.addChild(self.headSprite,2);
                    }

                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    self.headSprite.initWithTexture(texture2d);

                    // this.touxiangSprite.setScale(fXScale,fYScale);

                    var size = self.headSprite.getContentSize();
                    self.headSprite.setScale(90/size.width,90/size.height);



                    cc.log("success loadImg="+userInfo.headSprite); // self.addChild(logo);
                    // self.touxiangSprite.setValue(false);
                }
            });
          }

        if(userInfo.nickName!=null&&self.selfNameLabel!=null)
        {
            // self.selfNameLabel.setString(userInfo.nickName);
            self.selfNameLabel.setString(cutstr(userInfo.nickName,37));
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
        if(userInfo.winMatchFriend!=null&&self.winFriendLabel!=null)
        {
            cc.log("setDataforInfoF="+userInfo.winMatchFriend);
            self.winFriendLabel.setPosition(cc.pAdd(self.infoLabelFriend.getPosition(),cc.p(self.infoLabelFriend.getContentSize().width,0)));
            self.winFriendLabel.setString(userInfo.winMatchFriend);

            self.sumFriendLabel.setString("/"+userInfo.sumMatchFriend);
            self.sumFriendLabel.setPosition(cc.pAdd(self.winFriendLabel.getPosition(),cc.p(self.winFriendLabel.getContentSize().width,0)));
        }

        if(self.playerNumLabel!=null&&userInfo.onlineNum!=null){
           self.playerNumLabel.setString("在线人数："+userInfo.onlineNum)
        }
    },
    setMainMenuScenedata:function(data)
    {
        // var data=JSON.parse(jsonText);
        // cc.log("setMainMenuScenedata jsonText parse over");
        // {"uid":"43562","nickName":"坎坎坷坷6xcvd","winOfMatchForOne":1,"sumOfMatchForOne":28,"winOfMatchForMore":37,"sumOfMatchForMore":67,"winOfMatchForAI":16,"sumOfMatchForAI":51,"gainCumulation":"-11.285","sumOfAllMatch":28,"winMatchFriend":5,"sumMatchFriend":8,"headPicture":"http://qiniu.kiiik.com/SM-N9200__1481620525057__449948_1253"}
        /*message HallInfo{
        required string uid=1;//用户Id
        optional string token=2;//授权token
        optional int32 sumMatchOne=3;
        optional int32 sumMatchMore=4;
        optional int32 sumMatchAI=5;
        optional int32 sumMatchMoreTool=6;
        optional int32 sumMatchFriend=7;
        optional int32 winMatchOne=8;
        optional int32 winMatchMore=9;
        optional int32 winMatchAI=10;
        optional int32 winMatchMoreTool=11;
        optional int32 winMatchFriend=12;
        optional double GainCumulationForOne=13;
        optional double GainCumulationForAI=14;
        optional double GainCumulationForMore=15;
        optional double GainCumulationForMoreTool=16;
        optional double GainCumulationForFriend=17;
        optional string userName=18;
        optional string headPicture=19;
    }*/

        // userInfo.userId = data["uid"];
        // userInfo.nickName=data["nickName"];
        // userInfo.headSprite=data["headPicture"];
        // userInfo.winOfMatchForOne=data["winOfMatchForOne"];
        // userInfo.sumOfMatchForOne=data["sumOfMatchForOne"];
        // userInfo.winOfMatchForMore=data["winOfMatchForMore"];
        // userInfo.sumOfMatchForMore=data["sumOfMatchForMore"];
        // userInfo.winOfMatchForAI=data["winOfMatchForAI"];
        // userInfo.sumOfMatchForAI=data["sumOfMatchForAI"];
        // userInfo.winMatchFriend =data["winMatchFriend"];
        // userInfo.sumMatchFriend =data["sumMatchFriend"];
        // userInfo.gainCumulation=data["gainCumulation"];
        // userInfo.sumOfAllMatch=data["sumOfAllMatch"];
        //sumMatchOneMC
        userInfo.userId = data["uid"];
        userInfo.nickName=data["userName"];
        userInfo.headSprite=data["headPicture"];
        userInfo.winOfMatchForOne=data["winMatchOne"]+data["winMatchDaily"]+data["winMatchOneMC"];
        userInfo.sumOfMatchForOne=data["sumMatchOne"]+data["sumMatchDaily"]+data["sumMatchOneMC"];
        userInfo.winOfMatchForMore=data["winMatchMore"]+data["winMatchMoreTool"];
        userInfo.sumOfMatchForMore=data["sumMatchMore"]+data["sumMatchMoreTool"];
        userInfo.winOfMatchForAI=data["winMatchAI"];
        userInfo.sumOfMatchForAI=data["sumMatchAI"];
        userInfo.winMatchFriend =data["winMatchFriend"];
        userInfo.sumMatchFriend =data["sumMatchFriend"];
        userInfo.gainCumulation=data["gainCumulation"];
        userInfo.sumOfAllMatch=data["sumOfAllMatch"];
        userInfo.onlineNum = data["onLineNum"];

        // userInfo.GainCumulationForDaily = data["GainCumulationForDaily"];
        // userInfo.sumMatchDaily = data["sumMatchDaily"];


        cc.log(" ,"+userInfo.winOfMatchForOne+" ,"+userInfo.winOfMatchForMore+" ,"+userInfo.winOfMatchForAI+" ,"+userInfo.winMatchFriend);

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
        self.stopProgress();
		// var packet=Packet.prototype.Parse(message);
        cc.log("messageCallBack mainScene message callback message=="+message);
		if(message==null) return;
// WARN_FOR_REMOTE_LOGIN(-400,"您的账号已在其他地方登陆，请确保密码安全"),
//     WARN_FOR_GET_HISDATA(-401, "获取历史行情失败，请重新再试"),
//     WARN_FOR_VISTOR_APP(-402,"更多功能，请登录东航金融APP"),
//     WARN_FOR_VISTOR_WEB(-403,"更多功能，请下载东航金融APP"),
//     WARN_FOR_REPEAT_MATCHING(-404,"重复匹配"),
//     WARN_FOR_MATCHING_MATCHNOTFINSH(-405,"您有一场比赛尚未结束，请等待"),
//     ERROR_LOGIN_DIVCODE(-406,"登录校验失败"),
//     VERIFY_CODE_SEND_SUCCESS(-407,"验证码发送成功"),
//     WARN_NO_SUCH_TOOL(-408,"尚未提供该种类类道具"),
//     WARN_NO_SUCH_MATCH_TYPE(-409,"每局每种道具只能使用两次，请您下局再使用"),
//     WARN_NOT_ENOUGH_MONEY(-410,"金币不足"),
//     WARN_NOT_ENOUGH_POSITION(-411,"仓位不足"),
//     WARN_NOT_MATCH_MOBILE_CODE(-412,"手机号验证码校验失败"),
//     WARN_LOGIN_AGAIN(-413,"请重新登录");
        if(message.messageType==MessageType.Type_Warn){
            if(null!=message.warn.token){
                userInfo.token = message.warn.token;
            }
            switch (message.warn.code){
                case -400:{
                    self.showErrorBox(message.warn.warnInfo,function(){self.errorBoxClosed();});
                    break;
                }
                case -401:{
                    self.showErrorBox(message.warn.warnInfo,function(){self.errorBoxClosed();});
                    break;
                }
                case -402:{
                    self.showMessageBox(message.warn.warnInfo,function(){self.messageBoxClosed();});
                    break;
                }
                case -403:{
                    self.showMessageBox(message.warn.warnInfo,function(){self.messageBoxClosed();});
                    break;
                }
                case -404:{
                    self.showErrorBox(message.warn.warnInfo,function(){self.errorBoxClosed();});
                    break;
                }
                case -405:{
                    self.showErrorBox(message.warn.warnInfo,function(){self.errorBoxClosed();});
                    break;
                }
                case -420:{
                    if(self.friendLayer!=null){
                        self.friendLayer.showLayer();
                        self.pauseLowerLayer();
                    }
                    self.showErrorBox(message.warn.warnInfo,function(){self.errorBoxClosed();});

                    break;
                }
                default:{
                    cc.log("MainScene messageCallBack default message.warn.code="+message.warn.code);
                    self.showErrorBox(message.warn.warnInfo,function(){self.errorBoxClosed();});
                    break;
                }
            }

        }
        switch(message.messageType)
        {
            case MessageType.Type_Hall_Info://切换登录
            {
                if(self.loginViewLayer!=null){
                    self.LoginViewLayer_Close();
                }

                self.setMainMenuScenedata(message.hallInfo);
                cc.log("get MainMenuScene passed");
                self.stopProgress();
                // userId:null,//
                // 	deviceId:null,//设备号
                // userInfo.username=gPlayerName;
                // userInfo.password=packet.content.split("#")[1];
                //更新用户信息
                // userInfo.userId=packet.content.split("#")[0];
                // userInfo.source=packet.content.split("#")[1];
                // userInfo.operationType=1;//登录方式记录为
                // self.setMainMenuScenedata(packet.content);
                // cc.log("get MainMenuScene passed");
                // self.stopProgress();
                break;
            }
            // case "P"://接收到了大厅数据的消息
            // {
            //     cc.log("call get MainMenuScene data");
            //     if(gMainMenuScene==false){
            //         gMainMenuScene==new MainMenuScene();
            //     }
            //     self.setMainMenuScenedata(packet.content);
            //     cc.log("get MainMenuScene passed");
            //     self.stopProgress();
            //     break;
            // }
            // case "M"://人机对战结束信息
            // {
            //     //收到对方买入的信息
            //     // if(gKlineScene==null)
            //     //     gKlineScene=new KLineScene();
            //     // if(gKlineScene!=null) {
            //     //     gKlineScene.showMatchEndInfo(packet.content);
            //     // }
            //     // self.stopProgress();
            //     break;
            // }
            // case "Matching"://人人人对战信息Matching|"playerList":["http://7xpfdl.com1.z0.glb.clouddn.com/M1 E__1480588002710__166279_3596","http://ohfw64y24.bkt.clouddn.com/54"]|###
            // {
            //     cc.log("gMainMenuScene 人人机对战信息");
            //     if(self.matchViewLayer!=null) {
            //
            //         cc.log("gMainMenuScene 人人机对战信息2");
            //         userInfo.matchBeginFlag=true;
            //         self.matchViewLayer.stopHeadChange();
            //         self.matchViewLayer.refreshMatchViewByData(packet.content);
            //     }
            //     // self.stopProgress();
            //     break;
            // }
            case  MessageType.Type_Matching_Success://人人人对战信息Matching|"playerList":["http://7xpfdl.com1.z0.glb.clouddn.com/M1 E__1480588002710__166279_3596","http://ohfw64y24.bkt.clouddn.com/54"]|###
            {
                cc.log("gMainMenuScene 人人机对战信息");
                if(self.matchViewLayer!=null) {

                    cc.log("gMainMenuScene 人人机对战信息2");
                    userInfo.matchBeginFlag=true;
                    self.matchViewLayer.stopHeadChange();
                    self.matchViewLayer.refreshMatchViewByPBData(message.matchingSuccess);
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
            // case "8":
            // {
            //     //收到对方买入的信息
            //     if(gKlineScene==null)
            //         gKlineScene=new KLineScene();
            //     if(gKlineScene!=null) {
            //         var buyOperationIndex=parseInt(packet.content.split("#")[1]);
            //         gKlineScene.opponentOperations.push(buyOperationIndex);
            //         gKlineScene.refreshScores();
            //     }
            //     //alert("8="+packet.content);
            //
            //
            // }
            //
            // case "9":
            // {
            //     //收到对方卖出的信息
            //     //alert("9="+packet.content);
            //     if(gKlineScene==null)
            //         gKlineScene=new KLineScene();
            //     if(gKlineScene!=null) {
            //         var sellOperationIndex=parseInt(packet.content.split("#")[1]);
            //         gKlineScene.opponentOperations.push(-sellOperationIndex);
            //         gKlineScene.refreshScores();
            //     }
            //     break;
            // }
            //
            // case "4":
            // {
            //     //
            //     //cc.director.runScene(cc.TransitionSlideInL.create(0.5,klineScene));
            //     self.opponentsInfo.push(packet.content);
            //     self.stopProgress();
            //     break;
            // }
            case MessageType.Type_HisdataInfo://K线数据
            {
                //localStorage.clear();
                if(gKlineScene==null){
                    gKlineScene=new KLineScene();
                }
                gKlineScene.onEnteredFunction=function(){
                    gKlineScene.showProgress();
                    cc.log("gKlineScene.onEnteredFunction=====");
                    gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
                    gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);
                    gKlineScene.messageCallBack(message);
                    // gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
                };

                userInfo.matchBeginFlag=true;
                if(gMainMenuScene!=null){
                    gSocketConn.UnRegisterEvent("onmessage",gMainMenuScene.messageCallBack);
                }

                // gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);
                if(gKlineScene!=null)
                {
                    cc.log("call get kline data");
                    if(userInfo.matchMode==MatchType.Type_PlainMultiplayer_Match||userInfo.matchBeginFlag==true){
                        cc.log("get kline userInfo.matchMode==1 passed");
                        pageTimer["runScene"] = setTimeout(function(){cc.director.runScene(gKlineScene);},1000);
                    }
                    if(userInfo.matchMode!=MatchType.Type_PlainMultiplayer_Match){
                        cc.log("get kline userInfo.matchMode!=1 passed");
                        cc.director.runScene(gKlineScene);
                    }
                    cc.log("get kline passed");
                }
                // userInfo.matchBeginFlag=true;
                // gKlineScene.getklinedata(message);
                // var data = message.hisdataInfo;
                // gKlineScene.setklinePbdata(data);
                // gKlineScene.setDataForLlineLayer();
                // self.stopProgress();
                break;
            }
            // case "S":
            // {
            //     if(gKlineScene==null)
            //         gKlineScene=new KLineScene();
            //     //接收到了K线数据的分享消息
            //     gKlineScene.share(packet.content);
            //     cc.log("get kline K线数据的分享消息passed"+packet.content);
            //     break;
            // }
            // case "H":
            // {
            //     //成功接收到了K线数据的分享数据
            //     if(gKlineScene==null)
            //         gKlineScene=new KLineScene();
            //     //接收到了分享的K线数据的消息
            //     // gSocketConn.UnRegisterEvent("onmessage",self.messageCallBack);
            //     if(gKlineScene!=null)
            //     {
            //         cc.log("call get kline data");
            //         gKlineScene.getShareKlinedata(packet.content);
            //         cc.log("get kline passed");
            //     }
            //     self.stopProgress();
            //     cc.log("成功接收到了K线数据的分享数据");
            //     break;
            // }
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
            // case "PLAYERNUM":
            // {
            //     //接收到在线人数
            //     cc.log("messageCallBack.mainScenepacket.msgType="+packet.msgType+"packet.content=="+ packet.content);
            //     if(self.playerNumLabel!=null){
            //         self.playerNumLabel.setString("在线人数:"+packet.content);
            //     }
            //
            //     break;
            // }
             case MessageType.Type_OnlineNum:
            {
                //接收到在线人数
                cc.log("messageCallBack.mainScenepacket OnlineNum=="+ message.onlineNum);
                userInfo.onlineNum = message.onlineNum;
                if(self.playerNumLabel!=null){
                    self.playerNumLabel.setString("在线人数:"+userInfo.onlineNum );
                }

                break;
            }
            // case "G":
            // {
            //     if(gKlineScene==null)
            //         gKlineScene=new KLineScene();
            //     gKlineScene.showPlayerInfo(packet.content);
            //     break;
            // }
            // case "RANK"://排名信息
            // {
            //     // cc.log("messageCallBack.mainScene..packet.msgType="+packet.msgType);
            //     self.showRankViewInfo(packet.content);
            //     self.stopProgress();
            //     break;
            // }
            // case "Z"://接收到战绩的数据
            // {
            //     self.showZhanjiInfo(packet.content);
            //     self.stopProgress();
            //     break;
            // }
            case MessageType.Type_RankList://排名信息
            {
                // cc.log("messageCallBack.mainScene..packet.msgType="+packet.msgType);
                // self.showRankViewInfo(packet.content);
                console.info(message.rankList);
                if(message.rankList!=null){
                    self.showRankViewPbInfo(message.rankList);
                }else{
                    cc.log("排名信息为空");
                }


                self.stopProgress();
                break;
            }
            case MessageType.Type_HistoryMatches://接收到战绩的数据
            {
                // self.showZhanjiInfo(packet.content);
                console.info(message.historyMatches);
                if(message.historyMatches!=null){
                    self.showZhanjiPbInfo(message.historyMatches);
                }else{
                    cc.log("战绩信息为空");
                }
                self.stopProgress();
                break;
            }

            case  MessageType.Type_AddFriend:
            {
                // cc.log("messageCallBack.mainScene.packet.msgType="+message.messageType+"=====");

                userInfo.inviteFlag = false;
                userInfo.friendListData = [];
                var data=message.addFriend;
                userInfo.friendAddData = data;
                userInfo.friendNewListData  = data.findFriendRequest;
                userInfo.friendSearchListData  = data.selectAddNewFriend;
                if(self.friendLayer==null){
                    return;
                }else {
                    // LISTFRIEND||
                    self.friendLayer.showLayer();
                    self.pauseLowerLayer();
                    if(data.addFriendType==AddFriendType.Type_FindFriendRequest){
                        userInfo.token = data.findFriendRequest[0]["token"];
                        self.friendLayer.refreshAddFriendView();
                    }
                    if(data.addFriendType==AddFriendType.Type_SelectAdd_NewFriend){
                        userInfo.token = data.selectAddNewFriend[0]["token"];
                        self.friendLayer.refreshSearchFriendView();
                    }
                    if(data.addFriendType==AddFriendType.Type_SendFriend_Request&&null!=data.sendFriendRequest){
                        userInfo.token = data.sendFriendRequest["token"];
                        self.friendLayer.sendFriendList();
                    }
                    if(data.addFriendType==AddFriendType.Type_ReceiveFriendRequest&&null!=data.receiveFriendRequest){
                        userInfo.token = data.receiveFriendRequest["token"];
                        self.friendLayer.sendFriendList();
                    }
                }

                break;
            }
           case  MessageType.Type_FriendList:
            {
                cc.log("messageCallBack.mainScene.packet.msgType="+message.messageType+"=====");
                userInfo.inviteFlag = false;
                userInfo.friendListData = [];
                var data=message.friendList;
                userInfo.friendListData  = data;

                userInfo.friendListData.sort(function (a,b) {
                    if(a["status"]=="在线"){
                        return -1;
                    }else if(b["status"]=="在线"){
                        return 1;
                    }else if(a["status"]=="组队中"){
                        return -1;
                    }else if(b["status"]=="组队中"){
                        return 1;
                    }else if(a["status"]=="比赛中"){
                        return -1;
                    }else if(b["status"]=="比赛中"){
                        return 1;
                    }else {
                        // console.log(a["userName"].charCodeAt(0));
                        // console.log(b["userName"].charCodeAt(0));
                        return a["userName"].charCodeAt(0)-b["userName"].charCodeAt(0);
                    }
                });
                cc.log("after sort.....");
                cc.log(userInfo.friendListData);
                // var length = userInfo.friendListData.length;
                // for(var i=0;i<length;i++){
                //     var friendInfo = userInfo.friendListData[i];
                //     var url = friendInfo["headPicture"];
                //     cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                //         if(err){
                //             cc.log("before friend fail loadImg["+i+"]="+url);
                //             cc.log(err);
                //         }
                //         if(img){
                //             cc.log("before friend success loadImg["+i+"]="+url); // self.addChild(logo);
                //         }
                //
                //     });
                // }

                userInfo.inviteFlag = true;
                self.openFriendLayer();
                // if(self.friendLayer!=null){
                //     self.friendLayer.refreshFriendViewLayer();
                // }
                break;
            }

            case  MessageType.Type_FriendList_Change:
            {
                // cc.log("messageCallBack.mainScene.packet.msgType="+message.messageType+"=====");
                userInfo.inviteFlag = false;
                var data=message.friendListChange;
                var friendName =data["uid"];
                var status = data["status"];
                for(var i=0;userInfo.friendListData!=null&&i<userInfo.friendListData.length;i++)
                {
                    if(userInfo.friendListData[i]["uid"]==friendName){
                        userInfo.friendListData[i]["status"]=status;
                    }
                }
                if(null!=userInfo.friendListData&&userInfo.friendListData.length>1){
                    userInfo.friendListData.sort(function (a,b) {
                        if(a["status"]=="在线"){
                            return -1;
                        }else if(b["status"]=="在线"){
                            return 1;
                        }else if(a["status"]=="组队中"){
                            return -1;
                        }else if(b["status"]=="组队中"){
                            return 1;
                        }else if(a["status"]=="比赛中"){
                            return -1;
                        }else if(b["status"]=="比赛中"){
                            return 1;
                        }else {
                            return -1;
                        }
                    });
                }
                cc.log("好友列表"+userInfo.friendListData);
                // cc.log("userInfo.friendListData[1][headPicture]=="+userInfo.friendListData[1]["headPicture"]);

                if(self.friendLayer!=null){
                    self.friendLayer.refreshFriendViewLayer();
                }
                break;
            }

            case MessageType.Type_FriendMatch_Invit:
            {

                userInfo.inviteFlag = false;
                var data = message.friendMatchInvite;
                // var inviteInfo = new FriendMatch_Invite();
                inviteInfo.inviteCode = data["inviteCode"];
                inviteInfo.inviterName = data["inviterName"];
                inviteInfo.inviteeName = data["inviteeName"];
                inviteInfo.inviterPic = data["inviterPic"];
                inviteInfo.inviterUid = data["inviterUid"];
                inviteInfo.inviteeUid = data["inviteeUid"];
                inviteInfo.otherPlatform= data["otherPlatform"];
                // userInfo.matchMode = 4;
                userInfo.matchMode = MatchType.Type_Friend_Match;

                if(null==inviteInfo.inviteeName){//邀请第三方平台
                    var content = "点击链接同意比赛";
                    var url = "index.html?" + "tittle=room&&source=" + userInfo.inviteType +"&inviterUid=" + inviteInfo.inviterUid + "&inviteCode=" + inviteInfo.inviteCode + "&head=趋势突击&subtitle=" + content + "subtitleEnd";
                    cc.log("url");
                    // window.location.href = url;
                    if(sys.isMobile!=false){
                        window.location.href = url;
                    }else{
                        window.open(url);
                    }

                    userInfo.inviteType=null;
                }else{
                    if(self.invitedViewLayer==null){
                        self.invitedViewLayer=new InvitedViewLayer();
                        self.invitedViewLayer.setVisible(false);
                        self.invitedViewLayer.setPosition(0,0);
                        self.otherMessageTipLayer.addChild(self.invitedViewLayer, 1,self.invitedViewLayer.getTag());
                        // self.invitedViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
                        self.invitedViewLayer.closeCallBackFunction=function(){self.openFriendLayer()};
                    }

                    self.invitedViewLayer.showLayer();
                    self.pauseLowerLayer();
                }
                // var self = this;

                // if(self.friendLayer!=null){
                //     self.friendLayer.refreshFriendViewLayer();
                // }
                break;

            }
            case MessageType.Type_Player_In_Home:{
                cc.log("MessageType.Type_Player_In_Home=="+message+"=====");
                var playerInHome = message.playerInHome;
                userInfo.inviteFlag = true;
                self.openFriendLayer();
                self.friendLayer.refreshInviteFriend(playerInHome);
                // if()
                break;
            }
             case MessageType.Type_FriendMatch_Answer:
            {
                // cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
                /*message FriendMatch_Answer{
                 required bool agree=1;//同意
                 optional string answerName=2;//回答者
                 optional string answerPic=3;//回答者头像
                 optional string inviteCode=4;
                 }*/
                userInfo.inviteFlag = false;
                var data = message.friendMatchAnswer;
                var name = data["answerName"];
                if(self.friendLayer!=null&&!data["agree"]){
                    self.friendLayer.showMessageInfo(name+"拒绝了你的邀请！");
                }else{
                    ;
                }
                break;

            }
            // case "2":
            // {
            //     //登录失败
            //     self.stopProgress();
            //     self.showErrorBox(packet.content,function(){self.errorBoxClosed();});
            //     break;
            // }
            // case "D":
            // {
            //     //其他地方登陆
            //     self.stopProgress();
            //     self.showErrorBox(packet.content,function(){self.errorBoxClosed();});
            //     break;
            // }
            // case "ERROR":
            // {
            //     //登录失败
            //     self.stopProgress();
            //     self.showMessageBox(packet.content,function(){self.messageBoxClosed();});
            //     break;
            // }
            // case "UNMATCH":
            // {
            //     if(packet.content=="SUCCESS"){
            //         userInfo.matchBeginFlag=false;
            //         cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=== UNMATCH SUCCESSpacket.content=="+ packet.content);
            //     }else {
            //         cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=== packet.content=="+ packet.content);
            //     }
            //
            //     break;
            // }
            // case "SENDCODE"://获取验证码test
            // {
            //     cc.log("messageCallBack.mainScenepacket.msgType="+packet.msgType+"packet.content=="+ packet.content);
            //     break;
            // }
            // case "LOGIN"://获取验证码test
            // {
            //     cc.log("messageCallBack.mainScenepacket.msgType="+packet.msgType+"packet.content=="+ packet.content);
            //     // gSocketConn.toLogin(packet.content);
            //     // self.login();toLogin
            //     self.stopProgress();
            //     gSocketConn.SendToHMessage(packet.content);
            //     break;
            // }
            // case "LISTFRIEND":
            // {
            //
            //     cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
            //     userInfo.friendListData = [];
            //     var data=JSON.parse(packet.content);
            //     userInfo.friendListData  = data;
            //     cc.log(userInfo.friendListData);
            //     userInfo.friendListData.sort(function (a,b) {
            //         if(a["status"]=="在线"){
            //             return -1;
            //         }else if(b["status"]=="在线"){
            //             return 1;
            //         }else if(a["status"]=="组队中"){
            //             return -1;
            //         }else if(b["status"]=="组队中"){
            //             return 1;
            //         }else if(a["status"]=="比赛中"){
            //             return -1;
            //         }else if(b["status"]=="比赛中"){
            //             return 1;
            //         }else {
            //             return a["userName"]-b["userName"];
            //         }
            //     });
            //     //
            //     //     var arrSimple2=new Array(1,8,7,6);
            //     //     arrSimple2.sort(function(a,b){
            //     //         return b-a});
            //     // 解释：a,b表示数组中的任意两个元素，若return > 0 b前a后；reutrn < 0 a前b后；a=b时存在浏览器兼容
            //     //     简化一下：a-b输出从小到大排序，b-a输出从大到小排序。
            //     // cc.log("userInfo.friendListData[1][headPicture]=="+userInfo.friendListData[1]["headPicture"]);
            //
            //     if(self.friendLayer!=null){
            //         self.friendLayer.refreshFriendViewLayer();
            //     }
            //
            //     break;
            //
            // }
            // case "FRIENDCHANGE":
            // {
            //
            //     // cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
            //     cc.log(userInfo.friendListData);
            //
            //     var friendName = packet.content.split("#")[0];
            //     var status = packet.content.split("#")[1];
            //     for(var i=0;userInfo.friendListData!=null&&i<userInfo.friendListData.length;i++)
            //     {
            //         if(userInfo.friendListData[i]["friendname"]==friendName){
            //             userInfo.friendListData[i]["status"]=status;
            //         }
            //     }
            //
            //     userInfo.friendListData.sort(function (a,b) {
            //         if(a["status"]=="在线"){
            //             return -1;
            //         }else if(b["status"]=="在线"){
            //             return 1;
            //         }else if(a["status"]=="组队中"){
            //             return -1;
            //         }else if(b["status"]=="组队中"){
            //             return 1;
            //         }else if(a["status"]=="比赛中"){
            //             return -1;
            //         }else if(b["status"]=="比赛中"){
            //             return 1;
            //         }else {
            //             return -1;
            //         }
            //     });
            //     cc.log(userInfo.friendListData);
            //     // cc.log("userInfo.friendListData[1][headPicture]=="+userInfo.friendListData[1]["headPicture"]);
            //
            //     if(self.friendLayer!=null){
            //         self.friendLayer.refreshFriendViewLayer();
            //     }
            //     break;
            //
            // }
            // case "INVITE":
            // {
            //     // cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
            //     inviteInfo.code = packet.content.split("#")[0];
            //     inviteInfo.friendName = packet.content.split("#")[1];
            //     inviteInfo.picUrl = packet.content.split("#")[2];
            //     userInfo.matchMode = 4;
            //     // userInfo.matchMode = AiType.Type_Friend_Match;
            //     // var self = this;
            //     if(self.invitedViewLayer==null){
            //         self.invitedViewLayer=new InvitedViewLayer();
            //         self.invitedViewLayer.setVisible(false);
            //         self.invitedViewLayer.setPosition(0,0);
            //         self.otherMessageTipLayer.addChild(self.invitedViewLayer, 1,self.invitedViewLayer.getTag());
            //         self.invitedViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
            //     }
            //
            //     self.invitedViewLayer.showLayer();
            //     self.pauseLowerLayer();
            //
            //     // if(self.friendLayer!=null){
            //     //     self.friendLayer.refreshFriendViewLayer();
            //     // }
            //     break;
            //
            // }
            // case "REJECT":
            // {
            //     // cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
            //     var name = packet.content.split("#")[0];
            //
            //     if(self.friendLayer!=null){
            //         self.friendLayer.showMessageInfo(name+"拒绝了你的邀请！");
            //     }
            //
            //     // if(self.friendLayer!=null){
            //     //     self.friendLayer.refreshFriendViewLayer();
            //     // }
            //     break;
            //
            // }
                // REJECT|张三|
            default:
            {
                // cc.log("gMainMenuScene packet.msgType ="+message.messageType);
                cc.log("messageCallBack.mainScene.default.packet.msgType="+message.messageType+"=====");
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
    showZhanjiPbInfo:function(data)
    {
        cc.log("showZhanjiInfo  visible = true");
        // cc.log(content);
        var self=this;
        /*message HistoryMatches{
         required MatchType matchType=1;
         optional	int32  sumMatch=2;
         optional double winRate=3;
         optional double AvgGain=4;
         repeated OneHistoryMatch matchInfo=5;
         }
         message OneHistoryMatch{
         optional int32 matchId=1;
         optional string	matchTime=2;
         repeated	MatchUserInfo userInfo=3;
         }message MatchUserInfo{

         required string userName=1;
         required double score=2;
         optional int32 ranking=3;
         required string headPicture=4;
         repeated int32 operationIndex=5;
         optional int32 currentIndex=6;
         }*/
        userInfo.totalCount=data["sumMatch"];

        // rankData["AvgGain"] = parseFloat(rankData["AvgGain"]).toFixed(2);
        userInfo.winRate=parseFloat(data["winRate"]).toFixed(2);
        userInfo.AvgGain=parseFloat(data["AvgGain"]).toFixed(2);
        var historyMatchListData=data["matchInfo"];
        cc.log("historyMatchListData="+historyMatchListData);
        userInfo.MatchListData=[];
        for(var i=0;i<historyMatchListData.length;i++)
        {
            var matchData=historyMatchListData[i];
            // var userInfoTemp = matchData["userInfo"];
            // userInfoTemp.score=parseFloat(userInfoTemp.score).toFixed(2);
            // userInfo.AvgGain=parseFloat(data["AvgGain"]).toFixed(2);
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
            this.rankViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
        }
        pageTimer["rank"] = setTimeout(function(){self.rankrefreshRViewLayer();},100);
    },
    showRankViewPbInfo:function(data)
    {
        cc.log("showRankViewInfo  visible = true");
        /*message PlayerRanking{
         optional int32 rank=1;
         optional int32 sumMatch=2;
         optional int32 winMatch=3;
         optional double AvgGain=4;
         optional string userName=5;
         optional string headPicture=6;

         }

         message RankList{
         required MatchType matchType=1;
         optional PlayerRanking myInfo=2;
         repeated PlayerRanking playerInfo=3;
         }*/
        var self=this;
        userInfo.recordMode = data["matchType"];
        userInfo.myRanking = data["myInfo"];

        userInfo.myRanking["AvgGain"] = parseFloat(userInfo.myRanking["AvgGain"]).toFixed(2);

        var rankListData=data["playerInfo"];
        // cc.log("rankListData="+rankListData);
        userInfo.rankList=[];
        for(var i=0;i<rankListData.length;i++)
        {
            var rankData=rankListData[i];
            rankData["AvgGain"] = parseFloat(rankData["AvgGain"]).toFixed(2);
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
            this.rankViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
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

    showAddFriendView:function () {
        var self = this;
        if(self.addFriendViewLayer==null){
            self.addFriendViewLayer=new addFriendView();
            self.addFriendViewLayer.setVisible(false);
            self.addFriendViewLayer.setPosition(0,0);
            self.otherMessageTipLayer.addChild(self.addFriendViewLayer,1,self.addFriendViewLayer.getTag());
            self.addFriendViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
        }
        self.addFriendViewLayer.showLayer();
        self.pauseLowerLayer();
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