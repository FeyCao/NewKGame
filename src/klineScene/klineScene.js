
var pageTimer = {} ; //定义计算器全局变量
// //赋值模拟
// pageTimer["timer1"] = setInterval(function(){},2000);
// pageTimer["timer2"] = setInterval(function(){},2000);
// //全部清除方法
// for(var each in pageTimer){
// 	clearInterval(pageTimer[each]);
// }

var KLineScene = SceneBase.extend(
{
	backgroundLayer:null,		//背景层
	
	matchEndInfoLayer:null,		//对局结束后弹出的对话框

	// klineLayer:null,		//跳动的K线图
	klineLayerMain:null,		//主要的持续跳动的K线图
	klineLayerPrev:null,		//前期的K线，游戏一开始显示一下作为游戏时判断使用

	volumnTechLayerMain:null,		//主要的持续跳动的成交量图，也可以作为技术指标的图
	volumnTechLayerPrev:null,		//前期的一副图，游戏一开始显示一下作为游戏时判断使用

	klineData:null,			//游戏界面K线图的数据，按照时间从小到大排序。
	klinedataMain:null,			//游戏界面K线图的数据，按照时间从小到大排序。
	prevKlineData:null,			//游戏界面前的K线图的数据，按照时间从小到大排序。

	prevDataDayCount:null,
	mainDataDayCount:null,


	matchInfoLayer:null,		//显示游戏按钮的层
	playerInfoLayer:null,		//显示对手信息，比赛分数信息的层
	matchViewLayer:null,
	phase2:false,				//主K线阶段
	opponentsInfo:[],			//对手信息

	matchRunFlag:false,
	//买入卖出信息格式如下，正数为买入，负数为卖出，绝对值表示买入或卖出的索引
	selfOperations:[],			//自己的交易信息，
	opponentOperations:[],		//对手的交易信息
	
	borderArea:null,			//画K线图和技术图的边框的区域
	middleHorizontalLineCount:11,	//在中间的横线的个数
	
	currentCandleIndex:0,		//当前显示的是第几个蜡烛，从0开始
	CANDAL_DRAW_INTERVAL:500,		//每个K线相隔的时间
	currentCandleDrawInterval:null,	//当前的K线绘画间隔
	drawCandleStoped:false,			//是否绘画停止了
	
	mainLayerNumber:5,		//上方的主图的层号
	volumnTechLayerNumber:4,//下方的技术指标的层号
	
	onEnteredFunction:null,	//OnEnter调用结束后的Function

	countDownSprite:null,
	countDownNumber:null,
	countBeginNumber:null,
	countBeginSprite:null,
	ctor: function ()
	{
		this._super();
		this.backgroundLayer=null;
		this.matchEndInfoLayer=null;
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

		this._super();
		// cc.director.setDisplayStats(true);
		cc.log("KLineScene onEnter begin");
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
        this.fXScale = this.size.width/1280;
		this.fYScale = this.size.height/720;
		//document.getElementById("mainBody").style
		document.bgColor="#152936";
		gKlineScene=this;
		gSocketConn.RegisterEvent("onmessage",gKlineScene.messageCallBack);

		this.currentCandleDrawInterval=this.CANDAL_DRAW_INTERVAL;
		cc.log("............klinescene on enter called");
		this.backgroundLayer=new cc.LayerColor(cc.color(21,41,54, 255));
		this.backgroundLayer.ignoreAnchorPointForPosition(false);  
		this.backgroundLayer.setPosition(this.size.width / 2, this.size.height / 2);
		this.addChild(this.backgroundLayer, 1,this.backgroundLayer.getTag());

		this.backgroundSprite=cc.Sprite.create("res/battle_bg.png");
		this.backgroundSprite.setScale(this.fXScale,this.fYScale);
		this.backgroundSprite.setPosition(this.size.width/2,this.size.height/2);
		this.backgroundLayer.addChild(this.backgroundSprite, 1);

		var background = this.backgroundSprite.getContentSize();

		this.playerInfoLayer=new PlayerInfoLayer(this.size.width,this.size.height);
		this.playerInfoLayer.setPosition(cc.p(0,0));
		// this.playerInfoLayer.setPosition(cc.p(this.size.width/2,this.size.height/2));
		this.addChild(this.playerInfoLayer, 8,this.playerInfoLayer.getTag());
		this.setPlayerInfo();


 		//  //设置K线图的区域

		var kWidth = this.KlineWidth*2;
		this.klineLayerMain=new KlineLayer(kWidth,192);
		this.klineLayerMain.setPosition(cc.p(this.KlinePosX,170));

		this.volumnTechLayerMain=new VolumnTechLayer(kWidth,94);
		this.volumnTechLayerMain.setPosition(cc.p(this.KlinePosX,75));
		this.volumnTechLayerMain.setClickEvent(function(){self.changeTechLayer();});

		this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());

		this.borderArea=new cc.DrawNodeCanvas();
		this.borderArea.setPosition(cc.p(0,68));
		this.borderArea.width=726;
		this.borderArea.height=294;
		this.addChild(this.borderArea, 2);
		  //画边框
		//this.drawAreaBorder();
		this.drawHorizontalLine();
		
		// this.klineLayerPrev=new KlineLayer(this.klineLayerMain.width,this.klineLayerMain.height);
		// this.klineLayerPrev.setPosition(this.klineLayerMain.getPosition());
		//
		// this.volumnTechLayerPrev=new VolumnTechLayer(this.volumnTechLayerMain.width,this.volumnTechLayerMain.height);
		// this.volumnTechLayerPrev.setPosition(this.volumnTechLayerMain.getPosition());
		// this.volumnTechLayerPrev.setClickEvent(function(){self.changeTechLayer();});



		
		//需要设置指标
		// this.klineLayerPrev.addNewTais(new TaisMa([10,20,30],0));
		this.klineLayerMain.addNewTais(new TaisMa([10,20,30],0));
		//this.klineLayerMain.addNewTais(new TaisMa([5,10,20,30],0));
		
		this.volumnTechLayerMain.addNewTais(new TaisMa([5,10],1));
		// this.volumnTechLayerPrev.addNewTais(new TaisMa([5,10],1));
		
		var macdTais1=new TaisMacd(12,26,9);
		var macdTais2=new TaisMacd(12,26,9);
		macdTais1.isEnabled=false;
		macdTais2.isEnabled=false;
		this.volumnTechLayerMain.addNewTais(macdTais1);
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
		this.btnHome.setPosition(cc.p(40,bgSize.height-40));
		mu.addChild(this.btnHome);
		this.btnStart=new cc.MenuItemImage("res/btnStart.png", "res/btnStart.png", self.start, this);//new cc.MenuItemImage("res/home.png", "res/home.png", self.start, this);
		this.btnStart.setPosition(cc.p(bgSize.width/2,60));
		mu.addChild(this.btnStart);

		if(this.btnStart!=null)
		{
			this.btnStart.setVisible(false);
		}
		// this.btnHome.setScale(this.fXScale*0.8,this.fYScale*0.8);
        // this.btnHome.setPosition(cc.p(40*this.fXScale,this.size.height-35*this.fYScale));
        // this.btnHome.setScale(this.fXScale*0.8,this.fYScale*0.8);
        // this.btnHome.setClickEvent(function(){self.toHome();});
        // this.addChild(this.btnHome,123);

		// this.btnStart=new Button("res/btnStart.png");
		// this.btnStart.setPosition(cc.p(363,40));
		// this.btnStart.setScale(this.fXScale,this.fYScale);
		// this.btnStart.setClickEvent(function(){
		// 	self.start();
		// });
		// this.addChild(this.btnStart,123);

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

	setPlayerInfo:function()
	{
		if(userInfo.matchMode==null)return;
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.setPlayerInfo();
		}
		switch(userInfo.matchMode)
		{
			case 0:
			{
				this.KlineWidth = 726;
				this.KlinePosX = 5;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((this.size.width-this.matchEndInfoLayer.width) / 2, (this.size.height-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());

				break;
			}
			case 1:
			{
				this.KlineWidth = this.size.width-120*this.fXScale;
				this.KlinePosX = 125*this.fXScale;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((this.size.width-this.matchEndInfoLayer.width) / 2, (this.size.height-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());

				cc.log("人人战this.KlineWidth ="+this.KlineWidth +"||this.KlinePosX="+this.KlinePosX+"||this.size.width="+this.size.width);//this.KlineWidth =667||this.KlinePosX=69||this.size.width=736

				break;
			}
			case 2:
			{
				this.KlineWidth = this.size.width-120*this.fXScale;
				this.KlinePosX = 125*this.fXScale;

				this.matchEndInfoLayer=new MatchEndInfoLayer();
				// this.matchEndInfoLayer.setAnchorPoint(0.5,0.5);
				this.matchEndInfoLayer.setVisible(false);
				this.matchEndInfoLayer.setPosition((this.size.width-this.matchEndInfoLayer.width) / 2, (this.size.height-this.matchEndInfoLayer.height) / 2);
				// this.matchEndInfoLayer.setPosition(this.size.width / 2, this.size.height / 2);
				this.otherMessageTipLayer.addChild(this.matchEndInfoLayer, 1,this.matchEndInfoLayer.getTag());

				cc.log("人机战this.KlineWidth ="+this.KlineWidth +"||this.KlinePosX="+this.KlinePosX+"||this.size.width="+this.size.width);//this.KlineWidth =667||this.KlinePosX=69||this.size.width=736

				break;
			}
			case 3:
			{
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
		cc.log("klinescene changeTechLayer instanceid="+this.__instanceid);
		
		if(this.phase2==false)
		{
			cc.log("changeTechLayer to begin");
			if(this.volumnTechLayerPrev.isTaisEnabled("MACD")==true)
			{
				//如果MACD是激活的，则切换到"MA"
				cc.log("changeTechLayer to ma");
				this.volumnTechLayerPrev.changeToOtherTais(["MA"]);
				this.volumnTechLayerMain.changeToOtherTais(["MA"]);
			}
			else if(this.volumnTechLayerPrev.isTaisEnabled("MA")==true)
			{
				//如果"MA"是激活的，则切换到MACD
				cc.log("changeTechLayer to macd");
				this.volumnTechLayerPrev.changeToOtherTais(["MACD"]);
				this.volumnTechLayerMain.changeToOtherTais(["MACD"]);
			}
			//需要重绘技术图
			this.volumnTechLayerPrev.clearMaxAndMinValue();
			this.volumnTechLayerPrev.clearAllContents();
			this.volumnTechLayerPrev.drawAllCandlesTillIndexOrEnd();
		}
		else
		{
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
		for(var i=0;i<this.middleHorizontalLineCount;i++)
		{
			// var pointBegin=cc.p(5,middleGapHeight*(i+1));
			// var pointEnd=cc.p(this.borderArea.width-5,middleGapHeight*(i+1));

			// var WhiteColor=cc.color(189,240,255,255);//白色
			if(i!=3)
			for(var j=0;this.borderArea.width>3*j;j++)//画虚线
			{
				var pointBegin=cc.p(5+3*j,middleGapHeight*(i+1));
				var pointEnd=cc.p(6+3*j,middleGapHeight*(i+1));
				// var pointMiddle = cc.p(5+3*j,middleGapHeight*(i+1));
				this.borderArea.drawSegment(pointBegin,pointEnd,0.2,cc.color(189,240,255,100));
			}

			//
			//this.borderArea.drawSegment(pointBegin,pointEnd,0.4,cc.color(36,62,83,80));
			// this.borderArea.drawSegment(pointBegin,pointEnd,0.4,WhiteColor);
			// cc.log("drawHorizontalLine middleGapHeight i="+i+"||middleGapHeight=="+middleGapHeight);
		}
		this.borderArea.drawSegment(cc.p(0,100),cc.p(this.size.width,100),1,BlueColor);
	},

	
	messageCallBack:function(message)
	{
		cc.log("KlineScene messageCallBack..." + message);
		var packet=Packet.prototype.Parse(message);
		var self=gKlineScene;
		if(packet==null) return;
		switch(packet.msgType)
		{
			case "8":
			{
				//收到对方买入的信息
				//alert("8="+packet.content);
				var buyOperationIndex=parseInt(packet.content.split("#")[1]);
				self.opponentOperations.push(buyOperationIndex);
				self.refreshScores();
			}

			case "9":
			{
				//收到对方卖出的信息
				//alert("9="+packet.content);
				var sellOperationIndex=parseInt(packet.content.split("#")[1]);
				self.opponentOperations.push(-sellOperationIndex);
				self.refreshScores();
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
			case "5":
			{
				//接收到了K线数据的消息
				cc.log("jsonText parseK线数据over");
				self.getklinedata(packet.content);

				self.stopProgress();
				 // self.setDataForLlineLayerTest();
				self.setDataForLlineLayer();

				cc.log("get kline K线数据 passed");
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
			case "O"://观看记录
			{
				cc.log("begin to parse 观看记录json text");
				// // self.getRecordKlinedata(packet.content);
				// var data=JSON.parse(packet.content);
				// cc.log("jsonText parse 观看记录over");
				// self.toSetklinedata(data);
				self.getklinedata(packet.content);
				self.advanceToMainKLine_Record();
				cc.log("get 观看记录 passed");

				break;
			}
			case "Y"://观看交易记录Match
			{
				cc.log("begin 观看交易记录Match");
				// self.getRecordKlinedata(packet.content);
				var data=JSON.parse(packet.content);
				cc.log("jsonText parse 观看记录over");
				// self.toSetklinedata(data);
				self.advanceToMainKLine_RecordMatch(data);
				cc.log("get 观看交易记录Match");

				break;
			}
			// case "2":
			// {
			// 	//登录失败
			// 	self.stopProgress();
			// 	self.showErrorBox(packet.content,function(){self.errorBoxClosed();});
			// 	break;
			// }
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
			for(var j=i;j>1;j--)
			{
				if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
				{
					var temp = userInfo.playerListData[j];
					userInfo.playerListData[j] =userInfo.playerListData[j-1];
					userInfo.playerListData[j-1] =temp;
				}
			}
		}
		this.playerInfoLayer.refreshScoresByData();

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
		gSocketConn.UnRegisterEvent("onmessage",this.messageCallBack);
		//再开始一盘

		this.beginNextKLineScene();
	},
	
	matchEndInfoLayer_Share:function()
	{
		//分享
		gSocketConn.SendShareMessage();
		//分享函数
		
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

		cc.log("klineSceneNext begin");
		// cc.director.runScene(gKlineScene);
		var matchInfoMessage =userInfo.matchMode+"#"+userInfo.matchAiMode+"#"+userInfo.matchDayCount;
		cc.log(" beginMatch:function() begin matchInfoMessage="+matchInfoMessage);
		var klineSceneNext=new KLineScene();
		var self=this;
		klineSceneNext.onEnteredFunction=function(){

			cc.log("klineSceneNext onEnteredFunction end");
			// klineSceneNext.showProgress();
		};
		cc.log("klineSceneNext middle");
		//不能放到onEnteredFunction里面
		gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
		cc.director.runScene(klineSceneNext);
		switch(userInfo.matchMode)
		{
			case 0:
			{
				this.showProgress();

				gSocketConn.BeginMatch(matchInfoMessage);
				break;
			}
			case 1:
			{
				// this.KlineWidth = 700;
				// this.KlinePosX = 60;
				this.showProgress();
				gSocketConn.BeginMatch(1);
				break;
			}
			case 2:
			{
				this.showProgress();
				gSocketConn.BeginMatch(matchInfoMessage);
				break;
			}
			case 3:
			{
				break;
			}
			default:
			{
				cc.log("userInfo.matchMode ="+userInfo.matchMode);
				break;
			}
		}
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
		this.clearDataForLineLayer();
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

		this.klineData=[];
		for(var i=0;i<this.prevDataDayCount+this.mainDataDayCount;i++)
		{
			this.klineData.push({o:dailyData[5*i],x:dailyData[5*i+1],i:dailyData[5*i+2],c:dailyData[5*i+3],v:dailyData[5*i+4]});
		}

		this.klinedataMain=[];
		for(var i=this.prevDataDayCount;i<this.prevDataDayCount+this.mainDataDayCount;i++)
		{
			this.klinedataMain.push({o:dailyData[5*i],x:dailyData[5*i+1],i:dailyData[5*i+2],c:dailyData[5*i+3],v:dailyData[5*i+4]});
		}

		this.prevKlineData=[];
		for(var i=0;i<this.prevDataDayCount;i++)
		{
			this.prevKlineData.push({o:dailyData[5*i],x:dailyData[5*i+1],i:dailyData[5*i+2],c:dailyData[5*i+3],v:dailyData[5*i+4]});
		}


	},

	clearBuySellOperation:function()
	{
		this.selfOperations=[];
		this.opponentOperations=[];
		this.klineLayerMain.clearUpDownArrows();
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
		
		//设置前面的一副蜡烛图
		this.klineLayerPrev.setKLineData(null);
		this.volumnTechLayerPrev.setKLineData(null);
		
	
		
		this.klineLayerMain.setKLineData(null);
		this.volumnTechLayerMain.setKLineData(null);
		
		////////////////////////////////////////////////////////
		if(this.countDownSprite!=null)
		{
			this.countDownSprite.removeFromParent(false);
			this.countDownSprite=null;
		}
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.setPlayerInfo();
		}
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
		this.mainLayerAnction();
        //依次画后面的K线
		this.setCountBeginSprite();
		// this.drawAllCandlesOneByOne();
	},
    drawCandlesOneByOneForMatch:function()//匹配赛
    {
        if(this.drawCandleStoped==false)
        {
            this.drawCandleStoped=true;
            // this.refreshScores(this.currentCandleIndex);
            var ended=this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
            this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);

			this.matchRunFlag=true;
            if(ended)
            {
                cc.log("绘制结束");
				this.matchRunFlag=false;
                this.sendEndMessage();
                this.matchEnd();
                return;
            }
            else
            {
                gSocketConn.Step(this.currentCandleIndex);
            }

            this.currentCandleIndex+=1;
        }
        var self=this;
		// pageTimer["drawMatchTimer"] = setTimeout(function(){self.drawCandlesOneByOneForMatch();},100);
        pageTimer["drawTimerMatch"] = setTimeout(function(){self.drawCandlesOneByOneForMatch();},self.currentCandleDrawInterval);
    },


    drawCandlesOneByOne:function()
    {
        if(this.drawCandleStoped==false)
        {
            // this.drawCandleStoped=true;
			if(userInfo.matchMode==0){
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
		if(this.drawCandleStoped==false)
		{

			// this.drawCandleStoped=true;
			if(userInfo.matchMode==0){
				this.refreshScores(this.currentCandleIndex);
			}

			// if(this.currentCandleIndex==241||this.currentCandleIndex==301)
			// {
			// 	cc.log("drawAllCandlesOneByOne绘制120");
			//  	this.moveByPos();
			// }

			if(this.currentCandleIndex>240)
			{
				cc.log("drawAllCandlesOneByOne绘制120");
				this.moveByOnePos();
			}

			//var curentIndex = this.currentCandleIndex+120;
			var ended=this.klineLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			this.volumnTechLayerMain.drawSingleCandleLineByCurrentIndex(this.currentCandleIndex);
			cc.log("drawAllCandlesOneByOne currentIndex=="+this.currentCandleIndex);
			this.matchRunFlag=true;
			if(ended)
			{
				cc.log("绘制结束");
				this.matchRunFlag=false;
				this.sendEndMessage();
				this.matchEnd();
				return;
			}
			else
			{
				gSocketConn.Step(this.currentCandleIndex-120);
			}

			this.currentCandleIndex+=1;
		}
		var self=this;
		pageTimer["drawTimer"] = setTimeout(function(){self.drawAllCandlesOneByOne();},this.currentCandleDrawInterval);
	},



	setDataForLlineLayer:function()//比赛图
	{
		if(this.klinedataMain==null || this.prevKlineData==null) return;
		this.stopProgress();
		this.phase2=false;
		// 设置前面的一副蜡烛图
		// this.removeChild(this.klineLayerMain);
		// this.removeChild(this.volumnTechLayerMain);
		// if(this.klineLayerPrev!=null)
		// this.klineLayerPrev.removeFromParent(false);
		// if(this.volumnTechLayerPrev!=null)
		// this.volumnTechLayerPrev.removeFromParent(false);


		// this.removeChild(this.klineLayerPrev);
		// this.removeChild(this.volumnTechLayerPrev);
		//先显示前面一副蜡烛图（历史数据）
		// this.klineLayerPrev.setKLineData(this.prevKlineData);
		// this.volumnTechLayerPrev.setKLineData(this.prevKlineData);
		// this.addChild(this.klineLayerPrev,this.mainLayerNumber,this.klineLayerPrev.getTag());
		// if(this.getChildByTag(this.volumnTechLayerPrev.getTag())==null){
		// 	this.addChild(this.volumnTechLayerPrev,this.volumnTechLayerNumber,this.volumnTechLayerPrev.getTag());
		// }
		// cc.log("drawAllCandlesTillIndexOrEnd");
		// this.klineLayerPrev.drawAllCandlesTillIndexOrEnd();
        // // this.klineLayerPrev.drawAllCandlesTillBetweenIndex(119,239);
		// this.volumnTechLayerPrev.drawAllCandlesTillIndexOrEnd();
		// cc.log("drawAllCandlesTillIndexOrEnd Over....");

		//先显示前面120一副蜡烛图（历史数据）
		this.klineLayerMain.setKLineData(this.klineData);
		this.volumnTechLayerMain.setKLineData(this.klineData);

		this.drawHistoryCandlePart2();

		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.setPlayerInfo();
		}

		if(userInfo.matchMode==1){
			if(gKlineScene!=null)
			{
				gSocketConn.SendBeginMessage();
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
		this.matchRunFlag=true;
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
			this.countDownNumber=3;
			// this.advanceToMainKLine_PhaseMatch();
			return;
		}
		
		if(this.countDownSprite==null)
		{
			this.countDownNumber=3;
			//this.countDownSprite= cc.Sprite.create("res/cd_5.png");
			this.countDownSprite= cc.LabelTTF.create(this.countDownNumber,"Arial",100);
			this.addChild(this.countDownSprite,8);
		}
		this.countDownSprite.setVisible(true);

		this.countDownSprite.setPosition(this.size.width / 2, this.size.height / 2+25);
		this.countDownSprite.setOpacity(255);
		this.countDownSprite.setString(this.countDownNumber);

		this.countDownNumber-=1;
		var self=this;
		pageTimer["beginTimer"] = setTimeout(function(){self.setCountDownSprite();},1000);
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
				this.matchInfoLayer.ableSpeedButtons();
			}
			//依次画后面的K线
			this.drawAllCandlesOneByOne();
			return;
		}


		this.countBeginSprite.setVisible(true);
		this.countBeginSprite.setString(this.countBeginNumber);
		this.countBeginNumber-=1;
		cc.log("end this.countBeginNumber==",this.countBeginNumber);
		var self=this;
		pageTimer["beginTimer"] = setTimeout(function(){self.setCountBeginSprite();},1000);
	},

	phase1Time:0.25,
	phase2Time:0.5,
	// phase3Time:0.25,
	
	createAnimation_Move:function()
	{
		var actionMoveIn=new cc.moveBy(this.phase1Time,0,-25);
		var actionBlank=new cc.ActionInterval(this.phase2Time);
		var actionMoveOut=new cc.moveBy(this.phase1Time,0,-25);
		return new cc.Sequence(actionMoveIn,actionBlank,actionMoveOut);
	},
	
	createAnimation_Scale:function()
	{
		var actionScaleIn=new cc.ScaleBy(this.phase1Time,1,5);
		var actionBlank=new cc.ActionInterval(this.phase2Time);
		var actionScaleOut=new cc.ScaleBy(this.phase1Time,1,0.2);
		return new cc.Sequence(actionScaleIn,actionBlank,actionScaleOut);
	},
	
	createAnimation_Fade:function()
	{
		var actionFadeIn=new cc.FadeTo(this.phase1Time,255);
		var actionBlank=new cc.ActionInterval(this.phase2Time);
		var actionFadeOut=new cc.FadeTo(this.phase3Time,0);
		return new cc.Sequence(actionFadeIn,actionBlank,actionFadeOut);
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
		var moveLeft1  = cc.MoveBy.create(1,posEnd0);  // 左移
		var moveLeft2  = cc.MoveBy.create(1,posEnd0);  // 左移
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

		var self =this;
		var posBegain = cc.p(0,0);
		var posEnd0 = cc.p(-this.KlineWidth,0);
		var posEnd1 = cc.p(-this.KlineWidth/3,0);
		var moveLeft1  = cc.MoveBy.create(1,posEnd0);  // 左移
		var moveLeft2  = cc.MoveBy.create(1,posEnd0);  // 左移
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
		this.klineLayerMain.setKLineData(this.klinedata,this.prevKlineData);
		//设置附图的数据
		this.volumnTechLayerMain.setKLineData(this.klinedataMain,this.prevKlineData);
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
			if(userInfo.matchMode!=1){
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
		}
		//一次性画出当前数据图
		this.businessInfo();
		cc.log("advanceToMainKLine_RecordMatch:function()//Match观看记录 end");
	},


	advanceToMainKLine_Record:function()//观看记录
	{
		cc.log("advanceToMainKLine_Record:function()//观看记录 begin");
		if(this.klinedataMain==null || this.prevKlineData==null) return;
		this.phase2=true;

		// if(this.klineLayerPrev!=null)
		// 	this.klineLayerPrev.removeFromParent(false);
		// if(this.volumnTechLayerPrev!=null)
		// 	this.volumnTechLayerPrev.removeFromParent(false);

		//设置主K线图的数据
		this.klineLayerMain.setKLineData(this.klinedataMain,this.prevKlineData);
		// this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		//设置附图的数据
		this.volumnTechLayerMain.setKLineData(this.klinedataMain,this.prevKlineData);
		// this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
        //
		// if(this.lowerLayer.getChildByTag(this.klineLayerMain.getTag())){
		// 	this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		// }
		// if(this.lowerLayer.getChildByTag(this.volumnTechLayerMain.getTag())){
		// 	this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
		// }

		var self=this;
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
		this.phase2=true;

		if(this.klineLayerPrev!=null)
			this.klineLayerPrev.removeFromParent(false);
		if(this.volumnTechLayerPrev!=null)
			this.volumnTechLayerPrev.removeFromParent(false);
		
		//设置主K线图的数据
		this.klineLayerMain.setKLineData(this.klinedataMain,this.prevKlineData);
		// this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		
		//设置附图的数据
		this.volumnTechLayerMain.setKLineData(this.klinedataMain,this.prevKlineData);
		// this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
		if(this.lowerLayer.getChildByTag(this.klineLayerMain.getTag())){
			this.addChild(this.klineLayerMain,this.mainLayerNumber,this.klineLayerMain.getTag());
		}
		if(this.lowerLayer.getChildByTag(this.volumnTechLayerMain.getTag())){
			this.addChild(this.volumnTechLayerMain,this.volumnTechLayerNumber,this.volumnTechLayerMain.getTag());
		}

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
		if(this.klineLayerMain!=null)
		{
			this.klineLayerMain.drawAllCandlesAll();
			//画出买卖操作的信息
			this.businessInfo();
		}
		if(this.volumnTechLayerMain!=null)
			this.volumnTechLayerMain.drawAllCandlesAll();
		this.currentCandleIndex=this.klinedataMain.length;


		this.stopProgress();
		//cc.log("drawCandlesAll this.currentCandleIndex = ",this.currentCandleIndex);
	},
	//
	businessInfo:function()
	{
		cc.log("businessInfo:function() begin= ");
		if(this.phase2==false)return;
		this.clearBuySellOperation();
		var businessInfo = this.buyInfo;
		this.selfOperations=[];
		for (i=0;i<businessInfo.length;i++)
		{
			cc.log("businessInfo[" + i + "] = " + businessInfo[i]);
			this.selfOperations.push(businessInfo[i]);
			if(businessInfo[i]>0)
			{
				this.klineLayerMain.setUpArrowIndex(Math.abs(businessInfo[i]),(this.selfOperations.length%2==1));
			}else{
				this.klineLayerMain.setDownArrowIndex(Math.abs(businessInfo[i]),(this.selfOperations.length%2==1));
			}
			
		}
		var score = this.buyScore;
		this.playerInfoLayer.refreshScoresByData();
		this.playerInfoLayer.refreshScores(score);
		if(this.playerInfoLayer!=null)
		{
			this.playerInfoLayer.ableInfoButtons();
		}
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
		//注意：此处存入的买入操作的index不是从0开始，而是从1开始的
		var lastCandleIndex=this.currentCandleIndex;
		this.selfOperations.push(lastCandleIndex);
		this.refreshScores(lastCandleIndex);
		
		this.klineLayerMain.setUpArrowIndex(lastCandleIndex,(this.selfOperations.length%2==1));
		
		if(gSocketConn!=null && gSocketConn!=undefined)
		{
			gSocketConn.Buy(lastCandleIndex-120);
		}
	},
	
	sellClick:function()
	{
		cc.log("sellClick:function() begin");
		if(this.phase2==false)return;
		//注意：此处存入的卖出操作的index不是从0开始，而是从1开始的
		var lastCandleIndex=this.currentCandleIndex;
		this.selfOperations.push(-lastCandleIndex);
		this.refreshScores(lastCandleIndex);
		
		this.klineLayerMain.setDownArrowIndex(lastCandleIndex,(this.selfOperations.length%2==1));
		if(gSocketConn!=null && gSocketConn!=undefined)
		{
			gSocketConn.Sell(lastCandleIndex-120);
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

        if(typeof(gMainMenuScene)=="undefined")
        {
			window.location.href="http://analyse.kiiik.com/";
        }
        else if(gMainMenuScene!=null)
        {
            //window.close();

			if(gMainMenuScene==false)
				gMainMenuScene=new MainMenuScene();
			if(this.matchRunFlag==true){
				var errorInfo = "";
				gSocketConn.SendEndErrorMessage(errorInfo);
			}
			
			gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);
			gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
			//cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
			cc.director.runScene(gMainMenuScene);
            //window.location.href="clear.html";
        }
        //this.matchInfoLayer.disableAllButtons();
    },

	start:function()
	{
		if(gKlineScene!=null)
		{
			gSocketConn.SendBeginMessage();
			gKlineScene.setCountDownSprite();
		}

	},

});