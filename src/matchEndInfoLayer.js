// JavaScript Document
var MatchEndInfoLayer= cc.Layer.extend({
	
	bgSprtie:null,
	stockInfoLabel:null,
	btnReplay:null,		//复盘---退出游戏
	btnAgain:null,		//再战
	btnShare:null,		//分享
	
	againCallBackFunction:null,
	replayCallBackFunction:null,
	shareCallBackFunction:null,
	
	avatarSprite:null,
	
	ishidden:true,
	scoreLabel:null,
	
	scoreLabel2:null,
	
	ctor:function()
	{
		this._super();
		this.width=476;
		this.height=232;
	},


	onEnter:function () 
	{
		this._super();
		this.size = cc.director.getWinSize();
		this.fXScale = this.size.width/1280;
		this.fYScale = this.size.height/720;

		this.tableView = null;
		// this.width = 985*this.fXScale;
		// this.height = 483*this.fYScale;

		// this.setOpacity(160);
		// var listener = cc.EventListener.create({
		// 	event: cc.EventListener.TOUCH_ONE_BY_ONE,
		// 	swallowTouches: true,
		// 	onTouchBegan: function (touch, event) {
		// 		return true;
		// 	}
		// });
		// cc.eventManager.addListener(listener, this);
		// this._listener = listener;


		var self=this;

		this.stockInfoLabel=cc.LabelTTF.create("", "Arial", 30);
		//this.stockInfoLabel.setColor(cc.color(40,184,245,255));
		this.stockInfoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
		this.stockInfoLabel.setAnchorPoint(0.5,0.5);
		var posBtnY = 39;

		var bgSize = cc.director.getWinSize();
		if(userInfo.matchMode>0)//多人
		{

			this.bgSprtie = cc.Sprite.create("res/matchMoreEnd.png");
			bgSize = this.bgSprtie.getContentSize();

			//设置用户名
			text1Label = new cc.LabelTTF(" 玩家 ", "Arial", 32.0);
			text1Label.setPosition(cc.p(210,bgSize.height-120));

			//设置收益
			text2Label = new cc.LabelTTF("本局收益", "Arial", 32.0);
			text2Label.setPosition(cc.p(bgSize.width / 2+10,bgSize.height-120));
			// text2Label.setAnchorPoint(0,0.5);

			this.decInfoLabel=cc.LabelTTF.create("排名", "Arial", 30);
			//this.stockInfoLabel.setColor(cc.color(40,184,245,255));
			this.decInfoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
			this.decInfoLabel.setColor(WhiteColor);
			this.decInfoLabel.setAnchorPoint(0,0.5);
			this.decInfoLabel.setPosition(15, bgSize.height-120);
			this.stockInfoLabel.setPosition(bgSize.width / 2, bgSize.height-55);

			this.bgSprtie.addChild(text1Label,2);
			this.bgSprtie.addChild(text2Label,2);
			this.bgSprtie.addChild(this.stockInfoLabel,2);
			this.bgSprtie.addChild(this.decInfoLabel,2);
			posBtnY = 70;

			if(this.tableView==null)
			this.tableView = new cc.TableView(this, cc.size(1000, 360));

			this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
			//tableView.setAnchorPoint(0,1);
			//cc.log(-winSize.width/2,-40);this
			this.tableView.setPosition(-244,-130);
			//tableView.setPosition(0,0);
			//tableView.x = winSize.width/2;
			//tableView.y = winSize.height / 2 - 150;
			// this.tableView.setScale(fXScale,fYScale);
			this.tableView.setDelegate(this);
			this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
		}
		else//单人
		{

			this.bgSprtie = cc.Sprite.create("res/matchEnd.png");
			bgSize = this.bgSprtie.getContentSize();
			this.stockInfoLabel.setPosition(bgSize.width / 2, bgSize.height-265);
			this.bgSprtie.addChild(this.stockInfoLabel,2);
			this.scoreLabel=cc.LabelTTF.create("", "黑体", 30);
			//this.stockInfoLabel.setColor(cc.color(40,184,245,255));
			this.scoreLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
			// this.scoreLabel.setAnchorPoint(0,0.5);
			this.scoreLabel.setPosition(bgSize.width / 2, bgSize.height-160);
			this.scoreLabel.setColor(cc.color(33,158,187,255));
			this.scoreLabel.setString("您这局的收益率为：");
			this.bgSprtie.addChild(this.scoreLabel,2);


			this.scoreLabel2=cc.LabelTTF.create("", "Arial", 30);
			//this.stockInfoLabel.setColor(cc.color(40,184,245,255));
			this.scoreLabel2.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
			this.scoreLabel2.setAnchorPoint(0,0.5);
			this.scoreLabel2.setPosition(bgSize.width / 2+this.scoreLabel.getContentSize().width/2, bgSize.height-160);
			this.scoreLabel2.setColor(cc.color(33,158,187,255));
			this.bgSprtie.addChild(this.scoreLabel2,2);


			this.avatarSprite=cc.Sprite.create("res/bg_touxiang.png");
			this.avatarSprite.setPosition(bgSize.width /4, bgSize.height-160);
			// this.avatarSprite.setScale(0.4);
			this.bgSprtie.addChild(this.avatarSprite,5);
			// this.addChild(this.avatarSprite,5);
			var url = userInfo.headSprite;
			cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
				if(err){
					cc.log(err);
					cc.log("MatchEndInfoLayer fail loadImg="+userInfo.headSprite); // self.addChild(logo);
				}
				if(img){
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
					headSprite.setPosition(bgSize.width /4, bgSize.height-160);
					self.bgSprtie.addChild(headSprite,5);

					cc.log("MatchEndInfoLayer success loadImg="+userInfo.headSprite); // self.addChild(logo);
					// self.touxiangSprite.setValue(false);
				}

			});

			posBtnY =70;


		}
		// this.btnReplay=new Button("res/meBtnReplay.png");

		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.bgSprtie.addChild(mu, 2);

		this.btnAgain=new cc.MenuItemImage("res/meBtnAgain.png","", self.again, this);//new Button("res/home.png");
		// this.btnAgain.setScale(fXScale,fYScale);
		// this.btnAgain.setPosition(cc.p(size.width/4,posY));
		mu.addChild(this.btnAgain);
		this.btnShare=new cc.MenuItemImage("res/meBtnShare.png","", self.share, this);//new Button("res/home.png");
		// this.btnShare.setScale(fXScale,fYScale);
		// this.btnShare.setPosition(cc.p(size.width/4*3,posY));
		mu.addChild(this.btnShare);
		this.btnReplay=new cc.MenuItemImage("res/btnEnd.png","", self.replay, this);//new Button("res/home.png");
		// this.meBtnStart.setScale(fXScale,fYScale);
		// this.meBtnStart.setPosition(cc.p(size.width/2,posY));
		mu.addChild(this.btnReplay);

		// this.btnReplay=new Button("res/btnEnd.png");
		// this.btnReplay.setClickEvent(function(){
		// 	self.replay();
		// });

		// this.btnAgain=new Button("res/meBtnAgain.png");
		// this.btnAgain.setClickEvent(function(){
		// 	self.again();
		// });

		// this.btnShare=new Button("res/meBtnShare.png");
		// this.btnShare.setClickEvent(function(){
		// 	cc.log("res/meBtnShare.png Click!!!");
		// 	self.share();
		// });


		// this.width = 985*this.fXScale;
		// this.height = 483*this.fYScale;
		// this.btnReplay.setScale(this.fXScale,this.fYScale);
		// this.btnShare.setScale(this.fXScale,this.fYScale);
		// this.btnAgain.setScale(this.fXScale,this.fYScale);
		this.btnReplay.setPosition(bgSize.width/4,posBtnY);
		this.btnAgain.setPosition(bgSize.width/2,posBtnY);
		this.btnShare.setPosition(3*bgSize.width/4,posBtnY);
		// this.bgSprtie.addChild(this.btnReplay,2);
		// this.bgSprtie.addChild(this.btnAgain,2);
		// this.bgSprtie.addChild(this.btnShare,2);

		this.bgSprtie.setPosition(this.width / 2, this.height / 2);
		// this.bgSprtie.setScale(this.fXScale,this.fYScale);
		this.addChild(this.bgSprtie,1);

		if(this.tableView!=null)
		{
			this.tableView.reloadData();
			this.addChild(this.tableView,2);
		}
		this.setScale(this.fXScale,this.fYScale);


		// Back Menu
		//var itemBack = new cc.MenuItemFont("Close", this.toMainLayer, this);
		//itemBack.x = winSize.width - 50;
		//itemBack.y = 25;
		//var menuBack = new cc.Menu(itemBack);
		//menuBack.x = 0;
		//menuBack.y = 0;
		//this.addChild(menuBack);
		return true;



	},
	onExit:function()
	{
		this._super();
		cc.eventManager.removeAllListeners();
		this.removeAllChildrenWithCleanup(true);
		cc.log("MatchEndInfoLayer onExit end");
	},

	replay:function()
	{
		if(this.replayCallBackFunction!=null)
		{
			this.replayCallBackFunction();
		}
	},
	
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

    start:function()
    {
        if(this.startCallBackFunction!=null)
        {
            this.startCallBackFunction();
        }
    },

	hideLayer:function()
	{
		this.setVisible(false);
		this.scheduler.pauseTarget(this);
		this.actionManager && this.actionManager.pauseTarget(this);
		cc.eventManager.pauseTarget(this,true);
	},
	
	showLayer:function()
	{
		this.setVisible(true);
		this.scheduler.resumeTarget(this);
		this.actionManager && this.actionManager.resumeTarget(this);
		cc.eventManager.resumeTarget(this,true);
	},
	
	
	//根据Content的内容，解析后赋予参数
	applyParamsFromContent:function(content)
	{
		switch(userInfo.matchMode)
		{
			case 0:
			{
				var fields=content.split("#");
				var len=fields.length;
				this.stockInfoLabel.setString(fields[len-3]+" ("+fields[len-2]+" - "+fields[len-1]+")");
				var ratio=parseFloat(fields[2]);
				if(ratio>0)
				{
					this.scoreLabel2.setColor(cc.color(249,27,27,255));
				}
				else if(ratio<0)
				{
					this.scoreLabel2.setColor(cc.color(6,224,0,255));
				}
				else
				{
					this.scoreLabel2.setColor(cc.color(255,255,255,255));
				}
				this.scoreLabel2.setString(ratio.toFixed(2)+"%");
				break;
			}
			case 1:
			{
				cc.log("MatchEndInfoLayer to parse json text");
				// {"codeInfo":"600970(上证)#2006-07-27#2007-01-23","endInfoOfAllPlayers":[{"nickName":"开心的钱多多","ranking":2,"matchId":6231,"score":-34.99,"level":0,"exp":0},{"nickName":"唐齐安通道","ranking":1,"matchId":6231,"score":-1.76,"level":0,"exp":0}]}
				var ratio=parseFloat(0);
				var data=JSON.parse(content);
				this.stockInfoLabel.setString(data["codeInfo"]);
				var endInfoData = data["endInfoOfAllPlayers"];
				var endInfoList = new Array()
				// userInfo.endInfoOfAllPlayers=;
				for(var i=0;endInfoData!=null&&i<endInfoData.length;i++)
				{
					cc.log("showPlayerInfo playerData.userName="+endInfoData[i]["nickName"]);
					if(userInfo.nickName==endInfoData[i]["nickName"])ratio=endInfoData[i]["score"];
					endInfoList.push(endInfoData[i]);
				}
				//按排名排序

				for(var i=0;i<endInfoList.length;i++)
				{
					for(var j=i;j<endInfoList.length-i-1;j++)
					{
						if(endInfoList[j]["ranking"]>endInfoList[j+1]["ranking"])
						{
							var temp = endInfoList[j];
							endInfoList[j] =endInfoList[j+1];
							endInfoList[j+1] =temp;
						}
					}

				}
				if(userInfo.endInfoOfAllPlayers!=null)
				{
					userInfo.endInfoOfAllPlayers=[];
				}
				userInfo.endInfoOfAllPlayers = endInfoList;

				if(this.tableView!=null)
				{
					this.tableView.reloadData();
					// this.tableView.setVisible(true);
				}
				break;
			}
			case 2:
			{

				cc.log("MatchEndInfoLayer to parse json text");
				// {"codeInfo":"600970(上证)#2006-07-27#2007-01-23","endInfoOfAllPlayers":[{"nickName":"开心的钱多多","ranking":2,"matchId":6231,"score":-34.99,"level":0,"exp":0},{"nickName":"唐齐安通道","ranking":1,"matchId":6231,"score":-1.76,"level":0,"exp":0}]}
				var ratio=parseFloat(0);
				var data=JSON.parse(content);
				this.stockInfoLabel.setString(data["codeInfo"]);
				var endInfoData = data["endInfoOfAllPlayers"];
				var endInfoList = new Array()
				// userInfo.endInfoOfAllPlayers=;
				for(var i=0;endInfoData!=null&&i<endInfoData.length;i++)
				{
					cc.log("showPlayerInfo playerData.userName="+endInfoData[i]["nickName"]);
					if(userInfo.nickName==endInfoData[i]["nickName"])ratio=endInfoData[i]["score"];
					endInfoList.push(endInfoData[i]);
				}
				//按排名排序

				for(var i=0;i<endInfoList.length;i++)
				{
					for(var j=i;j<endInfoList.length-i-1;j++)
					{
						if(endInfoList[j]["ranking"]>endInfoList[j+1]["ranking"])
						{
							var temp = endInfoList[j];
							endInfoList[j] =endInfoList[j+1];
							endInfoList[j+1] =temp;
						}
					}

				}
				// endInfoList.sort(function(a,b){return a["ranking"]>b["ranking"]?1:-1});
				// alert(endInfoList);
				if(userInfo.endInfoOfAllPlayers!=null)
				{
					userInfo.endInfoOfAllPlayers=[];
				}
				userInfo.endInfoOfAllPlayers = endInfoList;

			if(this.tableView!=null)
			{
				this.tableView.reloadData();
				// this.tableView.setVisible(true);
			}
				// 	var arrDemo = ;
//
// arrDemo[0] = 10;
// arrDemo[1] = 50;
// arrDemo[2] = 51;
// arrDemo[3] = 100;
//
// arrDemo.sort(); //调用sort方法后，数组本身会被改变，即影响原数组
//
// alert(arrDemo);//10,100,50,51 默认情况下sort方法是按ascii字母顺序排序的，而非我们认为是按数字大小排序
//
// arrDemo.sort(function(a,b){return a>b?1:-1});//从小到大排序
//
// alert(arrDemo);//10,50,51,100
//
// arrDemo.sort(function(a,b){return a<b?1:-1});//从大到小排序
//
// alert(arrDemo);//100,51,50,10
				//

				// this.setPlayerEndInfo();

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

		// cc.log(content);
	},


	scrollViewDidScroll:function (view) {
	},
	scrollViewDidZoom:function (view) {
	},

	tableCellTouched:function (table, cell) {
		cc.log("cell touched at index: " + cell.getIdx());
		// var matchId = userInfo.MatchListData[cell.getIdx()]["matchId"];
		// var userId = userInfo.MatchListData[cell.getIdx()]["uid"];
		// gSocketConn.SendRecordMessage(userId,matchId);
	},
	tableCellTouched2:function () {
		cc.log("cell touched at index: ");
	},

	tableCellSizeForIndex:function (table, idx) {
		//if (idx == 2) {
		//    return cc.size(1000, 100);
		//}
		return cc.size(1000, 90);
	},

	tableCellAtIndex:function (table, idx) {
		cc.log("cell tableCellAtIndex index: "+idx);
		var self = this;
		var strValue = idx.toFixed(0);
		var strText;
		var cell = table.dequeueCell();
		var label;
		var textLabel;
		if (!cell) {
			cell = new PlayerInfoCell();

			//label = new cc.LabelTTF(strValue, "Arial", 30.0);
			//label.setPosition(cc.p(0,20));
			//label.setAnchorPoint(0,0);
			//label.tag = 123;
			//cell.addChild(label);
			if(userInfo.endInfoOfAllPlayers!=null)
			{
				cell.setCellData(idx);
			}

		}
		else {
			//label = cell.getChildByTag(123);
			//label.setString(strValue);
			if(userInfo.endInfoOfAllPlayers!=null)
			{
				cell.setCellData(idx);
			}
		}

		return cell;
	},

	numberOfCellsInTableView:function (table) {
		if(userInfo.endInfoOfAllPlayers!=null)
		{
			if(userInfo.endInfoOfAllPlayers.length>4)
				return 4;
			else
				return userInfo.endInfoOfAllPlayers.length;
		}
		else return 0;
	},



});

