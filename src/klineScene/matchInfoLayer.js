﻿//﻿//﻿ JavaScript Document用来显示对局的信息和按钮等控件
var MatchInfoLayer = cc.Layer.extend({
    buyDisableSprite:null,		//买入按钮关闭图片
	buyCloseDisableSprite:null,	//买入平仓按钮关闭图片

	sellDisableSprite:null,		//卖出按钮关闭图片
	sellCloseDisableSprite:null,//卖出平仓按钮关闭图片

	buyButton:null,				//买入按钮
	sellButton:null,			//卖出按钮
	buyCloseButton:null,		//买平按钮
	sellCloseButton:null,		//卖平按钮
	
	selfNameLabel:null,			//玩家的名字
	opponentNameLabel:null,		//对手的名字
	
	selfDirLabel:null,			//玩家的方向
	opponentDirLabel:null,		//对手的方向
	
	selfScoreLabel:null,			//玩家的分数
	opponentScoreLabel:null,		//对手的分数
	
	
	//变速区域
	speedControlLayer:null,			//放变速按钮的层
	scBackgroundSprite:null,		//按钮的背景层
	scPlayCheckButton:null,			//播放和暂停切换的按钮
	scHalfCheckButton:null,			//半速
	scNormalCheckButton:null,		//普通速度
	scDoubleCheckButton:null,		//2倍速度

	emoticonButton:null,//
	faceSprites:null,

	//menuControlLayer:null,			//放功能按钮的层
	// menuControlLayer:null,
	btnReplay:null,		//复盘
	btnShare:null,		//分享
    meBtnStart:null,        //我也要玩
	againCallBackFunction:null,
	shareCallBackFunction:null,
    startCallBackFunction:null,
	// menu:null,

    dailyControlLayer:null,			//分时控制层

	statusFlag:0,

	ctor:function(width,height)
	{
		this._super();
		this.width=width;
		this.height=height;
		
	},
	
	onEnter:function () 
	{
		this._super();
		var self=this;
		// var size = cc.director.getWinSize();
		var fXScale = gDesignResolutionWidth/1280;
		var fYScale = gDesignResolutionHeight/720;
		// var fontSize = 25;

		var posX = 80;
		var posY = 35;
		// this.backgroundSprite=cc.Sprite.create("res/battle_bg.png");
		// var bgSize = this.backgroundSprite.getContentSize();
		// this.menuControlLayer = new cc.Layer();
		// this.menuControlLayer.setScale(fXScale,fYScale);
		// this.menuControlLayer.setPosition(0,0);
		// this.addChild(this.menuControlLayer);
		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.addChild(mu, 2);

		this.btnAgain=new cc.MenuItemImage("res/meBtnAgain.png","", self.again, this);//new Button("res/home.png");
		this.btnAgain.setScale(fXScale,fYScale);
		this.btnAgain.setPosition(cc.p(gDesignResolutionWidth/4,posY));
		mu.addChild(this.btnAgain);
		this.btnShare=new cc.MenuItemImage("res/meBtnShare.png","",self.share, this);//new Button("res/home.png");
		this.btnShare.setScale(fXScale,fYScale);
		this.btnShare.setPosition(cc.p(gDesignResolutionWidth/4*3,posY));
		mu.addChild(this.btnShare);
		this.meBtnStart=new cc.MenuItemImage("res/meBtnStart.png","", self.meStart, this);//new Button("res/home.png");
		this.meBtnStart.setScale(fXScale,fYScale);
		this.meBtnStart.setPosition(cc.p(gDesignResolutionWidth/2,posY));
		mu.addChild(this.meBtnStart);

		// this.btnStart=new Button("res/btnStart.png");
		// this.btnStart.setPosition(cc.p(363,posY));
		// this.btnStart.setClickEvent(function(){
		//     self.start();
		// });

		// this.btnHome=new Button("res/home.png");
		// this.btnHome.setPosition(cc.p(363,posY));
		// this.btnHome.setClickEvent(function(){
		//     self.meStart();
		// });

		// this.addChild(this.btnAgain,3);
		// this.addChild(this.btnShare,3);
		// this.addChild(this.meBtnStart,3);
		// this.addChild(this.btnStart,3);


		var posBuy = cc.p(posX,posY);
		var posSell = cc.p(gDesignResolutionWidth-posX,posY);
		var posTool = cc.p(70,0);
		this.buyButton=new cc.MenuItemImage(res.BTN_BUY_ENABLE_png,res.BTN_BUY_ENABLE_png,res.BTN_BUY_DISABLE_png, self.buyClick, this);//new Button("res/home.png");
		this.buyButton.setScale(fXScale,fYScale);
		this.buyButton.setPosition(posBuy);
		mu.addChild(this.buyButton);
		this.sellButton=new cc.MenuItemImage(res.BTN_SELL_ENABLE_png,res.BTN_SELL_ENABLE_png,res.BTN_SELL_DISABLE_png, self.sellClick, this);//new Button("res/home.png");
		this.sellButton.setScale(fXScale,fYScale);
		this.sellButton.setPosition(posSell);
		mu.addChild(this.sellButton);

		this.emoticonButton=new cc.MenuItemImage(res.btn_Emoticon_png,"", self.ShowemoticonView, this);//new Button("res/home.png");
		this.emoticonButton.setScale(0.8);
		this.emoticonButton.setPosition(cc.pAdd(posBuy,posTool));
		mu.addChild(this.emoticonButton);
		cc.log("userInfo.matchMode=="+userInfo.matchMode);
		// this.emoticonButton.setVisible(userInfo.matchMode==1?true:false);


		this.toolsButton=new cc.MenuItemImage(res.BTN_PROPS_png,"", self.ShowToolsView, this);//new Button("res/home.png");
		this.toolsButton.setScale(0.6);
		this.toolsButton.setPosition(cc.pSub(posSell,posTool));
		mu.addChild(this.toolsButton);
		cc.log("userInfo.matchMode=="+userInfo.matchMode);
		// this.toolsButton.setVisible(userInfo.matchMode==1?true:false);


		// this.matchInfoArea=new cc.DrawNode();
		// //设置K线图的区域
		// this.matchInfoArea.setPosition(cc.p(0,0));
		// this.matchInfoArea.width=this.width;
		// this.matchInfoArea.height=this.height;
		// this.addChild(this.matchInfoArea, 1);


		//设置变速信息的区域
		this.initSpeedControlArea();

		// setEnableBuyOrSell

		this.setButtonsToNoPosition();
		// this.setEnableBuyOrSell(true);
		// this.drawDisableButtons();

        //分时区域设置
        this.initDailyTradeControlArea();

		this.faceSprites = [];
		var posX = 85;
		for(var i=0;i<2;i++){
			this.faceSprites[i] = new cc.Sprite(res.Emoticon_1_png);
			this.faceSprites[i].setScale(fXScale*0.8);
			this.faceSprites[i].setPosition(i==0?posX:gDesignResolutionWidth-posX,300);
			this.faceSprites[i].setOpacity(0);
			this.addChild(this.faceSprites[i]);
		}
	},


	showFaceSprite:function(name,num)
	{
		var size = cc.director.getWinSize();
		var resFace = "res/public/Emoticon_"+num+".png";
		cc.log("showFaceSprite:function(name,num) resFace=="+resFace+"||userInfo.playerListData.length=="+userInfo.playerListData.length);

		var posCurrent = null;
		// var faceSpFrame = new cc.s
		if(userInfo.playerListData.length>0&&name == userInfo.playerListData[0]["userName"]){
			this.faceSprites[0].setTexture(resFace);
			posCurrent = this.faceSprites[0].getPosition();
			// this.faceSprites[0].runAction(actionTest);
			// cc.log("showFaceSprite:function(name,num) resFace==11");
		}else{
			this.faceSprites[1].setTexture(resFace);
			posCurrent = this.faceSprites[1].getPosition();
			// this.faceSprites[1].runAction(jumpto);
			// cc.log("showFaceSprite:function(name,num) resFace==22");
		}
		// headSprite.initWithTexture(texture2d);
		// for(var i=userInfo.playerListData.length-1;i>0;i--)
		// {
		// 	cc.log("refreshMatchViewByData 2=="+content);
		// 	for(var j=i;j>0;j--)
		// 	{
		// 		// cc.log("refreshMatchViewByData 2=="+content);
		// 		if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
		// 		{
		// 			var temp = userInfo.playerListData[j];
		// 			userInfo.playerListData[j] =userInfo.playerListData[j-1];
		// 			userInfo.playerListData[j-1] =temp;
		// 		}
		// 	}
		// }
		// 50,240-120*i
		var winSize = cc.director.getWinSize();

		// 3.窗口中心
		var posCenter = cc.p(winSize.width / 2, winSize.height / 2);
		var actionFadeIn=new cc.FadeTo(0.5,255);
		var jumpto = cc.jumpTo(1,posCurrent,10,4);
		var actionFadeOut=new cc.FadeTo(1,0);
		var actionTest = new  cc.Sequence(actionFadeIn,jumpto,cc.ActionInterval(1),actionFadeOut);//

		// var actionTest = cc.spawn(actionFadeIn,jumpto,actionFadeOut);//

		if(userInfo.playerListData.length>0&&name == userInfo.playerListData[0]["userName"]){
			// this.faceSprites[0].initWithTexture(texture2d);
			this.faceSprites[0].runAction(actionTest);
		}else{
			// this.faceSprites[1].initWithTexture(texture2d);
			// cc.log("showFaceSprite:function(name,num) resFace==22");
			this.faceSprites[1].runAction(actionTest);
		}

	},
	ShowToolsButtonView:function()
	{
		cc.log("ShowToolsButtonView begin  userInfo.toolsFlag=="+userInfo.toolsFlag);
		// var size = cc.director.getWinSize();
		// var posCenter = cc.p(size.width / 2, size.height / 2);
		gKlineScene.drawCoverCandlePart();

		// if(gKlineScene!=null&&userInfo.toolsFlag==0){
		// 	gKlineScene.drawNormalCandlePart();
		// 	userInfo.toolsFlag=1;
		// }else if(gKlineScene!=null&&userInfo.toolsFlag==1){
		// 	gKlineScene.drawOppositeCandlePart();
		// 	userInfo.toolsFlag=2;
		// }else if(gKlineScene!=null&&userInfo.toolsFlag==2){
		// 	gKlineScene.drawCoverCandlePart();
		// 	userInfo.toolsFlag=3;
		// }else if(gKlineScene!=null&&userInfo.toolsFlag==3){
		// 	// gKlineScene.drawNormalCandlePart();
		// 	userInfo.toolsFlag=0;
		// }

	},

	ShowemoticonView:function()
	{
		cc.log("showemoticonView begin");
		// 2.获取窗口大小
		var winSize = cc.director.getWinSize();

		// 3.窗口中心
		var centerpos = cc.p(winSize.width / 2, winSize.height / 2);
		// 3.窗口位置
		var posBase = cc.p(this.emoticonButton.getPositionX()-80, 80);
		// if (typeof(pos) == "undefined") {
		// 	var pos = centerpos;
		// }
		// this.emoticonViewLayer.setVisible(true);
		if(this.emoticonViewLayer==null) {
			this.emoticonViewLayer=new EmoticonViewLayer();
			this.addChild(this.emoticonViewLayer);
			this.emoticonViewLayer.setVisible(false);
		}
		this.emoticonViewLayer.setPosition(posBase);
		if(this.emoticonViewLayer.isVisible()){
			this.emoticonViewLayer.hideLayer();
		}else{
			this.emoticonViewLayer.showLayer();
		}

		// this.pauseLowerLayer();
	},

	ShowToolsView:function()
	{
		cc.log("showemoticonView begin");
		// 2.获取窗口大小
		var winSize = cc.director.getWinSize();

		// 3.窗口中心
		var centerpos = cc.p(winSize.width / 2, winSize.height / 2);
		// 3.窗口位置
		var posBase = cc.p(this.toolsButton.getPositionX()-80, 80);
		// if (typeof(pos) == "undefined") {
		// 	var pos = centerpos;
		// }
		// this.toolsViewLayer.setVisible(true);
		if(this.toolsViewLayer==null) {
			this.toolsViewLayer=new ToolsViewLayer();
			this.addChild(this.toolsViewLayer);
			this.toolsViewLayer.setVisible(false);
		}
		this.toolsViewLayer.setPosition(posBase);
		if(this.toolsViewLayer.isVisible()){
			this.toolsViewLayer.hideLayer();
		}else{
			this.toolsViewLayer.showLayer();
		}

		// this.pauseLowerLayer();
	},
	// setEmoticonSprites:function () {
	// 	var size = cc.director.getWinSize();
	// 	var posX =83;
	// 	var posY = 35;
	// 	var fXScale = size.width/1280;
	// 	var fYScale = size.height/720;
	// 	this.faceSprites = [];
	// 	for(var i=0;i<1;i++){
	// 		if(null == this.faceSprites[i]){
	// 			this.faceSprites[i] = cc.Sprite(res.Emoticon_1_png);
	// 			this.faceSprites[i].setPosition(100*fXScale,(500-252*i)*fYScale);
	// 			this.addChild(this.faceSprites[i]);
	// 		}
	// 	}
    //
	// },

	initSpeedControlArea:function()
	{
		//设置变速信息的信息
		var self=this;
		// var size = cc.director.getWinSize();
        var posX =83;
		var posY = 35;
		var fXScale = gDesignResolutionWidth/1280;
		var fYScale = gDesignResolutionHeight/720;
		this.speedControlLayer=new cc.Sprite(res.BTN_SC_BG_png);
		this.speedControlLayer.setPosition(gDesignResolutionWidth/2,posY);
		this.speedControlLayer.setScale(fXScale*0.6,fYScale*0.6);
		this.addChild(this.speedControlLayer,3);

		var bgSize = this.speedControlLayer.getContentSize();
		cc.log("speedControlLayer  bgSize.width=="+bgSize.width+"bgSize.height=="+bgSize.height);

		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.speedControlLayer.addChild(mu, 2);

		// this.zhanjiButton = new cc.MenuItemImage("res/btn_zhanji.png", "res/btn_zhanji.png", self.zhanji, this);


		this.scPlayCheckButton=new cc.MenuItemImage("res/btn_sc_play.png","res/btn_sc_pause.png", self.playCheckChanged, self);//new Button("res/home.png");
		this.scPlayCheckButton.setPosition(cc.p(posX,bgSize.height/2));
		mu.addChild(this.scPlayCheckButton);
		this.scPauseCheckButton=new cc.MenuItemImage("res/btn_sc_pause.png","res/btn_sc_play.png", self.playCheckChanged, self);//new Button("res/home.png");
		this.scPauseCheckButton.setPosition(cc.p(posX,bgSize.height/2));
		mu.addChild(this.scPauseCheckButton);
		this.scPlayCheckButton.setVisible(gKlineScene.drawCandleStoped);
		this.scPauseCheckButton.setVisible(!gKlineScene.drawCandleStoped);

		this.scHalfCheckButton=new cc.MenuItemImage("res/btn_sc_a_half.png","res/btn_sc_a_normal.png",self.halfSpeedCheckClicked, self);//new Button("res/home.png");
		this.scHalfCheckButton.setPosition(cc.p(bgSize.width-posX,bgSize.height/2));
		this.scHalfCheckButton.setVisible(false);
		mu.addChild(this.scHalfCheckButton);//new CheckButton("res/btn_sc_a_half.png","res/btn_sc_d_half.png");
		this.scNormalCheckButton=new cc.MenuItemImage("res/btn_sc_a_normal.png","res/btn_sc_a_double.png",self.normalSpeedCheckClicked, self);//new Button("res/home.png");
		this.scNormalCheckButton.setPosition(cc.p(bgSize.width-posX,bgSize.height/2));
		mu.addChild(this.scNormalCheckButton);//new CheckButton("res/btn_sc_a_normal.png","res/btn_sc_d_normal.png");
		this.scDoubleCheckButton=new cc.MenuItemImage("res/btn_sc_a_double.png","res/btn_sc_a_half.png", self.doubleSpeedCheckClicked, self);//new Button("res/home.png");
		this.scDoubleCheckButton.setPosition(cc.p(bgSize.width-posX,bgSize.height/2));
		this.scDoubleCheckButton.setVisible(false);
		mu.addChild(this.scDoubleCheckButton);//new CheckButton("res/btn_sc_a_double.png","res/btn_sc_d_double.png");

		// this.scBackgroundSprite=cc.Sprite.create("res/btn_sc_bg.png");
		// this.scPlayCheckButton=new CheckButton("res/btn_sc_pause.png","res/btn_sc_play.png");
		// this.scHalfCheckButton=new CheckButton("res/btn_sc_a_half.png","res/btn_sc_d_half.png");
		// this.scNormalCheckButton=new CheckButton("res/btn_sc_a_normal.png","res/btn_sc_d_normal.png");
		// this.scDoubleCheckButton=new CheckButton("res/btn_sc_a_double.png","res/btn_sc_d_double.png");

		// this.scBackgroundSprite.setPosition(cc.p(406,posY));
		// this.scPlayCheckButton.setPosition(cc.p(302,posY));
		// this.scHalfCheckButton.setPosition(cc.p(359,posY));
		// this.scNormalCheckButton.setPosition(cc.p(406,posY));
		// this.scDoubleCheckButton.setPosition(cc.p(453,posY));

		// this.scPlayCheckButton.setClickEvent(function(){
		// 	self.playCheckChanged();
		// });

		// this.scHalfCheckButton.setClickEvent(function(){
		// 	self.halfSpeedCheckClicked();
		// });
        //
		// this.scNormalCheckButton.setClickEvent(function(){
		// 	self.normalSpeedCheckClicked();
		// });
        //
		// this.scDoubleCheckButton.setClickEvent(function(){
		// 	self.doubleSpeedCheckClicked();
		// });
        //
		// this.scNormalCheckButton.setChecked(true);
		// this.scPlayCheckButton.setChecked(true);

		// this.speedControlLayer.addChild(this.scBackgroundSprite,1);
		// this.speedControlLayer.addChild(this.scPlayCheckButton,1);
		// this.speedControlLayer.addChild(this.scHalfCheckButton,1);
		// this.speedControlLayer.addChild(this.scNormalCheckButton,1);
		// this.speedControlLayer.addChild(this.scDoubleCheckButton,1);
	},
	initDailyTradeControlArea:function()
	{
		//设置变速信息的信息
		var self=this;
		// var size = cc.director.getWinSize();
        var posX =48;
		var posY = 78;
		var fontSize = 25;
		var fXScale = gDesignResolutionWidth/1280;
		var fYScale = gDesignResolutionHeight/720;
		this.dailyControlLayer=new cc.Sprite(res.EXERCISE_BOX_DEFAULT);
        var bgSize = this.dailyControlLayer.getContentSize();
        // this.dailyControlLayer.setAnchorPoint(0.5,1);
		this.dailyControlLayer.setPosition(gDesignResolutionWidth-bgSize.width*fXScale/2-10,gDesignResolutionHeight-bgSize.height*fYScale/2-5);
		this.dailyControlLayer.setScale(fXScale,fYScale);
		this.addChild(this.dailyControlLayer,3);
		var bgSize = this.dailyControlLayer.getContentSize();
		cc.log("dailyControlLayer  bgSize.width=="+bgSize.width+"bgSize.height=="+bgSize.height);

		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.dailyControlLayer.addChild(mu, 2);
		this.dailyControlLayer.setVisible(false);

        this.dailySelectButton=new cc.MenuItemImage(res.EXERCISE_ARROW_DOWN,res.EXERCISE_ARROW_UP, self.setStretchDailyTradeControlArea, self);//new Button("res/home.png");
        this.dailySelectButton.setPosition(cc.p(bgSize.width-posX,bgSize.height-posY/2));
		self.infoLabel = new cc.LabelTTF("分时",res.FONT_TYPE,fontSize);
		self.infoLabel.enableStroke(ShadowColor, 2);
		self.infoLabel.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height-posY/2));
		this.dailyControlLayer.addChild(self.infoLabel);
        // this.dailySelectButton.setVisible(false);
        mu.addChild(this.dailySelectButton);//new CheckButton("res/btn_sc_a_double.png","res/btn_sc_d_double.png");
		self.dailyLabel = new cc.LabelTTF("分时",res.FONT_TYPE,fontSize);
		this.item1 = new cc.MenuItemLabel(self.dailyLabel, self.dailyLine, self);//new cc.MenuItemFont("普通模式", self.generalMatch, this);
		// item1.setAnchorPoint(0,0.5);
		mu.addChild(this.item1);
		self.onedailyLabel = new cc.LabelTTF("1分钟",res.FONT_TYPE,fontSize);
		this.itemOne = new cc.MenuItemLabel(self.onedailyLabel, self.onedailyLine, self);//new cc.MenuItemFont("普通模式", self.generalMatch, this);
		// itemOne.setAnchorPoint(0,0.5);
		mu.addChild(this.itemOne);
		self.fivedailyLabel = new cc.LabelTTF("5分钟",res.FONT_TYPE,fontSize);
		this.itemFive = new cc.MenuItemLabel(self.fivedailyLabel, self.fivedailyLine, self);//new cc.MenuItemFont("普通模式", self.generalMatch, this);
		// itemFive.setAnchorPoint(0,0.5);
		mu.addChild(this.itemFive);
		this.item1.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height-posY/2));
		this.itemOne.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height-posY));
		this.itemFive.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height-posY/2*3));


		this.setDefaultDailyTradeControlArea();

	},
	dailyLine:function () {

		this.setDefaultDailyTradeControlArea();
		this.infoLabel.setString("分时");
		// this.playCheckChanged(false);
		var klineScene=this.parent.parent;
		if(null!=klineScene){
			klineScene.drawDailyView();
		}
		cc.log("dailyLine:function ()!!!");
	},
	onedailyLine:function () {
		this.infoLabel.setString("1分钟");
		this.setDefaultDailyTradeControlArea();
		// this.playCheckChanged(true);
		var klineScene=this.parent.parent;
		if(null!=klineScene){
			klineScene.drawOneDailyView();
		}
		cc.log("onedailyLine:function ()!!!");
	},
	fivedailyLine:function () {
		this.infoLabel.setString("5分钟");
		this.setDefaultDailyTradeControlArea();
		// this.playCheckChanged(true);
		var klineScene=this.parent.parent;
		if(null!=klineScene){
			klineScene.drawFiveDailyView();
		}
		cc.log("fivedailyLine:function ()!!!");
	},
    setDefaultDailyTradeControlArea:function () {//设置默认分时模式
		var self=this;
		// var size = cc.director.getWinSize();
		var posX =48;
		var posY = 78;
		var fXScale = gDesignResolutionWidth/1280;
		var fYScale = gDesignResolutionHeight/720;

        if(this.dailyControlLayer!=null){
            this.dailyControlLayer.initWithFile(res.EXERCISE_BOX_DEFAULT);
			var bgSize = this.dailyControlLayer.getContentSize();
			this.dailySelectButton.setPosition(cc.p(bgSize.width-posX,bgSize.height-posY/2));
			// this.dailySelectButton.initWithNormalImage(res.EXERCISE_ARROW_DOWN,res.EXERCISE_ARROW_UP, self.setStretchDailyTradeControlArea, self);
			this.dailyControlLayer.setPosition(gDesignResolutionWidth-bgSize.width*fXScale/2-10,gDesignResolutionHeight-bgSize.height*fYScale/2-5);
			this.dailySelectButton.unselected();
			this.dailySelectButton.setCallback(self.setStretchDailyTradeControlArea, self);

			self.infoLabel.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height-posY/2));
			self.infoLabel.setVisible(true);
			this.item1.setVisible(false);
			this.itemOne.setVisible(false);
			this.itemFive.setVisible(false);

        }

    },
    setStretchDailyTradeControlArea:function () {//设置拉伸选择模式
		var self=this;
		// var size = cc.director.getWinSize();
		var posX =48;
		var posY = 78/2;
		var fXScale = gDesignResolutionWidth/1280;
		var fYScale = gDesignResolutionHeight/720;
        if(this.dailyControlLayer!=null){
            this.dailyControlLayer.initWithFile(res.EXERCISE_BOX_STRETCH);
			var bgSize = this.dailyControlLayer.getContentSize();
			this.dailyControlLayer.setPosition(gDesignResolutionWidth-bgSize.width*fXScale/2-10,gDesignResolutionHeight-bgSize.height*fYScale/2-5);
			this.dailySelectButton.setPosition(cc.p(bgSize.width-posX,bgSize.height-posY));
			this.dailySelectButton.selected();
			this.dailySelectButton.setCallback(self.setDefaultDailyTradeControlArea, self);
			this.item1.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height-posY));
			this.item1.setVisible(true);
			this.itemOne.setVisible(true);
			this.itemFive.setVisible(true);
			this.itemOne.setPosition(cc.p((bgSize.width-posX)/2,bgSize.height/2));
			this.itemFive.setPosition(cc.p((bgSize.width-posX)/2,posY));
			self.infoLabel.setVisible(false);
        }
    },

	setEnableBuyOrSell:function (flag) {

		cc.log("setEnableBuyOrSell:function (flag)== "+flag);
		this.buyButton.setEnabled(flag);
		this.sellButton.setEnabled(flag);
        if(flag&&this.statusFlag==-1){
            this.setButtonsToSellPosition();
        }
        if(flag&&this.statusFlag==1){
            this.setButtonsToBuyPosition();
        }
	},

	// playCheckChanged:function()
	// {
     //    cc.log("playCheckChanged gKlineScene.drawCandleStoped=="+gKlineScene.drawCandleStoped);
	// 	// cc.log("playCheckChanged this.setEnableBuyOrSell(gKlineScene.drawCandleStoped)=="+gKlineScene.drawCandleStoped);
	// 	gKlineScene.drawCandleStoped=!gKlineScene.drawCandleStoped;
	// 	this.scPlayCheckButton.setVisible(gKlineScene.drawCandleStoped);
	// 	this.scPauseCheckButton.setVisible(!gKlineScene.drawCandleStoped);
	// },
	playCheckChanged:function(flag)
	{
		cc.log("playCheckChanged gKlineScene.drawCandleStoped=="+gKlineScene.drawCandleStoped);
		cc.log(flag);
		// cc.log("playCheckChanged this.setEnableBuyOrSell(gKlineScene.drawCandleStoped)=="+gKlineScene.drawCandleStoped);
		if("undefined"===typeof flag){
			gKlineScene.drawCandleStoped=!gKlineScene.drawCandleStoped;
			// cc.log("playCheckChanged flag==undefined=="+gKlineScene.drawCandleStoped);
		}else if("boolean"===typeof flag){
			// cc.log("playCheckChanged flag!=undefined=="+flag);
			gKlineScene.drawCandleStoped = flag;
		}else{
			gKlineScene.drawCandleStoped=!gKlineScene.drawCandleStoped;
			// cc.log("playCheckChanged flag=="+typeof(flag));
		}
		this.scPlayCheckButton.setVisible(gKlineScene.drawCandleStoped);
		this.scPauseCheckButton.setVisible(!gKlineScene.drawCandleStoped);
	},
	
	halfSpeedCheckClicked:function()
	{
		cc.log("begin gKlineScene.currentCandleDrawInterval=="+gKlineScene.currentCandleDrawInterval);
		this.scHalfCheckButton.setVisible(false);
		this.scNormalCheckButton.setVisible(true);
		this.scDoubleCheckButton.setVisible(false);
		gKlineScene.currentCandleDrawInterval=gKlineScene.CANDAL_DRAW_INTERVAL;
		cc.log("end gKlineScene.currentCandleDrawInterval=="+gKlineScene.currentCandleDrawInterval);
		// if(this.scHalfCheckButton.isSelected==true)
		// {
		// 	 this.scHalfCheckButton.setDisabled(true);
		//
		// 	 this.scNormalCheckButton.setChecked(false);
		// 	 this.scNormalCheckButton.setDisabled(false);
		//
		// 	 this.scDoubleCheckButton.setChecked(false);
		// 	 this.scDoubleCheckButton.setDisabled(false);
		//
		// 	 gKlineScene.currentCandleDrawInterval=gKlineScene.CANDAL_DRAW_INTERVAL*2;
		// 	 if(gKlineScene.drawCandleStoped==true)
		// 	 {
		// 		 gKlineScene.drawCandleStoped=false;
		// 		 this.scPlayCheckButton.setChecked(true);
		// 	 }
		// }
	},
	
	normalSpeedCheckClicked:function()
	{
		cc.log("begin gKlineScene.currentCandleDrawInterval=="+gKlineScene.currentCandleDrawInterval);
		this.scHalfCheckButton.setVisible(false);
		this.scNormalCheckButton.setVisible(false);
		this.scDoubleCheckButton.setVisible(true);
		gKlineScene.currentCandleDrawInterval=gKlineScene.CANDAL_DRAW_INTERVAL/2;
		cc.log("end gKlineScene.currentCandleDrawInterval=="+gKlineScene.currentCandleDrawInterval);
		// if(this.scNormalCheckButton.isSelected==true)
		// {
		// 	 this.scNormalCheckButton.setDisabled(true);
		//
		// 	 this.scHalfCheckButton.setChecked(false);
		// 	 this.scHalfCheckButton.setDisabled(false);
		//
		// 	 this.scDoubleCheckButton.setChecked(false);
		// 	 this.scDoubleCheckButton.setDisabled(false);
		//
		// 	 gKlineScene.currentCandleDrawInterval=gKlineScene.CANDAL_DRAW_INTERVAL;
		// 	 if(gKlineScene.drawCandleStoped==true)
		// 	 {
		// 		 gKlineScene.drawCandleStoped=false;
		// 		 this.scPlayCheckButton.setChecked(true);
		// 	 }
		// }
	},
	
	doubleSpeedCheckClicked:function()
	{
		cc.log("begin gKlineScene.currentCandleDrawInterval=="+gKlineScene.currentCandleDrawInterval);
		this.scHalfCheckButton.setVisible(true);
		this.scNormalCheckButton.setVisible(false);
		this.scDoubleCheckButton.setVisible(false);
		gKlineScene.currentCandleDrawInterval=gKlineScene.CANDAL_DRAW_INTERVAL*2;
		cc.log("end gKlineScene.currentCandleDrawInterval=="+gKlineScene.currentCandleDrawInterval);
		// if(this.scDoubleCheckButton.isSelected==true)
		// {
		// 	 this.scDoubleCheckButton.setDisabled(true);
		//
		// 	 this.scNormalCheckButton.setChecked(false);
		// 	 this.scNormalCheckButton.setDisabled(false);
		//
		// 	 this.scHalfCheckButton.setChecked(false);
		// 	 this.scHalfCheckButton.setDisabled(false);
		//
		// 	 gKlineScene.currentCandleDrawInterval=gKlineScene.CANDAL_DRAW_INTERVAL/2;
		// 	 if(gKlineScene.drawCandleStoped==true)
		// 	 {
		// 		 gKlineScene.drawCandleStoped=false;
		// 		 this.scPlayCheckButton.setChecked(true);
		// 	 }
		// }
	},
	
	disableAllButtons:function()
	{
		this.buyButton.setVisible(false);

		this.sellButton.setVisible(false);
		// this.buyCloseButton.setVisible(false);
		// this.sellCloseButton.setVisible(false);
		this.btnAgain.setVisible(false);
		this.btnShare.setVisible(false);
        this.meBtnStart.setVisible(false);

		this.emoticonButton.setVisible(false);
		this.toolsButton.setVisible(false);

		this.speedControlLayer.setVisible(false);
		this.dailyControlLayer.setVisible(false);
		// if(testFlag==true){
		// 	// this.emoticonButton.setVisible(true);
		// 	// this.toolsButton.setVisible(true);
		// 	this.dailyControlLayer.setVisible(true);
		// }
		cc.log("disableAllButtons ====setButtonsToNoPosition");
	},
	ableSpeedButtons:function()
	{
		this.speedControlLayer.setVisible(true);
	},

	ableAmoticonButtons:function()
	{
		this.emoticonButton.setVisible(true);
	},

	ableToolButtons:function()
	{
		this.toolsButton.setVisible(true);
	},

	disableToolButtons:function()
	{
		this.toolsButton.setVisible(false);
	},
	//将按钮设置为平仓的状态
	setButtonsToNoPosition:function()
	{
		cc.log("setButtonsToNoPosition");
		var self = this;
		this.buyButton.setVisible(true);
		this.sellButton.setVisible(true);
		this.buyButton.setEnabled(true);
		this.sellButton.setEnabled(true);

		this.buyButton.initWithNormalImage(res.BTN_BUY_ENABLE_png,res.BTN_BUY_ENABLE_png,res.BTN_BUY_DISABLE_png, self.buyClick, this);
		this.sellButton.initWithNormalImage(res.BTN_SELL_ENABLE_png,res.BTN_SELL_ENABLE_png,res.BTN_SELL_DISABLE_png, self.sellClick, this);


		this.statusFlag = 0;
        // if(userInfo.matchMode==MatchType.Type_PlainMultiplayer_Match||userInfo.matchMode==MatchType.Type_Tool_Match||userInfo.matchMode==MatchType.Type_Friend_Match||userInfo.matchMode==MatchType.Type_ArtificialMatch)//多人
        if(userInfo.matchMode==MatchType.Type_Practice_Match||userInfo.matchMode==MatchType.Type_DailyTrade_Match||userInfo.matchMode==MatchType.Type_ArtificialMatch){
            this.ableSpeedButtons();
        }
        if(userInfo.matchMode==MatchType.Type_PlainMultiplayer_Match||userInfo.matchMode==MatchType.Type_Tool_Match||userInfo.matchMode==MatchType.Type_Friend_Match){//匹配赛
            this.ableAmoticonButtons();
        }
        if(userInfo.matchMode==MatchType.Type_Tool_Match){//Type_Tool_Match
            this.ableToolButtons();
        }
		// this.buyCloseButton.setVisible(false);
		// this.sellCloseButton.setVisible(false);
	},
	
	//将按钮设置为多仓的状态
	setButtonsToBuyPosition:function()
	{
		// this.buyButton.setVisible(false);
		var self = this;
		this.buyButton.setEnabled(false);
		this.sellButton.setEnabled(true);
		this.sellButton.setVisible(true);
		this.sellButton.initWithNormalImage(res.BTN_SELL_CLOSE_png,res.BTN_SELL_CLOSE_png,res.BTN_SELL_DISABLE_png, self.sellClick, this);

		// this.buyButton.setDisabled(true);
		// this.sellButton.setDisabled(false);
		this.statusFlag = 1;
		// this.buyCloseButton.setVisible(false);
		// this.sellCloseButton.setVisible(true);
	},
	
	//将按钮设置为空仓的状态
	setButtonsToSellPosition:function()
	{
		var self = this;
		this.buyButton.setVisible(true);
		this.buyButton.initWithNormalImage(res.BTN_BUY_CLOSE_png,res.BTN_BUY_CLOSE_png,res.BTN_BUY_DISABLE_png, self.buyClick, this);
		// this.sellButton.setVisible(false);
		this.buyButton.setEnabled(true);
		this.sellButton.setEnabled(false);
		this.statusFlag = -1;
		// this.buyCloseButton.setVisible(true);
		// this.sellCloseButton.setVisible(false);
	},
	
	buyClick:function()
	{

		var klineScene=this.parent.parent;
		var lastCandleIndex=klineScene.currentCandleIndex;
        if(lastCandleIndex<121&&userInfo.matchMode!=MatchType.Type_DailyTrade_Match){
			return;
		}else{
			if(userInfo.buttonSoundFlag==true)
			{
				cc.log("buyClick===== ");
				playBuySound();
				// cc.audioEngine.playEffect("res/sound/button.mp3",false);
			}

			var i=klineScene.selfOperations.length;
			if(i>0&&Math.abs(klineScene.selfOperations[i-1])>=klineScene.currentCandleIndex)
			{
				cc.log("ERROR　selfOperations[" + i + "] = " + klineScene.selfOperations[i-1]);
				cc.log(" this.currentCandleIndex = ",klineScene.currentCandleIndex);
				return;
			}
			else
			{
				klineScene.buyClick();
				if(this.statusFlag==0)
				{
					this.setButtonsToBuyPosition();
				}
				else
				{
					this.setButtonsToNoPosition();
				}

			}
		}
	},
	
	// buyCloseClick:function()
	// {
	// 	var klineScene=this.parent.parent;
	// 	klineScene.buyClick();
	//
	// 	this.setButtonsToNoPosition();
	// },
	
	sellClick:function()
	{
		var klineScene=this.parent.parent;
		var lastCandleIndex=klineScene.currentCandleIndex;
        if(lastCandleIndex<121&&userInfo.matchMode!=MatchType.Type_DailyTrade_Match){
			return;
		}else{
			if(userInfo.buttonSoundFlag==true)
			{
				playSellSound();
			}
			var i=klineScene.selfOperations.length;
			if(i>0&&Math.abs(klineScene.selfOperations[i-1])>=klineScene.currentCandleIndex)
			{
				cc.log("ERROR　selfOperations[" + i + "] = " + klineScene.selfOperations[i-1]);
				cc.log("this.currentCandleIndex = ",klineScene.currentCandleIndex);
				return;
			}
			else
			{
				klineScene.sellClick();
				if(this.statusFlag==0)
				{
					this.setButtonsToSellPosition();
				}
				else
				{
					this.setButtonsToNoPosition();
				}
			}
		}

		
	},
	
	sellCloseClick:function()
	{
		// var klineScene=this.parent.parent;
		// klineScene.sellClick();
		if(gKlineScene!=null)
		{
			gKlineScene.sellClick();
		}
		this.setButtonsToNoPosition();
	},



	buyButtonCallBack:function()
	{
		// var klineScene=arguments[0].parent.parent.parent.parent;
		// klineScene.buyClick();
		if(gKlineScene!=null)
		{
			gKlineScene.buyClick();
		}
	},

	sellButtonCallBack:function()
	{
		if(gKlineScene!=null)
		{
			gKlineScene.sellClick();
		}
		// var klineScene=arguments[0].parent.parent.parent.parent;
		// klineScene.sellClick();
	},

	setReplayKLineScene:function()
	{
		//this.speedControlLayer.setVisible(false);
		this.btnAgain.setVisible(true);
		this.btnShare.setVisible(true);
	},

    setShareKLineScene:function()
    {
        this.meBtnStart.setVisible(true);
    },
	
    // setStart:function()
    // {
		// cc.log("MatchInfoLayer setStart:function()");
    //     this.btnStart.setVisible(true);
    // },

	
	again:function()
	{
		if(this.againCallBackFunction!=null)
		{
			this.againCallBackFunction();
		}
	},
	
	share:function()
	{
		if(this.shareCallBackFunction!=null)
		{
			this.shareCallBackFunction();
		}
	},
    meStart:function()
    {
        if(this.startCallBackFunction!=null)
        {
            this.startCallBackFunction();
        }
    }
});// JavaScript Document