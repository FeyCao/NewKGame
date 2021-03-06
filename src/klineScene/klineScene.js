
// //赋值模拟
// pageTimer["timer1"] = setInterval(function(){},2000);
// pageTimer["timer2"] = setInterval(function(){},2000);
// //全部清除方法
// for(var each in pageTimer){
// 	clearInterval(pageTimer[each]);
// }
var faceSprite = {};
var KLineScene = SceneBase.extend(
{
	backgroundLayer:null,		//背景层
	
	matchEndInfoLayer:null,		//对局结束后弹出的对话框

	// klineLayer:null,		//跳动的K线图
	klineView:null,//指标图
	klineLayerMain:null,		//主要的持续跳动的K线图
	klineLayerPrev:null,		//前期的K线，游戏一开始显示一下作为游戏时判断使用

	volumnTechLayerMain:null,		//主要的持续跳动的成交量图，也可以作为技术指标的图
	volumnTechLayerPrev:null,		//前期的一副图，游戏一开始显示一下作为游戏时判断使用

	klineData:null,			//游戏界面K线图的数据，按照时间从小到大排序。
	klineFiveData:null,			//游戏界面K线图的5倍数据，按照时间从小到大排序。
	klinedataMain:null,			//游戏界面K线图的数据，按照时间从小到大排序。
	prevKlineData:null,			//游戏界面前的K线图的数据，按照时间从小到大排序。

	prevDataDayCount:null,
	mainDataDayCount:null,


	matchInfoLayer:null,		//显示游戏按钮的层
	playerInfoLayer:null,		//显示对手信息，比赛分数信息的层
	matchViewLayer:null,
    preMatchView:null,
	phase2:false,				//主K线阶段
	opponentsInfo:[],			//对手信息

	matchRunFlag:false,
	//买入卖出信息格式如下，正数为买入，负数为卖出，绝对值表示买入或卖出的索引
	selfOperations:[],			//自己的交易信息，
	opponentOperations:[],		//对手的交易信息
	
	borderArea:null,			//画K线图和技术图的边框的区域
	middleHorizontalLineCount:11,	//在中间的横线的个数
	
	currentCandleIndex:0,		//当前显示的是第几个蜡烛，从0开始
	CANDAL_DRAW_INTERVAL:cc.game.config["CANDAL_DRAW_INTERVAL"],		//每个K线相隔的时间
	currentCandleDrawInterval:null,	//当前的K线绘画间隔
	drawCandleStoped:false,			//是否绘画停止了
	
	mainLayerNumber:5,		//上方的主图的层号
	volumnTechLayerNumber:4,//下方的技术指标的层号
	
	onEnteredFunction:null,	//OnEnter调用结束后的Function

	countDownSprite:null,
	countDownNumber:null,
	countBeginNumber:null,
	countBeginSprite:null,
	countDownInfo:null,
	countDownTimeInfo:null,
	countDownTime:null,


	ctor: function ()
	{
		this._super();
		this.backgroundLayer=null;
		this.matchEndInfoLayer=null;
		this.klineLayerView=null;
		this.klineLayerMain=null;
		this.klineLayerPrev=null;
		this.volumnTechLayerMain=null;
		this.buyInfo=null,
		this.buyScore=null,
		this.klinedataMain=null;
		this.prevKlineData=null;
		this.matchInfoLayer=null;
		this.playerInfoLayer=null;
		this.phase2=false;
		this.opponentsInfo=[];
		this.selfOperations=[];
		this.opponentOperations=[];
		this.borderArea=null;
		this.onEnteredFunction=null;
		this.currentCandleDrawInterval=null;

		this.size=null;
		this.fXScale = null;
		this.fYScale = null;
		this.KlineWidth = 726;
		this.KlinePosX = 5;
	},

	onExit:function()
	{
		this._super();

		 //全部清除方法
		for(var each in pageTimer){
			clearTimeout(pageTimer[each]);
		}

		cc.eventManager.removeAllListeners();
		if(gSocketConn!=null)
			gSocketConn.UnRegisterEvent("onmessage",this.messageCallBack);
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.onExit();
		}
		if(this.matchEndInfoLayer!=null)
		{
			this.matchEndInfoLayer.onExit();
		}
		if(this.matchViewLayer!=null)
		{
			this.matchViewLayer.onExit();
		}

		userInfo.endInfoOfAllPlayers = null;
		userInfo.playerListData = null;
        userInfo.matchId = null;
		this.removeAllChildrenWithCleanup(true);
		gKlineScene=null;
		// if(cc.audioEngine.isMusicPlaying()==true)
		// {
		// 	cc.audioEngine.stopMusic();
		// }
		cc.log("KLineScene onExit end");
	},

	onEnter:function () 
	{
		cc.log("KLineScene onEnter begin");
		this._super();
		gKlineScene=this;
		// cc.director.setDisplayStats(true);
		cc.view.enableRetina(userInfo.viewFlag);

		// if(userInfo.bgSoundFlag==true){
        //
		// 	if(cc.audioEngine.isMusicPlaying()==false)
		// 	{
		// 		var musicFile = "res/sound/home_bg.mp3";
		// 		cc.audioEngine.playMusic(musicFile,true);
		// 	}
		// }
		var self=this;
        this.size = cc.director.getWinSize();
        this.fXScale = gDesignResolutionWidth/1280;
		this.fYScale = gDesignResolutionHeight/720;
		cc.log("比例大小=="+this.fXScale);
		//document.getElementById("mainBody").style比例大小==0.575
		var centerpos = cc.p(this.size.width / 2, this.size.height / 2);
		// document.bgColor="#152936";

		gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);

		this.currentCandleDrawInterval=this.CANDAL_DRAW_INTERVAL;
		cc.log("............klinescene on enter called");
		this.backgroundLayer=new cc.LayerColor(cc.color(21,41,54, 255));
		this.backgroundLayer.ignoreAnchorPointForPosition(false);  
		this.backgroundLayer.setPosition(gDesignResolutionWidth / 2, gDesignResolutionHeight / 2);
		this.addChild(this.backgroundLayer, 1,this.backgroundLayer.getTag());

		this.backgroundSprite=new cc.Sprite(res.BG_BATTLE_png);
		this.backgroundSprite.setScale(this.fXScale,this.fYScale);
		this.backgroundSprite.setPosition(gDesignResolutionWidth/2,gDesignResolutionHeight/2);
		this.backgroundLayer.addChild(this.backgroundSprite, 1);

		var background = this.backgroundSprite.getContentSize();

		this.playerInfoLayer=new PlayerInfoLayer();
		this.playerInfoLayer.setPosition(cc.p(0,0));
		// this.playerInfoLayer.setPosition(cc.p(this.size.width/2,this.size.height/2));
		this.backgroundSprite.addChild(this.playerInfoLayer, 8,this.playerInfoLayer.getTag());
		this.setKlineInfo();



		// var containerColor=cc.color(0,32,52,180);//
		// this.container.setColor(containerColor);

		// this.coverSprite = new cc.LayerColor(BlackColor,700,200);;
		// this.coverSprite = new cc.Sprite(res.BLUE_BG_png);
		// this.coverSprite.setScale(70,20);
		// this.coverSprite = new cc.Scale9Sprite(res.BG_COVER_png,cc.size(700,200));
		// var baseSize = cc.size(720,200);
		this.coverSprite = new cc.Sprite(res.BG_COVER_png);
		this.coverSprite.setScale(0.63,0.52);
		this.coverSprite.setAnchorPoint(0,0);
		// this.coverSprite.setContentSize(baseSize);
		// this.coverSprite.setOpacity(0);
		this.coverSprite.setVisible(false);
		this.coverSprite.setPosition(this.KlinePosX,165);
		// var coverSp = new cc.Sprite(res.SP_COVER_png);
		// coverSp.setPosition(this.coverSprite.getContentSize().width/2,this.coverSprite.getContentSize().height/2);
		// this.coverSprite.addChild(coverSp);
		this.addChild(this.coverSprite,9);

		this.banSprite = new cc.Sprite(res.BG_BAN_png);
		this.banSprite.setScale(0.63,0.52);
		this.banSprite.setAnchorPoint(0,0);
		// this.coverSprite.setContentSize(baseSize);
		// this.banSprite.setOpacity(0);
		this.banSprite.setVisible(false);
		this.banSprite.setPosition(this.KlinePosX,165);
		this.addChild(this.banSprite,4);


		var posBar = cc.p(gDesignResolutionWidth / 2+20, gDesignResolutionHeight-60);


		this.barSprite = new cc.Sprite(res.BG_BAR_png);
		this.barSprite.setScale(0.8,0.6);
		// this.barSprite.setAnchorPoint(0,0);
		// this.coverSprite.setContentSize(baseSize);
		// this.barSprite.setOpacity(255);
		this.barSprite.setPosition(posBar);
		this.addChild(this.barSprite,10);

		this.barInfo= new createClipRoundNode("xxx对xxx使用了道具xxx对",22,YellowColor,350,30);// cc.LabelTTF.create("xxx对xxx使用了道具","Arial",25);//createClipRoundText = function(txt,fontsize,color,width,height)
		// this.barInfo.setAnchorPoint(0,0.5);
		this.barInfo.setPosition(90,12);//.text.setString();

		// this.barInfo.setString("使用了道具使用了道具使用了道具使用了道具");
		this.barSprite.addChild(this.barInfo);


		// this.barInfo.setPosition(cc.p(gDesignResolutionWidth / 3-20, gDesignResolutionHeight-80));
		// // gKlineScene.barInfo.setVisible(false);
		gKlineScene.barSprite.setVisible(false);
		// this.addChild(this.barInfo,11);


		this.warnInfo= cc.LabelTTF.create("警告信息：","Arial",30);
		// this.warnInfo.setAnchorPoint(0,0.5);
		this.warnInfo.setScale(0.5);
		this.warnInfo.setPosition(cc.p(gDesignResolutionWidth / 2, 30));
		gKlineScene.warnInfo.setVisible(false);
		this.addChild(this.warnInfo,11);

 		// //  //设置K线图的区域
        //
		// var kWidth = this.KlineWidth*2-10;
		// this.klineLayerMain=new KlineLayer(kWidth,192);
        //
		// this.volumnTechLayerMain=new VolumnTechLayer(kWidth,94);
		// this.volumnTechLayerMain.setClickEvent(function(){self.changeTechLayer();});
		// this.klineLayerMain.setPosition(cc.p(this.KlinePosX,170));
		// this.volumnTechLayerMain.setPosition(cc.p(this.KlinePosX,75));
		// this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		// this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
        // this.klineLayerMain.addNewTais(new TaisMa([10,20,30],0));
        // this.volumnTechLayerMain.addNewTais(new TaisMa([5,10],1));
        // var macdTais1=new TaisMacd(12,26,9);
        // macdTais1.isEnabled=false;
        // this.volumnTechLayerMain.addNewTais(macdTais1);

		//画虚线非常耗性能
		// this.borderArea=new cc.DrawNodeCanvas();
		// this.borderArea.setPosition(cc.p(0,68));
		// this.borderArea.width=726;
		// this.borderArea.height=294;
		// this.addChild(this.borderArea, 2);
		//   //画边框
		// //this.drawAreaBorder();
		// this.drawHorizontalLine();

        // var kWidth = this.KlineWidth*2-10;
        // // this.klineLayerMain=new KlineLayer(kWidth,192);
        // this.volumnTechLayerMain=new VolumnTechLayer(kWidth,94);
        // this.volumnTechLayerMain.setAnchorPoint(0,0);
        // this.volumnTechLayerMain.setPosition(cc.p(this.KlinePosX,75));
        // this.volumnTechLayerMain.setClickEvent(function(){self.changeTechLayer();});
        // // this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
        // this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
        // this.klineLayerMain=new KlineLayer(kWidth,192);
        // this.klineLayerMain.setPosition(this.KlineWidth-5,0);
        // this.klineLayerMain.setAnchorPoint(0,0.5);
        // var contentSize = cc.size(kWidth,195);
        // // //设置View的大小，相当于是显示的区域
        // var viewSize = cc.size(720,192);
        // // var contentSize = cc.size(610,270*8.2);
        // // var sp =cc.Sprite.create("res/help/bg_help.png");
        // this.container = new cc.LayerColor();
        // var containerColor=cc.color(0,32,52,180);//
        // this.container.setColor(containerColor);
        // this.container.setAnchorPoint(0,0);
        // // container.addChild(sp);
        // this.container.setPosition(0,0) ;
        // this.container.setVisible(true);
        // var posTopX = contentSize.width;
        // this.klineLayerView = new cc.ScrollView();
        // this.klineLayerView.setContainer(this.container);
        // this.klineLayerView.setContentSize(contentSize);
        // this.klineLayerView.setViewSize(viewSize);
        // this.klineLayerView.setAnchorPoint(0,0);
        // this.klineLayerView.setPosition(this.KlinePosX,170);
        // this.klineLayerView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        // this.klineLayerView.setVisible(true);
        // this.klineLayerView.setBounceable(true);
        // // scroll_card.jumpToTop();
        // this.klineLayerView.setContentOffset(this.klineLayerView.minContainerOffset() , false);
        // this.container.addChild(this.klineLayerMain);
        // cc.log("klineLayerView.klineLayerView.maxContainerOffset()x=="+this.klineLayerView.minContainerOffset().x+"y=="+this.klineLayerView.minContainerOffset().y);
        // this.backgroundLayer.addChild(this.klineLayerView,this.mainLayerNumber);



        // this.klineLayerPrev=new KlineLayer(this.KlineWidth-5,192);
		// this.klineLayerPrev.setPosition(cc.p(this.KlinePosX,170));
		// this.volumnTechLayerPrev=new VolumnTechLayer(this.KlineWidth-5,94);
		// this.volumnTechLayerPrev.setPosition(cc.p(this.KlinePosX,75));
		// this.volumnTechLayerPrev.setClickEvent(function(){self.changeTechLayer();});
        //
		// //需要设置指标
		// this.klineLayerPrev.addNewTais(new TaisMa([10,20,30],0));
		// this.volumnTechLayerPrev.addNewTais(new TaisMa([5,10],1));
		// var macdTais2=new TaisMacd(12,26,9);
		// macdTais2.isEnabled=false;
		// this.volumnTechLayerPrev.addNewTais(macdTais2);


		// this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());

		// this.addChild(this.klineLayerPrev,this.mainLayerNumber,this.klineLayerPrev.getTag());
		// this.addChild(this.volumnTechLayerPrev,this.volumnTechLayerNumber,this.volumnTechLayerPrev.getTag());

		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.backgroundSprite.addChild(mu, 2);

		var bgSize = this.backgroundSprite.getContentSize();
		// this.zhanjiButton = new cc.MenuItemImage("res/btn_zhanji.png", "res/btn_zhanji.png", self.zhanji, this);


        this.btnHome=new cc.MenuItemImage("res/home.png", "res/home.png", self.toHome, this);//new Button("res/home.png");
		this.btnHome.setPosition(cc.p(35,bgSize.height-35));
		this.btnHome.setScale(0.9);
		mu.addChild(this.btnHome);
		this.btnStart=new cc.MenuItemImage("res/btnStart.png", "res/btnStart.png", self.start, this);//new cc.MenuItemImage("res/home.png", "res/home.png", self.start, this);
		this.btnStart.setPosition(cc.p(bgSize.width/2,60));
		mu.addChild(this.btnStart);

		if(this.btnStart!=null)
		{
			this.btnStart.setVisible(false);
		}

		//调用下面这个函数的时候，可能数据还未获取到，也可能获取到了
		this.setDataForLlineLayer();
		
		this.matchInfoLayer=new MatchInfoLayer(726,82);
		this.matchInfoLayer.setPosition(cc.p(5,0));
		this.addChild(this.matchInfoLayer, 8,this.matchInfoLayer.getTag());


		if(gSocketConn!=null && gSocketConn!=undefined)
		{
			gSocketConn.RegisterEvent("onmessage",this.messageCallBack);
		}
		cc.log("............klineLayerMain created");

		if(this.matchInfoLayer!=null)
		{
			this.matchInfoLayer.disableAllButtons();
			//this.matchInfoLayer.ableSpeedButtons();
		}

		
		if(this.onEnteredFunction!=null)
		{
			cc.log("KLineScene onEnteredFunction end");
			this.onEnteredFunction();
		}


		cc.log("KLineScene onEnter end");
		// //pageView begin
		// var pageView = new ccui.PageView();
		// pageView.setTouchEnabled(true);
		// pageView.setContentSize(cc.size(this.size .width,this.size .height));
		// // pageView.x = ( this.size.width - background.width) / 2 + (background.width - pageView.width) / 2;
		// // pageView.y = ( this.size.height - background.height) / 2 + (background.height - pageView.height) / 2;
        //
		// pageView.x = (this.size .width - pageView.width) / 2;
		// pageView.y = (this.size .height - pageView.height) / 2;
		// cc.log("pageView.x = "+pageView.x);
		// cc.log("pageView.y = "+pageView.y);
		// // //设置K线图的区域
		// // this.klineLayerMain=new KlineLayer(this.KlineWidth,192);
		// // this.klineLayerMain.setPosition(cc.p(this.KlinePosX,170));
		// for (var i = 0; i < 3; ++i) {
		// 	var layout = new ccui.Layout();
		// 	layout.setContentSize(cc.size(this.size .width,this.size .height));
		// 	var layoutRect = layout.getContentSize();
        //
		// 	cc.log("layout.getContentSize()"+layoutRect.width);
		// 	var imageView =cc.Sprite.create("res/title.png");
		// 	// imageView.setPose
		// 	// var imageView = new ccui.ImageView();
		// 	// imageView.setTouchEnabled(true);
		// 	// // imageView.setScale9Enabled(true);
		// 	// imageView.loadTexture("res/title.png");
		// 	// // imageView.setContentSize(cc.size(240, 130));
		// 	imageView.x = layoutRect.width / 2;
		// 	imageView.y = layoutRect.height / 2;
		// 	layout.addChild(imageView);
		// 	//
		// 	var text = new ccui.Text();
		// 	text.string = "page" + (i + 1);
		// 	text.font = "30px 'Marker Felt'";
		// 	text.color = cc.color(192, 192, 192);
		// 	text.x = layoutRect.width / 2;
		// 	text.y = layoutRect.height / 2;
		// 	layout.addChild(text);
        //
		// 	cc.log("pageView layer ="+i);
		// 	pageView.addPage(layout, i);
		// }
		// // pageView.setCurrent(1);
		// pageView.addEventListener(this.pageViewEvent, this);
        //
		// pageView.setCurrent(2);
		// //for test purpose only
		// cc.log(pageView.getPages());
		// cc.log(pageView.getPage(0));
		// this.addChild(pageView,2,pageView.getTag());
		// ///pageView end
		// return true;
	},
		setKlineInfo:function()
		{


			this.KlineWidth = gDesignResolutionWidth-10;
			this.KlinePosX = 5;
			// switch(userInfo.matchMode)
			// {
			// 	case 0:
			// 	{
			// 		this.KlineWidth = gDesignResolutionWidth-10;
			// 		this.KlinePosX = 5;
			// 		break;
			// 	}
			// 	case 1:
			// 	{
			// 	}
			// 	case 3:
			// 	case 2:
			// 	{
			// 		this.KlineWidth = gDesignResolutionWidth-120*this.fXScale;
			// 		this.KlinePosX = 120*this.fXScale;
            //
			// 		break;
			// 	}
            //
            //
			// 	default:
			// 	{
			// 		cc.log("userInfo.matchMode ="+userInfo.matchMode);
			// 		break;
			// 	}
			// }

			cc.log("setKlineInfo userInfo.matchMode ="+userInfo.matchMode);
		},

	setPlayerInfo:function()
	{
		if(userInfo.matchMode==null)return;
		if(this.playerInfoLayer!=null)
		{
			cc.log("setPlayerInfo:function()");
			this.playerInfoLayer.refreshScoresByData();
		}
		// case MatchType.Type_Practice_Match:
		// case MatchType.Type_ArtificialMatch://人机匹配
		// case MatchType.Type_Tool_Match://道具匹配
		// case MatchType.Type_Friend_Match://好友匹配
		// case MatchType.Type_PlainMultiplayer_Match://普通匹配
		switch(userInfo.matchMode)
		{
			case MatchType.Type_Practice_Match:
			{
				this.KlineWidth = 726;
				this.KlinePosX = 5;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((gDesignResolutionWidth-this.matchEndInfoLayer.width) / 2, (gDesignResolutionHeight-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				if(null!=this.otherMessageTipLayer){
					this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());
				}

				break;
			}
			case MatchType.Type_ArtificialMatch://人机匹配
			{
				// this.KlineWidth = this.size.width-120*this.fXScale;
				// this.KlinePosX = 120*this.fXScale;
				this.KlineWidth = 726;
				this.KlinePosX = 5;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((gDesignResolutionWidth-this.matchEndInfoLayer.width) / 2, (gDesignResolutionHeight-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				if(null!=this.otherMessageTipLayer){
					this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());
				}

				cc.log("人机战this.KlineWidth ="+this.KlineWidth +"||this.KlinePosX="+this.KlinePosX+"||this.size.width="+gDesignResolutionWidth);//this.KlineWidth =667||this.KlinePosX=69||this.size.width=736

				break;
			}
			case MatchType.Type_Tool_Match://道具匹配
			case MatchType.Type_Friend_Match://好友匹配
			case MatchType.Type_PlainMultiplayer_Match://普通匹配
			{
				// this.KlineWidth = this.size.width-120*this.fXScale;
				// this.KlinePosX = 120*this.fXScale;
				this.KlineWidth = 726;
				this.KlinePosX = 5;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((gDesignResolutionWidth-this.matchEndInfoLayer.width) / 2, (gDesignResolutionHeight-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				if(null!=this.otherMessageTipLayer){
					this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());
				}

				cc.log("人人战this.KlineWidth ="+this.KlineWidth +"||this.KlinePosX="+this.KlinePosX+"||this.size.width="+gDesignResolutionWidth);//this.KlineWidth =667||this.KlinePosX=69||this.size.width=736

				break;
			}
			case MatchType.Type_DailyTrade_Match:{
				this.KlineWidth = 726;
				this.KlinePosX = 5;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((gDesignResolutionWidth-this.matchEndInfoLayer.width) / 2, (gDesignResolutionHeight-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				if(null!=this.otherMessageTipLayer){
					this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());
				}

				break;
			}
			default:
			{
				cc.log("userInfo.matchMode ="+userInfo.matchMode);
				break;
			}
		}

		cc.log("setPlayerInfo userInfo.matchMode ="+userInfo.matchMode);
	},

	//修改副图的显示内容
	changeTechLayer:function()
	{
		cc.log("klinescene changeTechLayer begin");
		
		if(this.phase2==false)
		{
			cc.log("changeTechLayer this.phase2==false to begin");
			if(this.volumnTechLayerPrev.isTaisEnabled("MACD")==true)
			{
				//如果MACD是激活的，则切换到"MA"
				cc.log("changeTechLayer to ma");
				this.volumnTechLayerPrev.changeToOtherTais(["MA"]);
				// this.volumnTechLayerMain.changeToOtherTais(["MA"]);
			}
			else if(this.volumnTechLayerPrev.isTaisEnabled("MA")==true)
			{
				//如果"MA"是激活的，则切换到MACD
				cc.log("changeTechLayer to macd");
				this.volumnTechLayerPrev.changeToOtherTais(["MACD"]);
				// this.volumnTechLayerMain.changeToOtherTais(["MACD"]);
			}
			//需要重绘技术图
			this.volumnTechLayerPrev.clearMaxAndMinValue();
			this.volumnTechLayerPrev.clearAllContents();
			this.volumnTechLayerPrev.drawAllCandlesTillIndexOrEnd();
		}
		else
		{
			cc.log("changeTechLayer this.phase2 to begin");
			if(this.volumnTechLayerMain.isTaisEnabled("MACD")==true)
			{
				cc.log("====changeTechLayer to ma");
				//如果MACD是激活的，则切换到"MA"
				this.volumnTechLayerMain.changeToOtherTais(["MA"]);
			}
			else if(this.volumnTechLayerMain.isTaisEnabled("MA")==true)
			{
				cc.log("====changeTechLayer to macd");
				this.volumnTechLayerMain.changeToOtherTais(["MACD"]);
			}
			
			this.volumnTechLayerMain.clearMaxAndMinValue();
			this.volumnTechLayerMain.clearAllContents();
			if(this.currentCandleIndex>=1)
			{
				this.volumnTechLayerMain.drawAllCandlesTillIndexOrEnd(this.currentCandleIndex-1);
			}
		}
	},

	drawAreaBorder:function()
	{
		 //给这个矩形区域添加边框
		 var radius=10;
		 this.borderArea.drawSegment(cc.p(0+radius,0),cc.p(this.borderArea.width-radius,0),1,cc.color(38,64,86,255));
		 this.borderArea.drawSegment(cc.p(0,0+radius),cc.p(0,this.borderArea.height-radius),1,cc.color(38,64,86,255));
		 this.borderArea.drawSegment(cc.p(0+radius,this.borderArea.height),cc.p(this.borderArea.width-radius,this.borderArea.height),1,cc.color(38,64,86,255));
		 this.borderArea.drawSegment(cc.p(this.borderArea.width,0+radius),cc.p(this.borderArea.width,this.borderArea.height-radius),1,cc.color(38,64,86,255));
		 
		 this.borderArea.drawQuadBezier(cc.p(0+radius,0),cc.p(0,0),cc.p(0,0+radius),5,2,cc.color(38,64,86,255));
		 this.borderArea.drawQuadBezier(cc.p(0,this.borderArea.height-radius),cc.p(0,this.borderArea.height),cc.p(0+radius,this.borderArea.height),5,2,cc.color(38,64,86,255));
		 this.borderArea.drawQuadBezier(cc.p(this.borderArea.width-radius,0),cc.p(this.borderArea.width,0),cc.p(this.borderArea.width,0+radius),5,2,cc.color(38,64,86,255));
		 this.borderArea.drawQuadBezier(cc.p(this.borderArea.width-radius,this.borderArea.height),cc.p(this.borderArea.width,this.borderArea.height),cc.p(this.borderArea.width,this.borderArea.height-radius),5,2,cc.color(38,64,86,255));
		 
		 //this.borderArea.drawRect(cc.p(0,0),cc.p(this.borderArea.width, this.borderArea.height),cc.color(0,0,0,0),1,cc.color(38,64,86,255));
	},

	
	drawHorizontalLine:function()
	{
		var size = cc.director.getWinSize();
		var middleGapHeight=this.borderArea.height/(this.middleHorizontalLineCount+1);
		// for(var i=0;i<this.middleHorizontalLineCount;i++)
		// {
		// 	// var pointBegin=cc.p(5,middleGapHeight*(i+1));
		// 	// var pointEnd=cc.p(this.borderArea.width-5,middleGapHeight*(i+1));
        //
		// 	// var WhiteColor=cc.color(189,240,255,255);//白色
		// 	if(i!=3)
		// 	for(var j=0;this.borderArea.width>3*j;j++)//画虚线
		// 	{
		// 		var pointBegin=cc.p(5+3*j,middleGapHeight*(i+1));
		// 		var pointEnd=cc.p(6+3*j,middleGapHeight*(i+1));
		// 		// var pointMiddle = cc.p(5+3*j,middleGapHeight*(i+1));
		// 		this.borderArea.drawSegment(pointBegin,pointEnd,0.2,cc.color(189,240,255,100));
		// 	}
        //
		// 	//
		// 	//this.borderArea.drawSegment(pointBegin,pointEnd,0.4,cc.color(36,62,83,80));
		// 	// this.borderArea.drawSegment(pointBegin,pointEnd,0.4,WhiteColor);
		// 	// cc.log("drawHorizontalLine middleGapHeight i="+i+"||middleGapHeight=="+middleGapHeight);
		// }
		this.borderArea.drawSegment(cc.p(0,100),cc.p(gDesignResolutionWidth,100),1,BlueColor);
	},

	
	messageCallBack:function(message)
	{

		// var data = message.hisdataInfo;
		cc.log("KlineScene messageCallBack.begin..");
		// var packet=Packet.prototype.Parse(message);
		var self=gKlineScene;
		// if(packet==null) return;
		if(message==null) return;
		if(message.messageType==MessageType.Type_Warn){
			cc.log("login scene message callback warnInfo msgType="+message.messageType);
			self.showErrorBox("登录失败:"+message.warn.warnInfo,function(){self.errorBoxClosed();});
		}
		switch(message.messageType)
		{
			case MessageType.Type_Hall_Info://切换登录
			{
				if(self.loginViewLayer!=null){
					self.LoginViewLayer_Close();
				}

				if(gMainMenuScene!=null){
					gMainMenuScene.setMainMenuScenedata(message.hallInfo);
				}

				cc.log("get MainMenuScene passed");
				self.stopProgress();


				break;
			}
			case MessageType.Type_Score:
			{
				//收益信息
				//alert("9="+packet.content);
				var scoreInfo = message.score;
				self.showPlayerInfoPb(scoreInfo);
				break;
			}

			case MessageType.Type_End_Match_Info:
			{
				//接收到对局结束
				//alert("接收到对局结束");
				self.showMatchEndPbInfo(message.endMatchInfo);
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
			case MessageType.Type_HisdataInfo:
			{
				//接收到了K线数据的消息we
				userInfo.matchBeginFlag=true;
				cc.log("jsonText parseK线数据over");
				// self.getklinedata(packet.content);
				var data = message.hisdataInfo;
				userInfo.matchRecordFlag = false;
				userInfo.recordName=null;
				self.setklinePbdata(data);

				self.stopProgress();
				 // self.setDataForLlineLayerTest();
				self.setDataForLlineLayer();

                // self.matchViewLayer_Close();
				self.popViewLayer_Close();
                cc.log("get kline K线数据 passed");
                break;
            }


            case "Matching"://人人人对战信息Matching|"playerList":["http://7xpfdl.com1.z0.glb.clouddn.com/M1 E__1480588002710__166279_3596","http://ohfw64y24.bkt.clouddn.com/54"]|###
            {
                cc.log("gKLineScene 人人机对战信息");
                if(self.matchViewLayer!=null) {

                    cc.log("gMainMenuScene 人人机对战信息2");
                    userInfo.matchBeginFlag=true;
                    self.matchViewLayer.stopHeadChange();
                    self.matchViewLayer.refreshMatchViewByData(packet.content);
                }
                // self.stopProgress();
                break;
            }
			case "G":
			{
				// if(gKlineScene==null)
				// 	gKlineScene=new KLineScene();
				self.showPlayerInfo(packet.content);
				break;
			}
			case "S":
			{
				//接收到了K线数据的分享消息
				self.share(packet.content);
				cc.log("get kline K线数据的分享消息passed"+packet.content);
				break;
			}
			case "H":
			{
				//成功接收到了K线数据的分享数据
				cc.log("jsonText parseK线分享数据over");
				self.getklinedata(packet.content);
				self.advanceToMainKLine_Share();
				cc.log("成功接收到了K线数据的分享数据");
				break;
			}
			case MessageType.Type_Share:
			{
				//成功接收到了K线数据的分享数据
				cc.log("MessageType.Type_Share线分享数据over");
				var data = message.shareInfo;
				userInfo.matchRecordFlag = true;
				userInfo.recordName=null;
				self.setklinePbdata(data);
				self.advanceToMainKLine_Share();
				cc.log("成功接收到了K线数据的分享数据");
				break;
			}
			case "O"://观看记录
			{
				cc.log("begin to parse 观看记录json text");
				userInfo.matchFlag = true;
				self.getklinedata(packet.content);
				self.advanceToMainKLine_Record();
				cc.log("get 观看记录 passed");

				break;
			}
			case MessageType.Type_Match_Record:
			{
				//成功接收到了K线数据的观看记录数据
				cc.log("MessageType.Type_Match_Record数据r");
				var data = message.matchRecord;
				userInfo.matchRecordFlag = true;
				userInfo.recordName=null;
				self.setklinePbdata(data);
				self.advanceToMainKLine_Record();
				cc.log("成功接收到了K线数据的分享数据");
				break;
			}
			case "I":
			{
				//接收到了K线数据的分享错误消息
				cc.log("call get kline data");
				//self.share(packet.content);
				cc.log("get kline passed"+packet.content);
				break;
			}
			case "F":
			{
				//接收到对局结束
				//alert("接收到对局结束");
				self.showMatchEndInfo(packet.content);
				break;
			}


			// case "Z"://接收到战绩的数据
			// {
			// 	self.showZhanjiInfo(packet.content);
			// 	self.stopProgress();
			// 	break;
			// }

			case "M"://人机对战结束信息
			{
				//收到对方买入的信息
				if(gKlineScene==null)
					gKlineScene=new KLineScene();
				if(gKlineScene!=null) {
					gKlineScene.showMatchEndInfo(packet.content);
				}
				self.stopProgress();
				break;
			}

			case "Y"://观看交易记录Match
			{
				cc.log("begin 观看交易记录Match");
				// self.getklinedata(packet.content);
				// self.advanceToMainKLine_Record();
				var data=JSON.parse(packet.content);
				self.advanceToMainKLine_RecordMatch(data);

				cc.log("jsonText parse 观看记录over");
				// self.toSetklinedata(data);

				cc.log("get 观看交易记录Match");

				break;
			}
			case "LISTFRIEND":
			{

				cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
				userInfo.friendListData = [];
				var data=JSON.parse(packet.content);
				userInfo.friendListData  = data;
				cc.log(userInfo.friendListData);
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
				//
				//     var arrSimple2=new Array(1,8,7,6);
				//     arrSimple2.sort(function(a,b){
				//         return b-a});
				// 解释：a,b表示数组中的任意两个元素，若return > 0 b前a后；reutrn < 0 a前b后；a=b时存在浏览器兼容
				//     简化一下：a-b输出从小到大排序，b-a输出从大到小排序。
				// cc.log("userInfo.friendListData[1][headPicture]=="+userInfo.friendListData[1]["headPicture"]);

				if(self.friendLayer!=null){
					self.friendLayer.refreshFriendViewLayer();
				}

				break;

			}
			case "FRIENDCHANGE":
			{

				cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
				cc.log(userInfo.friendListData);

				var friendName = packet.content.split("#")[0];
				var status = packet.content.split("#")[1];
				for(var i=0;userInfo.friendListData!=null&&i<userInfo.friendListData.length;i++)
				{
					if(userInfo.friendListData[i]["friendname"]==friendName){
						userInfo.friendListData[i]["status"]=status;
					}
				}

				for(var i=0;userInfo.friendListData!=null&&i<userInfo.friendListData.length;i++)
				{
					if(userInfo.friendListData[i]["friendname"]==friendName){
						userInfo.friendListData[i]["status"]=status;
					}
				}

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
				cc.log(userInfo.friendListData);
				// cc.log("userInfo.friendListData[1][headPicture]=="+userInfo.friendListData[1]["headPicture"]);

				if(self.friendLayer!=null){
					self.friendLayer.refreshFriendViewLayer();
				}
				break;

			}
			case "INVITE":
			{
				cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
				inviteInfo.code = packet.content.split("#")[0];
				inviteInfo.friendName = packet.content.split("#")[1];
				inviteInfo.picUrl = packet.content.split("#")[2];
				userInfo.matchMode = MatchType.Type_Friend_Match;
				// var self = this;
				if(self.invitedViewLayer==null){
					self.invitedViewLayer=new InvitedViewLayer();
					self.invitedViewLayer.setVisible(false);
					self.invitedViewLayer.setPosition(0,0);
					self.otherMessageTipLayer.addChild(self.invitedViewLayer, 1,self.invitedViewLayer.getTag());
					self.invitedViewLayer.closeCallBackFunction=function(){self.popViewLayer_Close()};
				}

				self.invitedViewLayer.showLayer();
				self.pauseLowerLayer();

				// if(self.friendLayer!=null){
				//     self.friendLayer.refreshFriendViewLayer();
				// }
				break;

			}
			case "REJECT":
			{
				cc.log("messageCallBack.mainScene.packet.msgType="+packet.msgType+"=====");
				var name = packet.content.split("#")[0];

				if(self.friendLayer!=null){
					self.friendLayer.showMessageInfo(name+"拒绝了你的邀请！");
				}

				// if(self.friendLayer!=null){
				//     self.friendLayer.refreshFriendViewLayer();
				// }
				break;

			}

			case "FACE"://表情处理
			{
				//接收到对局结束
				//alert("接收到对局结束");
				// self.showMatchEndInfo(packet.content);
				var userNickName=packet.content.split("#")[0];
				var faceNum = packet.content.split("#")[1];
				cc.log("userNickName=="+userNickName+"||faceNum=="+faceNum);

				if(null!=self.matchInfoLayer){
					self.matchInfoLayer.showFaceSprite(userNickName,faceNum);
				}

				// userId:null,//
				// 	deviceId:null,//设备号
				// userInfo.username=gPlayerName;
				// userInfo.password=packet.content.split("#")[1];

				break;
			}
            case MessageType.Type_Face://表情处理
			{
				//接收到对局结束
				//alert("接收到对局结束");
				// // self.showMatchEndInfo(packet.content);
				// var userNickName=packet.content.split("#")[0];
				// var faceNum = packet.content.split("#")[1];
				var data = message.faceInfo;
				var userNickName=data.senderInfo["userName"];
				var faceNum = data.faceType+1;//匹配表情图
				cc.log("userNickName=="+userNickName+"||faceNum=="+faceNum);

				if(null!=self.matchInfoLayer){
					self.matchInfoLayer.showFaceSprite(userNickName,faceNum);
				}

				// userId:null,//
				// 	deviceId:null,//设备号
				// userInfo.username=gPlayerName;
				// userInfo.password=packet.content.split("#")[1];

				break;
			}
            case MessageType.Type_Tool://使用了道具信息处理
            {

				var toolInfo = message.toolInfo;
				var noticeInfo = toolInfo.broardcastInfo;//道具描述
				gKlineScene.barInfo.setString(noticeInfo);
				// gKlineScene.barInfo.setVisible(true);
				gKlineScene.barSprite.setVisible(true);
				pageTimer["hideBar"] = setTimeout(function(){gKlineScene.hideBarInfo();},5000);
               var toolType = toolInfo.toolType;
                // var faceNum = packet.content.split("#")[1];
                cc.log("TOOLTYPE=="+toolType);

				var senderFlag = toolInfo.senderInfo["userName"]==userInfo.nickName?true:false;
				gKlineScene.setCountDownInfo();
				switch(toolInfo.toolType){
					case ToolType.Tool_red2green:{//红绿颠倒
						gKlineScene.drawOppositeCandlePart(senderFlag);
						// gKlineScene.setCountDownInfo();
						break;
					}
					case ToolType.Tool_Cover:{//遮盖效果
						// gKlineScene.setCountDownInfo();
						gKlineScene.drawCoverCandlePart(senderFlag);
						break;
					}
					case ToolType.Tool_Ban_keyboard:{//禁止买卖操作
						gKlineScene.drawBanCandlePart(senderFlag);
						break;
					}
					default:{//其它无效信息
						cc.log("TOOLTYPE messageCallBack..default TOOL NAME."+toolType);
						break;
					}

				}
				cc.log("KlineScene messageCallBack..TOOL NAME."+message);


                // userId:null,//
                // 	deviceId:null,//设备号
                // userInfo.username=gPlayerName;
                // userInfo.password=packet.content.split("#")[1];

                break;
            }
			case "TOOL"://被使用了道具信息处理
			{
				//接收到对局结束
				//alert("接收到对局结束");
				// self.showMatchEndInfo(packet.content);
				var toolType = packet.content;
				// var faceNum = packet.content.split("#")[1];
				cc.log("TOOLTYPE=="+toolType);

				gKlineScene.setCountDownInfo();
				switch(toolType){
					case "red2green":{//红绿颠倒
						gKlineScene.drawOppositeCandlePart();
						// gKlineScene.setCountDownInfo();
						break;
					}
					case "cover":{//遮盖效果
						// gKlineScene.setCountDownInfo();
						gKlineScene.drawCoverCandlePart();
						break;
					}
					case "ban":{//禁止买卖操作
						gKlineScene.drawBanCandlePart();
						break;
					}
					default:{//其它无效信息
						cc.log("TOOLTYPE messageCallBack..default TOOL NAME."+toolType);
						break;
					}

				}
				cc.log("KlineScene messageCallBack..TOOL NAME."+message);


				// userId:null,//
				// 	deviceId:null,//设备号
				// userInfo.username=gPlayerName;
				// userInfo.password=packet.content.split("#")[1];

				break;
			}

				// TNOTICE|坎坎坷坷6xcvd对5566使用了道具“键盘损坏”|
			case "TNOTICE":
			{
				var noticeInfo = packet.content;
				gKlineScene.barInfo.setString(noticeInfo);
				// gKlineScene.barInfo.setVisible(true);
				gKlineScene.barSprite.setVisible(true);
				pageTimer["hideBar"] = setTimeout(function(){gKlineScene.hideBarInfo();},5000);
				break;
			}
			case "WARN":
			{
				var warnInfo = packet.content;
				gKlineScene.warnInfo.setString(warnInfo);
				gKlineScene.warnInfo.setVisible(true);
				pageTimer["WARN"] = setTimeout(function(){gKlineScene.warnInfo.setVisible(false);},5000);
				break;
			}
			case "LISTFRIEND":
			{

				userInfo.friendListData = [];
				userInfo.friendListData  = packet.content;
				cc.log(userInfo.friendListData);
				cc.log("userInfo.friendListData[1]"+userInfo.friendListData[1]["friendname"]);


				break;
			}
			case "":
			{
				break;
			}

			default:
			{
				cc.log("KlineScene messageCallBack..."+message);
				break;
			}
		}
	},

	hideBarInfo:function () {
		// gKlineScene.barInfo.setVisible(false);
		gKlineScene.barSprite.setVisible(false);
	},

	showMatchEndInfo:function(content)
	{
		cc.log("showMatchEndInfo  visible = true");
		var self=this;
		
		this.matchEndInfoLayer.applyParamsFromContent(content);
		//content的内容为:   总用户个数(假设为2)#用户名A#收益率A#得分A#用户名B#收益率B#得分B#品种名字#起始日期#终止日期
		this.matchEndInfoLayer.againCallBackFunction=function(){self.matchEndInfoLayer_Again()};
		this.matchEndInfoLayer.replayCallBackFunction=function(){self.matchEndInfoLayer_Replay()};
		this.matchEndInfoLayer.shareCallBackFunction=function(){self.matchEndInfoLayer_Share()};
		this.matchEndInfoLayer.showLayer();
		this.pauseLowerLayer();
	},
	showMatchEndPbInfo:function(endMatchInfo)
	{
		cc.log("showMatchEndInfo  visible = true");
		var self=this;

		this.matchEndInfoLayer.applyParamsFromPb(endMatchInfo);
		//content的内容为:   总用户个数(假设为2)#用户名A#收益率A#得分A#用户名B#收益率B#得分B#品种名字#起始日期#终止日期
		this.matchEndInfoLayer.againCallBackFunction=function(){self.matchEndInfoLayer_Again()};
		this.matchEndInfoLayer.replayCallBackFunction=function(){self.matchEndInfoLayer_Replay()};
		this.matchEndInfoLayer.shareCallBackFunction=function(){self.matchEndInfoLayer_Share()};
		this.matchEndInfoLayer.showLayer();
		this.pauseLowerLayer();
	},
	showPlayerInfo:function(content)
	{
		cc.log("showPlayerInfo  begin to parse json text");
		var data=JSON.parse(content);
		cc.log("showPlayerInfo jsonText parse over");
		var playerListData=data["playerList"];
		userInfo.playerListData=[];
		for(var i=0;playerListData!=null&&i<playerListData.length;i++)
		{
			var playerData=playerListData[i];
			cc.log("showPlayerInfo playerData.userName="+playerData["userName"]);
			userInfo.playerListData.push(playerData);
		}

		//把该用户信息排在第一位
		for(var i=userInfo.playerListData.length-1;i>0;i--)
		{
			for(var j=i;j>0;j--)
			{
				if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
				{
					var temp = userInfo.playerListData[j];
					userInfo.playerListData[j] =userInfo.playerListData[j-1];
					userInfo.playerListData[j-1] =temp;
				}
			}
		}
		cc.log("showPlayerInfo  this.playerInfoLayer.refreshScoresByData();");
		this.playerInfoLayer.refreshScoresByData();

		var indexFromServe = userInfo.playerListData[0]["index"];
		if(indexFromServe>this.currentCandleIndex-120){

			this.drawHistoryCandlePartToIndex(120+indexFromServe);
		}
		this.drawCandleStoped=false;
	},
	showPlayerInfoPb:function(score)
	{
		cc.log("showPlayerInfoPb  begin to parse json text");
		/*message MatchUserInfo{

		 required string userName=1;
		 required double score=2;
		 optional int32 ranking=3;
		 required string headPicture=4;
		 repeated int32 operationIndex=5;
		 }*/
		 var playerListData=score["playerInfo"];
		userInfo.playerListData=[];
		for(var i=0;playerListData!=null&&i<playerListData.length;i++)
		{
			var playerData=playerListData[i];
			cc.log("showPlayerInfo playerData.userName="+playerData["userName"]);
			userInfo.playerListData.push(playerData);
		}

		//把该用户信息排在第一位
		for(var i=userInfo.playerListData.length-1;i>0;i--)
		{
			for(var j=i;j>0;j--)
			{
				if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
				{
					var temp = userInfo.playerListData[j];
					userInfo.playerListData[j] =userInfo.playerListData[j-1];
					userInfo.playerListData[j-1] =temp;
				}
			}
		}
		cc.log("showPlayerInfo  this.playerInfoLayer.refreshScoresByData();");
		this.playerInfoLayer.refreshScoresByData();

		var indexFromServe = userInfo.playerListData[0]["currentIndex"];//加一修正
		if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			this.drawHistoryCandlePartToIndex(indexFromServe+1);
		}else if(indexFromServe>this.currentCandleIndex-121){
			this.drawHistoryCandlePartToIndex(121+indexFromServe);
		}
		this.drawCandleStoped=false;
	},
	matchEndInfoLayer_Replay:function()
	{
		if(gMainMenuScene!=null)
		{
			this.toHome();
		}else{
			//复盘
			this.matchEndInfoLayer.hideLayer();
			this.resumeLowerLayer();

			if(this.btnHome!=null)//显示返回
			{
				this.btnHome.setVisible(true);
			}
			//关闭后显示下方的按钮
			this.beginReplayKLineScene();
		}

	},
	
	matchEndInfoLayer_Again:function()
	{
		this.matchEndInfoLayer.hideLayer();
		this.resumeLowerLayer();
		// gSocketConn.UnRegisterEvent("onmessage",this.messageCallBack);
		//再开始一盘再来一局

		this.beginNextKLineScene();
	},
	
	matchEndInfoLayer_Share:function()
	{
		//分享

		var content ="";
		if(userInfo.score<100)
		{
			content = "取得收益"+userInfo.score+"%25%0a不服点我"
		}
		else
		{
			content = "取得收益"+userInfo.score+"%25%0a世界上不超过10人玩到100%25"
		}
		//分享函数
		var url = "share.html?"+"tittle=share&userName="+userInfo.nickName+"&matchId="+userInfo.matchId+"&head="+"趋势突击&subtitle="+content+"subtitleEnd";
		//share.html?userId=167&matchId=150
//		var url = "WebSocketClient.html?"+"userId="+userId+"&matchId="+matchId;取得收益
		cc.log(url);
//		gSocketConn.ShareMessage(userID,matchID);
//
		window.open(url);
		// window.location.href=url;
		
	},

    matchInfoLayer_Start:function()
    {
        var url = "index.html?"+"source=SWEB";
        cc.log(url);

        window.open(url);
        //window.location.href=url;
    },

	share:function(content)
	{
		// window.location.href="myapp:myfunction:share";//"javascript:gotoshare()"; 
		var fields=content.split("#");
		var len=fields.length;
		var userId = fields[0];
		var matchId = fields[1];
		var score = fields[2];
		var text = "";
		if(score<100)
		{
			content = "取得收益"+score+"%25%0a不服点我"
		}
		else
		{
			content = "取得收益"+score+"%25%0a世界上不超过10人玩到100%25"
		}
		
		
		var url = "share.html?"+"tittle=share&userId="+userId+"&matchId="+matchId+"&head="+"趋势突击&subtitle="+content+"subtitleEnd";
		//share.html?userId=167&matchId=150
//		var url = "WebSocketClient.html?"+"userId="+userId+"&matchId="+matchId;取得收益
		cc.log(url);
//		gSocketConn.ShareMessage(userID,matchID);
//		
// 		window.open(url);
		window.location.href=url;
	},

	beginReplayKLineScene:function()
	{
		cc.log("beginReplayKLineScene  visible = true");
		var self=this;
		if(self.matchInfoLayer!=null)
		{
			self.matchInfoLayer.disableAllButtons();
			self.matchInfoLayer.setReplayKLineScene();
		}
		if(self.matchInfoLayer!=null)
		{
			self.matchInfoLayer.disableAllButtons();
			self.matchInfoLayer.setReplayKLineScene();
		}
		//self.matchEndInfoLayer.applyParamsFromContent(content);
		//content的内容为:   总用户个数(假设为2)#用户名A#收益率A#得分A#用户名B#收益率B#得分B#品种名字#起始日期#终止日期
		self.matchInfoLayer.againCallBackFunction=function(){self.matchEndInfoLayer_Again()};
		self.matchInfoLayer.shareCallBackFunction=function(){self.matchEndInfoLayer_Share()};
		
		
	},

	beginNextKLineScene:function()
	{
//再开始一盘再来一局
// 		cc.log("klineSceneNext begin");
// 		// cc.director.runScene(gKlineScene);
// 		var matchInfoMessage =userInfo.matchMode+"#"+userInfo.matchAiMode+"#"+userInfo.matchDayCount;
// 		cc.log(" beginMatch:function() begin matchInfoMessage="+matchInfoMessage);
//
//
// 		if(gKlineScene.matchViewLayer==null){
// 			gKlineScene.matchViewLayer=new MatchViewLayer();
// 			gKlineScene.matchViewLayer.setVisible(false);
// 			gKlineScene.matchViewLayer.setPosition(0,0);
// 			gKlineScene.otherMessageTipLayer.addChild(gKlineScene.matchViewLayer, 1,gKlineScene.matchViewLayer.getTag());
// 			gKlineScene.matchViewLayer.closeCallBackFunction=function(){gKlineScene.matchViewLayer_Close()};
// 			// this.controlViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
// 		}
// 		gKlineScene.matchViewLayer.refreshMatchViewLayer();
// 		gKlineScene.matchViewLayer.showLayer();
// 		gKlineScene.pauseLowerLayer();// klineSceneNext.showProgress();

        cc.log("klineSceneNext begin");



        // cc.director.runScene(gKlineScene);
        var matchInfoMessage =userInfo.matchMode+"#"+userInfo.matchAiMode+"#"+userInfo.matchDayCount;
        cc.log(" beginMatch:function() begin matchInfoMessage="+matchInfoMessage);
        var klineSceneNext=new KLineScene();
        var self=this;
        klineSceneNext.onEnteredFunction=function(){
            cc.log("klineSceneNext onEnteredFunction end");
			if(userInfo.matchMode==MatchType.Type_Friend_Match){
				gSocketConn.BeginMatch("4");
				gSocketConn.getFriendList();
				if(gKlineScene.friendLayer==null){
					gKlineScene.friendLayer=new FriendViewLayer();
					gKlineScene.friendLayer.setVisible(false);
					gKlineScene.friendLayer.setAnchorPoint(0,0);
					gKlineScene.friendLayer.setPosition(0,0);
					gKlineScene.otherMessageTipLayer.addChild(gKlineScene.friendLayer, 1,gKlineScene.friendLayer.getTag());
					gKlineScene.friendLayer.closeCallBackFunction=function(){gKlineScene.popViewLayer_Close()};
				}

				// LISTFRIEND||
				gKlineScene.friendLayer.showLayer();
				gKlineScene.friendLayer.refreshFriendViewLayer();

			}else if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
                if(gKlineScene.preMatchView==null){
                    gKlineScene.preMatchView=new preMatchView();
                    gKlineScene.preMatchView.setVisible(false);
                    gKlineScene.preMatchView.setPosition(0,0);
                    gKlineScene.otherMessageTipLayer.addChild(this.preMatchView, 1,this.preMatchView.getTag());
                    gKlineScene.preMatchView.closeCallBackFunction=function(){self.popViewLayer_Close()};
                }
                gKlineScene.preMatchView.showLayer();
            }else{
				if(gKlineScene.matchViewLayer==null){
					gKlineScene.matchViewLayer=new MatchViewLayer();
					gKlineScene.matchViewLayer.setVisible(false);
					gKlineScene.matchViewLayer.setPosition(0,0);
					gKlineScene.otherMessageTipLayer.addChild(gKlineScene.matchViewLayer, 1,gKlineScene.matchViewLayer.getTag());
					gKlineScene.matchViewLayer.closeCallBackFunction=function(){gKlineScene.popViewLayer_Close()};
					// this.controlViewLayer.replayCallBackFunction=function(){self.MatchEndInfoLayer_Replay()};
				}
				gKlineScene.matchViewLayer.refreshMatchViewLayer();
				gKlineScene.matchViewLayer.showLayer();
			}

            gKlineScene.pauseLowerLayer();// klineSceneNext.showProgress();
        };
        cc.log("klineSceneNext middle");
        //不能放到onEnteredFunction里面
        gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
        cc.director.runScene(klineSceneNext);



		// switch(userInfo.matchMode)
		// {
		// 	case 0:
		// 	{
		// 		this.showProgress();
        //
		// 		gSocketConn.BeginMatch(matchInfoMessage);
		// 		break;
		// 	}
		// 	case 1:
		// 	{
		// 		// this.KlineWidth = 700;
		// 		// this.KlinePosX = 60;
		// 		this.showProgress();
		// 		gSocketConn.BeginMatch(1);
		// 		break;
		// 	}
		// 	case 2:
		// 	{
		// 		this.showProgress();
		// 		gSocketConn.BeginMatch(matchInfoMessage);
		// 		break;
		// 	}
		// 	case 3:
		// 	{
		// 		break;
		// 	}
		// 	default:
		// 	{
		// 		cc.log("userInfo.matchMode ="+userInfo.matchMode);
		// 		break;
		// 	}
		// }
		cc.log("klineSceneNext end");

		// gKlineScene.stopProgress();
		// gSocketConn.BeginMatch(userInfo.matchMode);
	},
	
	///获取K线数据
	getklinedata:function(jsonText)
	{
		cc.log("begin to parse json text");
		if(jsonText!=""||jsonText==null){
			var data=JSON.parse(jsonText);
			cc.log("jsonText parse over");
			this.toSetklinedata(data);
		}else{
			cc.log("begin to parse json text="+jsonText+"|");
		}
		// this.ongotklinedata(data);
	},
	// ///获取K线数据
	// getklinedata:function(jsonText)
	// {
	// 	cc.log("begin to parse json text");
	// 	var data=JSON.parse(jsonText);
	// 	cc.log("jsonText parse over");
	// 	this.ongotklinedata(data);
	// },

	toSetklinedata:function(data)
	{
		//{"dataBusiness":[108,-113],"score":4.22374,"nickName":"誓约者艾琳诺","matchId":7571,"playerList":
		// this.clearDataForLineLayer();
		var businessData=data["dataBusiness"];
		cc.log("dataBusiness="+businessData);
		this.buyInfo=[];
		for(var i=0;businessData!=undefined&&i<businessData.length;i++)
		{
			this.buyInfo.push(businessData[i]);
		}
		if(data["score"]!=undefined)
		{
			this.buyScore=data["score"];
		}
		if(data["nickName"]!=undefined)
		{
			userInfo.nickName=data["nickName"];
		}
        if(data["headPicture"]!=undefined)
        {
            userInfo.headSprite=data["headPicture"];
        }
		if(data["matchId"]!=undefined)
		{
			userInfo.matchId=data["matchId"];
		}
		var dailyData=data["data"];
		this.mainDataDayCount=data["count"][0];
		this.prevDataDayCount=data["count"][1];
		//"count":[120,240]},playerList:[{"userName":"","score":"0.000"},{"userName":"唐齐安通道","score":"0.000"}]
		cc.log("toSetklinedata mainDataDayCount="+this.mainDataDayCount+" prevDataDayCount="+this.prevDataDayCount);
		var playerListData=data["playerList"];
		userInfo.playerListData=[];
		for(var i=0;playerListData!=undefined&&i<playerListData.length;i++)
		{
			var playerData=playerListData[i];
			cc.log("playerData.userName="+playerData["userName"]);
			userInfo.playerListData.push(playerData);
			//this.MatchListData.push({matchId:matchData["matchId"],matchTime:matchData["matchId"],playerNum:matchData["matchId"],score:matchData["matchId"],uid:matchData["matchId"]});
		}
		//把该用户信息排在第一位
		for(var i=userInfo.playerListData.length-1;i>0;i--)
		{
			for(var j=i;j>0;j--)
			{
				cc.log("playerData.userName="+userInfo.playerListData[j]["userName"]+"userInfo.nickName"+userInfo.nickName);
				if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
				{
					var temp = userInfo.playerListData[j];
					userInfo.playerListData[j] =userInfo.playerListData[j-1];
					userInfo.playerListData[j-1] =temp;
				}
			}
		}

		gKlineScene.klineData=[];
		for(var i=0;i<this.prevDataDayCount+this.mainDataDayCount;i++)
		{
			gKlineScene.klineData.push({o:dailyData[5*i],x:dailyData[5*i+1],i:dailyData[5*i+2],c:dailyData[5*i+3],v:dailyData[5*i+4]});
		}

		gKlineScene.klinedataMain=[];
		for(var i=this.prevDataDayCount;i<this.prevDataDayCount+this.mainDataDayCount;i++)
		{
			gKlineScene.klinedataMain.push({o:dailyData[5*i],x:dailyData[5*i+1],i:dailyData[5*i+2],c:dailyData[5*i+3],v:dailyData[5*i+4]});
		}

		gKlineScene.prevKlineData=[];
		for(var i=0;i<this.prevDataDayCount;i++)
		{
			gKlineScene.prevKlineData.push({o:dailyData[5*i],x:dailyData[5*i+1],i:dailyData[5*i+2],c:dailyData[5*i+3],v:dailyData[5*i+4]});
		}
		gKlineScene.setPlayerInfo();

	},
	setklinePbdata:function(data)
	{
		var self=this;
		self.mainDataDayCount=data["handleDay"];
		userInfo.matchMode = data["matchType"];

		self.klineData=[];
		// var dailyData=data["data"];
		var klinePbData=data["oneDayInfo"];
		var dayInfolengths = klinePbData.length;

		self.prevDataDayCount=dayInfolengths-self.mainDataDayCount;
		self.klineData=[];
		for(var i=0;i<dayInfolengths;i++)
		{
			var dailyData = klinePbData[i];
			self.klineData.push({avg:dailyData["avg"],o:dailyData["open"],x:dailyData["max"],i:dailyData["min"],c:dailyData["close"],v:dailyData["vol"]});
		}
		self.klineFiveData=[];
		for(var i=0;i<dayInfolengths/5;i++)
		{
			var min = self.klineData[5*i].i;
			var max = self.klineData[5*i].x;
			var vol=self.klineData[5*i].v;
			for(var j=1;j<5;j++){
				min = min<this.klineData[5*i+j].i?min:this.klineData[5*i+j].i;
				max = max>this.klineData[5*i+j].x?max:this.klineData[5*i+j].x;
				vol += this.klineData[5*i+j].v;
			}
			self.klineFiveData.push({avg:self.klineData[5*i].avg,o:self.klineData[5*i].o,x:max,i:min,c:self.klineData[5*i+4].c,v:vol});
		}

		cc.log(self.klineFiveData);
		self.klinedataMain=[];
		for(var i=self.prevDataDayCount;i<dayInfolengths;i++)
		{
			var dailyData = klinePbData[i];
			self.klinedataMain.push({avg:dailyData["avg"],o:dailyData["open"],x:dailyData["max"],i:dailyData["min"],c:dailyData["close"],v:dailyData["vol"]});
		}

		self.prevKlineData=[];
		for(var i=0;i<self.prevDataDayCount;i++)
		{
			var dailyData = klinePbData[i];
			self.prevKlineData.push({avg:dailyData["avg"],o:dailyData["open"],x:dailyData["max"],i:dailyData["min"],c:dailyData["close"],v:dailyData["vol"]});
		}
		cc.log("setklinePbdata mainDataDayCount="+this.mainDataDayCount+" prevDataDayCount="+this.prevDataDayCount);
		var playerListData=data["playerInfo"];
		userInfo.playerListData=[];
		for(var i=0;playerListData!=undefined&&i<playerListData.length;i++)
		{
			var playerData=playerListData[i];
			cc.log("playerData.userName="+playerData["userName"]);
			userInfo.playerListData.push(playerData);
			//this.MatchListData.push({matchId:matchData["matchId"],matchTime:matchData["matchId"],playerNum:matchData["matchId"],score:matchData["matchId"],uid:matchData["matchId"]});
		}
		//把该用户信息排在第一位
		for(var i=userInfo.playerListData.length-1;i>0;i--)
		{
			for(var j=i;j>0;j--)
			{
				cc.log("playerData.userName="+userInfo.playerListData[j]["userName"]+"userInfo.nickName"+userInfo.nickName);
				if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
				{
					var temp = userInfo.playerListData[j];
					userInfo.playerListData[j] =userInfo.playerListData[j-1];
					userInfo.playerListData[j-1] =temp;
				}
			}
		}

		if(userInfo.playerListData!=null){
			this.buyInfo=userInfo.playerListData[0]["operationIndex"];
			userInfo.headSprite = userInfo.playerListData[0]["headPicture"];
		}

		if(userInfo.matchMode==MatchType.Type_Practice_Match&&userInfo.playerListData!=null&&userInfo.playerListData.length>1){
			userInfo.matchMode=MatchType.Type_PlainMultiplayer_Match;
		}
		if(data["score"]!=null){
			this.buyScore=data["score"];
		}

		self.setPlayerInfo();

	},

	clearBuySellOperation:function()
	{
		this.selfOperations=[];
		this.opponentOperations=[];

		if(null!=this.klineLayerMain){
			this.klineLayerMain.clearUpDownArrows();
		}
		if(null!=this.klineLayerPrev){
			this.klineLayerPrev.clearUpDownArrows();
		}

	},
	
	//清除最上面的玩家信息
	clearPlayerInfo:function()
	{
		this.playerInfoLayer.clear();
	},

	setDisableAllButtons:function()
	{
		if(this.matchInfoLayer!=null)
		{
			this.matchInfoLayer.disableAllButtons();
		}
		if(this.btnStart!=null)
		{
			this.btnStart.setVisible(false);
		}
		// if(this.btnHome!=null)
		// {
		// 	this.btnHome.setVisible(false);
		// }
		this.hidematchEndInfoLayer();
	},

	//清除K线图的所有数据
	clearDataForLineLayer:function()
	{
		if(this.klinedataMain==null || this.prevKlineData==null) return;

		//K线部分清空
		if(this.klineLayerMain.graphArea!=null){
			this.klineLayerMain.graphArea.clear();
		}
		if(this.volumnTechLayerMain.graphArea!=null){
			this.volumnTechLayerMain.graphArea.clear();
		}
		this.clearBuySellOperation();



		////////////////////////倒计时信息重置////////////////////////////////
		if(this.countDownSprite!=null)
		{
			this.countDownSprite.removeFromParent(false);
			this.countDownSprite=null;
			this.countDownNumber=2;
		}
		if(this.countBeginSprite!=null)
		{
			this.countBeginSprite.removeFromParent(false);
			this.countBeginSprite=null;
			this.countBeginNumber=3;
		}
		if(this.countDownInfo!=null)
		{
			this.countDownInfo.removeFromParent(false);
			this.countDownInfo=null;
			this.countDownTimeInfo.removeFromParent(false);
			this.countDownTimeInfo=null;
			this.countDownTime=5;
		}
		if(this.playerInfoLayer!=null)
		{
			cc.log("clearDataForLineLayer  this.playerInfoLayer.refreshScoresByData();");
			this.playerInfoLayer.refreshScoresByData();
		}
		//按钮信息重置
		this.setDisableAllButtons();
	},

	setDataForLlineLayerTest:function()//比赛图测试
	{
		if(this.klinedataMain==null || this.prevKlineData==null) return;
		this.stopProgress();
		this.phase2=true;
		this.setPlayerInfo();
		this.setDisableAllButtons();

		cc.log("setDataForLlineLayerTest:function()//比赛图 end");
		if(userInfo.matchMode!= MatchType.Type_DailyTrade_Match){
			this.mainLayerAnction();
		}


		// //清除最大值最小值
		// this.klineLayerMain.calculateMaxMinBetweenIndex(this.currentCandleIndex);
		// this.volumnTechLayerMain.calculateMaxMinBetweenIndex(this.currentCandleIndex);
		// this.klineLayerMain.clearMaxAndMinValue();
		// this.volumnTechLayerMain.clearMaxAndMinValue();
		// this.klineLayerMain.calculateMaxMinBetweenIndex(this.currentCandleIndex-10,this.currentCandleIndex);
		// this.volumnTechLayerMain.calculateMaxMinBetweenIndex(this.currentCandleIndex-10,this.currentCandleIndex);
        //依次画后面的K线
		this.setCountBeginSprite();
		// this.drawAllCandlesOneByOne();
	},
    drawCandlesOneByOneForMatch:function()//匹配赛
    {
		var self=this;
		cc.log("drawCandlesOneByOneForMatch this.currentCandleIndex="+this.currentCandleIndex);
        if(this.drawCandleStoped==false)
        {
            this.drawCandleStoped=true;
            // this.refreshScores(this.currentCandleIndex);
            var ended=this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
            this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);

			this.matchRunFlag=true;
            if(ended)
            {
                cc.log("//匹配赛绘制结束");
				this.matchRunFlag=false;
                this.sendEndMessage();
                this.matchEnd();
				// clearTimeout(pageTimer["drawTimerMatch"]);
                return;
            }
            // else
            // {
            //     gSocketConn.Step(this.currentCandleIndex);
            // }

            this.currentCandleIndex+=1;
        }

		// pageTimer["drawMatchTimer"] = setTimeout(function(){self.drawCandlesOneByOneForMatch();},100);
        pageTimer["drawTimerMatch"] = setTimeout(function(){self.drawCandlesOneByOneForMatch();},self.currentCandleDrawInterval);
    },

    drawCandlesOneByOne:function()
    {
        if(this.drawCandleStoped==false)
        {
            // this.drawCandleStoped=true;
			if(userInfo.matchMode==MatchType.Type_Practice_Match||userInfo.matchMode==MatchType.Type_DailyTrade_Match){
				this.refreshScores(this.currentCandleIndex);
			}
            
            var ended=this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
            this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);

			this.matchRunFlag=true;
            if(ended)
            {
                cc.log("绘制结束");
				this.matchRunFlag=false;
                this.sendEndMessage();
                this.matchEnd();
				// clearTimeout(pageTimer["drawTimer"]);
                return;
            }
            else
            {
                gSocketConn.Step(this.currentCandleIndex);
            }

            this.currentCandleIndex+=1;
        }
        var self=this;
        pageTimer["drawTimer"] = setTimeout(function(){self.drawCandlesOneByOne();},this.currentCandleDrawInterval);
    },
	drawAllCandlesOneByOne:function()
	{
		cc.log("drawAllCandlesOneByOne currentIndex before=="+this.currentCandleIndex);
		var self=this;
		// if(this.drawCandleStoped==false&&userInfo.matchMode!=MatchType.Type_DailyTrade_Match)
		if(this.drawCandleStoped==false)
		{

			// this.drawCandleStoped=true;
			if(userInfo.matchMode==MatchType.Type_Practice_Match||userInfo.matchMode==MatchType.Type_DailyTrade_Match){
				this.refreshScores(this.currentCandleIndex);
			}

			if(userInfo.matchMode!=MatchType.Type_DailyTrade_Match&&(this.currentCandleIndex==241||this.currentCandleIndex==301))
			{
				cc.log("drawAllCandlesOneByOne绘制120");
			 	this.moveByPos();
			}

			// if(this.currentCandleIndex>240)
			// {
			// 	cc.log("drawAllCandlesOneByOne绘制120");
			// 	this.moveByOnePos();
			// }

			//var curentIndex = this.currentCandleIndex+120;
			var ended = false;
			if(null!=this.klineLayerMain&&this.klineLayerMain.isVisible()){
				ended=this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			}
			if(null!=this.klineView&&this.klineView.isVisible()){
				ended=this.klineView.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			}

			this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			cc.log("drawAllCandlesOneByOne currentIndex=="+this.currentCandleIndex);
			this.matchRunFlag=true;
			if(ended)
			{
				cc.log("绘制结束");
				this.matchRunFlag=false;
				this.sendEndMessage();
				this.matchEnd();
				// clearTimeout(pageTimer["drawTimer"]);
				return;
			}
			else
			{
				if(userInfo.matchMode==MatchType.Type_PlainMultiplayer_Match||userInfo.matchMode==MatchType.Type_Tool_Match||userInfo.matchMode==MatchType.Type_Friend_Match){//多人赛同步处理Type_PlainMultiplayer_Match
					this.drawCandleStoped=true;
				}else if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
                    gSocketConn.Step(this.currentCandleIndex);
                }else if(this.currentCandleIndex-120>-1){
                    gSocketConn.Step(this.currentCandleIndex-120);
                }
			}
			cc.log("比赛进度currentIndex =="+this.currentCandleIndex);
			this.currentCandleIndex++;
		}
		cc.log("drawAllCandlesOneByOne currentIndex after=="+this.currentCandleIndex);
		pageTimer["drawTimer"] = setTimeout(function(){self.drawAllCandlesOneByOne();},this.currentCandleDrawInterval);
	},

	setDataForLlineLayer:function()//比赛图
	{
		if(this.klinedataMain==null || this.prevKlineData==null) return;
        var self = this;
		this.stopProgress();
		this.phase2=false;
        // //  //设置K线图的区域
        var kWidth = this.KlineWidth*2-10;
        if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
            kWidth = this.KlineWidth-5;
        }

        this.klineLayerMain=new KlineLayer(kWidth,192);

        this.volumnTechLayerMain=new VolumnTechLayer(kWidth,94);
        this.volumnTechLayerMain.setClickEvent(function(){self.changeTechLayer();});
        this.klineLayerMain.setPosition(cc.p(this.KlinePosX,170));
        this.volumnTechLayerMain.setPosition(cc.p(this.KlinePosX,75));
        this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
        this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
        if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
            this.klineLayerMain.lineType=1;
            this.klineLayerMain.addNewTais(new TaisMa([1],0));
        }else {
            this.klineLayerMain.addNewTais(new TaisMa([10,20,30],0));
        }

        this.volumnTechLayerMain.addNewTais(new TaisMa([5,10],1));
        var macdTais1=new TaisMacd(12,26,9);
        macdTais1.isEnabled=false;
        this.volumnTechLayerMain.addNewTais(macdTais1);

		//先显示前面120一副蜡烛图（历史数据）
		if(null!=this.klineLayerMain){
			this.klineLayerMain.setKLineData(gKlineScene.klineData);
		}
		if(null!=this.volumnTechLayerMain){
			this.volumnTechLayerMain.setKLineData(gKlineScene.klineData);
		}

		if(null!=this.klineLayerMain && null!=this.volumnTechLayerMain){
			if(this.klineLayerMain.graphArea!=null){
				this.klineLayerMain.graphArea.clear();
			}
			if(this.volumnTechLayerMain.graphArea!=null){
				this.volumnTechLayerMain.graphArea.clear();
			}
			this.drawHistoryCandlePart2();
			this.klineLayerMain.setPosition(cc.p(this.KlinePosX,170));
			this.volumnTechLayerMain.setPosition(cc.p(this.KlinePosX,75));
		}


		if(this.playerInfoLayer!=null)
		{
			cc.log("setDataForLlineLayer  this.playerInfoLayer.refreshScoresByData();");
			this.playerInfoLayer.refreshScoresByData();
		}

		if(userInfo.matchMode==2||userInfo.matchMode==3||userInfo.matchMode==4){
			if(gKlineScene!=null)
			{
				// gSocketConn.SendBeginMessage();
				gKlineScene.setCountDownSprite();
			}
		}else {
			if(this.btnStart!=null)
			{
				this.btnStart.setVisible(true);
			}
		}
        // this.setPlayerInfo();
		//this.setCountDownSprite();
	},
	//SHARE_TEST
	setDataForLlineLayerShare:function()
	{
		if(this.klinedataMain==null || this.prevKlineData==null) return;
		
		this.phase2=false;
		// this.klineLayerPrev.drawAllCandlesTillIndexOrEnd();
		// this.volumnTechLayerPrev.drawAllCandlesTillIndexOrEnd();
		cc.log("drawAllCandlesTillIndexOrEnd Over....");

		this.advanceToMainKLine_Share();
	},

	//设置游戏倒计时
	setCountDownSprite:function()
	{
        // if(this.btnHome!=null)
        // {
        //     this.btnHome.setVisible(false);
        // }
        // this.prevLayerAnction();

		// this.mainLayerAnction();
		// this.matchRunFlag=true;
		if(this.btnStart!=null)
		{
			this.btnStart.setVisible(false);
		}
		if(this.matchInfoLayer!=null)
		{
			this.matchInfoLayer.disableAllButtons();
		}
		if(this.countDownNumber==0 && this.countDownSprite!=null)
		{
			this.countDownSprite.setVisible(false);
			this.setDataForLlineLayerTest();
			// this.advanceToMainKLine_PhaseMatch();
			clearTimeout(pageTimer["beginDownTimer"]);
			return;
		}

		if(this.countDownSprite==null)
		{
			this.countDownNumber=2;
			this.countDownSprite= cc.Sprite.create(res.BEGIN_INFO_png);
			// this.countDownSprite= new cc.LabelTTF.create("马上开始","Arial",40);
			gKlineScene.addChild(this.countDownSprite,8);
			var posCenter = cc.p(gDesignResolutionWidth / 2, gDesignResolutionHeight / 2+20);
			this.countDownSprite.setVisible(true);
			this.countDownSprite.setScale(0.5);
			this.countDownSprite.setPosition(posCenter);
			this.countDownSprite.setOpacity(0);
			// this.countDownSprite.setColor(GreenColor);
			var actFade = this.createAnimation_ACT0();
			this.countDownSprite.runAction(actFade);
			// var jumpto = cc.jumpTo(1,posCenter,20,3);
		}

		// if(this.countDownSprite==null)
		// {
		// 	this.countDownNumber=2;
		// 	//this.countDownSprite= cc.Sprite.create("res/cd_5.png");
		// 	this.countDownSprite= cc.LabelTTF.create("马上开始","Arial",40);
		// 	this.addChild(this.countDownSprite,8);
		// }
		// var posCenter = cc.p(gDesignResolutionWidth / 2, gDesignResolutionHeight / 2);
		// this.countDownSprite.setVisible(true);
		// this.countDownSprite.setPosition(posCenter);
		// this.countDownSprite.setOpacity(0);
		// this.countDownSprite.setColor(GreenColor);
		// this.countDownSprite.setString("马上开始");

		// var jumpto = cc.jumpTo(1,posCenter,20,3);
		// var actFade = this.createAnimation_ACT0();
		// this.countDownSprite.runAction(actFade);

		this.countDownNumber-=1;
		var self=this;
		pageTimer["beginDownTimer"] = setTimeout(function(){self.setCountDownSprite();},1000);
	},

	//设置游戏倒计时开始游戏
	setCountBeginSprite:function()
	{


		if(this.countBeginSprite==null)
		{
			this.countBeginNumber=3;
			//this.countDownSprite= cc.Sprite.create("res/cd_5.png");
			this.countBeginSprite= cc.LabelTTF.create(this.countBeginNumber,"Arial",100);
			this.countBeginSprite.setPosition(this.size.width / 2, this.size.height / 2+25);
			this.countBeginSprite.setOpacity(255);
			this.addChild(this.countBeginSprite,8);
		}
		cc.log("begin this.countBeginNumber==",this.countBeginNumber);
		if(this.countBeginNumber==0 && this.countDownSprite!=null)
		{
			this.countBeginSprite.setVisible(false);
			if(this.matchInfoLayer!=null)
			{
				this.matchInfoLayer.disableAllButtons();
				this.matchInfoLayer.setButtonsToNoPosition();
				cc.log("begin userInfo.matchMode==",userInfo.matchMode);

			}
			gSocketConn.SendBeginMessage();//画线前请求比赛
			if(this.matchInfoLayer!=null&&userInfo.matchMode==MatchType.Type_DailyTrade_Match)
			{
				if(null!=this.matchInfoLayer.dailyControlLayer){
					this.matchInfoLayer.dailyControlLayer.setVisible(true);
				}

			}
			//依次画后面的K线
			this.drawAllCandlesOneByOne();
			// clearTimeout(pageTimer["beginTimer"]);
			return;
		}


		this.countBeginSprite.setVisible(true);
		this.countBeginSprite.setString(this.countBeginNumber);
		this.countBeginNumber-=1;
		cc.log("end this.countBeginNumber==",this.countBeginNumber);
		var self=this;
		pageTimer["beginTimer"] = setTimeout(function(){self.setCountBeginSprite();},1000);
	},

	phaseSecTime:1,
	phase1Time:0.25,
	phase2Time:0.5,
	phase3Time:0.25,
	createAnimation_Move:function()
	{
		var actionMoveIn=new cc.moveBy(this.phase1Time,0,-25);
		var actionBlank=new cc.ActionInterval(this.phase2Time);
		var actionMoveOut=new cc.moveBy(this.phase1Time,0,-25);
		return new cc.Sequence(actionMoveIn,actionBlank,actionMoveOut);
	},
	
	createAnimation_Scale:function()
	{
		var actionScaleIn=new cc.ScaleBy(this.phaseSecTime,1,5);
		var actionBlank=new cc.ActionInterval(this.phase2Time);
		var actionScaleOut=new cc.ScaleBy(this.phase1Time,1,0.2);
		return new cc.Sequence(actionScaleIn,actionBlank,actionScaleOut);
	},
	
	createAnimation_Fade:function()
	{
		var actionFadeIn=new cc.FadeTo(this.phaseSecTime/2,255);
		// var actionBlank=new cc.ActionInterval(this.phaseSecTime);
		var actionBlank=new cc.ScaleBy(this.phaseSecTime*2,1.2,1.2);
		var actionFadeOut=new cc.FadeTo(this.phaseSecTime/2,0);
		return new cc.Sequence(actionFadeIn,actionBlank,actionFadeOut);
	},

        createAnimation_Flip:function()//翻转
        {
            cc.log("createAnimation_Flip:function()//翻转");

            //第一个参数：完成扭曲所花的时间
            //第二个参数：x轴方向扭曲的值
            //第三个参数：y轴方向扭曲的值
            // action = CCSkewBy::create(2, 35, 87);
            // var rotAction1=new cc.skewBy(0.5,0,90);
            // var rotAction1=new cc.RotateTo(0.5,90,90);
            // var rotAction2=new cc.RotateTo(0.5,180,180);
            // var rotAction3=new cc.RotateTo(0.5,270,270);
            // var rotAction4=new cc.RotateTo(0.5,360,360);
            // var rotAction1=new cc.skewBy(0.5,0,90);
            // var rotAction2=new cc.skewBy(0.5,0,180);
            // var rotAction3=new cc.skewBy(0.5,0,270);
            // var rotAction4=new cc.skewBy(0.5,0,360);

            var rotAction1=new cc.RotateTo(0.5,90,90);
            var rotAction3=new cc.RotateTo(0.5,180,180);
            var rotAction2=new cc.MoveTo(0.5,ccp(100, 100));
            var rotAction4=new cc.MoveTo(0.5,360,360);
            return new cc.Sequence(rotAction1,rotAction2,rotAction3,rotAction4);
            // var actionMoveIn=new cc.moveBy(this.phase1Time,0,-25);
            // var actionBlank=new cc.ActionInterval(this.phase2Time);
            // var actionMoveOut=new cc.moveBy(this.phase1Time,0,-25);
            // return new cc.Sequence(actionMoveIn,actionBlank,actionMoveOut);
        },
	///得到当前的K线图的层
	getCurrentKLineLayer:function()
	{
		if(this.klineLayerMain.parent==this.lowerLayer)
		{
			return this.klineLayerMain;
		}
		if(this.klineLayerPrev.parent==this.lowerLayer)
		{
			return this.klineLayerPrev;
		}
		return null;
	},


	removeAllLayerChild:function () {
		if(this.klineLayerPrev!=null)
			this.klineLayerPrev.removeFromParent(false);
		if(this.volumnTechLayerPrev!=null)
			this.volumnTechLayerPrev.removeFromParent(false);

		if(this.klineLayerMain!=null)
			this.klineLayerMain.removeFromParent(false);
		if(this.volumnTechLayerMain!=null)
			this.volumnTechLayerMain.removeFromParent(false);
	},

	prevLayerAnction:function () {

		// cc.MoveTo是“移动到这里"，而cc.MoveBy则是“相对于之前点再移动”，通俗一点就是说这里需要两个坐标pos1（x1，y1），pos2（x2，y2）。
        //
		// 如果是cc.MoveTo的话，就是将对象由pos1移动到pos2，而cc.MoveBy则是说对象的终坐标是在pos1的基础上再加上（矢量相加）pos2，终坐标pos3=pos1+pos2。
		// var start1_3 = cc.Sprite.createWithSpriteFrameName("transcription1.png");
		// start1_3.setOpacity(255);
		// start1_3.setScale(1.5);
		// start1_3.setPosition(cc.p(350,150));
		// this.addChild(start1_3,g_GameZOder.ui);
		// var bigger = cc.ScaleBy.create(3, 2);  //变大
		// var smaller = bigger.reverse(); // 恢复
		// var moveLeft  = cc.MoveBy.create(0.1,cc.p(3,0));  // 左移
		// var moveRight = moveLeft.reverse(); // 回位
		// start1_3.runAction(cc.RepeatForever.create(cc.Sequence.create(bigger,smaller,moveLeft,moveRight))); // 变大缩小再闪动一下

		var self =this;
		var posBegain = cc.p(0,0);
		var posEnd0 = cc.p(-this.width/3,0);
		var posEnd1 = cc.p(-this.width/3,0);
		var moveLeft1  = cc.MoveBy.create(2,posEnd0);  // 左移
		var moveLeft2  = cc.MoveBy.create(2,posEnd0);  // 左移
		cc.log("posEnd1//比赛图 beginposEnd1=="+posEnd1);
		this.klineLayerPrev.runAction(moveLeft1);
		this.volumnTechLayerPrev.runAction(moveLeft2);
		// var action = cc.callFunc(function(){this.klineLayerPrev.runAction(moveLeft1)},self.removeAllLayerChild());
		// var action2 = cc.callFunc(function(){this.volumnTechLayerPrev.runAction(moveLeft2)},self.removeAllLayerChild());
		// var action = cc.sequence(
		// 	cc.callFunc(function(){this.bottompic.runAction(this.bottompic.bomAction.reverse());},this),
		// 	cc.scaleTo(0.5, 0),
		// 	cc.callFunc(function(){if(target && callback){callback.call(target);}},this)
		// );

	},
	mainLayerAnction:function () {

		// cc.MoveTo是“移动到这里"，而cc.MoveBy则是“相对于之前点再移动”，通俗一点就是说这里需要两个坐标pos1（x1，y1），pos2（x2，y2）。
		//
		// 如果是cc.MoveTo的话，就是将对象由pos1移动到pos2，而cc.MoveBy则是说对象的终坐标是在pos1的基础上再加上（矢量相加）pos2，终坐标pos3=pos1+pos2。
		// var start1_3 = cc.Sprite.createWithSpriteFrameName("transcription1.png");
		// start1_3.setOpacity(255);
		// start1_3.setScale(1.5);
		// start1_3.setPosition(cc.p(350,150));
		// this.addChild(start1_3,g_GameZOder.ui);
		// var bigger = cc.ScaleBy.create(3, 2);  //变大
		// var smaller = bigger.reverse(); // 恢复
		// var moveLeft  = cc.MoveBy.create(0.1,cc.p(3,0));  // 左移
		// var moveRight = moveLeft.reverse(); // 回位
		// start1_3.runAction(cc.RepeatForever.create(cc.Sequence.create(bigger,smaller,moveLeft,moveRight))); // 变大缩小再闪动一下
        cc.log(" mainLayerAnction begin this.klineLayerMain.x=="+this.klineLayerMain.getPositionX()+"this.KlinePosX=="+this.KlinePosX);
        var self =this;
        var posBegain = cc.p(this.klineLayerMain.getPositionX(),this.klineLayerMain.getPosition().y);
        var posEnd1 = cc.p(-gDesignResolutionWidth+this.klineLayerMain.getPositionX()+10,0);
        var posEnd2 = cc.p(-gDesignResolutionWidth+this.klineLayerMain.getPositionX()+10,0);
        var moveLeft1  = cc.moveBy(3,posEnd1,3);//cc.MoveBy.create(3,posEnd1);  // 左移
        var moveLeft2  = cc.MoveBy.create(3,posEnd2);  // 左移
        cc.log("posEnd1//比赛图 beginposEnd posEnd1.x=="+posEnd1.x);
        this.klineLayerMain.runAction(moveLeft1);
        this.volumnTechLayerMain.runAction(moveLeft2);
        // this.klineLayerMain.setPosition(posEnd1);
        cc.log("this.klineLayerMain.x=="+this.klineLayerMain.getPosition().x+"this.klineLayerMain.y=="+this.klineLayerMain.y);
// var action = cc.callFunc(function(){this.klineLayerPrev.runAction(moveLeft1)},self.removeAllLayerChild());
        // var action2 = cc.callFunc(function(){this.volumnTechLayerPrev.runAction(moveLeft2)},self.removeAllLayerChild());
        // var action = cc.sequence(
        // 	cc.callFunc(function(){this.bottompic.runAction(this.bottompic.bomAction.reverse());},this),
        // 	cc.scaleTo(0.5, 0),
        // 	cc.callFunc(function(){if(target && callback){callback.call(target);}},this)
        // );

	},
	moveByOnePos:function () {


		var posEnd0 = cc.p(-this.KlineWidth/120,0);
		var moveLeft1  = cc.MoveBy.create(0.1,posEnd0);  // 左移
		var moveLeft2  = cc.MoveBy.create(0.1,posEnd0);  // 左移
		cc.log("posEnd1//比赛图 beginposEnd1=="+this.KlineWidth);
		this.klineLayerMain.runAction(moveLeft1);
		this.volumnTechLayerMain.runAction(moveLeft2);
	},

	moveByPos:function () {

		// cc.MoveTo是“移动到这里"，而cc.MoveBy则是“相对于之前点再移动”，通俗一点就是说这里需要两个坐标pos1（x1，y1），pos2（x2，y2）。
		//
		// 如果是cc.MoveTo的话，就是将对象由pos1移动到pos2，而cc.MoveBy则是说对象的终坐标是在pos1的基础上再加上（矢量相加）pos2，终坐标pos3=pos1+pos2。
		// var start1_3 = cc.Sprite.createWithSpriteFrameName("transcription1.png");
		// start1_3.setOpacity(255);
		// start1_3.setScale(1.5);
		// start1_3.setPosition(cc.p(350,150));
		// this.addChild(start1_3,g_GameZOder.ui);
		// var bigger = cc.ScaleBy.create(3, 2);  //变大
		// var smaller = bigger.reverse(); // 恢复
		// var moveLeft  = cc.MoveBy.create(0.1,cc.p(3,0));  // 左移
		// var moveRight = moveLeft.reverse(); // 回位
		// start1_3.runAction(cc.RepeatForever.create(cc.Sequence.create(bigger,smaller,moveLeft,moveRight))); // 变大缩小再闪动一下


		var posEnd0 = cc.p(-this.KlineWidth/120*60,0);
		var moveLeft1  = cc.MoveBy.create(0.5,posEnd0);  // 左移
		var moveLeft2  = cc.MoveBy.create(0.5,posEnd0);  // 左移
		cc.log("posEnd1//比赛图 beginposEnd1=="+this.KlineWidth);
		this.klineLayerMain.runAction(moveLeft1);
		this.volumnTechLayerMain.runAction(moveLeft2);
		// var action = cc.callFunc(function(){this.klineLayerPrev.runAction(moveLeft1)},self.removeAllLayerChild());
		// var action2 = cc.callFunc(function(){this.volumnTechLayerPrev.runAction(moveLeft2)},self.removeAllLayerChild());
		// var action = cc.sequence(
		// 	cc.callFunc(function(){this.bottompic.runAction(this.bottompic.bomAction.reverse());},this),
		// 	cc.scaleTo(0.5, 0),
		// 	cc.callFunc(function(){if(target && callback){callback.call(target);}},this)
		// );

	},

	advanceToMainKLine_PhaseMatch:function()//比赛图
	{
		cc.log("advanceToMainKLine_PhaseMatch:function()//比赛图 begin");
		if(this.klinedataMain==null || this.prevKlineData==null) return;
		this.phase2=true;


		this.removeAllLayerChild();
		// this.prevLayerAnction();

		//设置主K线图的数据
		this.klineLayerMain.setKLineData(this.klineData,null);
		//设置附图的数据
		this.volumnTechLayerMain.setKLineData(this.klineData,null);
		this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());

		this.setPlayerInfo();
		this.setDisableAllButtons();
		//先画前面的部分
		this.drawHistoryCandlePart();
		if(this.matchInfoLayer!=null)
		{
			this.matchInfoLayer.disableAllButtons();
			this.matchInfoLayer.setButtonsToNoPosition();
			//依次画后面的K线
			if(userInfo.matchMode<2){//
				this.matchInfoLayer.ableSpeedButtons();
                this.drawCandlesOneByOne();
			}else{
                this.drawCandlesOneByOneForMatch();
			}
		}

		cc.log("advanceToMainKLine_PhaseMatch:function()//比赛图 end");
	},


	advanceToMainKLine_RecordMatch:function(data)//观看交易记录Match
	{
		cc.log("advanceToMainKLine_RecordMactch:function()//观看交易记录 begin");
        //
		var businessData=data["dataBusiness"];
		cc.log("dataBusiness="+businessData);
		this.buyInfo=[];
		for(var i=0;businessData!=undefined&&i<businessData.length;i++)
		{
			this.buyInfo.push(businessData[i]);
		}
		this.buyScore=data["score"];
		if(data["nickName"]!=undefined)
		{
			userInfo.nickName=data["nickName"];
		}

		if(data["headPicture"]!=undefined)
		{
			userInfo.headSprite=data["headPicture"];
		}
		var self=this;
		this.setDisableAllButtons();
		if(this.btnHome!=null)
		{
			this.btnHome.setVisible(true);
		}
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.ableInfoButtons();
			this.playerInfoLayer.refreshScoresByData();
		}
		//一次性画出当前数据图 观看交易记录Match
		cc.log("userInfo.matchFlag=="+userInfo.matchFlag);
		if(userInfo.matchFlag){
			this.businessInfo();
		}else {
			this.businessMatchInfo();
		}

		cc.log("advanceToMainKLine_RecordMatch:function()//Match观看记录 end");
	},


	advanceToMainKLine_Record:function()//观看记录
	{
		cc.log("advanceToMainKLine_Record:function()//观看记录 begin");
        if(this.klinedataMain==null || this.prevKlineData==null) return;
        this.phase2=false;
		this.KlineWidth = 726;
		this.KlinePosX = 5;
		this.klineLayerPrev=new KlineLayer(this.KlineWidth-5,192);
		this.klineLayerPrev.setPosition(cc.p(this.KlinePosX,170));
		this.volumnTechLayerPrev=new VolumnTechLayer(this.KlineWidth-5,94);
		this.volumnTechLayerPrev.setPosition(cc.p(this.KlinePosX,75));
		this.volumnTechLayerPrev.setClickEvent(function(){self.changeTechLayer();});

		//需要设置指标
		if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			this.klineLayerPrev.lineType=1;
			this.klineLayerPrev.addNewTais(new TaisMa([1],0));
		}else {
			this.klineLayerPrev.addNewTais(new TaisMa([10,20,30],0));
		}
		this.volumnTechLayerPrev.addNewTais(new TaisMa([5,10],1));
		var macdTais2=new TaisMacd(12,26,9);
		macdTais2.isEnabled=false;
		this.volumnTechLayerPrev.addNewTais(macdTais2);
		//设置主K线图的数据
		this.klineLayerPrev.setKLineData(this.klinedataMain,this.prevKlineData);
		//设置附图的数据
		this.volumnTechLayerPrev.setKLineData(this.klinedataMain,this.prevKlineData);
		this.addChild(this.klineLayerPrev,this.mainLayerNumber,this.klineLayerPrev.getTag());
		this.addChild(this.volumnTechLayerPrev,this.volumnTechLayerNumber,this.volumnTechLayerPrev.getTag());


		var self=this;
		cc.log("advanceToMainKLine_Record:function()观看记录his.playerInfoLayer.refreshScoresByData();");
		this.playerInfoLayer.refreshScoresByData();
		this.setDisableAllButtons();

		if(this.btnHome!=null)
		{
			this.btnHome.setVisible(true);
		}
        //一次性画出当前数据图
        this.drawCandlesAll();
		cc.log("advanceToMainKLine_Record:function()//观看记录 end");
	},

	//SHARE_TEST
	advanceToMainKLine_Share:function()//分享图
	{
		if(this.klinedataMain==null || this.prevKlineData==null) return;
		this.phase2=false;
		this.KlineWidth = 726;
		this.KlinePosX = 5;
		this.klineLayerPrev=new KlineLayer(this.KlineWidth-5,192);
		this.klineLayerPrev.setPosition(cc.p(this.KlinePosX,170));
		this.volumnTechLayerPrev=new VolumnTechLayer(this.KlineWidth-5,94);
		this.volumnTechLayerPrev.setPosition(cc.p(this.KlinePosX,75));
		this.volumnTechLayerPrev.setClickEvent(function(){self.changeTechLayer();});

		//需要设置指标
		if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			this.klineLayerPrev.lineType=1;
			this.klineLayerPrev.addNewTais(new TaisMa([1],0));
		}else {
			this.klineLayerPrev.addNewTais(new TaisMa([10,20,30],0));
		}
		this.volumnTechLayerPrev.addNewTais(new TaisMa([5,10],1));
		var macdTais2=new TaisMacd(12,26,9);
		macdTais2.isEnabled=false;
		this.volumnTechLayerPrev.addNewTais(macdTais2);

		//设置主K线图的数据
		this.klineLayerPrev.setKLineData(this.klinedataMain,this.prevKlineData);
		//设置附图的数据
		this.volumnTechLayerPrev.setKLineData(this.klinedataMain,this.prevKlineData);
		this.addChild(this.klineLayerPrev,this.mainLayerNumber,this.klineLayerPrev.getTag());
		this.addChild(this.volumnTechLayerPrev,this.volumnTechLayerNumber,this.volumnTechLayerPrev.getTag());
		

		// this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
		// if(this.lowerLayer.getChildByTag(this.klineLayerMain.getTag())){
		// 	this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		// }
		// if(this.lowerLayer.getChildByTag(this.volumnTechLayerMain.getTag())){
		// 	this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
		// }

		var self=this;

		this.setDisableAllButtons();
		if(self.matchInfoLayer!=null)
		{
			// self.matchInfoLayer.disableAllButtons();
			self.matchInfoLayer.setShareKLineScene();
		}
		if(this.btnHome!=null)
		{
			this.btnHome.setVisible(true);
		}

		if(this.playerInfoLayer!=null)
		{
			cc.log("setPlayerInfo:function()");
			this.playerInfoLayer.refreshScoresByData();
		}
        self.matchInfoLayer.startCallBackFunction=function(){self.matchInfoLayer_Start()};
		//一次性画出当前数据图
		this.drawCandlesAll();

	},

	drawHistoryCandlePart2:function()
	{
		this.phase2=true;
		for(var i=0;i<this.prevDataDayCount;i++)
		{
			this.currentCandleIndex=i;
			this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
		}
	},
		drawHistoryCandlePartToIndex:function(index)
		{
			cc.log("drawHistoryCandlePartToIndex:function(index) this.currentCandleIndex=="+this.currentCandleIndex+"||index=="+index);

			this.phase2=true;
			this.currentCandleIndex=index;
			// var ended=this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			// this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			// cc.log("drawAllCandlesOneByOne currentIndex=="+this.currentCandleIndex);
			// this.matchRunFlag=true;
			if(this.currentCandleIndex==this.klineData.length)
			{
				cc.log("绘制结束");
				this.matchRunFlag=false;
				this.sendEndMessage();
				this.matchEnd();
				// clearTimeout(pageTimer["drawTimer"]);
				return;
			}else{
				this.klineLayerMain.redrawCandlesToIndex(this.currentCandleIndex);
				this.volumnTechLayerMain.redrawCandlesToIndex(this.currentCandleIndex);
			}

		},

	drawHistoryCandlePart:function()
	{
		var index=this.klineLayerMain.getHistoryCandleIndexByPageIndex();
		var count=this.klineLayerMain.getHistoryCandleCountByPageIndex();
		for(var i=0;i<count;i++)
		{
			if(index<0)
			{
				this.klineLayerMain.drawSingleCandleLineByCurrentIndex(index+i);
				this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(index+i);
			}
		}
	},


	//SHARE_TEST 一次性画出用户数据图
	drawCandlesAll:function()
	{
		this.setPlayerInfo();
		if(this.klineLayerPrev!=null)
		{
			this.klineLayerPrev.drawAllCandlesAll();
			//画出买卖操作的信息
			this.businessInfo();
		}
		if(this.volumnTechLayerPrev!=null)
			this.volumnTechLayerPrev.drawAllCandlesAll();
		this.currentCandleIndex=this.klinedataMain.length;
		this.stopProgress();
		//cc.log("drawCandlesAll this.currentCandleIndex = ",this.currentCandleIndex);
	},
	//切换到分时图
	drawDailyView:function()
	{
		// if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
		// 	this.klineLayerMain.lineType=1;
		// 	this.klineLayerMain.addNewTais(new TaisMa([1],0));
		// }
		var self =this;
		if(null!=this.klineLayerMain&&userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			this.klineLayerMain.redrawCandlesToIndex(self.currentCandleIndex);
			this.klineLayerMain.setVisible(true);
		}
		if(null!=this.klineView){
			this.klineView.setVisible(false);
		}
		// if(null!=this.volumnTechLayerMain){//画到当前位置
		// 	this.volumnTechLayerMain.lineType=0;
		// 	this.volumnTechLayerMain.redrawCandlesToIndex(self.currentCandleIndex);
		// }

	},
	//切换到分时图
	drawOneDailyView:function()
	{
		var self =this;
		if(null!=this.klineLayerMain&&userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			this.klineLayerMain.setVisible(false);
		}
		if(null==this.klineView&&userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			// //  //设置K线图的区域
			var kWidth = this.KlineWidth*2-10;
			if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
				kWidth = this.KlineWidth-5;
			}
			this.klineView=new KlineLayer(kWidth,192);
			this.klineView.setPosition(cc.p(this.KlinePosX,170));
			this.addChild(this.klineView,this.mainLayerNumber,this.klineView.getTag());
			this.klineView.addNewTais(new TaisMa([10,20,30],0));
			this.klineView.setKLineData(gKlineScene.klineData);

		}
		if(null!=this.klineView){//画到当前位置
			this.klineView.lineType=2;
			this.klineView.redrawCandlesToIndex(self.currentCandleIndex);
			this.klineView.setVisible(true);
		}
		// if(null!=this.volumnTechLayerMain){//画到当前位置
		// 	this.volumnTechLayerMain.lineType=0;
		// 	this.volumnTechLayerMain.redrawCandlesToIndex(self.currentCandleIndex);
		// }

	},
	//切换到分时图
	drawFiveDailyView:function()
	{
		var self =this;
		if(null!=this.klineLayerMain&&userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			this.klineLayerMain.setVisible(false);
		}
		if(null==this.klineView&&userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			// //  //设置K线图的区域
			var kWidth = this.KlineWidth*2-10;
			if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
				kWidth = this.KlineWidth-5;
			}
			this.klineView=new KlineLayer(kWidth,192);
			this.klineView.setPosition(cc.p(this.KlinePosX,170));
			this.addChild(this.klineView,this.mainLayerNumber,this.klineView.getTag());
			this.klineView.addNewTais(new TaisMa([10,20,30],0));
			this.klineView.setKLineData(gKlineScene.klineData);

		}
		if(null!=this.klineView){//画到当前位置
			this.klineView.lineType=3;
			// this.klineView.setKLineData(gKlineScene.klineFiveData);
			this.klineView.redrawCandlesToIndex(self.currentCandleIndex);
			this.klineView.setVisible(true);
		}
		// if(null!=this.volumnTechLayerMain){//画到当前位置
		// 	this.volumnTechLayerMain.lineType=0;
		// 	this.volumnTechLayerMain.redrawCandlesToIndex(self.currentCandleIndex);
		// }

	},

        drawOppositeCandlePart:function()
        {
            this.phase2=true;
            if(this.klineLayerMain.graphArea!=null){
                this.klineLayerMain.graphArea.clear();
            }
            // if(this.volumnTechLayerMain.graphArea!=null){
            // 	this.volumnTechLayerMain.graphArea.clear();
            // }
            for(var i=0;i<=this.currentCandleIndex;i++)
            {
                this.klineLayerMain.drawOppositeSingleDayGraphInfos(i);
                // this.volumnTechLayerMain.drawOppositeSingleDayGraphInfos(i);
            }
        },
        drawNormalCandlePart:function(flag)
        {
            this.phase2=true;
            if(this.klineLayerMain.graphArea!=null){
                this.klineLayerMain.graphArea.clear();
            }
            // if(this.volumnTechLayerMain.graphArea!=null){
            // 	this.volumnTechLayerMain.graphArea.clear();
            // }
            for(var i=0;i<=this.currentCandleIndex;i++)
            {
                this.klineLayerMain.drawSingleDayGraphInfos(i);
                // this.volumnTechLayerMain.drawOppositeSingleDayGraphInfos(i);
            }
			this.matchInfoLayer.setEnableBuyOrSell(true);
			if(this.countDownInfo!=null)
			{
				this.countDownInfo.removeFromParent(false);
				this.countDownInfo=null;
				this.countDownTimeInfo.removeFromParent(false);
				this.countDownTimeInfo=null;
				this.countDownTime=5;
			}

			this.hideBarInfo();
        },


		drawCoverCandlePart:function(flag)
		{
			this.phase2=true;
			cc.log("遮盖效果显示");
			if(this.coverSprite!=null&&flag!=true){

				this.coverSprite.setVisible(true);
				pageTimer["hideCover"] = setTimeout(function(){gKlineScene.coverSprite.setVisible(false);},5000);
				// var act1 = this.createAnimation_ACT2();
				// this.coverSprite.runAction(act1);
			}
		},

		drawBanCandlePart:function(flag)
		{
			this.phase2=true;
			cc.log("禁止买卖操作效果显示");
			this.matchInfoLayer.setEnableBuyOrSell(false);
			if(this.banSprite!=null&&flag!=true){
				this.banSprite.setVisible(true);
				pageTimer["hideBan"] = setTimeout(function(){gKlineScene.banSprite.setVisible(false);gKlineScene.matchInfoLayer.setEnableBuyOrSell(true);},5000);
				// var act1 = this.createAnimation_ACT2();
				// this.banSprite.runAction(act1);
			}

		},
		// drawToolsInfo:function(info)
		// {
		// 	if(this.toolsSprite!=null){
		// 		var act1 = this.createAnimation_ACT2();
		// 		this.toolsSprite.runAction(act1);
		// 	}
		// },


	setCountDownInfo:function () {
		if(this.countDownTime==0 && this.countDownInfo!=null)
		{
			this.countDownInfo.setVisible(false);
			this.countDownTimeInfo.setVisible(false);
			this.drawNormalCandlePart();
			// this.advanceToMainKLine_PhaseMatch();
			return;
		}

		if(this.countDownInfo==null)
		{
			this.countDownTime=5;
			//this.countDownSprite= cc.Sprite.create("res/cd_5.png");
			this.countDownInfo= cc.LabelTTF.create("解除倒计时:","Arial",20);
			this.countDownInfo.setColor(YellowColor);
			this.addChild(this.countDownInfo,10);
			this.countDownTimeInfo= cc.LabelTTF.create("5","Arial",30);
			this.addChild(this.countDownTimeInfo,10);
			this.countDownTimeInfo.setColor(YellowColor);

		}
		// var posCenter = cc.p(gDesignResolutionWidth / 2+130, gDesignResolutionHeight-28);
		var posCenter = cc.p(gDesignResolutionWidth / 2, 30);
		this.countDownInfo.setVisible(true);
		this.countDownInfo.setPosition(posCenter);
		this.countDownTimeInfo.setVisible(true);
		this.countDownTimeInfo.setPosition(cc.pAdd(posCenter,cc.p(this.countDownInfo.width/2+10,0)));
		this.countDownTimeInfo.setString(""+this.countDownTime);

		// var jumpto = cc.jumpTo(1,posCenter,20,3);

		this.countDownTime-=1;
		var self=this;
		pageTimer["beginDownTimer"] = setTimeout(function(){self.setCountDownInfo();},1000);

	},
		createAnimation_ACT0:function()
		{

			// var actionFadeIn=new cc.FadeTo(1,240);
			// var actionFadeOut=new cc.FadeTo(0.5,0);
			// var actionFade1=new cc.FadeTo(1,180);
			// var actionFade2=new cc.FadeTo(1,120);
			// var actionFade3=new cc.FadeTo(1,60);

			var actionFadeIn=new cc.FadeTo(this.phaseSecTime*2,255);
			// var actionBlank=new cc.ActionInterval(this.phaseSecTime);
			var actionBlank=new cc.ScaleBy(this.phaseSecTime*2,1.2,1.2);
			var actionFadeOut=new cc.FadeTo(this.phaseSecTime/2,0);
			return new cc.Sequence(actionFadeIn,actionBlank,actionFadeOut);

			var actionIn=cc.spawn(actionFadeIn,actionBlank);//
			// var actionOut=cc.spawn(actionFadeOut,actScale2);//
			return new cc.Sequence(actionIn,actionFadeOut);
		},

		createAnimation_ACT1:function()
		{

			var posBase = cc.p(0,-10);
			var actionFadeIn=new cc.FadeTo(2,255);
			var actMoveBy = cc.MoveBy.create(2,posBase);
			var actionFadeOut=new cc.FadeTo(1,0);
			// var actionTest = new  cc.Sequence(actionFadeIn,jumpto,cc.ActionInterval(1),actionFadeOut);//
			var posBy = cc.p(0,-this.size.height+20);
			var actMoveBy = cc.MoveBy.create(2,posBy);

			var actionMoveIn=cc.spawn(actionFadeIn,actMoveBy);//
			var actionBlank=new cc.ActionInterval(2);
			var actionMoveOut=cc.spawn(actionFadeOut,actMoveBy);//
			return new cc.Sequence(actionMoveIn,actMoveBy,actionBlank,actionMoveOut);
		},
		createAnimation_ACT2:function()//渐出渐隐
		{
			var actionFadeIn=new cc.FadeTo(1,200);
			var actionBlank=new cc.FadeTo(4,240);
			var actionFadeOut=new cc.FadeTo(1,0);
			// var actionFade1=new cc.FadeTo(1,180);
			// var actionFade2=new cc.FadeTo(1,120);
			// var actionFade3=new cc.FadeTo(1,60);
			var actionFade1=new cc.FadeTo(1,240);
			var actionFade2=new cc.FadeTo(1,240);
			var actionFade3=new cc.FadeTo(1,240);

			// var actScale1 = cc.ScaleTo(2,50,40);
			// var actScale2 = cc.ScaleTo(2,1,1);

			// var actionIn=cc.spawn(actionFadeIn,actScale1);//
			// var actionBlank=new cc.ActionInterval(2);
			// var actionOut=cc.spawn(actionFadeOut,actScale2);//
			// return new cc.Sequence(actionFadeIn,actionFade1,actionFade2,actionFade3,actionFadeOut);
			return new cc.Sequence(actionFadeIn,actionBlank,actionFadeOut);
		},
	//
	businessInfo:function()
	{
		cc.log("businessInfo:function() begin= ");
		// if(this.phase2==false)return;
		this.clearBuySellOperation();
		var businessInfo = this.buyInfo;
		this.selfOperations=[];
		for (i=0;i<businessInfo.length;i++)
		{
			cc.log("businessInfo[" + i + "] = " + businessInfo[i]);
			this.selfOperations.push(businessInfo[i]);
			if(businessInfo[i]>0)
			{
				this.klineLayerPrev.setUpArrowIndex(Math.abs(businessInfo[i]),(this.selfOperations.length%2==1));
			}else{
				this.klineLayerPrev.setDownArrowIndex(Math.abs(businessInfo[i]),(this.selfOperations.length%2==1));
			}
			
		}
		var score = this.buyScore;
		cc.log("businessInfo:function() his.playerInfoLayer.refreshScoresByData();");
		// this.playerInfoLayer.refreshScoresByData();
		// this.playerInfoLayer.refreshScores(score);
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.ableInfoButtons();
		}
	},