var PlayerInfoCell = cc.TableViewCell.extend({
	draw:function (ctx) {
		this._super(ctx);

	},

	setCellData:function(idx){
		cc.log("PlayerInfoCell setCellData=="+idx);
		var sprite = new cc.Sprite("res/line_bg.png");
		sprite.setPosition(cc.p(0,0));
		sprite.setAnchorPoint(0,0);
		this.addChild(sprite);
		if(userInfo.endInfoOfAllPlayers[idx]!=null)
		{

			var rankFlag = parseInt(userInfo.endInfoOfAllPlayers[idx]["ranking"]);
			rankLabel = new cc.LabelTTF(rankFlag, "Arial", 35.0);
			rankLabel.setPosition(cc.p(20,40));
			rankLabel.setAnchorPoint(0,0.5);
			sprite.addChild(rankLabel);
			//设置用户名
			strNameText= userInfo.endInfoOfAllPlayers[idx]["nickName"];
			textNameLabel = new cc.LabelTTF(cutstr(strNameText,11), "Arial", 25.0);
			textNameLabel.setPosition(cc.p(200,40));
			// textNameLabel.setAnchorPoint(0,0.5);
			sprite.addChild(textNameLabel);

			//strText= "名字:"+userInfo.MatchListData[idx]["uid"]+"  收益:"+userInfo.MatchListData[idx]["score"]+"  "+userInfo.MatchListData[idx]["matchTime"];

			//设置收益
			strScoreText= userInfo.endInfoOfAllPlayers[idx]["score"]+"%";
			textScoreLabel = new cc.LabelTTF(strScoreText, "Arial", 35.0);
			textScoreLabel.setPosition(cc.p(500,40));
			textScoreLabel.setAnchorPoint(0.5,0.5);
			if(userInfo.endInfoOfAllPlayers[idx]["score"]>0)
			{
				textScoreLabel.setColor(RedColor);
			}
			else if(userInfo.endInfoOfAllPlayers[idx]["score"]<0)
			{
				textScoreLabel.setColor(GreenColor);
			}
			else
			{
				textScoreLabel.setColor(WhiteColor);
			}
			sprite.addChild(textScoreLabel);


			//设置查看交易记录按钮
			//设置查看交易记录按钮
			recordButton=new Button("res/btnRecord.png");
			recordButton.setAnchorPoint(0,0.5);
			recordButton.setPosition(cc.p(800,40));
			sprite.addChild(recordButton);
			var matchId = userInfo.endInfoOfAllPlayers[idx]["matchId"];
			var userId = userInfo.endInfoOfAllPlayers[idx]["nickName"];
            userInfo.matchId = matchId;
			cc.log("PlayerInfoCell recordButton ClickEvent userId["+idx+"] ="+userId+"||matchId="+matchId);
			recordButton.setClickEvent(function(){
				// gSocketConn.SendRecordMatchMessage(userId,matchId);
				// cc.log("PlayerInfoCell ClickEvent userId["+idx+"] ="+userId+"||matchId="+matchId+"||recordButton="+recordButton.__instanceId);
				// // cc.director.runScene(klineSceneNext);
				gSocketConn.SendRecordMatchMessage(userId,matchId);

			});
		}
	},

});