/**
 * Created by Administrator on 2016-10-17.
 */
//tabelviewLayer
var ZhanjiTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);

    },

    onEnter:function () {
        this._super();
        this.spriteBg=null;
        cc.log("ZhanjiTableViewCell onEnter end");
    },
    onExit:function () {
        this._super();
        this.removeAllChildrenWithCleanup(true);
        cc.log("ZhanjiTableViewCell onExit end");
    },

    setCellView:function(idx){
        cc.log("ZhanjiTableViewCell setCellView begin");
        var self = this;

        var matchData=userInfo.MatchListData[idx];
        var userInfoTemp = matchData.userInfo;
        var length = userInfoTemp.length;
        for(var i=0;i<length;i++){
            userInfoTemp[i].score=parseFloat(userInfoTemp[i].score).toFixed(2);
        }
        // console.info("排序前");
        // console.info(userInfoTemp);
        userInfoTemp.sort(function (a,b) {
            if(a["userName"]==userInfo.nickName){
                return -1;
            }else if(b["userName"]==userInfo.nickName){
                return 1;
            }else {
                cc.log("得到的战绩信息有误！！！请核对");
                return -1;
            }
        });
        // console.info("排序后");
        // console.info(userInfoTemp);
        touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
        touxiangSprite.setScale(0.6);
        touxiangSprite.setPosition(cc.p(80,40));
        this.addChild(touxiangSprite,2);

        var url = userInfoTemp[0]["headPicture"];
        cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
            if(err){
                cc.log(err);
                cc.log("战绩：fail loadImg="+url); // self.addChild(logo);
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
                headSprite.setScale(66/size.width,66/size.height);
                headSprite.setPosition(cc.p(80,40));
                self.addChild(headSprite,2);
                cc.log("战绩：success loadImg="+url); // self.addChild(logo); // self.touxiangSprite.setValue(false);
            }
        });

        strNameText= userInfoTemp[0]["userName"];
        textNameLabel = new cc.LabelTTF(cutstr(strNameText,11), "Arial", 25.0);
        textNameLabel.setPosition(cc.p(150,20));
        textNameLabel.setAnchorPoint(0,0.5);
        this.addChild(textNameLabel);

        //设置收益
        strScoreText= userInfoTemp[0]["score"]+"%";
        textScoreLabel = new cc.LabelTTF(strScoreText, "Arial", 35.0);
        textScoreLabel.setPosition(cc.p(150,60));
        textScoreLabel.setAnchorPoint(0,0.5);
        textScoreLabel.setColor(setLabelColor(userInfoTemp[0]["score"]));

        // if(userInfoTemp["score"]>0)
        // {
        //     textScoreLabel.setColor(RedColor);
        // }
        // else if(userInfoTemp["score"]<0)
        // {
        //     textScoreLabel.setColor(GreenColor);
        // }
        // else
        // {
        //     textScoreLabel.setColor(WhiteColor);
        // }
        this.addChild(textScoreLabel);

        //设置时间
        strTimeText= matchData["matchTime"];
        textTimeLabel = new cc.LabelTTF(strTimeText, "Arial", 25.0);
        textTimeLabel.setPosition(cc.p(880,65));
        textTimeLabel.setAnchorPoint(0.5,0.5);
        textTimeLabel.setColor(lightBlueColor);
        this.addChild(textTimeLabel);

        //设置查看交易记录按钮
        recordButton=new Button("res/btnRecord.png");
        recordButton.setAnchorPoint(0.5,0.5);
        recordButton.setPosition(cc.p(880,30));
        this.spriteBg.addChild(recordButton);
        var matchId = matchData["matchId"];
        var userId = userInfoTemp[0]["userName"];
        cc.log("recordButton ClickEvent userId["+idx+"] ="+userId+"||matchId="+matchId);
        recordButton.setClickEvent(function(){

            var klineSceneNext=new KLineScene();
            klineSceneNext.onEnteredFunction=function(){

            };
            userInfo.matchMode=userInfo.recordMode;
            gSocketConn.SendRecordMessage(matchId,userId);
            cc.director.runScene(klineSceneNext);

        });

        cc.log("ZhanjiTableViewCell setCellView middle");

        if("undefined"!=typeof(userInfoTemp)&&userInfoTemp.length>1)
        {
            matchFlag =cc.Sprite.create("res/vs.png");
            matchFlag.setPosition(cc.p(420,40));
            this.addChild(matchFlag);
            if(userInfoTemp[0]["ranking"]==1)
            {
                matchFlag.setTexture("res/ko.png");
            }
            else
            {
                matchFlag.setTexture("res/vs.png");
            }

            // playerSprite = cc.Sprite.create("res/touxiangAI.png");
            // playerSprite.setScale(0.6);
            // playerSprite.setPosition(cc.p(530,40));
            // this.addChild(playerSprite,2);

            var url = userInfoTemp[1]["headPicture"];
            cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                if(err){
                    cc.log(err);
                }
                if(img){
                    cc.log("img!=null"+img);
                    var headSpriteAI = new cc.Sprite();
                    //     this.touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
                    // cc.textureCache.addImage(imgUrl);
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    headSpriteAI.initWithTexture(texture2d);

                    var size = headSpriteAI.getContentSize();
                    headSpriteAI.setScale(66/size.width,66/size.height);
                    headSpriteAI.setPosition(cc.p(530,40));
                    self.addChild(headSpriteAI,2);
                    // self.touxiangSprite.setValue(false);
                }
                cc.log("loadImg="+url); // self.addChild(logo);
            });
            playerNameText= userInfoTemp[1]["userName"];
            playerNameLabel = new cc.LabelTTF(cutstr(playerNameText,11), "Arial", 25.0);
            playerNameLabel.setPosition(cc.p(570,20));
            playerNameLabel.setAnchorPoint(0,0.5);
            this.addChild(playerNameLabel);
            //设置收益
            strScoreplayer= userInfoTemp[1]["score"]+"%";
            playerScoreLabel = new cc.LabelTTF(strScoreplayer, "Arial", 25.0);
            playerScoreLabel.setPosition(cc.p(570,60));
            playerScoreLabel.setAnchorPoint(0,0.5);
            playerScoreLabel.setColor(setLabelColor(userInfoTemp[1]["score"]));

            this.addChild(playerScoreLabel);
        }
        cc.log("ZhanjiTableViewCell setCellView end");
    },
    setCellData:function(idx){
        cc.log("ZhanjiTableViewCell setCellData=="+idx);
        var self = this;
        this.spriteBg = new cc.Sprite("res/line_bg.png");
        this.spriteBg.setPosition(cc.p(0,0));
        this.spriteBg.setAnchorPoint(0,0);
        this.addChild(this.spriteBg);
        if(userInfo.MatchListData!=null)
        {

            var matchData=userInfo.MatchListData[idx];
            var userInfoTemp = matchData.userInfo[0];
            userInfoTemp.score=parseFloat(userInfoTemp.score).toFixed(2);
            // userInfo.AvgGain=parseFloat(data["AvgGain"]).toFixed(2);

            // this.setCellView(idx);
            //{"matchId":7661,"uid":3434343770,"nickName":"誓约者艾琳诺","score":"0.00","matchTime":"11-16 16:36","playerNum":1,"matchType":2,"playerList":[{"userName":"誓约者艾琳诺","score":"0.00","ranking":1},{"userName":"唐奇安通道","score":"-1.22","ranking":2}]}
            //设置用户名
            // strNameText= userInfo.MatchListData[idx]["uid"];
            switch (userInfo.recordMode)
            {

                case MatchType.Type_Practice_Match:
                {
                    touxiangSprite = cc.Sprite.create("res/bg_touxiang.png");
                    touxiangSprite.setScale(0.6);
                    touxiangSprite.setPosition(cc.p(80,40));
                    this.addChild(touxiangSprite,2);

                    var url = userInfoTemp["headPicture"];
                    cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                        if(err){
                            cc.log(err);
                            cc.log("战绩：fail loadImg="+url); // self.addChild(logo);
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
                            headSprite.setScale(66/size.width,66/size.height);
                            headSprite.setPosition(cc.p(80,40));
                            self.addChild(headSprite,2);
                            cc.log("战绩：success loadImg="+url); // self.addChild(logo); // self.touxiangSprite.setValue(false);
                        }
                    });

                    strNameText= userInfoTemp["userName"];
                    textNameLabel = new cc.LabelTTF(cutstr(strNameText,11), "Arial", 25.0);
                    textNameLabel.setPosition(cc.p(150,40));
                    textNameLabel.setAnchorPoint(0,0.5);
                    this.addChild(textNameLabel);

                    //设置收益
                    strScoreText= userInfoTemp["score"]+"%";
                    textScoreLabel = new cc.LabelTTF(strScoreText, "Arial", 35.0);
                    textScoreLabel.setPosition(cc.p(400,40));
                    textScoreLabel.setAnchorPoint(0,0.5);
                    if(userInfoTemp["score"]>0)
                    {
                        textScoreLabel.setColor(RedColor);
                    }
                    else if(userInfoTemp["score"]<0)
                    {
                        textScoreLabel.setColor(GreenColor);
                    }
                    else
                    {
                        textScoreLabel.setColor(WhiteColor);
                    }
                    this.addChild(textScoreLabel);

                    //设置时间
                    strTimeText= matchData["matchTime"];
                    textTimeLabel = new cc.LabelTTF(strTimeText, "Arial", 25.0);
                    textTimeLabel.setPosition(cc.p(600,40));
                    textTimeLabel.setAnchorPoint(0,0.5);
                    textTimeLabel.setColor(WhiteColor);
                    this.addChild(textTimeLabel);

                    //设置查看交易记录按钮
                    recordButton=new Button("res/btnRecord.png");
                    recordButton.setAnchorPoint(0,0.5);
                    recordButton.setPosition(cc.p(800,40));
                    this.spriteBg.addChild(recordButton);
                    var matchId = matchData["matchId"];
                    var userId = userInfoTemp["userName"];
                    cc.log("recordButton ClickEvent userId["+idx+"] ="+userId+"||matchId="+matchId);
                    recordButton.setClickEvent(function(){

                        var klineSceneNext=new KLineScene();
                        klineSceneNext.onEnteredFunction=function(){

                        };
                        userInfo.matchMode=userInfo.recordMode;
                        gSocketConn.SendRecordMessage(matchId,userId);
                        cc.director.runScene(klineSceneNext);

                    });
                    break;
                }
                case MatchType.Type_PlainMultiplayer_Match:
                case MatchType.Type_ArtificialMatch:
                case MatchType.Type_Friend_Match:
                {
                    this.setCellView(idx);

                    break;
                }

                default:
                {
                    cc.log("userInfo.recordMode=="+userInfo.recordMode);
                    break;
                }
            }
        }
    },

});

var ZhanjiViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,
    recordCallBackFunction:null,
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


        this.backgroundSprite=cc.Sprite.create("res/zhanji_bg.png");
        //this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);


        this.addChild(this.backgroundSprite);
        this.closeButton=new Button("res/close.png");
        // this.closeButton.setScale(fXScale,fYScale);
        //this.closeButton.setPosition(cc.p(size.width,size.height));
        this.closeButton.setPosition(cc.p(830,460));
        this.addChild(this.closeButton);


        var infoNode = new cc.Node();
        infoNode.setPosition(cc.p(150,0));
        this.addChild(infoNode);
        var posX = 50;
        this.setButtonList();

        text1Label = new cc.LabelTTF( "平均收益:", "Arial", 25.0);
        text1Label.setPosition(cc.p(10,280));
        text1Label.setAnchorPoint(0,0);
        text1Label.setColor(WhiteColor);
        infoNode.addChild(text1Label);
        infoNode.setVisible(false);

        text2Label = new cc.LabelTTF( "总场:", "Arial", 25.0);
        text2Label.setPosition(cc.p(300,280));
        text2Label.setPosition(cc.p(20,280));
        text2Label.setAnchorPoint(0,0);
        text2Label.setColor(WhiteColor);
        this.addChild(text2Label);

        text3Label = new cc.LabelTTF( "胜率:", "Arial", 25.0);
        text3Label.setPosition(cc.p(500,280));
        text3Label.setAnchorPoint(0,0);
        text3Label.setColor(WhiteColor);
        this.addChild(text3Label);

        if(userInfo!=null)
        {
            //var strValue = "平均收益率:"+userInfo.AvgGain+"       总局数:"+userInfo.totalCount+"     胜率:"+userInfo.winRate;
            //cc.log(strValue);
            this.avgGainLabel = new cc.LabelTTF( userInfo.AvgGain+"%", "Arial", 25.0);
            this.avgGainLabel.setPosition(cc.p(150,280));
            this.avgGainLabel.setAnchorPoint(0,0);
            this.avgGainLabel.setColor(setLabelColor(userInfo.AvgGain));
            infoNode.addChild(this.avgGainLabel);

            this.totalCountLabel = new cc.LabelTTF( userInfo.totalCount, "Arial", 25.0);
            this.totalCountLabel.setPosition(cc.p(400,280));
            this.totalCountLabel.setPosition(cc.p(120,280));
            this.totalCountLabel.setAnchorPoint(0,0);
            this.totalCountLabel.setColor(YellowColor);
            this.addChild(this.totalCountLabel);

            this.winRateLabel = new cc.LabelTTF( userInfo.winRate+"%", "Arial", 25.0);
            this.winRateLabel.setPosition(cc.p(580,280));
            this.winRateLabel.setAnchorPoint(0,0);
            this.winRateLabel.setColor(YellowColor);
            this.addChild(this.winRateLabel);
        }


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
        this.tableView.reloadData();


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
                    gMainMenuScene.zhanji();
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
                    gMainMenuScene.zhanji();
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
                    gMainMenuScene.zhanji();
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
                    gMainMenuScene.zhanji();
                }
            });

            this.backgroundSprite.addChild(this.mode4Button,5);
        }

        this.refreshZhanjiViewLayer();
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
            cell = new ZhanjiTableViewCell();

            //label = new cc.LabelTTF(strValue, "Arial", 30.0);
            //label.setPosition(cc.p(0,20));
            //label.setAnchorPoint(0,0);
            //label.tag = 123;
            //cell.addChild(label);
            if(userInfo.MatchListData!=null)
            {
                cell.setCellData(idx);
            }

        } else {
            //label = cell.getChildByTag(123);
            //label.setString(strValue);
            if(userInfo.MatchListData!=null)
            {
                cell.setCellData(idx);
            }
        }
        return cell;
        // setTimeout(function(){return cell;},100);
        // for(var each in pageTimer){
        //     clearTimeout(pageTimer[each]);
        // }
        // var self=this;
        // pageTimer["tableCellAtIndex"] = setTimeout(function(){return cell;},100);
    },

    numberOfCellsInTableView:function (table) {
        if(userInfo.MatchListData!=null)
        {
            if(userInfo.MatchListData.length>20)
                return 20;
            else
            return userInfo.MatchListData.length;
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
    refreshZhanjiViewLayer:function()
    {
        if(this.tableView!=null)
        {
            this.tableView.reloadData();
        }
        // this.tableView.reloadData();
        if(userInfo!=null)
        {
            //var strValue = "平均收益率:"+userInfo.AvgGain+"       总局数:"+userInfo.totalCount+"     胜率:"+userInfo.winRate;
            //cc.log(strValue);
            if(this.avgGainLabel!=null)
            {
                this.avgGainLabel.setString(userInfo.AvgGain+"%");
                this.avgGainLabel.setColor(setLabelColor(userInfo.AvgGain));
            }

            if(this.totalCountLabel!=null){
                this.totalCountLabel.setString(userInfo.totalCount);
            }
            if(this.winRateLabel!=null)
            {
                this.winRateLabel.setString(userInfo.winRate+"%");
                // this.winRateLabel.setColor(setLabelColor(userInfo.winRate));
            }
            this.setALLButtonStatus();
        }

    }
});


