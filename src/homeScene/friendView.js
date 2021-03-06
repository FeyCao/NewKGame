/**
 * Created by Administrator on 2016-10-17.
 */
//tabelviewLayerLISTFRIEND|[{"uid":43562,"friendname":"坎坎坷坷6xcvd","headPicture":"http://www.baidu.com","status":"离线"},{"uid":3434343779,"friendname":"ss123","headPicture":"http://7xpfdl.com1.z0.glb.clouddn.com/KKKK.jpg","status":"离线"},{"uid":3434343756,"friendname":"jajtd","headPicture":"http://wx.qlogo.cn/mmopen/gzM6p3xTA7TnIrLHxXI6ib9wXoFXvjgUEKrPPMIoj2viaDjj3BcxO0kXX07C2ZibOudutb1zIdT7XFffwPv2oCuakqeP02ZseTr/0","status":"离线"},{"uid":46020,"friendname":"kacoyi哈哈哈哈哈哈","headPicture":"http://www.baidu.com","status":"离线"},{"uid":75,"friendname":"指引者艾丽斯","headPicture":"http://www.baidu.com","status":"离线"}]
var FriendTableViewCell = cc.TableViewCell.extend({

    friendInfo:null,
    draw:function (ctx) {
        this._super(ctx);
        // this.friendInfo=new Friend_Status();
        cc.log("FriendTableViewCell draw end");
    },

    onEnter:function () {
        this._super();

        this.spriteBg= new cc.LayerColor(cc.color(0,0,0,0),340,120);
        this.addChild(this.spriteBg,1);

        cc.log("FriendTableViewCell onEnter end");
    },
    onExit:function () {
        this._super();
        this.removeAllChildrenWithCleanup(true);
        cc.log("FriendTableViewCell onExit end");
    },

    setFriendInfo:function (data) {
        // this.friendInfo["userName"] = data["userName"];
        // this.friendInfo["headPicture"] = data["headPicture"];
        // this.friendInfo["status"] = data["status"];
        this.friendInfo = data;
    },
    setCellView:function(idx){
        cc.log("FriendTableViewCell setCellView begin");
        var self = this;
        if(self.friendInfo==null){return;}
        self.setCellData();
        var posBase = cc.p(70,60)
        self.headSprite = new cc.Sprite(res.BG_FRIEND_HEAD_WAIT_png);
        self.headSprite.setPosition(posBase);
        var size = self.headSprite.getContentSize();
        self.headSprite.setScale(114/size.width,114/size.height);
        self.addChild(this.headSprite,2);
        self.headSpriteBg = new cc.Sprite(res.BG_FRIEND_HEAD_png);
        self.headSpriteBg.setPosition(posBase);
        self.addChild(self.headSpriteBg ,3);

        var url = self.friendInfo["headPicture"];
        cc.log("FriendTableViewCell loadCellImg beginloadImg["+idx+"]="+url);
        cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
            if(err){
                cc.log("friend fail loadImg["+idx+"]="+url);
                cc.log(err);
            }
            if(img){
                cc.log("friendInfo img!=null");
                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(img);
                texture2d.handleLoadedTexture();
                if(self.friendInfo["userName"]==userInfo.friendListData[idx]["userName"]){
                    self.headSprite.initWithTexture(texture2d);
                }

                // this.touxiangSprite.setScale(fXScale,fYScale);
                var size = self.headSprite.getContentSize();
                self.headSprite.setScale(100/size.width,100/size.height);
                console.info(self.friendInfo);
                cc.log("friend success loadImg["+idx+"]="+url); // self.addChild(logo);
            }

        });
        cc.log("FriendTableViewCell loadCellImg end");

    },
    setCellData:function () {
        var self = this;
        // if(self.friendnameLabel==null){
        //
        // }
        self.friendnameLabel = new cc.LabelTTF("", "Arial", 25.0);
        self.friendnameLabel.setPosition(cc.p(140,90));
        self.friendnameLabel.setAnchorPoint(0,0.5);
        self.addChild(this.friendnameLabel);
        // if(self.statusSprite==null){
        //
        // }
        self.statusSprite = new cc.Sprite(res.STATUS_FRIEND_OFFLINE_png);
        self.addChild(this.statusSprite,2);

        var username = self.friendInfo["userName"];
        self.friendnameLabel.setString(cutstr(username,17));

        var stausFlag = self.friendInfo["status"];//在线or离线or组队中or比赛中
        var inviteFlag = false;
        switch (stausFlag){
            case "离线":{
                self.statusSprite.initWithFile(res.STATUS_FRIEND_OFFLINE_png);
                inviteFlag = false;
                break;
            }
            case "在线":{
                self.statusSprite.initWithFile(res.STATUS_FRIEND_ONLINE_png);
                inviteFlag = true;
                break;
            }
            case "组队中":{
                self.statusSprite.initWithFile(res.STATUS_FRIEND_MG_png);
                inviteFlag = false;
                break;
            }
            case "比赛中":{
                self.statusSprite.initWithFile(res.STATUS_FRIEND_GAME_png);
                inviteFlag = false;
                break;
            }
            default:{
                cc.log("stausFlag default =="+stausFlag);
                inviteFlag = false;
                break;
            }
        }
        self.statusSprite.setVisible(true);
        self.statusSprite.setPosition(cc.p(140,30));
        self.statusSprite.setAnchorPoint(0,0.5);
        // self.statusSprite.setPosition(cc.p(140+self.statusSprite.getContentSize().width/2,30));
        //设置邀请按钮
        var inviteButton=new Button(res.BTN_FRIEND_INVITE_png);
        inviteButton.setScale(0.9);
        inviteButton.setPosition(cc.p(300,30));
        inviteButton.setVisible(inviteFlag);
        self.addChild(inviteButton,2);//INVITE|username|

        inviteButton.setClickEvent(function(){
            self.statusSprite.initWithFile(res.STATUS_FRIEND_INVITED_png);
            self.statusSprite.setPosition(cc.p(140,30));
            self.statusSprite.setAnchorPoint(0,0.5);
            // self.statusSprite.setVisible(false);
            // self.invitedInfoLabel.setVisible(true);
            gSocketConn.inviteFriend(username);
        });
        cc.log("FriendTableViewCell setCellView end");
    },

});

var FriendViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,

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
        this.infoBg=null;
        this.infoLabel=null;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;

        this.backgroundSprite = new cc.LayerColor(cc.color(0,0,0,0),1280,720);
        this.addChild(this.backgroundSprite,1);

        this.bgLeftSprite=new cc.Sprite(res.BG_FRIEND_LEFT_png);
        this.bgLeftSprite.setAnchorPoint(0,0);
        this.bgLeftSprite.setPosition(0,0);
        this.bgRightSprite=new cc.Sprite(res.BG_FRIEND_RIGHT_png);
        this.bgRightSprite.setAnchorPoint(0,0);
        this.bgRightSprite.setPosition(925,0);

        this.backgroundSprite.addChild(this.bgLeftSprite);
        this.backgroundSprite.addChild(this.bgRightSprite);

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu, 2);
        this.btnHome=new cc.MenuItemImage("res/home.png", "res/home.png", self.toMainScene, this);//new Button("res/home.png");
        var bgSize = this.backgroundSprite.getContentSize();
        this.btnHome.setPosition(cc.p(35,bgSize.height-35));
        this.btnHome.setScale(0.9);
        mu.addChild(this.btnHome);


        // var sprite = new cc.Sprite(spriteFrame);
        var posD = 400;
        this.selfBg = new cc.Sprite(res.BG_FRIEND_HEAD_VS_png);
        this.selfBg.setPosition(270,posD);
        this.backgroundSprite.addChild(this.selfBg,2);
        var fontSize = 25;

        this.opponentBg = new cc.Sprite(res.BG_FRIEND_HEAD_WAIT_png);
        this.opponentBg.setPosition(660,posD);
        this.backgroundSprite.addChild(this.opponentBg,2);

        this.selfNameLabel = cc.LabelTTF.create(userInfo.nickName, "Arial", fontSize);
        this.selfNameLabel.setPosition(270,posD-100);
        this.selfNameLabel.enableStroke(ShadowColor, 2);
        this.backgroundSprite.addChild(this.selfNameLabel,2);

        this.opponentNameLabel = cc.LabelTTF.create("-- -- -- --", "Arial", fontSize);
        this.opponentNameLabel.setPosition(660,posD-100);
        this.backgroundSprite.addChild(this.opponentNameLabel,2);

        if(userInfo.headSprite!=null)
        {
            var url = userInfo.headSprite;
            cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                if(err){
                    cc.log(err);
                    cc.log("fail loadImg="+url); // self.addChild(logo);
                }
                if(img)
                {
                    var headSprite = new cc.Sprite();
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                    headSprite.initWithTexture(texture2d);

                    var size = headSprite.getContentSize();
                    headSprite.setScale(130/size.width,130/size.height);
                    headSprite.setPosition(self.selfBg.getPosition());
                    self.backgroundSprite.addChild(headSprite,1);
                    cc.log("refreshMatchViewLayer success loadImg="+url); // self.addChild(logo);
                }
            });
        }
        if(userInfo.nickName!=null&&self.selfNameLabel!=null)
        {
            self.selfNameLabel.setString(cutstr(userInfo.nickName,11));
        }

        this.tableView = new cc.TableView(this, cc.size(350, 660));
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        //tableView.setAnchorPoint(0,1);
        //cc.log(-winSize.width/2,-40);this
        this.tableView.setPosition(925,0);
        //tableView.setPosition(0,0);
        //tableView.x = winSize.width/2;
        //tableView.y = winSize.height / 2 - 150;
        //this.tableView.setScale(fXScale,fYScale);
        this.tableView.setDelegate(this);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        self.backgroundSprite.addChild(this.tableView,3);
        this.tableView.reloadData();


        this.messageLabelInfo=new cc.LabelTTF("", "Arial", 40);//好友是否接受邀请提示信息
        this.messageLabelInfo.setColor(BlueColor);
        this.messageLabelInfo.setPosition(bgSize.width / 2,bgSize.height/2);
        this.messageLabelInfo.textAlign = cc.TEXT_ALIGNMENT_CENTER;//设置文本位置
        this.messageLabelInfo.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.messageLabelInfo.setVisible(false);
        self.backgroundSprite.addChild(this.messageLabelInfo,10);

        this.messageLabelInfoShadow=new cc.LabelTTF("", "Arial", 40);//好友是否接受邀请提示信息
        this.messageLabelInfoShadow.setColor(WhiteColor);
        this.messageLabelInfoShadow.setPosition(bgSize.width / 2+2,bgSize.height/2-2);
        this.messageLabelInfoShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;//设置文本位置
        this.messageLabelInfoShadow.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.messageLabelInfoShadow.setVisible(false);
        self.backgroundSprite.addChild(this.messageLabelInfoShadow,10);

        this.setScale(fXScale,fYScale);
        // this.refreshFriendViewLayer();
        return true;
    },

    showMessageInfo:function(msg)
    {
        var self = this;
        if(self.messageLabelInfo!=null){
            // this.messageLabelInfoShadow
            self.messageLabelInfo.setVisible(true);
            self.messageLabelInfo.setString(msg);
            self.messageLabelInfoShadow.setVisible(true);
            self.messageLabelInfoShadow.setString(msg);
            setTimeout(function(){self.messageLabelInfo.setVisible(false);self.messageLabelInfoShadow.setVisible(false);},3000);
            cc.log("showMessageInfo:function(msg)");
        }
    },
    toMainScene:function () {


        if(gMainMenuScene!=null)
        {
            if(gMainMenuScene==false)
            {
                gMainMenuScene=new MainMenuScene();
                cc.director.runScene(gMainMenuScene);
            }//window.close();
            if(userInfo.matchBeginFlag==true){
                var errorInfo = "好友回大厅";
                gSocketConn.SendEndErrorMessage(errorInfo);
            }
            gSocketConn.SendInfoMessage("UNMATCH","");
            gSocketConn.RegisterEvent("onmessage",gMainMenuScene.messageCallBack);

            //cc.director.runScene(cc.TransitionFade.create(0.5,klineSceneNext,cc.color(255,255,255,255)));
            //window.location.href="clear.html";
        }
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
        return cc.size(350, 130);
    },

    tableCellAtIndex:function (table, idx) {
        cc.log("cell tableCellAtIndex index: "+idx);

        var self = this;

        // var strValue = idx.toFixed(0);
        // var label;
        var cell = table.dequeueCell();
        if (cell==null) {
            cell = new FriendTableViewCell();
        }
        if(userInfo.friendListData!=null)
        {
            var data = userInfo.friendListData[idx];
            if(data!=null){
                cell.setFriendInfo(data);
            }
            cell.setCellView(idx);
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
        if(userInfo.friendListData!=null)
        {
            if(userInfo.friendListData.length>20)
                return 20;
            else
            return userInfo.friendListData.length;
        }
        else {
            return 0;
        }
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
    refreshFriendViewLayer:function()
    {
        if(this.tableView!=null)
        {
            this.tableView.reloadData();
        }
        if(userInfo.friendListData!=null)
        {

            if(userInfo.friendListData.length>0){
                if(this.infoLabel!=null){
                    this.infoLabel.setVisible(false);
                }
                if(this.infoBg!=null){
                    this.infoBg.setVisible(false);
                }

            }else{
                if(this.infoBg == null){
                    this.infoBg = new cc.Sprite(res.BG_FRIEND_NO_png);
                    this.infoBg.setPosition(1100,460);
                    this.backgroundSprite.addChild(this.infoBg,2);
                }
                if(this.infoLabel==null){
                    this.infoLabel =new cc.LabelTTF('抱歉，您目前还没有好友\n请到东航金融“账户”的\n“好友列表”里添加。', res.FONT_TYPE, 24,cc.size(35*10,300));
                    this.infoLabel.setPosition(1100,360);
                    // this.infoLabel.enableStroke(ShadowColor, 2);
                    this.infoLabel.setLineHeight(40);
                    this.infoLabel.setAnchorPoint(0.5,1);
                    // this.infoLabel.setColor(cc.color(18,122,272,55));
                    this.infoLabel.setColor(cc.color(18,122,186,55));
                    this.infoLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
                    this.infoLabel.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
                    // this.infoLabel.setAnchorPoint(0.5,0.5);
                    this.backgroundSprite.addChild(this.infoLabel,2);
                }
                this.infoBg.setVisible(true);
                this.infoLabel.setVisible(true);
            }
        }
        else {
            if(this.infoBg == null){
                this.infoBg = new cc.Sprite(res.BG_FRIEND_NO_png);
                this.infoBg.setPosition(1100,460);
                this.backgroundSprite.addChild(this.infoBg,2);
            }
            if(this.infoLabel==null){
                this.infoLabel =new cc.LabelTTF('抱歉，您目前还没有好友\n请到东航金融“账户”的\n“好友列表”里添加。', res.FONT_TYPE, 24,cc.size(35*10,300));
                this.infoLabel.setPosition(1100,360);
                // this.infoLabel.enableStroke(ShadowColor, 2);
                this.infoLabel.setLineHeight(40);
                this.infoLabel.setAnchorPoint(0.5,1);
                // this.infoLabel.setColor(cc.color(18,122,272,55));
                this.infoLabel.setColor(cc.color(18,122,186,55));
                this.infoLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
                this.infoLabel.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
                // this.infoLabel.setAnchorPoint(0.5,0.5);
                this.backgroundSprite.addChild(this.infoLabel,2);
            }
            this.infoBg.setVisible(true);
            this.infoLabel.setVisible(true);
        }
    }
});


