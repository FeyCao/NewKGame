/**
 * Created by Administrator on 2016-10-17.
 */
//tabelviewLayerLISTFRIEND|[{"uid":43562,"friendname":"坎坎坷坷6xcvd","headPicture":"http://www.baidu.com","status":"离线"},{"uid":3434343779,"friendname":"ss123","headPicture":"http://7xpfdl.com1.z0.glb.clouddn.com/KKKK.jpg","status":"离线"},{"uid":3434343756,"friendname":"jajtd","headPicture":"http://wx.qlogo.cn/mmopen/gzM6p3xTA7TnIrLHxXI6ib9wXoFXvjgUEKrPPMIoj2viaDjj3BcxO0kXX07C2ZibOudutb1zIdT7XFffwPv2oCuakqeP02ZseTr/0","status":"离线"},{"uid":46020,"friendname":"kacoyi哈哈哈哈哈哈","headPicture":"http://www.baidu.com","status":"离线"},{"uid":75,"friendname":"指引者艾丽斯","headPicture":"http://www.baidu.com","status":"离线"}]
var FriendTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);

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

    setCellView:function(idx){
        cc.log("FriendTableViewCell setCellView begin");
        var self = this;

        var posBase = cc.p(70,60)
        self.headSprite = new cc.Sprite(res.BG_FRIEND_HEAD_WAIT_png);
        self.headSprite.setPosition(posBase);
        var size = self.headSprite.getContentSize();
        self.headSprite.setScale(114/size.width,114/size.height);
        self.addChild(this.headSprite,2);
        self.headSpriteBg = new cc.Sprite(res.BG_FRIEND_HEAD_png);
        self.headSpriteBg.setPosition(posBase);
        self.addChild(self.headSpriteBg ,3);

        self.friendnameLabel = new cc.LabelTTF("", "Arial", 25.0);
        self.friendnameLabel.setPosition(cc.p(140,90));
        self.friendnameLabel.setAnchorPoint(0,0.5);
        self.addChild(this.friendnameLabel);

        self.statusSprite = new cc.Sprite(res.STATUS_FRIEND_OFFLINE_png);
        self.addChild(this.statusSprite,2);
        // self.statusSprite.setPosition(cc.p(140+self.statusSprite.getContentSize().width/2,30));
        var url = userInfo.friendListData[idx]["headPicture"];
        cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
            if(err){
                cc.log(err);
            }
            if(img){
                cc.log("img!=null"+img);

                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(img);
                texture2d.handleLoadedTexture();
                self.headSprite.initWithTexture(texture2d);

                // this.touxiangSprite.setScale(fXScale,fYScale);

                var size = self.headSprite.getContentSize();
                self.headSprite.setScale(100/size.width,100/size.height);
            }
            cc.log("loadImg="+userInfo.headSprite); // self.addChild(logo);
        });

        var username = userInfo.friendListData[idx]["friendname"];
        self.friendnameLabel.setString(cutstr(username,17));

        var stausFlag = userInfo.friendListData[idx]["status"];//在线or离线or组队中or比赛中
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
        self.statusSprite.setPosition(cc.p(140,30));
        self.statusSprite.setAnchorPoint(0,0.5);
        // self.statusSprite.setPosition(cc.p(140+self.statusSprite.getContentSize().width/2,30));
        //设置邀请按钮
        var inviteButton=new Button(res.BTN_FRIEND_INVITE_png);
        inviteButton.setPosition(cc.p(290,30));
        inviteButton.setVisible(inviteFlag);
        self.addChild(inviteButton,2);//INVITE|username|

        inviteButton.setClickEvent(function(){
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
                    headSprite.setScale(130/size.width,130/size.height);
                    headSprite.setPosition(self.selfBg.getPosition());
                    self.backgroundSprite.addChild(headSprite,1);
                    cc.log("refreshMatchViewLayer success loadImg="+userInfo.headSprite); // self.addChild(logo);
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
            //window.close();
            if(userInfo.matchBeginFlag==true){
                var errorInfo = "好友回大厅";
                gSocketConn.SendEndErrorMessage(errorInfo);
            }
            gSocketConn.SendInfoMessage("UNMATCH","");
            gSocketConn.SendEHMessage(userInfo.userId,userInfo.deviceId);
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

        var strValue = idx.toFixed(0);
        var label;
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new FriendTableViewCell();
            label = new cc.LabelTTF(strValue, "Arial", 30.0);
            label.setPosition(cc.p(0,20));
            label.setAnchorPoint(0,0);
            label.tag = 123;
            cell.addChild(label);
            if(userInfo.friendListData!=null)
            {
                cell.setCellView(idx);
            }

        } else {
            if(userInfo.friendListData!=null)
            {
                cell.setCellView(idx);
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
        if(userInfo.friendListData!=null)
        {
            if(userInfo.friendListData.length>20)
                return 20;
            else
            return userInfo.friendListData.length;
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
    refreshFriendViewLayer:function()
    {
        if(this.tableView!=null)
        {
            this.tableView.reloadData();
        }
    }
});


