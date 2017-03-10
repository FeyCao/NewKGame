// JavaScript Document
var PlayerInfoLayer= cc.Layer.extend({
	
	playerInfoArea:null,			//绘图的区域
	selfNameLabel:null,				//自己的名字
	selfScoreLabel:null,			//自己的分数
	avatarSprite:null,				//自己的头像

	headSprite:null,				//自己的头像
	// playerInfo_bg1:null,
	// playerInfo_bg2:null,
	// playerInfo_bg3:null,

	// playerInfo_btn0:null,//信息按鈕
	playerInfo_btn:null,//信息按鈕
    playerInfo_bg:null,//信息背景bg
	playerHead_Sprite:null,//头像
	playerNameLabel:null,				//名字
	playerScoreLabel:null,			//分数

	playerEmoticonBtn:null,
	// player1Label:null,				//自己的名字
	// playerScore1Label:null,			//自己的分数

     ctor:function(width,height)
	{
		this._super();
		this.width=width;
		this.height=height;
	},
	
	onEnter:function () 
	{
		this._super();
		var self = this;
		this.size = cc.director.getWinSize();
		this.fXScale = this.size.width/1280;
		this.fYScale = this.size.height/720;

		this.playerInfo_btn=[];
        this.playerInfo_bg =[];
		this.playerHead_Sprite  =[];
        this.playerNameLabel =[];
        this.playerScoreLabel =[];
		this.playerEmoticonBtn =[];

		this.playerInfoArea=new cc.DrawNode();
		//设置K线图的区域
		this.playerInfoArea.setPosition(cc.p(0,0));
		this.playerInfoArea.width=this.width;
		this.playerInfoArea.height=this.height;
		this.addChild(this.playerInfoArea, 1);

		this.selfNameLabel=cc.LabelTTF.create(cutstr(userInfo.nickName,11), "Arial", 20);
        this.selfNameLabel.setScale(this.fXScale,this.fYScale);
		//this.selfNameLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
		this.selfNameLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
		this.selfNameLabel.setAnchorPoint(0,0.5);
		this.selfNameLabel.setPosition(160*this.fXScale, this.height-20);
		this.addChild(this.selfNameLabel,5);

		this.selfScoreLabel=cc.LabelTTF.create("0.00%", "Arial", 22);
		this.selfScoreLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
		// this.selfScoreLabel.setAnchorPoint(0,0.5);
		this.selfScoreLabel.setPosition(this.width/3,this.height-20);
		// this.selfScoreLabel.setPosition(cc.pAdd(this.selfNameLabel.getPosition(),cc.p(this.selfNameLabel.getContentSize().width+10,0)));
		this.addChild(this.selfScoreLabel,5);


		// if(gPlayerAvatarSprite==null)
		// {
		// 	gPlayerAvatarSprite=cc.Sprite.create("res/avatar"+(1+Math.round(Math.random()*10)%5)+".png");
		// }
		// this.avatarSprite=cc.Sprite.create(gPlayerAvatarSprite.getTexture());

		// var frameCache = cc.spriteFrameCache;
		// frameCache.addSpriteFrames("res/touxiang.plist", "res/bg_touxiang.png");
		this.avatarSprite=cc.Sprite.create("res/bg_touxiang.png");
		this.avatarSprite.setPosition(120*this.fXScale,this.height-20);
		this.avatarSprite.setScale(0.3);
		this.addChild(this.avatarSprite,5);

		// this.setPlayerInfo();
		this.drawAreaBorder();
	},

	onExit:function()
	{
		this._super();
		cc.eventManager.removeAllListeners();
		this.removeAllChildrenWithCleanup(true);
		cc.log("PlayerInfoLayer onExit end");
	},
	setPlayerInfo:function()
	{
        //.setScale(this.fXScale,this.fYScale);

		var InfoposX = 60;
		var InfoposY1 = 100;
		var InfoposY2 = 20;

		var fontSize = 25;
		var size = cc.size(90,90);
		if(userInfo.matchMode==null)return;


		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.addChild(mu, 2);


		switch(userInfo.matchMode)
		{
			case 0:
			{
				cc.log("PlayerInfoLayer setPlayerInfo:function()=0" );
				this.avatarSprite.setVisible(true);
				break;
			}
			case 2:
			case 1:
			{
				cc.log("PlayerInfoLayer setPlayerInfo:function()=1 userInfo.playerListData.length="+userInfo.playerListData.length );// this.avatarSprite.setVisible(false);
				for(var i=0;i<userInfo.playerListData.length;i++)
				{
					if(this.playerInfo_bg[i] ==null)
					{
						this.playerInfo_bg[i]=cc.Sprite.create("res/playerInfo_bg.png");
						this.playerInfo_bg[i].setPosition(60*this.fXScale,(500-252*i)*this.fYScale);
						this.playerInfo_bg[i].setScale(this.fXScale,this.fYScale);
						this.playerNameLabel[i] = cc.LabelTTF.create(userInfo.nickName, "fonts/Arial.ttf", fontSize,cc.size(100,100));
						this.playerNameLabel[i].setAnchorPoint(0,1);
						this.playerScoreLabel[i] = cc.LabelTTF.create("0.00%", "Arial", 24);
						this.playerInfo_btn[i] = new cc.MenuItemImage(res.BLUE_BG_png,"", "", this);//new Button("res/less_bg.png");
						// var size = this.playerInfo_btn[i].getContentSize();
						this.playerInfo_btn[i].setContentSize(size);
						// this.playerInfo_btn[i].setScale(40/size.width,40/size.height);
						this.playerInfo_btn[i].setPosition(60*this.fXScale,(500-252*i)*this.fYScale);
						if (i==0)
						{
							this.playerNameLabel[i].setString(userInfo.nickName);
							this.playerInfo_btn[i].setCallback(function (){
								cc.log("playerInfo_btn0 ClickEvent ");
								var matchId = userInfo.matchId;
								var userId = userInfo.playerListData[0]["userName"];
								cc.log("playerInfo_btn0 ClickEvent userId[0] ="+userId+"||matchId="+userInfo.matchId);

								gSocketConn.SendRecordMatchMessage(userId,matchId);
							});

						}
						else
						{
							this.playerNameLabel[i].setString("");
							this.playerInfo_btn[i].setCallback(function () {
								cc.log("playerInfo_btn1 ClickEvent ");

								var matchId = userInfo.matchId;
								var userId = userInfo.playerListData[1]["userName"];
								cc.log("playerInfo_btn0 ClickEvent userId[1] =" + userId + "||matchId=" + userInfo.matchId);
								gSocketConn.SendRecordMatchMessage(userId, matchId);
							});
							// this.playerInfo_bg[i].addChild(this.playerInfo_btn1);
						}
						this.playerInfo_btn[i].setVisible(false);

						// this.btnAgain=new cc.MenuItemImage("res/meBtnAgain.png","", self.again, this);//new Button("res/home.png");
						// this.btnAgain.setScale(fXScale,fYScale);
						// this.btnAgain.set
						// this.btnAgain.setPosition(cc.p(size.width/4,posY));
						mu.addChild(this.playerInfo_btn[i]);


						this.playerHead_Sprite[i] = cc.Sprite.create("res/bg_touxiang.png");
						this.playerHead_Sprite[i].setContentSize(size);
						this.playerHead_Sprite[i].setAnchorPoint(0,0);
						this.playerHead_Sprite[i].setPosition(10,140);
						this.playerHead_Sprite[i].setVisible(false);

						this.playerInfo_bg[i].addChild(this.playerHead_Sprite[i]);

						this.playerNameLabel[i].setPosition(10,InfoposY1);
						this.playerScoreLabel[i].setPosition(InfoposX,InfoposY2);
						// this.playerInfo_bg[i].addChild(mu);

						this.playerInfo_bg[i].addChild(this.playerNameLabel[i]);
						this.playerInfo_bg[i].addChild(this.playerScoreLabel[i]);
						this.addChild(this.playerInfo_bg[i],5);

					}
				}
				break;
			}
			// case 2:
			// {
			// 	cc.log("PlayerInfoLayer setPlayerInfo:function()=2" );// this.avatarSprite.setVisible(false);
             //    for(var i=0;i<2;i++)
             //    {
             //        if(this.playerInfo_bg[i] ==null)
             //        {
             //            this.playerInfo_bg[i]=cc.Sprite.create("res/playerInfo_bg.png");
             //            this.playerInfo_bg[i].setPosition(60*this.fXScale,(500-252*i)*this.fYScale);
             //            this.playerInfo_bg[i].setScale(this.fXScale,this.fYScale);
             //            this.playerNameLabel[i] = cc.LabelTTF.create(userInfo.nickName, "Arial", fontSize,cc.size(100,100));
			// 			this.playerNameLabel[i].setAnchorPoint(0,1);
             //            this.playerScoreLabel[i] = cc.LabelTTF.create("0.00%", "Arial", 24);
			// 			this.playerInfo_btn[i] = new Button("res/less_bg.png");
			// 			// var size = this.playerInfo_btn[i].getContentSize();
			// 			this.playerInfo_btn[i].setContentSize(size);
			// 			// this.playerInfo_btn[i].setScale(40/size.width,40/size.height);
			// 			this.playerInfo_btn[i].setPosition(InfoposX,190);
			// 			if (i==0)
			// 			{
			// 				this.playerInfo_btn[i].setClickEvent(function (){
			// 					cc.log("playerInfo_btn0 ClickEvent ");
			// 					var matchId = userInfo.matchId;
			// 					var userId = userInfo.playerListData[0]["userName"];
			// 					cc.log("playerInfo_btn0 ClickEvent userId[0] ="+userId+"||matchId="+userInfo.matchId);
			// 					gSocketConn.SendRecordMatchMessage(userId, matchId);
			// 				});
            //
			// 			}
			// 			else
			// 			{
			// 				this.playerInfo_btn[i].setClickEvent(function () {
			// 					cc.log("playerInfo_btn1 ClickEvent ");
            //
			// 					var matchId = userInfo.matchId;
			// 					var userId = userInfo.playerListData[1]["userName"];
			// 					cc.log("playerInfo_btn0 ClickEvent userId[1] =" + userId + "||matchId=" + userInfo.matchId);
			// 					gSocketConn.SendRecordMatchMessage(userId, matchId);
			// 				});
			// 				// this.playerInfo_bg[i].addChild(this.playerInfo_btn1);
			// 			}
			// 			this.playerInfo_btn[i].setVisible(false);
            //
			// 			this.playerHead_Sprite[i] = cc.Sprite.create("res/bg_touxiang.png");
			// 			this.playerHead_Sprite[i].setContentSize(size);
			// 			this.playerHead_Sprite[i].setAnchorPoint(0,0);
			// 			this.playerHead_Sprite[i].setPosition(10,140);
			// 			this.playerHead_Sprite[i].setVisible(false);
            //
			// 			this.playerInfo_bg[i].addChild(this.playerHead_Sprite[i]);
            //
             //            this.playerNameLabel[i].setPosition(10,InfoposY1);
             //            this.playerScoreLabel[i].setPosition(InfoposX,InfoposY2);
			// 			this.playerInfo_bg[i].addChild(this.playerInfo_btn[i]);
            //
             //            this.playerInfo_bg[i].addChild(this.playerNameLabel[i]);
             //            this.playerInfo_bg[i].addChild(this.playerScoreLabel[i]);
             //            this.addChild(this.playerInfo_bg[i],5);
            //
             //        }
             //    }
            //
			// 	break;
			// }
			default:
			{
				cc.log("PlayerInfoLayer setPlayerInfo userInfo.matchMode=",userInfo.matchMode);
			}
		}
		// this.refreshScoresByData();
	},
	drawAreaBorder:function()
	{
		 //给这个矩形区域添加红色的边框
		 
		 //this.playerInfoArea.drawRect(cc.p(0,0),cc.p(this.playerInfoArea.width, this.playerInfoArea.height),cc.color(0,0,0,0),1,cc.color(0,255,255,255));
		 //this.playerInfoArea.drawRect(cc.p(0,0),cc.p(this.width, this.height),cc.color(0,0,0,0),1,cc.color(255,255,255,255));
	},

	refreshScore:function(currentIndex,data,selfOperations,opponentOperations)//计算收益率
	{
		
		// this.refreshScoreForPlayer(currentIndex,data,selfOperations,true);
		// this.refreshScoreForPlayer(currentIndex,data,opponentOperations,false);
		
	},
	
	refreshScores:function(buyScore)//设置收益率
	{
		var score=0;
		var upColor=cc.color(252,0,1,0);
		var downColor=cc.color(6,226,0,0);
		var scoreLabel=this.selfScoreLabel;
		if(scoreLabel!=null && scoreLabel!=undefined)
		{
			score=buyScore;
			scoreLabel.setString(score.toFixed(2)+"%");
			if(score>0)
			{
				scoreLabel.setColor(upColor);
			}
			else if(score<0)
			{
				scoreLabel.setColor(downColor);
			}
			else
			{
				scoreLabel.setColor(cc.color(255,255,255,0));
			}
		}
		
	},


	refreshScoresByData:function()//从服务器得到数据设置收益率
	{

		var self = this;
		self.setPlayerInfo();
		this.selfNameLabel.setString(cutstr(userInfo.nickName,11));
		if(this.headSprite==null){
			this.headSprite=cc.Sprite.create("res/bg_touxiang.png");
			this.headSprite.setPosition(120*this.fXScale,this.height-20);
			var size = self.headSprite.getContentSize();
			self.headSprite.setScale(33/size.width,33/size.height);
			this.addChild(this.headSprite,5);
		}

		var score=0;
		var upColor=cc.color(252,0,1,0);
		var downColor=cc.color(6,226,0,0);
		var scoreLabel=this.selfScoreLabel;
		if(userInfo.playerListData!=null)//&&userInfo.matchMode>0
		{
			var url = userInfo.headSprite;
			cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
				if(err){
					cc.log(err);
				}
				if(img){
					cc.log("img!=null"+img);
					if(gPlayerAvatarSprite==null)
					{
						// gPlayerAvatarSprite=cc.Sprite.create("res/avatar"+(1+Math.round(Math.random()*10)%5)+".png");
						gPlayerAvatarSprite=new cc.Texture2D();
					}
					// var texture2d = new cc.Texture2D();
					gPlayerAvatarSprite.initWithElement(img);
					gPlayerAvatarSprite.handleLoadedTexture();
					self.headSprite.initWithTexture(gPlayerAvatarSprite);

					var size = self.headSprite.getContentSize();
					self.headSprite.setScale(33/size.width,33/size.height);
				}
				cc.log("loadImg="+userInfo.headSprite); // self.addChild(logo);
			});
            for(var i=0;i<userInfo.playerListData.length;i++)
            {

				var InfoposX =60;
				var selectflag =userInfo.playerListData[i]["userName"]==userInfo.nickName?true:false;
				if(selectflag){
					score=parseFloat(userInfo.playerListData[i]["score"]);
					this.refreshScores(score);
				}
				if(i==0&&i<self.playerInfo_bg.length)
				{
					var url = userInfo.playerListData[i]["headPicture"];
					cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
						if(err){
							cc.log(err);
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
							headSprite.setScale(90/size.width,90/size.height);
							headSprite.setPosition(cc.p(60,190));
							self.playerInfo_bg[0].addChild(headSprite,2);
						}
						cc.log("loadImg"+userInfo.headSprite); // self.addChild(logo);
					});
				}
				if(i==1&&i<self.playerInfo_bg.length)
				{
					var url = userInfo.playerListData[i]["headPicture"];
					cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
						if(err){
							cc.log(err);
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
							headSprite.setScale(90/size.width,90/size.height);
							headSprite.setPosition(cc.p(60,190));
							self.playerInfo_bg[1].addChild(headSprite,2);
						}
						cc.log("loadImg"+userInfo.headSprite); // self.addChild(logo);
					});
				}

				// this.playerInfo_btn[i].setTexture
                if(this.playerNameLabel[i]!=null && this.playerNameLabel[i]!=undefined)
                {
					score=parseFloat(userInfo.playerListData[i]["score"]);

                    this.playerNameLabel[i].setString(cutstr(userInfo.playerListData[i]["userName"],11));
                    this.playerScoreLabel[i].setString(score.toFixed(2)+"%");
					this.playerScoreLabel[i].setColor(setLabelColor(score));
					// this.playerHead_Sprite[i].setVisible();
					this.playerHead_Sprite[i].setVisible(selectflag);
                }

            }
        }

	},

	ableInfoButtons:function()
	{

		for(var i=0;this.playerInfo_btn[i]!=undefined&&this.playerInfo_btn[i]!=null;i++)
		{
			this.playerInfo_btn[i].setVisible(true);
		}

	},
	refreshScoreForPlayer:function(currentIndex,data,operations,isSelf)
	{
		
		var score=0;
		var upColor=cc.color(252,0,1,0);
		var downColor=cc.color(6,226,0,0);
		
		for(var i=0;i<Math.floor(operations.length/2);i+=1)
		{
			var isBuyO=operations[2*i]>0;
			var OP=data[Math.abs(operations[2*i])-1].c;
			
			var isBuyC=operations[2*i+1]>0;
			var CP=data[Math.abs(operations[2*i+1])-1].c;
			if(isBuyO==true && isBuyC==false)
			{
				score=score+(CP-OP);
			}
			else if(isBuyO==false && isBuyC==true)
			{
				score=score+(OP-CP);
			}
		}
		
		var dir=0;
		if(operations.length%2!=0)
		{
			var index=operations[operations.length-1];
			var lastClose=data[currentIndex-1].c;
			
			var isBuyO=operations[operations.length-1]>0;
			var OP=data[Math.abs(operations[operations.length-1])-1].c;
			
			if(isBuyO==true)
			{
				score=score+(lastClose-OP);
				dir=1;
			}
			else
			{
				score=score+(OP-lastClose);
				dir=-1;
			}
		}
		
		//var dirLabel=this.selfDirLabel;
		var scoreLabel=this.selfScoreLabel;
		if(isSelf==false)
		{
			//dirLabel=this.opponentDirLabel;
			scoreLabel=this.opponentScoreLabel;
		}
		if(dir==1)
		{
			//dirLabel.setString("多");
			//dirLabel.setColor(upColor);
		}
		else if(dir==-1)
		{
			//dirLabel.setString("空");
			//dirLabel.setColor(downColor);
		}
		else
		{
			//dirLabel.setString("");
			//dirLabel.setColor(cc.color(255,255,255,0));
		}
		if(scoreLabel!=null && scoreLabel!=undefined)
		{
			scoreLabel.setString(score.toFixed(2)+"%");
			if(score>0)
			{
				scoreLabel.setColor(upColor);
			}
			else if(score<0)
			{
				scoreLabel.setColor(downColor);
			}
			else
			{
				scoreLabel.setColor(cc.color(255,255,255,0));
			}
		}
	},

	clear:function()
	{
		this.selfScoreLabel.setString("0.00%");
		this.selfScoreLabel.setColor(cc.color(255,255,255,0));
	}
	
});