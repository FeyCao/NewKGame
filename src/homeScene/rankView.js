/**
 * Created by Administrator on 2016-10-17.
 */
//tabelviewLayer
var RankTableViewCell = cc.TableViewCell.extend({
    rankInfo:null,
    draw:function (ctx) {
        this._super(ctx);

    },

    onEnter:function () {
        this._super();
        // cc.log("RankTableViewCell onEnter end");
    },
    onExit:function () {
        this._super();
        this.removeAllChildrenWithCleanup(true);
        // cc.log("RankTableViewCell onExit end");
    },

    setRankInfoData:function (data) {
        this.rankInfo = data;//userInfo.rankList[idx];
    },
    setCellData:function(idx) {
        var self = this;
        cc.log("RankTableViewCell setCellData==" + idx);
        var sprite = new cc.Sprite("res/line_bg.png");
        sprite.setPosition(cc.p(0, 0));
        sprite.setAnchorPoint(0, 0);
        this.addChild(sprite);

        var posX=100;
        var infoNode = new cc.Node();
        infoNode.setPosition(cc.p(posX,0));
        this.addChild(infoNode);



        if (self.rankInfo != null) {
            //RANK|{"myRanking":{"rank":1,"playerInfo":{"uid":3434343770,"nickName":"誓约者艾琳诺","winOfMatchForOne":4,"sumOfMatchForOne":33,"winOfMatchForMore":0,"sumOfMatchForMore":0,"winOfMatchForAI":98,"sumOfMatchForAI":187,"gainCumulation":"-197.391","sumOfAllMatch":33}},"rankList":[{"rank":1,"playerInfo":{"uid":10000,"nickName":"誓约者艾琳诺","winOfMatchForOne":4,"sumOfMatchForOne":33,"winOfMatchForM

            var playerInfo = self.rankInfo;//userInfo.rankList[idx];
            // var playerInfo = rankInfo["playerInfo"];

            var rank = playerInfo["rank"];
            if (rank > 3) {
                CellrankLabel = new cc.LabelTTF(playerInfo["rank"], "Arial", 35.0);
                // CellrankLabel.setAnchorPoint(0,0.5);
                CellrankLabel.setPosition(cc.p(30-posX/2, 40));
                CellrankLabel.setColor(RedColor);
                infoNode.addChild(CellrankLabel);
            }
            else {

                rankSprite = cc.Sprite.create("res/rank1.png");
                // rankSprite.setScale(0.5);
                rankSprite.setPosition(cc.p(30-posX/2, 40));
                infoNode.addChild(rankSprite, 2);
                switch (rank) {
                    case 1: {
                        rankSprite.setTexture("res/rank1.png");
                        break;
                    }
                    case 2: {
                        rankSprite.setTexture("res/rank2.png");
                        break;
                    }
                    case 3: {
                        rankSprite.setTexture("res/rank3.png");
                        break;
                    }
                    default: {
                        cc.log("player rank=" + rank);
                        break;
                    }

                }
            }

            touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
            touxiangSprite.setScale(0.6);
            touxiangSprite.setPosition(cc.p(100, 40));
            infoNode.addChild(touxiangSprite, 2);

            var url = playerInfo["headPicture"];
            cc.loader.loadImg(url, {isCrossOrigin: false}, function (err, img) {
                if (err) {
                    cc.log(err);
                    cc.log("排行：fail loadImg=" + userInfo.headSprite); // self.addChild(logo);
                }
                if (img) {
                    cc.log("img!=null" + img);
                    if(self.rankInfo["userName"]==userInfo.rankList[idx]["userName"]){
                        var headSprite = new cc.Sprite();
                        var texture2d = new cc.Texture2D();
                        texture2d.initWithElement(img);
                        texture2d.handleLoadedTexture();
                        headSprite.initWithTexture(texture2d);
                        var size = headSprite.getContentSize();
                        headSprite.setScale(66 / size.width, 66 / size.height);
                        headSprite.setPosition(cc.p(100, 40));
                        infoNode.addChild(headSprite, 2);
                        cc.log("排行：success loadImg=" + userInfo.headSprite); // self.addChild(logo);
                    }

                    // self.touxiangSprite.setValue(false);
                }
            });

            CellnameLabel = new cc.LabelTTF(cutstr(playerInfo["userName"], 11), "Arial", 24.0);
            CellnameLabel.setAnchorPoint(0, 0.5);
            CellnameLabel.setColor(WhiteColor);
            CellnameLabel.setPosition(cc.pAdd(touxiangSprite.getPosition(), cc.p(touxiangSprite.getContentSize().width / 2, 0)));
            infoNode.addChild(CellnameLabel);


            sumInfoLabel = cc.LabelTTF.create("总场:", "Arial", 28);
            sumInfoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            sumInfoLabel.setAnchorPoint(0, 0.5);
            sumInfoLabel.setColor(WhiteColor);
            sumInfoLabel.setPosition(cc.p(330+posX/2, 40));
            infoNode.addChild(sumInfoLabel, 5);

            winInfoLabel = cc.LabelTTF.create("胜场:", "Arial", 28);
            winInfoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            winInfoLabel.setAnchorPoint(0, 0.5);
            winInfoLabel.setPosition(cc.p(480+posX, 40));
            winInfoLabel.setColor(WhiteColor);
            infoNode.addChild(winInfoLabel, 5);


            avgGainReteInfoLabel = cc.LabelTTF.create("平均收益:", "Arial", 28);
            avgGainReteInfoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            avgGainReteInfoLabel.setAnchorPoint(0, 0.5);
            avgGainReteInfoLabel.setColor(WhiteColor);
            avgGainReteInfoLabel.setPosition(cc.p(650, 40));
            avgGainReteInfoLabel.setVisible(false);
            infoNode.addChild(avgGainReteInfoLabel, 5);


            sumLabel = cc.LabelTTF.create("", "Arial", 28);
            sumLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            sumLabel.setAnchorPoint(0, 0.5);
            sumLabel.setColor(YellowColor);
            sumLabel.setPosition(cc.pAdd(sumInfoLabel.getPosition(), cc.p(sumInfoLabel.getContentSize().width, 0)));
            infoNode.addChild(sumLabel, 5);


            winLabel = cc.LabelTTF.create("", "Arial", 28);
            winLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            winLabel.setAnchorPoint(0, 0.5);
            winLabel.setPosition(cc.pAdd(winInfoLabel.getPosition(), cc.p(winInfoLabel.getContentSize().width, 0)));
            winLabel.setColor(YellowColor);
            infoNode.addChild(winLabel, 5);


            avgGainReteLabel = cc.LabelTTF.create("", "Arial", 28);
            avgGainReteLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            avgGainReteLabel.setAnchorPoint(0, 0.5);
            avgGainReteLabel.setColor(WhiteColor);
            avgGainReteLabel.setPosition(cc.pAdd(avgGainReteInfoLabel.getPosition(), cc.p(avgGainReteInfoLabel.getContentSize().width, 0)));
            infoNode.addChild(avgGainReteLabel, 5);


            //总场数
            sumLabel.setString(" "+playerInfo["sumMatch"]);
            //胜场数
            winLabel.setString(" "+playerInfo["winMatch"]);
            //平均收益率
            avgGainReteLabel.setString(""+playerInfo["AvgGain"]+"%");
            avgGainReteLabel.setVisible(false);
            avgGainReteLabel.setColor(setLabelColor(playerInfo["AvgGain"]));

            /////// {"myRanking":{"rank":3,"playerInfo":{"uid":"43562","nickName":"坎坎坷坷6xcvd","winOfMatchForOne":6,"sumOfMatchForOne":21,"winOfMatchForMore":77,"sumOfMatchForMore":131,"winOfMatchForAI":24,"sumOfMatchForAI":42,"gainCumulation":"-0.03","sumOfAllMatch":42,"winMatchFriend":0,"sumMatchFriend":0,"GainCumulationForFriend":0,"headPicture":"http://qiniu.kiiik.com/SM-N9200__1481620525057__449948_1253"}}
            //     switch (userInfo.recordMode)
            //     {
            //
            //         case 0:
            //         {
            //             //总场数
            //             sumLabel.setString(" "+playerInfo["sumOfMatchForOne"]);
            //             //胜场数
            //             winLabel.setString(" "+playerInfo["winOfMatchForOne"]);
            //             //平均收益率
            //             avgGainReteLabel.setString(""+playerInfo["gainCumulation"]+"%");
            //             avgGainReteLabel.setColor(setLabelColor(playerInfo["gainCumulation"]));
            //             break;
            //         }
            //         case 4:{
            //             // sumMatchFriend
            //             //总场数
            //             sumLabel.setString(" "+playerInfo["sumMatchFriend"]);
            //             //胜场数
            //             winLabel.setString(" "+playerInfo["winMatchFriend"]);
            //             //平均收益率
            //             avgGainReteLabel.setString(""+playerInfo["gainCumulation"]+"%");
            //             avgGainReteLabel.setColor(setLabelColor(playerInfo["gainCumulation"]));
            //             break;
            //         }
            //         case 1:
            //         {
            //             //总场数
            //             sumLabel.setString(" "+playerInfo["sumOfMatchForMore"]);
            //             //胜场数
            //             winLabel.setString(" "+playerInfo["winOfMatchForMore"]);
            //             //平均收益率
            //             avgGainReteLabel.setString(""+playerInfo["gainCumulation"]+"%");
            //             avgGainReteLabel.setColor(setLabelColor(playerInfo["gainCumulation"]));
            //             break;
            //             // this.mode3Button.setDisabled(true);winOfMatchForMore"
            //         }
            //         case 2:
            //         {
            //
            //             //总场数
            //             sumLabel.setString(" "+playerInfo["sumOfMatchForAI"]);
            //             //胜场数
            //             winLabel.setString(" "+playerInfo["winOfMatchForAI"]);
            //             //平均收益率
            //             avgGainReteLabel.setString(""+playerInfo["gainCumulation"]+"%");
            //             avgGainReteLabel.setColor(setLabelColor(playerInfo["gainCumulation"]));
            //             break;
            //         }
            //         // case 3:
            //         // {
            //         //     break;
            //         // }
            //         default:
            //         {
            //             cc.log("userInfo.recordMode=="+userInfo.recordMode);
            //             break;
            //         }
            //     }
            //
            // }
        }
    }
});

var RankViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,
    // recordCallBackFunction:null,
  //  userId:null,
  ////  deviceId:null,
  //
  //  backgroundSprite:null,
  //
  //
  // // userNameLabel:null,				//自己的名字
  //  //selfScoreLabel:null,			//自己的分数
  //  // "winOfMatchForOne":0,"sumOfMatchForOne":2,"winOfMatchForMore":0,"sumOfMatchForMore":0,"gainCumulation":0.0,"sumOfAllMatch":2}
  //
  //  winOfMatchForOne:null,
  //  sumOfMatchForOne:null,
  //  winOfMatchForMore:null,
  //  gainCumulation:null,
  //  sumOfAllMatch:null,

    // m_touchListener:null,
    onEnter: function () {
        this._super();
        // this.setColor();
        this.setOpacity(160);
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }
        });
        cc.eventManager.addListener(listener, this);
        this._listener = listener;
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener);
        this._super();
    },
    ctor:function () {
        this._super();
        this.init();

    },

    init:function () {
        var winSize = cc.director.getWinSize();
        var self=this;

        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;


        this.backgroundSprite=cc.Sprite.create("res/rank_bg.png");
        //this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);


        this.addChild(this.backgroundSprite);
        this.closeButton=new Button("res/close.png");
        // this.closeButton.setScale(fXScale,fYScale);
        //this.closeButton.setPosition(cc.p(size.width,size.height));
        this.closeButton.setPosition(cc.p(830,460));
        this.addChild(this.closeButton);

        this.setButtonList();


        var infoNode = new cc.Node();
        infoNode.setPosition(cc.p(150,0));
        this.addChild(infoNode);

        var infoPosY = 295;

        self.text0Label = new cc.LabelTTF( "我的排名:", "Arial",28);
        self.text0Label.setPosition(cc.p(-100,infoPosY));
        self.text0Label.setAnchorPoint(0,0.5);
        self.text0Label.setColor(WhiteColor);
        infoNode.addChild(self.text0Label);
        this.rankLabel = new cc.LabelTTF( "", "Arial", 35);
        // this.rankLabel.setPosition(cc.pAdd(text0Label.getPosition(),cc.p(text0Label.getContentSize().width,0)));
        this.rankLabel.setAnchorPoint(0,0.5);
        this.rankLabel.setColor(RedColor);
        infoNode.addChild(this.rankLabel);

        self.infoLabel=cc.LabelTTF.create("总场:", "Arial",28);
        self.infoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabel.setAnchorPoint(0,0.5);
        self.infoLabel.setPosition(cc.p(200,infoPosY));
        infoNode.addChild(self.infoLabel,5);

        self.winOneLabel= cc.LabelTTF.create("", "Arial",28);
        self.winOneLabel.setAnchorPoint(0,0.5);
        self.winOneLabel.setColor(YellowColor);
        self.winOneLabel.setPosition(cc.pAdd(self.infoLabel.getPosition(),cc.p(self.infoLabel.getContentSize().width,0)));
        infoNode.addChild(self.winOneLabel,5);
        self.sumOneLabel= cc.LabelTTF.create("", "Arial",28);
        self.sumOneLabel.setAnchorPoint(0,0.5);
        self.sumOneLabel.setColor(WhiteColor);
        self.sumOneLabel.setPosition(cc.pAdd(self.winOneLabel.getPosition(),cc.p(self.winOneLabel.getContentSize().width,0)));
        infoNode.addChild(self.sumOneLabel,5);

        self.infoLabelAI=cc.LabelTTF.create("胜场:", "Arial",28);
        // self.infoLabelAI.setScale(0.8);
        //this.zhanjiLabel=cc.LabelTTF.create(gPlayerName, "Arial", 20);
        self.infoLabelAI.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabelAI.setAnchorPoint(0,0.5);
        self.infoLabelAI.setPosition(cc.p(400,infoPosY));
        infoNode.addChild(self.infoLabelAI,5);

        self.winAILabel= cc.LabelTTF.create("", "Arial",28);
        self.winAILabel.setAnchorPoint(0,0.5);
        self.winAILabel.setColor(YellowColor);
        self.winAILabel.setPosition(cc.pAdd(self.infoLabelAI.getPosition(),cc.p(self.infoLabelAI.getContentSize().width,0)));
        infoNode.addChild(self.winAILabel,5);
        self.sumAILabel= cc.LabelTTF.create("", "Arial",28);
        self.sumAILabel.setAnchorPoint(0,0.5);
        self.sumAILabel.setColor(WhiteColor);
        self.sumAILabel.setPosition(cc.pAdd(self.winAILabel.getPosition(),cc.p(self.winAILabel.getContentSize().width,0)));
        infoNode.addChild(self.sumAILabel,5);

        self.infoLabelGain=cc.LabelTTF.create("平均收益:", "Arial",28);
        self.infoLabelGain.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        self.infoLabelGain.setAnchorPoint(0,0.5);
        self.infoLabelGain.setPosition(cc.p(520,infoPosY));
        self.infoLabelGain.setVisible(false);
        infoNode.addChild(self.infoLabelGain,5);

        self.avgGainAILabel= cc.LabelTTF.create("", "Arial",30);
        self.avgGainAILabel.setAnchorPoint(0,0.5);
        self.avgGainAILabel.setColor(WhiteColor);
        self.avgGainAILabel.setPosition(cc.pAdd(self.infoLabelGain.getPosition(),cc.p(self.infoLabelGain.getContentSize().width,0)));
        self.avgGainAILabel.setVisible(false);
        infoNode.addChild(self.avgGainAILabel,5);




        this.closeButton.setClickEvent(function(){
            cc.log("closeButton ClickEvent");
            self.toMainScene();
        });

        this.tableView = new cc.TableView(this, cc.size(1000, 360));
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        //tableView.setAnchorPoint(0,1);
        //cc.log(-winSize.width/2,-40);this
        this.tableView.setPosition(-128,-100);
        //tableView.setPosition(0,0);
        //tableView.x = winSize.width/2;
        //tableView.y = winSize.height / 2 - 150;
        //this.tableView.setScale(fXScale,fYScale);
        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this.tableView);
        if(this.tableView!=null)
        {
            this.tableView.reloadData();
        }
        this.refreshRankViewLayer();

        this.setScale(fXScale,fYScale);
        return true;
    },

    setButtonList:function(){


        if(this.mode1Button==null)
        {
            //this.mode1Button=new CheckButton("res/btn_mode1d.png","res/btn_mode1u.png");//new Button("res/btn_mode1d.png");
            this.mode1Button=new CheckButton("res/btn_mode1d.png","res/btn_mode1u.png");;//new Button("res/btn_mode1d.png");
            this.mode1Button.setPosition(cc.p(300,520));
            this.mode1Button.setClickEvent(function(){
                cc.log("mode1Button ClickEvent");
                userInfo.recordMode=MatchType.Type_Practice_Match;
                if(gMainMenuScene!=null)
                {
                    gMainMenuScene.rank();
                }
            });
            this.backgroundSprite.addChild(this.mode1Button,5);
        }
        if(this.mode2Button==null)
        {
            this.mode2Button=new CheckButton("res/btn_mode2d.png","res/btn_mode2u.png");
            this.mode2Button.setPosition(cc.p(525,520));
            this.mode2Button.setClickEvent(function(){
                cc.log("mode2Button ClickEvent");
                userInfo.recordMode=MatchType.Type_ArtificialMatch;
                if(gMainMenuScene!=null)
                {
                    gMainMenuScene.rank();
                }
                //self.Rank();
            });
            this.backgroundSprite.addChild(this.mode2Button,5);
        }
        if(this.mode3Button==null)
        {
            this.mode3Button=new CheckButton("res/btn_mode3d.png","res/btn_mode3u.png");
            this.mode3Button.setPosition(cc.p(750,520));
            this.mode3Button.setClickEvent(function(){
                cc.log("mode3Button ClickEvent");
                userInfo.recordMode=MatchType.Type_PlainMultiplayer_Match;
                if(gMainMenuScene!=null)
                {
                    gMainMenuScene.rank();
                }
            });
            this.backgroundSprite.addChild(this.mode3Button,5);
        }
        if(this.mode4Button==null)
        {
            this.mode4Button=new CheckButton(res.BTN_SELECT_MODE4_D_png,res.BTN_SELECT_MODE4_U_png);
            this.mode4Button.setPosition(cc.p(975,520));
            this.mode4Button.setClickEvent(function(){
                cc.log("mode4Button ClickEvent");
                userInfo.recordMode=MatchType.Type_Friend_Match;
                if(gMainMenuScene!=null)
                {
                    gMainMenuScene.rank();
                }
            });

            this.backgroundSprite.addChild(this.mode4Button,5);
        }

    },
    setALLButtonStatus:function(){
        this.mode1Button.setDisabled(userInfo.recordMode==MatchType.Type_Practice_Match);
        this.mode2Button.setDisabled(userInfo.recordMode==MatchType.Type_ArtificialMatch);
        this.mode3Button.setDisabled(userInfo.recordMode==MatchType.Type_PlainMultiplayer_Match);
        this.mode4Button.setDisabled(userInfo.recordMode==MatchType.Type_Friend_Match);
        this.mode1Button.setTextureByStatus(userInfo.recordMode==MatchType.Type_Practice_Match);
        this.mode2Button.setTextureByStatus(userInfo.recordMode==MatchType.Type_ArtificialMatch);
        this.mode3Button.setTextureByStatus(userInfo.recordMode==MatchType.Type_PlainMultiplayer_Match);
        this.mode4Button.setTextureByStatus(userInfo.recordMode==MatchType.Type_Friend_Match);
    },

    toMainScene:function () {
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
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
            cell = new RankTableViewCell();
        }
        if(userInfo.rankList!=null)
        {
            var data = userInfo.rankList[idx];
            if(data!=null){
                cell.setRankInfoData(data);
            };
            cell.setCellData(idx);
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        if(userInfo.rankList!=null)
        {
            if(userInfo.rankList.length>20)
                return 20;
            else
            return userInfo.rankList.length;
        }
        else return 5;
    },

    showLayer:function()
    {
        this.setVisible(true);
        this.scheduler.resumeTarget(this);
        this.actionManager && this.actionManager.resumeTarget(this);
        cc.eventManager.resumeTarget(this,true);
    },
    hideLayer:function()
    {
        this.setVisible(false);
        this.scheduler.pauseTarget(this);
        this.actionManager && this.actionManager.pauseTarget(this);
        cc.eventManager.pauseTarget(this,true);
    },
    refreshRankViewLayer:function() {
        cc.log("refreshRankViewLayer begin");
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
        var self = this;
        if (this.tableView != null) {
            this.tableView.reloadData();
        }

        if (userInfo != null && userInfo.myRanking != null) {
            //RANK|{"myRanking":{"rank":1,"playerInfo":{"uid":3434343770,"nickName":"誓约者艾琳诺","winOfMatchForOne":4,"sumOfMatchForOne":33,"winOfMatchForMore":0,"sumOfMatchForMore":0,"winOfMatchForAI":98,"sumOfMatchForAI":187,"gainCumulation":"-197.391","sumOfAllMatch":33}},"rankList":[{"rank":1,"playerInfo":{"uid":10000,"nickName":"誓约者艾琳诺","winOfMatchForOne":4,"sumOfMatchForOne":33,"winOfMatchForM
            var rankInfo = userInfo.myRanking;

            self.rankLabel.setString(rankInfo["rank"]);
            self.rankLabel.setPosition(cc.pAdd(self.text0Label.getPosition(), cc.p(self.text0Label.getContentSize().width, 0)));

            // this.setDisableAllmodeButton();
            // this.setAbleAllmodeButton();
            this.setALLButtonStatus();
            //总场数
            self.winOneLabel.setString(" " + rankInfo["sumMatch"]);
            //胜场数
            self.winAILabel.setString(" " + rankInfo["winMatch"]);
            //
            self.avgGainAILabel.setString("" + rankInfo["AvgGain"] + "%");
            self.avgGainAILabel.setColor(setLabelColor(rankInfo["AvgGain"]));


            // switch (userInfo.recordMode) {
            //
            //     case MatchType.Type_Practice_Match: {
            //         //总场数
            //         self.winOneLabel.setString(" " + rankInfo["sumMatch"]);
            //         //胜场数
            //         self.winAILabel.setString(" " + rankInfo["winMatch"]);
            //         //
            //         self.avgGainAILabel.setString("" + rankInfo["AvgGain"] + "%");
            //         self.avgGainAILabel.setColor(setLabelColor(rankInfo["AvgGain"]));
            //         break;
            //
            //     }
            //     case MatchType.Type_ArtificialMatch: {
            //         //总场数
            //         self.winOneLabel.setString(" " + rankInfo["sumMatch"]);
            //         //胜场数
            //         self.winAILabel.setString(" " + rankInfo["winMatch"]);
            //         //
            //         self.avgGainAILabel.setString("" + rankInfo["AvgGain"] + "%");
            //         self.avgGainAILabel.setColor(setLabelColor(rankInfo["AvgGain"]));
            //         break;
            //     }
            //     case  MatchType.Type_Tool_Match: {
            //
            //     }
            //     case MatchType.Type_PlainMultiplayer_Match: {
            //         //总场数
            //         //总场数
            //         self.winOneLabel.setString(" " + rankInfo["sumMatch"]);
            //         //胜场数
            //         self.winAILabel.setString(" " + rankInfo["winMatch"]);
            //         //
            //         self.avgGainAILabel.setString("" + rankInfo["AvgGain"] + "%");
            //         self.avgGainAILabel.setColor(setLabelColor(rankInfo["AvgGain"]));
            //         break;
            //     }
            //
            //     case  MatchType.Type_Friend_Match: {
            //         //总场数
            //         self.winOneLabel.setString(" " + rankInfo["sumMatch"]);
            //         //胜场数
            //         self.winAILabel.setString(" " + rankInfo["winMatch"]);
            //         //
            //         self.avgGainAILabel.setString("" + rankInfo["AvgGain"] + "%");
            //         self.avgGainAILabel.setColor(setLabelColor(rankInfo["AvgGain"]));
            //         break;
            //     }
            //     default: {
            //         cc.log("userInfo.recordMode==" + userInfo.recordMode);
            //         break;
            //     }
            // }

        }
    }
});



