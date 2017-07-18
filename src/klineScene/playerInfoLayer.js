// JavaScript Document
var PlayerInfoLayer= cc.Node.extend({
	backgroundSprite:null,
	// playerInfoArea:null,			//绘图的区域
	selfNode:null,
	selfNameLabel:null,				//自己的名字
	selfScoreLabel:null,			//自己的分数
	// avatarSprite:null,				//自己的头像
    //
	// headSprite:null,				//自己的头像
	// playerInfo_bg1:null,
	// playerInfo_bg2:null,
	// playerInfo_bg3:null,

	// playerInfo_btn0:null,//信息按鈕
	playerInfo_btn:null,//信息按鈕
    playerInfo_bg:null,//信息背景bg
	playerHead_Sprite:null,//头像
	playerHead_Select:null,//头像选中
	playerNameLabel:null,				//名字
	playerScoreLabel:null,			//分数

	// playerEmoticonBtn:null,
	// player1Label:null,				//自己的名字
	// playerScore1Label:null,			//自己的分数

     ctor:function()
	{
		this._super();
		// this.width=width;
		// this.height=height;
	},

	onEnter:function () 
	{
		this._super();
		var self = this;
		// this.size = cc.director.getWinSize();
		// var fXScale = gDesignResolutionWidth/1280;
		// var fYScale = gDesignResolutionHeight/720;
		// var posX = 160;
		// var posY = 670;
		// var namePosX = 610;
		// var scorePosX = 320;
		// var fontSize = 30;
		this.backgroundSprite = new cc.LayerColor(cc.color(0,0,0,0),1280,720);
		this.backgroundSprite.setPosition(0,0);
		// this.backgroundSprite.setScale(fXScale,fYScale);
		this.addChild(this.backgroundSprite);


		this.playerInfo_btn=[];
        this.playerInfo_bg =[];
		this.playerHead_Sprite  =[];
		this.playerHead_Select  =[];
        this.playerNameLabel =[];
        this.playerScoreLabel =[];
		this.nameSpritebg=null;
		this.selfNameLabel=null;
		this.selfScoreLabel=null;
		// this.playerEmoticonBtn =[];

		// this.playerInfoArea=new cc.DrawNode();
		// //设置K线图的区域
		// this.playerInfoArea.setPosition(cc.p(0,0));
		// this.playerInfoArea.width=this.width;
		// this.playerInfoArea.height=this.height;
		// this.addChild(this.playerInfoArea, 1);


		this.setPlayerInfo();
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
		var self = this;
		var posY = 670;
		var posX1 = 160;
		// var posX2 = 1280-posX1;
		var namePosX = 610;
		var scorePosX = 320;
		var fontSize = 30;
		var size = cc.size(90,90);
		if(userInfo.matchMode==null)return;


		var mu = new cc.Menu();
		mu.x = 0;
		mu.y = 0;
		this.backgroundSprite.addChild(mu, 2);

		// this.headSpritebg = new cc.Sprite(res.BG_HEAD_PNG);
		// this.headSpritebg.setPosition(posX,posY);
		// this.headSpritebg.setScale(0.9);
		// this.backgroundSprite.addChild(this.headSpritebg,3);
        //
		// if(this.headSprite==null){
		// 	this.headSprite = new cc.Sprite(res.HEAD_0_PNG);
		// 	this.headSprite.setPosition(posX,posY);
		// 	this.backgroundSprite.addChild(this.headSprite,2);
		// }
		switch(userInfo.matchMode)
		{
            case MatchType.Type_DailyTrade_Match://分时比赛
			case MatchType.Type_Practice_Match://练习场比赛
			{
				cc.log("PlayerInfoLayer setPlayerInfo:function()=0" );
				// this.avatarSprite.setVisible(true);
				if(this.nameSpritebg!=null){
					this.nameSpritebg.setVisible(false);
				}
				if(this.selfNameLabel==null){
					this.selfNameLabel=new cc.LabelTTF(cutstr(userInfo.nickName,11), "Arial", fontSize);//,cc.size(160,40)
					// this.selfNameLabel.setScale(this.fXScale,this.fYScale);
					//this.selfNameLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
					this.selfNameLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
					this.selfNameLabel.setAnchorPoint(0,0.5);
					this.selfNameLabel.setPosition(posX1+60,posY+20);
					this.backgroundSprite.addChild(this.selfNameLabel,5);
				}

				if(this.selfScoreLabel==null){
					this.selfScoreLabel=cc.LabelTTF.create("0.00%", "Arial", 40);
					this.selfScoreLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
					this.selfScoreLabel.setAnchorPoint(0,0.5);
					this.selfScoreLabel.setPosition(posX1+60,posY-20);
					// this.selfScoreLabel.setPosition(cc.pAdd(this.selfNameLabel.getPosition(),cc.p(this.selfNameLabel.getContentSize().width+10,0)));
					this.backgroundSprite.addChild(this.selfScoreLabel,5);
				}

				if(this.headSprite==null){
					this.headSpritebg = new cc.Sprite(res.BG_HEAD_PNG);
					this.headSpritebg.setPosition(posX1,posY);
					this.headSpritebg.setScale(0.9);
					this.backgroundSprite.addChild(this.headSpritebg,3);
				}


				if(this.headSprite==null){
					this.headSprite = new cc.Sprite(res.HEAD_0_PNG);
					this.headSprite.setPosition(posX1,posY);
					this.backgroundSprite.addChild(this.headSprite,2);
					// var size = self.headSprite.getContentSize();
					// self.headSprite.setScale(80/size.width,80/size.height);
				}


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
						self.headSprite.setScale(90/size.width,90/size.height);
					}
					cc.log("//练习场比赛loadImg="+userInfo.headSprite); // self.addChild(logo);
				});
				break;
			}
			// case MatchType.Type_Practice_Match:
			case MatchType.Type_ArtificialMatch://人机匹配
			case MatchType.Type_Tool_Match://道具匹配
			case MatchType.Type_Friend_Match://好友匹配
			case MatchType.Type_PlainMultiplayer_Match://普通匹配
			{

				if(this.nameSpritebg==null){
					this.nameSpritebg = new cc.Sprite(res.BG_VS_NAME_PNG);
					this.nameSpritebg.setPosition(posX1*4,posY-5);
					this.nameSpritebg.setVisible(false);
					this.backgroundSprite.addChild(this.nameSpritebg,3);
				}

				this.nameSpritebg.setVisible(true);
				 cc.log("PlayerInfoLayer setPlayerInfo:function()userInfo.playerListData="+userInfo.playerListData );// this.avatarSprite.setVisible(false);


				for(var i=0;userInfo.playerListData!=null&&i<userInfo.playerListData.length;i++)
				{
					if(userInfo.recordName==null){
						userInfo.recordName= userInfo.nickName;
					}

					if(this.playerInfo_bg[i] ==null)
					{
						this.playerInfo_bg[i]=new cc.Sprite(res.BG_HEAD_PNG);
						this.playerInfo_btn[i] = new cc.MenuItemImage(res.BLUE_BG_png,"", "", this);
						this.playerInfo_btn[i].setContentSize(size);
						this.playerNameLabel[i] = cc.LabelTTF.create(userInfo.nickName, "fonts/Arial.ttf", fontSize);//cc.size(160,40)
						this.playerScoreLabel[i] = cc.LabelTTF.create("0.00%", "Arial", 50);

						this.playerHead_Sprite[i] = new cc.Sprite();
						// this.playerHead_Sprite[i].setContentSize(size);
						// this.playerHead_Sprite[i].setVisible(false);
						this.playerHead_Select[i] = new cc.Sprite(res.BG_HEAD_SELECT_PNG);
						this.playerHead_Select[i].setScale(0.6);
						// this.playerHead_Select[i].setVisible(false);

//////////////////////////////////////
///////////////////////////////////////

						if (i==0)
						{
							this.playerNameLabel[i].setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
							this.playerScoreLabel[i].setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
							this.playerNameLabel[i].setAnchorPoint(1,0.5);
							//new Button("res/less_bg.png");
							// var size = this.playerInfo_btn[i].getContentSize();
							this.playerNameLabel[i].setPosition(namePosX,posY);
							this.playerScoreLabel[i].setPosition(scorePosX,posY);
							this.playerInfo_bg[i].setPosition(posX1,posY);
							this.playerInfo_btn[i].setPosition(posX1,posY);
							this.playerNameLabel[i].setString(userInfo.nickName);
							this.playerHead_Sprite[i].setPosition(posX1,posY);//头像
							this.playerHead_Select[i].setPosition(posX1,posY);//头像选择框
							// cc.log("this.playerHead_Select[0]x="+posX1+"y="+posY);
							// cc.log(this.playerHead_Select[i].getPosition());

							this.playerInfo_btn[i].setCallback(function (){

								userInfo.recordName = userInfo.playerListData[0]["userName"];
								cc.log("playerInfo_btn0 ClickEvent userId[0] ="+userInfo.recordName);
								var playerInfo = new MatchUserInfo();
								var buyInfo=[];
								var score =0;
                                if(userInfo.matchRecordFlag&&userInfo.playerListData[0]["operationIndex"]!=null){
                                    playerInfo = userInfo.playerListData[0];
                                    score = parseFloat(playerInfo["score"]).toFixed(2);
                                    buyInfo=playerInfo["operationIndex"];
                                    gKlineScene.businessMatchRecordInfo(buyInfo,score);
                                }else{
                                    for(var j=0;userInfo.endInfoOfAllPlayers!=null&&j<userInfo.endInfoOfAllPlayers.length;j++)
                                    {
                                        if(userInfo.endInfoOfAllPlayers[j]["userName"]==userInfo.recordName){
                                            playerInfo = userInfo.endInfoOfAllPlayers[j];
                                            score = parseFloat(playerInfo["score"]).toFixed(2);
                                            buyInfo=playerInfo["operationIndex"];
                                            // for(var k=0;playerInfo["operationIndex"]!=null&&k<playerInfo["operationIndex"].length;k++)
                                            // {
                                            // 	buyInfo.push(playerInfo["operationIndex"][j]);
                                            // }
                                            break;
                                        }
                                    }
                                    cc.log("playerInfo_btn0 ClickEvent userId[0] ="+userInfo.recordName+"||matchId="+userInfo.matchId);
                                    gKlineScene.businessMatchInfo(buyInfo,score);
                                }

								// gSocketConn.SendRecordMatchMessage(userId,matchId);
							});

						}
						else
						{
							this.playerNameLabel[i].setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
							this.playerScoreLabel[i].setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
							this.playerNameLabel[i].setAnchorPoint(0,0.5);
							this.playerNameLabel[i].setPosition(1280-namePosX,posY);
							this.playerScoreLabel[i].setPosition(1280-scorePosX,posY);
							this.playerInfo_bg[i].setPosition(1280-posX1,posY);
							this.playerInfo_btn[i].setPosition(1280-posX1,posY);
							this.playerNameLabel[i].setString(userInfo.playerListData[1]["userName"]);

							// this.playerHead_Sprite[i].setAnchorPoint(0,0.5);
							this.playerHead_Sprite[i].setPosition(1280-posX1,posY);
							this.playerHead_Select[i].setPosition(1280-posX1,posY);

							// cc.log("this.playerHead_Select[1]x="+1280-posX1+"y="+posY);
							// cc.log(this.playerHead_Select[i].getPosition());
							this.playerInfo_btn[i].setCallback(function () {
								userInfo.recordName = userInfo.playerListData[1]["userName"];
								cc.log("playerInfo_btn1 ClickEvent userId[1] ="+userInfo.recordName);
								var playerInfo = new MatchUserInfo();
								var buyInfo=[];
								var score =0;
                                if(userInfo.matchRecordFlag&&userInfo.playerListData[1]["operationIndex"]!=null){
                                    playerInfo = userInfo.playerListData[1];
                                    score = parseFloat(playerInfo["score"]).toFixed(2);
                                    buyInfo=playerInfo["operationIndex"];
                                    gKlineScene.businessMatchRecordInfo(buyInfo,score);
                                }else{
                                    for(var j=0;userInfo.endInfoOfAllPlayers!=null&&j<userInfo.endInfoOfAllPlayers.length;j++)
                                    {
                                        if(userInfo.endInfoOfAllPlayers[j]["userName"]==userInfo.recordName){
                                            playerInfo = userInfo.endInfoOfAllPlayers[j];
                                            score = parseFloat(playerInfo["score"]).toFixed(2);
                                            buyInfo=playerInfo["operationIndex"];
                                            // for(var k=0;playerInfo["operationIndex"]!=null&&k<playerInfo["operationIndex"].length;k++)
                                            // {
                                            // 	buyInfo.push(playerInfo["operationIndex"][j]);
                                            // }
                                            break;
                                        }
                                    }
                                    cc.log("playerInfo_btn1 ClickEvent userId[1] ="+userInfo.recordName+"||matchId="+userInfo.matchId);
                                    gKlineScene.businessMatchInfo(buyInfo,score);
                                }


							});
							// this.playerInfo_bg[i].addChild(this.playerInfo_btn1);
						}


						this.playerInfo_btn[i].setVisible(false);

						mu.addChild(this.playerInfo_btn[i],5);

						this.backgroundSprite.addChild(this.playerHead_Sprite[i],5);
						this.backgroundSprite.addChild(this.playerHead_Select[i],6);

						// this.playerInfo_bg[i].addChild(mu);

						this.backgroundSprite.addChild(this.playerNameLabel[i],5);
						this.backgroundSprite.addChild(this.playerScoreLabel[i],5);
						this.backgroundSprite.addChild(this.playerInfo_bg[i],5);

					}
				}

				break;
			}
			default:
			{
				cc.log("PlayerInfoLayer setPlayerInfo userInfo.matchMode=",userInfo.matchMode);
			}
		}
		// this.refreshScoresByData();
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
		// var scoreLabel=this.selfScoreLabel;
		if(this.selfScoreLabel!=null)
		{
			score=buyScore;
			this.selfScoreLabel.setString(score.toFixed(2)+"%");
			if(score>0)
			{
				this.selfScoreLabel.setColor(upColor);
			}
			else if(score<0)
			{
				this.selfScoreLabel.setColor(downColor);
			}
			else
			{
				this.selfScoreLabel.setColor(cc.color(255,255,255,0));
			}
		}
		// this.selfScoreLabel.setVisible(true);
	},


	refreshScoresByData:function()//从服务器得到数据设置收益率
	{

		var self = this;
		self.setPlayerInfo();
		var strName = cutstr(userInfo.nickName,11);
		if(this.selfNameLabel!=null){
			this.selfNameLabel.setString(strName);
            this.selfNameLabel.setVisible(true);
		}

		if(this.headSprite==null){
			this.headSprite = new cc.Sprite(res.HEAD_0_PNG);
			this.headSprite.setPosition(160,670);
			this.backgroundSprite.addChild(this.headSprite,2);
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
					self.headSprite.setScale(80/size.width,80/size.height);
				}
				cc.log("playInfoLayer refreshScoresByData1 loadImg="+url); // self.addChild(logo);

				var length = userInfo.playerListData.length;
				if(length==1){
					score=parseFloat(userInfo.playerListData[0]["score"]);
					self.refreshScores(score);
				}else if(length==2){
					if(self.selfScoreLabel!=null){
						self.selfScoreLabel.setVisible(false);
					}
					//
					for(var i=0;i<length;i++)
					{

						// var InfoposX =60;
						var selectflag =userInfo.playerListData[i]["userName"]==userInfo.recordName?true:false;
						if(selectflag){
							score=parseFloat(userInfo.playerListData[i]["score"]);
							self.refreshScores(score);
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
									// var headSprite = new cc.Sprite();
									//     this.touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
									// cc.textureCache.addImage(imgUrl);
									var texture2d = new cc.Texture2D();
									texture2d.initWithElement(img);
									texture2d.handleLoadedTexture();
									self.playerHead_Sprite[0].initWithTexture(texture2d);
									var size = self.playerHead_Sprite[0].getContentSize();
									self.playerHead_Sprite[0].setScale(90/size.width,90/size.height);

								}
								cc.log("playInfoLayer refreshScoresByData2 loadImg"+url); // self.addChild(logo);
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
									var texture2d = new cc.Texture2D();
									texture2d.initWithElement(img);
									texture2d.handleLoadedTexture();
									self.playerHead_Sprite[1].initWithTexture(texture2d);
									var size = self.playerHead_Sprite[1].getContentSize();
									self.playerHead_Sprite[1].setScale(90/size.width,90/size.height);
								}
								cc.log("playInfoLayer  refreshScoresByData3 loadImg"+url); // self.addChild(logo);
							});
						}

						// this.playerInfo_btn[i].setTexture
						if(self.playerNameLabel[i]!=null && self.playerNameLabel[i]!=undefined)
						{
							if(self.selfNameLabel!=null){
								self.selfNameLabel.setVisible(false);
							}

							score=parseFloat(userInfo.playerListData[i]["score"]);

							self.playerNameLabel[i].setString(cutstr(userInfo.playerListData[i]["userName"],11));
							self.playerScoreLabel[i].setString(score.toFixed(2)+"%");
							self.playerScoreLabel[i].setColor(setLabelColor(score));
							// this.playerHead_Sprite[i].setVisible();
							self.playerHead_Select[i].setVisible(selectflag);
							// cc.log(self.playerHead_Select[i].getPosition(),userInfo.recordName);
						}

					}
				}

			});
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