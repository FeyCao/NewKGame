// JavaScript Document
//用来显示对局的信息和按钮等控件
var MatchInfoLayer= cc.Layer.extend({

	matchInfoArea:null,			//绘图的区域

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

	//menuControlLayer:null,			//放功能按钮的层
	// menuControlLayer:null,
	btnReplay:null,		//复盘
	btnShare:null,		//分享
    meBtnStart:null,        //我也要玩
	againCallBackFunction:null,
	shareCallBackFunction:null,
    startCallBackFunction:null,
	// menu:null,

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
		var size = cc.director.getWinSize();
		var fXScale = size.width/1280;
		var fYScale = size.height/720;
		var fontSize = 25;
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
		this.btnAgain.setPosition(cc.p(size.width/4,posY));
		mu.addChild(this.btnAgain);
		this.btnShare=new cc.MenuItemImage("res/meBtnShare.png","",self.share, this);//new Button("res/home.png");
		this.btnShare.setScale(fXScale,fYScale);
		this.btnShare.setPosition(cc.p(size.width/4*3,posY));
		mu.addChild(this.btnShare);
		this.meBtnStart=new cc.MenuItemImage("res/meBtnStart.png","", self.meStart, this);//new Button("res/home.png");
		this.meBtnStart.setScale(fXScale,fYScale);
		this.meBtnStart.setPosition(cc.p(size.width/2,posY));
		mu.addChild(this.meBtnStart);

		// this.btnStart=new Button("res/btnStart.png");
		// this.btnStart.setPosition(cc.p(363,posY));
		// this.btnStart.setClickEvent(function(){
		//     self.start();
		// });
		//
		// this.btnHome=new Button("res/home.png");
		// this.btnHome.setPosition(cc.p(363,posY));
		// this.btnHome.setClickEvent(function(){
		//     self.meStart();
		// });

		// this.addChild(this.btnAgain,3);
		// this.addChild(this.btnShare,3);
		// this.addChild(this.meBtnStart,3);
		// this.addChild(this.btnStart,3);


		this.buyButton=new cc.MenuItemImage("res/btnBuyEnable.png","res/btnBuyEnable.png", self.buyClick, this);//new Button("res/home.png");
		this.buyButton.setScale(fXScale*0.5,fYScale*0.5);
		this.buyButton.setPosition(cc.p(size.width/6,posY));
		mu.addChild(this.buyButton);
		this.sellButton=new cc.MenuItemImage("res/btnSellEnable.png","res/btnSellEnable.png", self.sellClick, this);//new Button("res/home.png");
		this.sellButton.setScale(fXScale*0.5,fYScale*0.5);
		this.sellButton.setPosition(cc.p(size.width/6*5,posY));
		mu.addChild(this.sellButton);
		//////////////////////////////////////////////////////////////
		// this.buyButton=new Button("res/btnBuyEnable.png");
		// //this.buyButton.setPosition(cc.p(77,44));
		// this.buyButton.setPosition(cc.p(106,posY-5));
		// this.buyButton.setClickEvent(function(){
		// 	self.buyClick();
		// });
		// this.addChild(this.buyButton, 3);
		// this.sellButton=new Button("res/btnSellEnable.png");
		// //this.sellButton.setPosition(cc.p(600,44));
		// this.sellButton.setPosition(cc.p(630,posY-5));
		// this.sellButton.setClickEvent(function(){
		// 	self.sellClick();
		// });
		// this.addChild(this.sellButton, 3);
		// this.sellCloseButton=new Button("res/btnCloseSell.png");
		// this.sellCloseButton.setPosition(cc.p(136,44));
        //
		// this.sellCloseButton=new Button("res/btnSellEnable.png");
		// this.sellCloseButton.setPosition(cc.p(630,posY-5));
        //
		// this.sellCloseButton.setClickEvent(function(){
		// 	self.sellCloseClick();
		// });
		// this.addChild(this.sellCloseButton, 3);
		//
		//
		//
		// this.buyCloseButton=new Button("res/btnCloseBuy.png");
		// this.buyCloseButton.setPosition(cc.p(659,44));
        //
		// this.buyCloseButton=new Button("res/btnBuyEnable.png");
		// this.buyCloseButton.setPosition(cc.p(106,posY));
        //
        //
		// this.buyCloseButton.setClickEvent(function(){
		// 	self.buyCloseClick();
		// });
		// this.addChild(this.buyCloseButton, 3);
		//
		// this.btnAgain=new Button("res/meBtnAgain.png");
		// this.btnAgain.setPosition(cc.p(276,posY));
		// this.btnAgain.setScale(0.5);
		// this.btnAgain.setClickEvent(function(){
		// 	self.again();
		// });
		//
		// this.btnShare=new Button("res/meBtnShare.png");
		// this.btnShare.setPosition(cc.p(460,posY));this.btnShare.setScale(0.5);
		// this.btnShare.setScale(0.5);
		// this.btnShare.setClickEvent(function(){
		// 	self.share();
		// });
		//
        // this.meBtnStart=new Button("res/meBtnStart.png");
        // this.meBtnStart.setPosition(cc.p(363,posY));
		// this.meBtnStart.setScale(0.5);
        // this.meBtnStart.setClickEvent(function(){
         //    self.meStart();
        // });


		this.matchInfoArea=new cc.DrawNode();
		//设置K线图的区域
		this.matchInfoArea.setPosition(cc.p(0,0));
		this.matchInfoArea.width=this.width;
		this.matchInfoArea.height=this.height;
		this.addChild(this.matchInfoArea, 1);



		//设置变速信息的区域
		this.initSpeedControlArea();

		this.setButtonsToNoPosition();
		this.drawDisableButtons();
		this.drawAreaBorder();
		/*
		 this.buyButtonImage=new cc.MenuItemImage("res/buy.png","res/buy_p.png",this.buyButtonCallBack);
		 this.buyMenu=new cc.Menu(this.buyButtonImage);
		 this.buyMenu.setPosition(cc.p(96/2,96/2));
	 	 this.addChild(this.buyMenu, 5);		
		 
		 this.sellButtonImage=new cc.MenuItemImage("res/sell.png","res/sell_p.png",this.sellButtonCallBack);
		 this.sellMenu=new cc.Menu(this.sellButtonImage);
		 this.sellMenu.setPosition(cc.p(this.width-96/2,96/2));
	 	 this.addChild(this.sellMenu, 5);		
		 
		 this.selfNameLabel = cc.LabelTTF.create(gPlayerName, "微软雅黑", 24);
		 this.selfNameLabel.setPosition(300, 80);
		 this.addChild(this.selfNameLabel,5);
		 
		  this.opponentNameLabel = cc.LabelTTF.create(this.parent.opponentsInfo[0], "微软雅黑", 24);
		 this.opponentNameLabel.setPosition(300, 30);
		 this.addChild(this.opponentNameLabel,5);
		 
		  this.selfDirLabel = cc.LabelTTF.create("", "微软雅黑", 24);
		 this.selfDirLabel.setPosition(400, 80);
		 this.addChild(this.selfDirLabel,5);
		 
		  this.opponentDirLabel = cc.LabelTTF.create("", "微软雅黑", 24);
		 this.opponentDirLabel.setPosition(400, 30);
		 this.addChild(this.opponentDirLabel,5);
		 
		  this.selfScoreLabel = cc.LabelTTF.create("", "微软雅黑", 24);
		 this.selfScoreLabel.setPosition(500, 80);
		 this.addChild(this.selfScoreLabel,5);
		 
		  this.opponentScoreLabel = cc.LabelTTF.create("", "微软雅黑", 24);
		 this.opponentScoreLabel.setPosition(500, 30);
		 this.addChild(this.opponentScoreLabel,5);
		 */
		 

	},

	initSpeedControlArea:function()
	{
		//设置变速信息的信息
		var self=this;
		var size = cc.director.getWinSize();
        var posX =83;
		var posY = 35;
		var fXScale = size.width/1280;
		var fYScale = size.height/720;
		this.speedControlLayer=cc.Sprite.create("res/btn_sc_bg.png");
		this.speedControlLayer.setPosition(size.width/2,posY);
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
	
	playCheckChanged:function()
	{
        cc.log("playCheckChanged gKlineScene.drawCandleStoped=="+gKlineScene.drawCandleStoped);
		gKlineScene.drawCandleStoped=!gKlineScene.drawCandleStoped;
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
		// this.btnStart.setVisible(false);
		this.speedControlLayer.setVisible(false);
		cc.log("disableAllButtons ====setButtonsToNoPosition");
	},
	ableSpeedButtons:function()
	{
		this.speedControlLayer.setVisible(true);
	},
	
	//将按钮设置为平仓的状态
	setButtonsToNoPosition:function()
	{
		cc.log("setButtonsToNoPosition");
		this.buyButton.setVisible(true);
		this.sellButton.setVisible(true);
		// this.buyButton.setDisabled(false);
		// this.sellButton.setDisabled(false);
		this.statusFlag = 0;
		// this.buyCloseButton.setVisible(false);
		// this.sellCloseButton.setVisible(false);
	},
	
	//将按钮设置为多仓的状态
	setButtonsToBuyPosition:function()
	{
		this.buyButton.setVisible(false);
		this.sellButton.setVisible(true);

		// this.buyButton.setDisabled(true);
		// this.sellButton.setDisabled(false);
		this.statusFlag = 1;
		// this.buyCloseButton.setVisible(false);
		// this.sellCloseButton.setVisible(true);
	},
	
	//将按钮设置为空仓的状态
	setButtonsToSellPosition:function()
	{
		this.buyButton.setVisible(true);
		this.sellButton.setVisible(false);
		// this.buyButton.setDisabled(false);
		// this.sellButton.setDisabled(true);
		this.statusFlag = -1;
		// this.buyCloseButton.setVisible(true);
		// this.sellCloseButton.setVisible(false);
	},
	
	buyClick:function()
	{
		if(userInfo.buttonSoundFlag==true)
		{
			cc.log("buyClick===== ");
			cc.audioEngine.playEffect("res/sound/button.mp3",false);
		}
		var klineScene=this.parent.parent;
		var i=klineScene.selfOperations.length;
		if(i>0&&Math.abs(klineScene.selfOperations[i-1])>=klineScene.currentCandleIndex)
		{
			cc.log("selfOperations[" + i + "] = " + klineScene.selfOperations[i-1]);
			cc.log("drawCandlesAll this.currentCandleIndex = ",klineScene.currentCandleIndex);
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
		if(userInfo.buttonSoundFlag==true)
		{
			cc.audioEngine.playEffect("res/sound/button.mp3",false);
		}
		var klineScene=this.parent.parent;
		var i=klineScene.selfOperations.length;
		if(i>0&&Math.abs(klineScene.selfOperations[i-1])>=klineScene.currentCandleIndex)
		{
			cc.log("selfOperations[" + i + "] = " + klineScene.selfOperations[i-1]);
			cc.log("drawCandlesAll this.currentCandleIndex = ",klineScene.currentCandleIndex);
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
	
	//画买卖开平等按钮
	drawDisableButtons:function()
	{
		// this.buyDisableSprite.setVisible(false);
		// this.buyCloseDisableSprite.setVisible(false);
		// this.sellDisableSprite.setVisible(false);
		// this.sellCloseDisableSprite.setVisible(false);
		
		
		/*
		var start=cc.p(77,44);
		var end=cc.p(136,44);
		this.matchInfoArea.drawSegment(start,end,4,cc.color(62,62,62,255));
		
		start=cc.p(600,44);
		end=cc.p(659,44);
		this.matchInfoArea.drawSegment(start,end,4,cc.color(62,62,62,255));
		
		this.buyDisableSprite.setPosition(cc.p(77,44));
		this.buyCloseDisableSprite.setPosition(cc.p(136,44));
		this.sellDisableSprite.setPosition(cc.p(600,44));
		this.sellCloseDisableSprite.setPosition(cc.p(659,44));
		*/
	},
	
	drawAreaBorder:function()
	{
		 //给这个矩形区域添加红色的边框
		 /*
		 this.matchInfoArea.drawRect(cc.p(0,0),cc.p(this.matchInfoArea.width, this.matchInfoArea.height),cc.color(0,0,0,0),1,cc.color(0,255,255,255));
		 this.matchInfoArea.drawRect(cc.p(0,0),cc.p(this.width, this.height),cc.color(0,0,0,0),1,cc.color(255,255,255,255));
		 */
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
    },
});// JavaScript Document