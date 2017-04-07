/**
 * Created by Administrator on 2016-12-13.
 */
var MatchViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,

    backgroundSprite:null,//
    selfNameLabel:null, //自己的名字
    opponentNameLabel:null,//对手的名字
    opponentSprite:null,
    PersonBattleView:null,
    AiBattleView:null,

    bgSprite:null,
    AiMenu:null,
    AiModeSelect:null,
    // PracticeBattleView:null,

    dayCount1Btn:null,
    dayCount2Btn:null,
    dayCount3Btn:null,
    dayCount4Btn:null,
    dayCountSelect:null,
    timeBegin:0,

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
        // this.onEnter();
        this.init();

    },

    init:function () {
        var self=this;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;
        var posD = 50;
        var posY = 100;
        var fontSize = 25;


        var matchInfoMessage =userInfo.matchMode+"#"+userInfo.matchAiMode+"#"+userInfo.matchDayCount;
        cc.log(" begin matchInfoMessage="+matchInfoMessage);
        this.refreshMatchViewLayer();

        return true;
    },

    toMainScene:function () {
        cc.log(" toMainScene:function () begin");
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
    },

    generalMatch:function () {
        userInfo.matchMode=1;
        this.propButton.unselected();
        this.generalButton.selected();
    },

    propMatch:function () {
        userInfo.matchMode=3;
        this.propButton.selected();
        this.generalButton.unselected();
    },
    beginMatch:function(){
        var self =this;
        var matchInfoMessage =userInfo.matchMode+"#"+userInfo.matchAiMode+"#"+userInfo.matchDayCount;
        cc.log(" beginMatch:function() begin matchInfoMessage="+matchInfoMessage);
        switch (userInfo.matchMode)
        {

            case 0:
            {

                // var klineSceneNext=new KLineScene();
                // klineSceneNext.onEnteredFunction=function(){
                //
                //     // klineSceneNext.showProgress();
                // };
                // gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
                gSocketConn.BeginMatch(matchInfoMessage);
                userInfo.matchBeginFlag=true;
                //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
                // cc.director.runScene(klineSceneNext);
                // cc.log("klineSceneNext切换KGameScene场景调用完毕");

                break;
            }
            case 1:
            {

                self.unmatchButton.setVisible(true);
                self.beginButton.setVisible(false);
                self.textLabel.setVisible(true);
                if(null!=gMainMenuScene)
                {
                    gSocketConn.BeginMatch("1");
                    this.timeBegin = new Date().getTime();
                    this.showHeadChange();
                }

                break;
            }
            case 2:
            {
                // var klineSceneNext=new KLineScene();
                // klineSceneNext.onEnteredFunction=function(){
                //
                //     // klineSceneNext.showProgress();
                // };
                // gSocketConn.RegisterEvent("onmessage",klineSceneNext.messageCallBack);
                gSocketConn.BeginMatch(matchInfoMessage);
                userInfo.matchBeginFlag=true;
                //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
                // cc.director.runScene(klineSceneNext);
                cc.log("klineSceneNext切换KGameScene场景调用完毕");
                break;
            }
            case 3:
            {

                self.unmatchButton.setVisible(true);
                self.beginButton.setVisible(false);
                self.textLabel.setVisible(true);
                if(null!=gMainMenuScene)
                {
                    gSocketConn.BeginMatch("3");
                    this.timeBegin = new Date().getTime();
                    this.showHeadChange();
                }

                break;
            }
            default:
            {
                cc.log("userInfo.recordMode=="+userInfo.recordMode);
                break;
            }
        }

        // if(this.closeCallBackFunction!=null){
        //     this.closeCallBackFunction();
        // }
    },

    unMatch:function(){
        cc.log(" unMatch:function() begin");

        this.unmatchButton.setVisible(false);
        this.textLabel.setVisible(false);
        this.timeLabel.setVisible(false);
        this.beginButton.setVisible(true);
        gSocketConn.SendInfoMessage("UNMATCH","");
        this.stopHeadChange();
        this.toMainScene();
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

    setPracticeBattleView:function(){

        if(this.AiBattleView ==null){
            this.setAiBattleView();
        }
        if(this.AiBattleView !=null){
            this.bgSprite.initWithFile("res/bg_select0.png");

            var posX0 = 40;
            var spaceX = 140 ;
            var spaceY = 10 ;
            var fscale = 1.2;
            var posY=100;
            this.dayCount1Btn.setPosition(cc.p(posX0+spaceX*1,bgSize.height/2+spaceY));
            this.dayCount1Btn.setScale(fscale);
            this.dayCount1Btn.setTag(101);

            this.dayCount2Btn.setPosition(cc.p(posX0+spaceX*2,bgSize.height/2+spaceY));
            this.dayCount2Btn.setScale(fscale);
            this.dayCount2Btn.setTag(102);

            this.dayCount3Btn.setPosition(cc.p(posX0+spaceX*3,bgSize.height/2+spaceY));
            this.dayCount3Btn.setScale(fscale);
            this.dayCount3Btn.setTag(103);

            this.dayCount4Btn.setPosition(cc.p(posX0+spaceX*4,bgSize.height/2+spaceY));
            this.dayCount4Btn.setTag(104);
            this.dayCount4Btn.setScale(fscale);
            this.dayCountSelect.setScale(fscale);

            this.AiBeginButton.setPosition(cc.p(bgSize.width/2,posY));
            switch(userInfo.matchDayCount)
            {
                case 60:
                    this.dayCountSelect.setPosition(this.dayCount1Btn.getPosition());
                    break;
                case 120:
                    this.dayCountSelect.setPosition(this.dayCount2Btn.getPosition());
                    break;
                case 180:
                    this.dayCountSelect.setPosition(this.dayCount3Btn.getPosition());
                    break;
                case 240:
                    this.dayCountSelect.setPosition(this.dayCount4Btn.getPosition());
                    break;
                default:
                    break;
            }
            this.AiMenu.setVisible(false);
            this.AiModeSelect.setVisible(false);
            this.AiBattleView.setVisible(true);
        }

        if(this.PersonBattleView !=null){

            this.PersonBattleView.setVisible(false);
        }
    },

    setAiBattleView:function(){
        var self=this;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;
        var posD = 70;
        var posY = 80;
        var fontSize = 25;

        if(this.AiBattleView ==null){
            this.AiBattleView =new cc.LayerColor(cc.color(0,0,0,127),size.width,size.height);
            this.bgSprite=cc.Sprite.create("res/bg_control.png");
            bgSize = this.bgSprite.getContentSize();

            this.bgSprite.initWithFile("res/bg_select.png");
            cc.log("MatchViewLayer backgroundSprite bgSize="+bgSize.width);

            var mu = new cc.Menu();
            mu.x = 0;
            mu.y = 0;
            this.bgSprite.addChild(mu,3);
            // closeBtn=new Button("res/close.png");
            var closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
            closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
            mu.addChild(closeBtn);
            this.AiBeginButton=new cc.MenuItemImage("res/btn_begin.png", "res/btn_begin.png", self.beginMatch, this);//new CheckButton("res/btn_begin.png","res/btn_begin.png");//new Button("res/btn_mode1d.png");
            this.AiBeginButton.setPosition(cc.p(bgSize.width/2,posY));
            mu.addChild(this.AiBeginButton);

            var posX0 = 120;
            var spaceX = 110 ;
            var spaceY = 60 ;
            if(this.dayCount1Btn==null){
                this.dayCount1Btn =  new cc.MenuItemImage("res/select_60.png", "res/select_60.png", self.setDayCount1, this);
                mu.addChild(this.dayCount1Btn);
            }
            this.dayCount1Btn.setPosition(cc.p(posX0+spaceX*1,bgSize.height/2+spaceY));
            this.dayCount1Btn.setTag(101);

            if(this.dayCount2Btn==null){
                this.dayCount2Btn =  new cc.MenuItemImage("res/select_120.png", "res/select_120.png", self.setDayCount2, this);
                mu.addChild(this.dayCount2Btn);
            }
            this.dayCount2Btn.setPosition(cc.p(posX0+spaceX*2,bgSize.height/2+spaceY));
            this.dayCount2Btn.setTag(102);

            if(this.dayCount3Btn==null){
                this.dayCount3Btn =  new cc.MenuItemImage("res/select_180.png", "res/select_180.png", self.setDayCount3, this);
                mu.addChild(this.dayCount3Btn);
            }
            this.dayCount3Btn.setPosition(cc.p(posX0+spaceX*3,bgSize.height/2+spaceY));
            this.dayCount3Btn.setTag(103);

            if(this.dayCount4Btn==null){
                this.dayCount4Btn =  new cc.MenuItemImage("res/select_240.png", "res/select_240.png", self.setDayCount4, this);
                mu.addChild(this.dayCount4Btn);
            }
            this.dayCount4Btn.setPosition(cc.p(posX0+spaceX*4,bgSize.height/2+spaceY));
            this.dayCount4Btn.setTag(104);

            if(this.dayCountSelect==null){
                this.dayCountSelect = cc.Sprite.create("res/select_bg.png");
                this.bgSprite.addChild(this.dayCountSelect,3);
            }

            switch(userInfo.matchDayCount)
            {
                case 60:
                    this.dayCountSelect.setPosition(this.dayCount1Btn.getPosition());
                    break;
                case 120:
                    this.dayCountSelect.setPosition(this.dayCount2Btn.getPosition());
                    break;
                case 180:
                    this.dayCountSelect.setPosition(this.dayCount3Btn.getPosition());
                    break;
                case 240:
                    this.dayCountSelect.setPosition(this.dayCount4Btn.getPosition());
                    break;
                default:
                    break;
            }

            if(this.AiMenu==null){
                this.AiMenu = new cc.Menu();
                this.AiMenu.x = 0;
                this.AiMenu.y = 0;
                this.bgSprite.addChild(this.AiMenu,3);
            }

            AiMode1Btn =  new cc.MenuItemImage("res/select_1.png", "res/select_1.png", self.setAiMode1, this);
            AiMode1Btn.setPosition(cc.p(posX0+spaceX*1,bgSize.height/2-posD));
            AiMode1Btn.setTag(101);
            this.AiMenu.addChild(AiMode1Btn);

            AiMode2Btn =  new cc.MenuItemImage("res/select_2.png", "res/select_2.png", self.setAiMode2, this);
            AiMode2Btn.setPosition(cc.p(posX0+spaceX*2,bgSize.height/2-posD));
            AiMode2Btn.setTag(102);
            this.AiMenu.addChild(AiMode2Btn);

            AiMode3Btn =  new cc.MenuItemImage("res/select_3.png", "res/select_3.png", self.setAiMode3, this);
            AiMode3Btn.setPosition(cc.p(posX0+spaceX*3,bgSize.height/2-posD));
            AiMode3Btn.setTag(103);
            this.AiMenu.addChild(AiMode3Btn);

            AiMode4Btn =  new cc.MenuItemImage("res/select_4.png", "res/select_4.png", self.setAiMode4, this);
            AiMode4Btn.setPosition(cc.p(posX0+spaceX*4,bgSize.height/2-posD));
            AiMode4Btn.setTag(104);
            this.AiMenu.addChild(AiMode4Btn);

            AiMode5Btn =  new cc.MenuItemImage("res/select_5.png", "res/select_5.png", self.setAiMode5, this);
            AiMode5Btn.setPosition(cc.p(posX0+spaceX*5,bgSize.height/2-posD));
            AiMode5Btn.setTag(104);
            this.AiMenu.addChild(AiMode5Btn);

            this.AiModeSelect = cc.Sprite.create("res/select_bg.png");
            // AiModeSelect.setScale(1.05);
            switch(userInfo.matchAiMode)
            {
                case "DON":
                    this.AiModeSelect.setPosition(AiMode1Btn.getPosition());
                    break;
                case "3MA":
                    this.AiModeSelect.setPosition(AiMode2Btn.getPosition());
                    break;
                case "1MA":
                    this.AiModeSelect.setPosition(AiMode3Btn.getPosition());
                    break;
                case "BOOL":
                    this.AiModeSelect.setPosition(AiMode4Btn.getPosition());
                    break;
                case "3RED":
                    this.AiModeSelect.setPosition(AiMode5Btn.getPosition());
                    break;
                default:
                    break;
            }
           // AiModeSelect.setPosition(AiMode1Btn.getPosition());
            this.bgSprite.addChild(this.AiModeSelect,3);

            this.bgSprite.setScale(fXScale,fYScale);
            this.bgSprite.setPosition(size.width/2,size.height/2);
            this.AiBattleView.addChild(this.bgSprite);
            this.addChild(this.AiBattleView);
            this.AiBattleView.setVisible(true);
        }
        if(this.AiBattleView !=null){
            this.bgSprite.initWithFile("res/bg_select.png");


            var posX0 = 120;
            var spaceX = 110 ;
            var spaceY = 60 ;
            var fscale = 1.0;

            this.AiBeginButton.setPosition(cc.p(bgSize.width/2,posY));
            this.dayCount1Btn.setPosition(cc.p(posX0+spaceX*1,bgSize.height/2+spaceY));
            this.dayCount1Btn.setScale(fscale);

            this.dayCount2Btn.setPosition(cc.p(posX0+spaceX*2,bgSize.height/2+spaceY));
            this.dayCount2Btn.setScale(fscale);

            this.dayCount3Btn.setPosition(cc.p(posX0+spaceX*3,bgSize.height/2+spaceY));
            this.dayCount3Btn.setScale(fscale);

            this.dayCount4Btn.setPosition(cc.p(posX0+spaceX*4,bgSize.height/2+spaceY));
            this.dayCount4Btn.setScale(fscale);
            this.dayCountSelect.setScale(fscale);


            switch(userInfo.matchDayCount)
            {
                case 60:
                    this.dayCountSelect.setPosition(this.dayCount1Btn.getPosition());
                    break;
                case 120:
                    this.dayCountSelect.setPosition(this.dayCount2Btn.getPosition());
                    break;
                case 180:
                    this.dayCountSelect.setPosition(this.dayCount3Btn.getPosition());
                    break;
                case 240:
                    this.dayCountSelect.setPosition(this.dayCount4Btn.getPosition());
                    break;
                default:
                    break;
            }

            this.AiMenu.setVisible(true);
            this.AiModeSelect.setVisible(true);
            this.AiBattleView.setVisible(true);
        }

        if(this.PersonBattleView !=null){

            this.PersonBattleView.setVisible(false);
        }
    },

    setDayCount1:function()
    {
        userInfo.matchDayCount = 60;
        this.dayCountSelect.setPosition(this.dayCount1Btn.getPosition());
    },
    setDayCount2:function()
    {
        userInfo.matchDayCount = 120;
        this.dayCountSelect.setPosition(this.dayCount2Btn.getPosition());
    },
    setDayCount3:function()
    {
        userInfo.matchDayCount = 180;
        this.dayCountSelect.setPosition(this.dayCount3Btn.getPosition());
    },
    setDayCount4:function()
    {
        userInfo.matchDayCount = 240;
        this.dayCountSelect.setPosition(this.dayCount4Btn.getPosition());
    },
    // setDayCount:function(tag, pMenuItem)
    // {
    //     cc.log(" setDayCount tag=="+tag);
    //     switch(tag)
    //     {
    //         case 101:
    //             userInfo.matchDayCount = 60;
    //             break;
    //         case 102:
    //             userInfo.matchDayCount = 120;
    //             break;
    //         case 103:
    //             userInfo.matchDayCount = 180;
    //             break;
    //         default:
    //             break;
    //     }
    // },
    setAiMode1:function(){
        userInfo.matchAiMode = "DON";
        this.AiModeSelect.setPosition(AiMode1Btn.getPosition());
    },
    setAiMode2:function(){
        userInfo.matchAiMode = "3MA";
        this.AiModeSelect.setPosition(AiMode2Btn.getPosition());
    },
    setAiMode3:function(){
        userInfo.matchAiMode = "1MA";
        this.AiModeSelect.setPosition(AiMode3Btn.getPosition());
    },
    setAiMode4:function(){
        userInfo.matchAiMode = "BOOL";
        this.AiModeSelect.setPosition(AiMode4Btn.getPosition());
    },
    setAiMode5:function(){
        userInfo.matchAiMode = "3RED";
        this.AiModeSelect.setPosition(AiMode5Btn.getPosition());
    },

    setPersonBattleView:function(){
        var self=this;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;

        var posY = 80;
        var fontSize = 25;

        if(this.AiBattleView !=null){
            this.AiBattleView.setVisible(false);
        }
        if(this.PersonBattleView ==null){
            this.PersonBattleView =new cc.LayerColor(cc.color(0,0,0,127),size.width,size.height);

            cc.spriteFrameCache.addSpriteFrames(res.touxiang_plist);
            this.backgroundSprite=new cc.Sprite("res/bg_control.png");

            this.backgroundSprite.initWithFile("res/bg_match.png");
            bgSize = this.backgroundSprite.getContentSize();
            cc.log("MatchViewLayer backgroundSprite bgSize="+bgSize.width);
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame("bg_touxiang.png");
            // var sprite = new cc.Sprite(spriteFrame);
            var posD = bgSize.height/2+80;
            this.selfBg = new cc.Sprite(spriteFrame );
            this.selfBg.setPosition(bgSize.width/4,posD);
            this.backgroundSprite.addChild(this.selfBg,2);

            this.vsSprite = new cc.Sprite("res/vs.png");
            this.vsSprite.setPosition(bgSize.width/2,posD);
            this.backgroundSprite.addChild( this.vsSprite,2);
            this.textLabel = cc.LabelTTF.create("匹配中...", "Arial", fontSize);
            this.textLabel.setPosition(bgSize.width/2,posD-80);
            this.textLabel.setColor(YellowColor);
            this.textLabel.setVisible(false);
            this.backgroundSprite.addChild(this.textLabel,2);
            this.timeLabel = cc.LabelTTF.create("已等待____", "Arial", fontSize);
            this.timeLabel.setPosition(bgSize.width/2,posD-120);
            this.timeLabel.setColor(WhiteColor);
            this.timeLabel.setVisible(false);
            this.backgroundSprite.addChild(this.timeLabel,2);



            this.opponentBg = new cc.Sprite(spriteFrame);
            this.opponentBg.setPosition(bgSize.width/4*3,posD);
            this.backgroundSprite.addChild(this.opponentBg,2);

            this.selfNameLabel = cc.LabelTTF.create(userInfo.nickName, "Arial", fontSize);
            this.selfNameLabel.setPosition(bgSize.width/4,posD-100);
            this.backgroundSprite.addChild(this.selfNameLabel,2);

            this.opponentNameLabel = cc.LabelTTF.create("-- -- -- --", "Arial", fontSize);
            this.opponentNameLabel.setPosition(bgSize.width/4*3,posD-100);
            this.backgroundSprite.addChild(this.opponentNameLabel,2);

            var mu = new cc.Menu();
            mu.x = 0;
            mu.y = 0;
            this.backgroundSprite.addChild(mu,3);
            // closeBtn=new Button("res/close.png");
            closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.unMatch, this);
            closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
            mu.addChild(closeBtn);

            if(userInfo.headSprite!=null)
            {
                var url = userInfo.headSprite;
                cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                    if(err){
                        cc.log(err);
                        cc.log("fail loadImg="+userInfo.headSprite); // self.addChild(logo);
                    }
                    if(img)
                    {
                        var headSprite = new cc.Sprite();
                        var texture2d = new cc.Texture2D();
                        texture2d.initWithElement(img);
                        texture2d.handleLoadedTexture();
                        headSprite.initWithTexture(texture2d);

                        var size = headSprite.getContentSize();
                        headSprite.setScale(95/size.width,95/size.height);
                        headSprite.setPosition(self.selfBg.getPosition());
                        self.backgroundSprite.addChild(headSprite,2);
                        cc.log("refreshMatchViewLayer success loadImg="+userInfo.headSprite); // self.addChild(logo);
                    }
                });
            }
            if(userInfo.nickName!=null&&self.selfNameLabel!=null)
            {
                self.selfNameLabel.setString(cutstr(userInfo.nickName,11));
            }


            // this.opponentSprite = new HeadSpriteChange(100,100);
            // this.opponentSprite.setPosition(bgSize.width/4*3,bgSize.height/2+posD);
            // this.opponentSprite.setVisible(false);
            var macthButtonPosY = 170;

            this.generalButton=new cc.MenuItemImage(res.SELECT_NO_PNG, res.SELECT_OK_PNG, self.generalMatch, this);//new CheckButton("res/btn_begin.png","res/btn_begin.png");//new Button("res/btn_mode1d.png");
            this.generalButton.setPosition(cc.p(bgSize.width/2-150,macthButtonPosY));
            mu.addChild(this.generalButton);

            // this.generalLabel=cc.LabelTTF.create("普通模式", "fonts/Self.ttf",fontSize);
            // this.generalLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            // this.generalLabel.setAnchorPoint(0,0.5);
            // this.generalLabel.setPosition(cc.p(bgSize.width/2-130,macthButtonPosY));
            // this.backgroundSprite.addChild(this.generalLabel,2);

            this.propButton=new cc.MenuItemImage(res.SELECT_NO_PNG, res.SELECT_OK_PNG, self.propMatch, this);//new CheckButton("res/btn_unmatch.png","res/btn_unmatch.png");//new Button("res/btn_mode1d.png");
            this.propButton.setPosition(cc.p(bgSize.width/2+50,macthButtonPosY-3));
            // this.propButton.setVisible(false);
            mu.addChild(this.propButton);

            cc.MenuItemFont.setFontName("fonts/Self.ttf");
            cc.MenuItemFont.setFontSize(fontSize);

            var item1 = new cc.MenuItemFont("普通模式", self.generalMatch, this);
            item1.setAnchorPoint(0,0.5);
            item1.setPosition(cc.p(bgSize.width/2-130,macthButtonPosY-5));
            mu.addChild(item1);

            var item2 = new cc.MenuItemFont("道具模式", self.propMatch, this);
            item2.setAnchorPoint(0,0.5);
            item2.setPosition(cc.p(bgSize.width/2+70,macthButtonPosY-5));
            mu.addChild(item2);




            // this.propLabel=cc.LabelTTF.create("道具模式", "fonts/Self.ttf",fontSize);
            // this.propLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            // this.propLabel.setAnchorPoint(0,0.5);
            // this.propLabel.setPosition(cc.p(bgSize.width/2+70,macthButtonPosY-3));
            // this.backgroundSprite.addChild(this.propLabel,2);


            this.beginButton=new cc.MenuItemImage("res/btn_begin.png", "res/btn_begin.png", self.beginMatch, this);//new CheckButton("res/btn_begin.png","res/btn_begin.png");//new Button("res/btn_mode1d.png");
            this.beginButton.setPosition(cc.p(bgSize.width/2,posY));
            mu.addChild(this.beginButton);

            this.unmatchButton=new cc.MenuItemImage("res/btn_unmatch.png", "res/btn_unmatch.png", self.unMatch, this);//new CheckButton("res/btn_unmatch.png","res/btn_unmatch.png");//new Button("res/btn_mode1d.png");
            this.unmatchButton.setPosition(cc.p(bgSize.width/2,posY));
            this.unmatchButton.setVisible(false);
            mu.addChild(this.unmatchButton);

            // soundButton.setScale(0.8);
            // unmatchButton.setClickEvent(function(){
            //
            //     // cc.audioEngine.stopMusic();
            // });
            // unmatchButton.setTextureByStatus(!userInfo.buttonSoundFlag);
            // this.backgroundSprite.addChild(unmatchButton,5);

            this.backgroundSprite.setScale(fXScale,fYScale);
            this.backgroundSprite.setPosition(size.width/2,size.height/2);
            this.PersonBattleView.addChild(this.backgroundSprite);
            this.addChild(this.PersonBattleView);
        }
        this.PersonBattleView.setVisible(true);
        this.textLabel.setString("匹配中...");

        if(userInfo.matchMode==1){
            this.generalButton.selected();
            this.propButton.unselected();
        }else {
            this.generalButton.unselected();
            this.propButton.selected();
        }


        // cc.spriteFrameCache.addSpriteFrames("res/animated-grossini.plist");
        // var spriteTest001 = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("grossini-head.png"));
        // var playerPlist = cc.spriteFrameCache

        /*plist文件测试*/
        //  cc.spriteFrameCache.addSpriteFrames(res.touxiang_plist);
        // // var playerTexture = cc.textureCache.addImage(res.touxiang_png);
        // var spriteTest001 = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("touxiangAI.png"));
        // spriteTest001.setPosition(gDesignResolutionWidth/4,gDesignResolutionHeight/2);
        //
        // this.backgroundSprite.addChild(spriteTest001, 3);

    },



    refreshMatchViewLayer:function()
    {
        var self =this;
        cc.log( "refreshMatchViewLayer"+userInfo.headSprite);
        switch (userInfo.matchMode)
        {

            case 0://练习场
            {

                self.setPracticeBattleView();
                break;
            }
            case 1://人人大战
            {
                self.setPersonBattleView();
                break;
                // this.mode3Button.setDisabled(true);winOfMatchForMore"
            }
            case 2://人机大战
            {
                self.setAiBattleView();

                break;
            }
            case 3://道具大战
            {
                self.setPersonBattleView();
                break;
            }
            default:
            {
                cc.log("userInfo.recordMode=="+userInfo.recordMode);//无效战斗模式
                break;
            }
        }
    },

    refreshMatchViewByData:function(content)
    {
        cc.log("refreshMatchViewByData 1=="+content);//人人人对战信息Matching|"playerList":[{"userName":"caoyongfei","score":"0.00","ranking":0,"headPicture":"http://222.66.97.203/Kgame/img/kiiikIcon.png"},{"userName":"红莲安迪","score":"0.00","ranking":0,"headPicture":"http://ohfw64y24.bkt.clouddn.com/30"}]|###
        // cc.log(content);
        var self=this;
        var posD = 50;
        var data=JSON.parse(content);
        var playerListData=data["playerList"];
        userInfo.playerListData=[];
        for(var i=0;playerListData!=null&&i<playerListData.length;i++)
        {
            var playerData=playerListData[i];
            cc.log("refreshMatchViewByData userName="+playerData["userName"]);
            userInfo.playerListData.push(playerData);
        }

        //把该用户信息排在第一位
        for(var i=userInfo.playerListData.length-1;i>0;i--)
        {
            cc.log("refreshMatchViewByData 2=="+content);
            for(var j=i;j>0;j--)
            {
                // cc.log("refreshMatchViewByData 2=="+content);
                if(userInfo.playerListData[j]["userName"]==userInfo.nickName)
                {
                    var temp = userInfo.playerListData[j];
                    userInfo.playerListData[j] =userInfo.playerListData[j-1];
                    userInfo.playerListData[j-1] =temp;
                }
            }
        }

        if(userInfo.playerListData[1]!=null)
        {
            cc.log("refreshMatchViewLayer 3 loadImg="); // self.addChild(logo);
            var opponentData = userInfo.playerListData[1];
            if(opponentData["userName"]!=null&&self.opponentNameLabel!=null)
            {
                cc.log("refreshMatchViewLayer userName=");
                self.opponentNameLabel.setString(cutstr(opponentData["userName"],11));
            }
            var url = opponentData["headPicture"];
            if(url!=null){
                cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                    if(err){
                        cc.log(err);
                        cc.log("fail loadImg="+userInfo.headSprite); // self.addChild(logo);
                    }
                    if(img)
                    {
                        var headSprite = new cc.Sprite();
                        var texture2d = new cc.Texture2D();
                        texture2d.initWithElement(img);
                        texture2d.handleLoadedTexture();
                        headSprite.initWithTexture(texture2d);

                        var size = headSprite.getContentSize();
                        headSprite.setScale(90/size.width,90/size.height);
                        headSprite.setPosition(self.opponentBg.getPosition());
                        self.backgroundSprite.addChild(headSprite,2);
                        cc.log("refreshMatchViewLayer2 success loadImg="+userInfo.headSprite); // self.addChild(logo);
                    }
                });
            }

            this.textLabel.setString("匹配成功！");
        }
    },

    showHeadChange:function()
    {
        // var frameCache = cc.spriteFrameCache;
        // cc.spriteFrameCache.addSpriteFrames(res.touxiang_plist);
        // cc.spriteFrameCache.addSpriteFrames(res.touxiang_plist);
        // var spriteTest001 = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("touxiangAI.png"));
        var timeEnd = new Date().getTime();

        var timeSpace  = timeEnd-this.timeBegin;
        cc.log("time.getMinutes()=="+timeSpace)
        var time = new Date(timeSpace);
        this.timeLabel.setVisible(true);
        this.timeLabel.setString("已等待 "+add0(time.getMinutes())+":"+add0(time.getSeconds()));


        var frameName = "touxiang_"+Math.round(Math.random()*100)%10+".png";
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
        // var sprite = new cc.Sprite(spriteFrame);
        cc.log("frameName = " + frameName);
        // CCSpriteBatchNode
        if(this.opponentSprite!=null)
        {
            this.opponentSprite.setVisible(true);
            this.opponentSprite.initWithSpriteFrame(spriteFrame);
            var size = this.opponentSprite.getContentSize();
            this.opponentSprite.setScale(95/size.width,95/size.height);
            // this.opponentSprite.setContentSize(size);
        }
        else {
            this.opponentSprite = new cc.Sprite(spriteFrame);
            this.opponentSprite.setPosition(this.opponentBg.getPosition());

            var size = this.opponentSprite.getContentSize();
            this.opponentSprite.setScale(95/size.width,95/size.height);
            this.backgroundSprite.addChild(this.opponentSprite, 1);
            // this.opponentSprite.runAction(cc.repeatForever(action));
        }
        var self =this;
        pageTimer["Change"] = setTimeout(function(){self.showHeadChange();},500);
    },

    stopHeadChange:function()
    {
        cc.log("stopHeadChange= begin");
        if(this.opponentSprite!=null&&null!=pageTimer["Change"] )
        {
            this.opponentSprite.setVisible(false);
            clearTimeout(pageTimer["Change"]);
            cc.log("stopHeadChange= end");
        }
    },
});