//一次性画出当前数据图 观看交易记录Match
// 		this.businessMatchInfo();
	businessMatchInfo:function()
	{
		cc.log("businessMatchInfo:function() begin= ");
		// if(this.phase2==false)return;
		this.clearBuySellOperation();
		var businessInfo = this.buyInfo;
		this.selfOperations=[];
		for (i=0;i<businessInfo.length;i++)
		{
			cc.log("businessInfo[" + i + "] = " + businessInfo[i]);
			this.selfOperations.push(businessInfo[i]);
			if(businessInfo[i]>0)
			{
				this.klineLayerMain.setUpArrowIndex(Math.abs(businessInfo[i])+120,(this.selfOperations.length%2==1));
			}else{
				this.klineLayerMain.setDownArrowIndex(Math.abs(businessInfo[i])+120,(this.selfOperations.length%2==1));
			}

		}
		var score = this.buyScore;
		cc.log("bbusinessMatchInfo:function() his.playerInfoLayer.refreshScoresByData();");
		this.playerInfoLayer.refreshScoresByData();
		this.playerInfoLayer.refreshScores(score);
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.ableInfoButtons();
		}
	},

		businessMatchInfo:function(buyInfo,score)
		{
			cc.log("businessMatchInfo:function() begin= ");
			// if(this.phase2==false)return;
			this.hidematchEndInfoLayer();
			this.clearBuySellOperation();
			var businessInfo = buyInfo;
			this.selfOperations=[];
			for (var i=0;i<businessInfo.length;i++)
			{
				cc.log("businessInfo[" + i + "] = " + businessInfo[i]);
				this.selfOperations.push(businessInfo[i]);
				if(businessInfo[i]>0)
				{
					this.klineLayerMain.setUpArrowIndex(Math.abs(businessInfo[i])+120,(this.selfOperations.length%2==1));
				}else{
					this.klineLayerMain.setDownArrowIndex(Math.abs(businessInfo[i])+120,(this.selfOperations.length%2==1));
				}

			}
			cc.log("bbusinessMatchInfo:function() his.playerInfoLayer.refreshScoresByData();");
			this.playerInfoLayer.refreshScoresByData();
			this.playerInfoLayer.refreshScores(score);
			if(this.playerInfoLayer!=null)
			{
				this.playerInfoLayer.ableInfoButtons();
			}
		},
		businessMatchRecordInfo:function(buyInfo,score)
		{
			cc.log("businessMatchInfo:function() begin= ");

			this.clearBuySellOperation();
			var businessInfo = buyInfo;
			this.selfOperations=[];
			for (i=0;i<businessInfo.length;i++)
			{
				cc.log("businessInfo[" + i + "] = " + businessInfo[i]);
				this.selfOperations.push(businessInfo[i]);
				if(businessInfo[i]>0)
				{
					this.klineLayerPrev.setUpArrowIndex(Math.abs(businessInfo[i]),(this.selfOperations.length%2==1));
				}else{
					this.klineLayerPrev.setDownArrowIndex(Math.abs(businessInfo[i]),(this.selfOperations.length%2==1));
				}

			}
			// if(this.phase2==false)return;

			cc.log("businessMatchRecordInfo:function() his.playerInfoLayer.refreshScoresByData();");
			this.playerInfoLayer.refreshScoresByData();
		},
	sendEndMessage:function()
	{
		if(gSocketConn!=null && gSocketConn!=undefined)
		{
			gSocketConn.SendEndMessage();
		}
	},
	
	buyClick:function()
	{
		cc.log("buyClick:function() begin");
		if(this.phase2==false)return;

		//注意：此处存入的买入操作的index不是从0开始，而是从120开始的
		var lastCandleIndex=this.currentCandleIndex;
		if(lastCandleIndex<121&&userInfo.matchMode!=MatchType.Type_DailyTrade_Match){
			return;
		}else{
			this.selfOperations.push(lastCandleIndex);
			this.refreshScores(lastCandleIndex);

			this.klineLayerMain.setUpArrowIndex(lastCandleIndex,(this.selfOperations.length%2==1));
			if(null!=this.klineView){
				this.klineView.setUpArrowIndex(lastCandleIndex,(this.selfOperations.length%2==1));
			}


			if(gSocketConn!=null && gSocketConn!=undefined)
			{
				if(this.matchRunFlag){
					gSocketConn.Buy(lastCandleIndex-121>0?lastCandleIndex-121:0);//
				}

			}
		}

	},
	
	sellClick:function()
	{
		cc.log("sellClick:function() begin");
		if(this.phase2==false)return;
		//注意：此处存入的卖出操作的index不是从0开始，而是从120开始的
		var lastCandleIndex=this.currentCandleIndex;
		if(lastCandleIndex<121&&userInfo.matchMode!=MatchType.Type_DailyTrade_Match){
			return;
		}else {
			this.selfOperations.push(-lastCandleIndex);
			this.refreshScores(lastCandleIndex);
			this.klineLayerMain.setDownArrowIndex(lastCandleIndex,(this.selfOperations.length%2==1));
			if(null!=this.klineView){
				this.klineView.setDownArrowIndex(lastCandleIndex,(this.selfOperations.length%2==1));
			}
			if(gSocketConn!=null && gSocketConn!=undefined)
			{
				if(this.matchRunFlag){
					gSocketConn.Sell(lastCandleIndex-121>0?lastCandleIndex-121:0);
				}
			}
		}

	},
	
				
	refreshScores:function(indexEnd)
	{
		if(indexEnd==null)
		{
			indexEnd=this.currentCandleIndex;
		}
		this.playerInfoLayer.refreshScore(indexEnd,this.klineData,this.selfOperations,this.opponentOperations);
	},

	matchEnd:function()
	{
		this.matchInfoLayer.disableAllButtons();
	},

	hidematchEndInfoLayer:function()
	{
		if(this.matchEndInfoLayer!=null){
			this.matchEndInfoLayer.hideLayer();
			this.resumeLowerLayer();
		}
	},
    toHome:function()
    {

		if(userInfo.matchBeginFlag==true){
			var errorInfo = "matchBeginFlag===true";
			gSocketConn.SendEndErrorMessage(errorInfo);
		}
        if(typeof(gMainMenuScene)=="undefined")
        {
			window.location.href="http://analyse.kiiik.com/";
        }
        else if(gMainMenuScene!=null)
        {
            //window.close();

			if(gMainMenuScene==false)
				gMainMenuScene=new MainMenuScene();

			// var errorInfo = "";
			// gSocketConn.SendEndErrorMessage(errorInfo);
			gSocketConn.UnRegisterEvent("onmessage",gKlineScene.messageCallBack);
			gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);
			gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
			//cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
			cc.director.runScene(gMainMenuScene);
            //window.location.href="clear.html";
        }
        //this.matchInfoLayer.disableAllButtons();
    },

        popViewLayer_Close:function()
        {
            //关闭matchViewL界面
            if(this.matchViewLayer!=null){
                this.matchViewLayer.hideLayer();
            }
			//关闭应邀请求界面
			if(this.invitedViewLayer!=null){
				this.invitedViewLayer.hideLayer();
			}
			//关闭好友界面
			if(this.friendLayer!=null){
				this.friendLayer.hideLayer();
			}
			//关闭preView界面
			if(this.preMatchView!=null){
				this.preMatchView.hideLayer();
			}
			this.resumeLowerLayer();
        },
	start:function()
	{
		if(gKlineScene!=null)
		{

            // gKlineScene.setDataForLlineLayerTest();
			gKlineScene.setCountDownSprite();
		}

	},

});