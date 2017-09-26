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

    setFriendInfo:function (data,type) {
        // this.friendInfo["userName"] = data["userName"];
        // this.friendInfo["headPicture"] = data["headPicture"];
        // this.friendInfo["status"] = data["status"];
        this.friendInfo = data;
        this.friendType = type;//
    },
    setCellView:function(idx){
        cc.log("FriendTableViewCell setCellView begin");
        var self = this;
        if(null==self.friendInfo){return;}
        if(null!=userInfo.friendListData&&self.friendType==AddFriendType.Type_SendFriend_Request)
        {
            self.setFriendCellData();
        }
        else  if(null!=userInfo.friendAddData&&self.friendType==AddFriendType.Type_FindFriendRequest){
            self.setNewFriendCellData();
        }else if(null!=userInfo.friendAddData&&self.friendType==AddFriendType.Type_SelectAdd_NewFriend){
            self.setSearchFriendCellData();
        }

        var posBase = cc.p(70,60)
        self.headSprite = new cc.Sprite(res.HEAD_NO_PNG);
        self.headSprite.setPosition(posBase);
        var size = self.headSprite.getContentSize();
        self.headSprite.setScale(100/size.width,100/size.height);
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

                if(null!=userInfo.friendListData&&self.friendType==AddFriendType.Type_SendFriend_Request)
                {
                    if(null!=self.friendInfo["userName"]&&self.friendInfo["userName"]==userInfo.friendListData[idx]["userName"]){
                        self.headSprite.initWithTexture(texture2d);
                    }
                }
                else  if(null!=userInfo.friendAddData&&self.friendType==AddFriendType.Type_FindFriendRequest){
                    if(null!=self.friendInfo["nickName"]&&self.friendInfo["nickName"]==userInfo.friendNewListData[idx]["nickName"]){
                        self.headSprite.initWithTexture(texture2d);
                    }
                }else if(null!=userInfo.friendAddData&&self.friendType==AddFriendType.Type_SelectAdd_NewFriend){
                    if(null!=self.friendInfo["userName"]&&self.friendInfo["userName"]==userInfo.friendSearchListData[idx]["userName"]){
                        self.headSprite.initWithTexture(texture2d);
                    }
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
    setFriendCellData:function () {
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
        var uid = self.friendInfo["uid"];
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
            gSocketConn.inviteFriend(username,false,uid);
        });
        cc.log("FriendTableViewCell setCellView end");
    },
    setNewFriendCellData:function () {
        var self = this;
        // if(self.friendnameLabel==null){
        //
        // }
        self.friendnameLabel = new cc.LabelTTF("", "Arial", 25.0);
        self.friendnameLabel.setPosition(cc.p(140,90));
        self.friendnameLabel.setAnchorPoint(0,0.5);
        self.addChild(this.friendnameLabel);

        var username = self.friendInfo["nickName"];
        self.friendnameLabel.setString(cutstr(username,17));


        var posY = 40;
        var stausFlag = self.friendInfo["type"];//1.接受，2.已添加，3.等待对方确认
        var addFlag = false;
        switch (stausFlag){
            case 1:{
                //设置同意按钮
                addFlag = true;
                self.agreeButton=new Button(res.BTN_FRIEND_ACCEPT);
                self.agreeButton.setScale(0.9);
                self.agreeButton.setPosition(cc.p(300,posY));
                self.addChild(self.agreeButton);//INVITE|username|
                self.agreeButton.setClickEvent(function(){

                    var addFriendType = AddFriendType.Type_ReceiveFriendRequest//AddFriendType.Type_SelectAdd_NewFriend;AddFriendType.Type_SendFriend_Request;AddFriendType.Type_FindFriendRequest;
                    var content = new ReceiveFriendRequest();
                    content.setToken(self.friendInfo["token"]);
                    content.setFollowerId(self.friendInfo["followerId"]);//申请人的uid
                    content.setComment(self.friendInfo["comment"]);//申请好友的备注

                    // self.statusSprite.setVisible(false);
                    // self.invitedInfoLabel.setVisible(true);
                    gSocketConn.addFriend(addFriendType,content);
                });
                break;
            }
            case 2:{
                addFlag = false;
                self.decLabel = new cc.LabelTTF("已添加", res.FONT_TYPE, 23.0);
                self.decLabel.setPosition(cc.p(300,posY));
                self.decLabel.setColor(cc.color("#053f73"));
                // self.friendnameLabel.setAnchorPoint(0,0.5);
                self.addChild(self.decLabel);
                break;
            }
            case 3:{
                addFlag = false;
                self.decLabel = new cc.LabelTTF("等待验证", res.FONT_TYPE, 23.0);
                self.decLabel.setPosition(cc.p(300,posY));
                self.decLabel.setColor(cc.color("#00dae2"));
                // self.friendnameLabel.setAnchorPoint(0,0.5);
                self.addChild(self.decLabel);
                break;
            }
            default:{
                cc.log("stausFlag default =="+stausFlag);
                addFlag = false;
                break;
            }
        }
        var comment = self.friendInfo["comment"];
        // new createClipRoundNode("xxx对xxx使用了道具xxx对",22,YellowColor,350,30);
        if(GetLength(comment)>10&&addFlag == true){
            self.commentLabel =  new createClipRoundNode(comment,19,cc.color("#0090e2"),100,30);
            self.commentLabel.setPosition(cc.p(140,20));
        }else{
            self.commentLabel =  new cc.LabelTTF(cutstr(username,10), res.FONT_TYPE, 19.0,cc.size(100,25));
            self.commentLabel.setPosition(cc.p(140,posY));
        }
        //new cc.LabelTTF(cutstr(comment,9), res.FONT_TYPE, 19.0);
        self.commentLabel.setColor(cc.color("#0090e2"));
        self.commentLabel.setAnchorPoint(0,0.5);
        self.addChild(self.commentLabel);
        cc.log("FriendTableViewCell setNewFriendCellData end");
    },
    setSearchFriendCellData:function () {
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
        //设置添加按钮
        var addButton=new Button(res.BTN_FRIEND_ADD);
        addButton.setScale(0.9);
        addButton.setPosition(cc.p(300,30));
        // addButton.setVisible(inviteFlag);
        self.addChild(addButton,2);//INVITE|username|

        var comment = "我是"+userInfo.nickName;
        addButton.setClickEvent(function(){

            // var addFriendType = AddFriendType.Type_SendFriend_Request//AddFriendType.Type_SelectAdd_NewFriend;AddFriendType.Type_SendFriend_Request;AddFriendType.Type_FindFriendRequest;
            var content = new SendFriend_Request();//SendFriend_Request
            content.setToken(self.friendInfo["token"]);
            content.setFollowerId(self.friendInfo["uid"]);//申请人的uid
            content.setComment(comment);//申请好友的备注

            if(null!=gMainMenuScene){
                gMainMenuScene.showAddFriendView();
                if(null!=gMainMenuScene.addFriendViewLayer){
                    gMainMenuScene.addFriendViewLayer.setFriendData(content);
                }
            }


            // self.statusSprite.setVisible(false);
            // self.invitedInfoLabel.setVisible(true);
            // gSocketConn.addFriend(addFriendType,content);
        });
        cc.log("FriendTableViewCell setCellView end");
    },

});

var FriendViewLayer = cc.Layer.extend({
    closeCallBackFunction:null,

    bgNumber:1,		//底图层号
    infoNumber:2,//信息层号
    muNumber:10,//按钮层号

    friendListNode:null,//好友界面
    friendAddNode:null,//添加好友界面新的好友界面
    // friendSearchNode:null,//好友搜索界面


    onEnter: function () {
        this._super();
        // this.setColor();
        this.setName("FriendViewLayer");
        this.setOpacity(160);
        userInfo.inviteType =null;
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
        userInfo.inviteType =null;
        cc.eventManager.removeListener(this._listener);
        this._super();

    },
    ctor:function () {
        this._super();
        this.init();

    },

    init:function () {
        var self=this;
        this.infoBg=null;
        this.infoLabel=null;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;

        // var titleSize = 30;
        var fontSize = 25;

        this.friendAddNode = new cc.Node();
        this.friendListNode = new cc.Node();
        this.friendSearchNode = new cc.Node();

        this.backgroundSprite = new cc.LayerColor(cc.color(0,0,0,0),1280,720);
        this.addChild(this.backgroundSprite,this.bgNumber);

        this.bgLeftSprite=new cc.Sprite(res.BG_FRIEND_LEFT_png);
        this.bgLeftSprite.setAnchorPoint(0,0);
        this.bgLeftSprite.setPosition(0,0);
        this.bgRightSprite=new cc.Sprite(res.BG_FRIEND_RIGHT_png);
        this.bgRightSprite.setAnchorPoint(0,0);
        this.bgRightSprite.setPosition(925,0);
        this.bgRTopSprite=new cc.Sprite(res.BG_FRIEND_RTOP_png);
        this.bgRTopSprite.setAnchorPoint(1,1);
        this.bgRTopSprite.setPosition(1280,720);
        var topPosY = this.bgRTopSprite.height/2;

        this.backgroundSprite.addChild(this.bgLeftSprite);
        this.backgroundSprite.addChild(this.bgRightSprite);
        this.backgroundSprite.addChild(this.bgRTopSprite);

        this.backgroundSprite.addChild(this.friendListNode);
        this.backgroundSprite.addChild(this.friendAddNode);
        this.backgroundSprite.addChild(this.friendSearchNode);



        var bgSize = this.backgroundSprite.getContentSize();
        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu, this.muNumber);
        this.btnHome=new cc.MenuItemImage("res/home.png", "res/home.png", self.toMainScene, this);//new Button("res/home.png");
        this.btnHome.setPosition(cc.p(35,bgSize.height-topPosY));
        this.btnHome.setScale(0.9);
        mu.addChild(this.btnHome);

        this.btnBegin=new cc.MenuItemImage(res.BTN_FRIENT_BEGINON, res.BTN_FRIENT_BEGINON,res.BTN_FRIENT_BEGINOFF, self.beginMatch, self);//new Button("res/home.png");
        this.btnBegin.setAnchorPoint(0.5,0);
        this.btnBegin.setPosition(cc.p(460,68));
        this.btnBegin.setEnabled(false);
        // this.btnBegin.setScale(0.9);
        mu.addChild(this.btnBegin);

        this.btnInviteQQ=new cc.MenuItemImage(res.BTN_FRIENT_QQ, res.BTN_FRIENT_QQ, self.inviteQQMatch, this);//new Button("res/home.png");
        this.btnInviteQQ.setPosition(cc.p(1190,topPosY));
        // this.btnInviteQQ.setScale(0.9);
        mu.addChild(this.btnInviteQQ);

        this.btnInviteWechat=new cc.MenuItemImage(res.BTN_FRIENT_WECHAT, res.BTN_FRIENT_WECHAT, self.inviteWechatMatch, this);//new Button("res/home.png");
        this.btnInviteWechat.setPosition(cc.p(1010,topPosY));
        // this.btnInviteWechat.setScale(0.9);
        mu.addChild(this.btnInviteWechat);

        this.leftDownBg = new cc.Sprite(res.BG_FRIEND_INVITE);
        this.leftDownBg.setAnchorPoint(0,0.5);
        this.leftDownBg.setPosition(cc.p(925,topPosY));
        this.backgroundSprite.addChild(this.leftDownBg,2);

        if(userInfo.source!="DHJK"){

            this.btnBegin.setVisible(false);
            this.leftDownBg.setVisible(false);
            this.btnInviteQQ.setVisible(false);
            this.btnInviteWechat.setVisible(false);
        }
        // this.btnBegin.setVisible(false);
        // this.leftDownBg.setVisible(false);
        // this.btnInviteQQ.setVisible(false);
        // this.btnInviteWechat.setVisible(false);
        var posD = 400;
        this.selfBg = new cc.Sprite(res.BG_FRIEND_HEAD_VS_png);
        this.selfBg.setPosition(270,posD);
        this.backgroundSprite.addChild(this.selfBg,2);

        this.opponentBg = new cc.Sprite(res.BG_FRIEND_HEAD_VS_png);
        this.opponentBg.setPosition(660,posD);
        this.backgroundSprite.addChild(this.opponentBg,2);
        this.opponentHead = new cc.Sprite(res.BG_FRIEND_HEAD_WAIT_png);
        this.opponentHead.setPosition(660,posD);
        this.backgroundSprite.addChild(this.opponentHead,1);

        this.selfNameLabel = cc.LabelTTF.create(userInfo.nickName, "Arial", fontSize);
        this.selfNameLabel.setPosition(270,posD-100);
        this.selfNameLabel.enableStroke(ShadowColor, 2);
        this.backgroundSprite.addChild(this.selfNameLabel,2);

        this.opponentNameLabel = cc.LabelTTF.create("-- -- -- --", "Arial", fontSize);
        this.opponentNameLabel.setPosition(660,posD-100);
        this.opponentNameLabel.enableStroke(ShadowColor, 2);
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
        this.messageLabelInfo=new cc.LabelTTF("", res.FONT_TYPE, 40);//好友是否接受邀请提示信息
        this.messageLabelInfo.setColor(BlueColor);
        this.messageLabelInfo.setPosition(bgSize.width / 2,bgSize.height/2);
        this.messageLabelInfo.textAlign = cc.TEXT_ALIGNMENT_CENTER;//设置文本位置
        this.messageLabelInfo.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.messageLabelInfo.setVisible(false);
        self.backgroundSprite.addChild(this.messageLabelInfo,10);

        this.messageLabelInfoShadow=new cc.LabelTTF("", res.FONT_TYPE, 40);//好友是否接受邀请提示信息
        this.messageLabelInfoShadow.setColor(WhiteColor);
        this.messageLabelInfoShadow.setPosition(bgSize.width / 2+2,bgSize.height/2-2);
        this.messageLabelInfoShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;//设置文本位置
        this.messageLabelInfoShadow.verticalAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.messageLabelInfoShadow.setVisible(false);
        self.backgroundSprite.addChild(this.messageLabelInfoShadow,10);
        this.setFriendListNode();
        this.setFriendAddNode();
        this.setFriendSearchNode();

       this.disableAllFriend();
       this.friendListNode.setVisible(true);
        this.setScale(fXScale,fYScale);
        // this.refreshFriendViewLayer();
        return true;
    },
    setFriendListNode:function () {
        var self = this;
        var titleSize = 30;
        // var fontSize = 25;
        var topPosY = this.bgRTopSprite.height/2;
        var bgSize = this.backgroundSprite.getContentSize();
        var infoTitle = new cc.LabelTTF("游戏好友", res.FONT_TYPE, titleSize,cc.size(140,45));
        infoTitle.setPosition(bgSize.width-150,bgSize.height-topPosY);
        this.friendListNode.addChild(infoTitle,5);
        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.friendListNode.addChild(mu, this.muNumber);
        this.btnAddFriend=new cc.MenuItemImage(res.BG_FRIEND_ADD, res.BG_FRIEND_ADD, self.sendFriendAdd, this);//new Button("res/home.png");
        this.btnAddFriend.setPosition(bgSize.width-320,bgSize.height-topPosY);
        // this.btnAddFriend.setScale(0.9);
        mu.addChild(this.btnAddFriend);
        this.btnAdd=new cc.MenuItemImage(res.BTN_FRIEND_ADD, res.BTN_FRIEND_ADD, self.sendFriendAdd, this);//new Button("res/home.png");
        this.btnAdd.setPosition(bgSize.width-180,bgSize.height/2-topPosY);//(1100,360)
        this.btnAdd.setVisible(false);
        mu.addChild(this.btnAdd);

        //好友列表
        this.tableViewFriend = new cc.TableView(this, cc.size(350, 660));
        this.tableViewFriend.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        //tableView.setAnchorPoint(0,1);
        //cc.log(-winSize.width/2,-40);this
        this.tableViewFriend.setPosition(925,0);
        //tableView.setPosition(0,0);
        //tableView.x = winSize.width/2;
        //tableView.y = winSize.height / 2 - 150;
        //this.tableView.setScale(fXScale,fYScale);
        this.tableViewFriend.setDelegate(this);
        this.tableViewFriend.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.friendListNode.addChild(this.tableViewFriend,3);
        cc.log("setFriendList:function()");
        this.tableViewFriend.reloadData();
    },
    setFriendAddNode:function () {
        var self = this;
        var titleSize = 30;
        var fontSize = 25;
        var bgSize = this.backgroundSprite.getContentSize();
        var topPosY = this.bgRTopSprite.height/2;
        var infoTitle = new cc.LabelTTF("添加好友", res.FONT_TYPE, titleSize,cc.size(140,45));
        infoTitle.setPosition(bgSize.width-150,bgSize.height-topPosY);
        this.friendAddNode.addChild(infoTitle,5);

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.friendAddNode.addChild(mu, this.muNumber);
        this.btnListFriend=new cc.MenuItemImage(res.BG_FRIEND_LIST, res.BG_FRIEND_LIST, self.sendFriendList, this);//new Button("res/home.png");
        this.btnListFriend.setPosition(bgSize.width-320,bgSize.height-topPosY);
        // this.btnListFriend.setVisible(false);
        mu.addChild(this.btnListFriend);
        var searchBg = new cc.Sprite(res.BG_FRIEND_SEARCH_L);
        searchBg.setPosition(bgSize.width-180,bgSize.height-topPosY*3);
        // searchBg.setVisible(false);
        this.friendAddNode.addChild(searchBg,self.infoNumber);

        this.btnSearchFriend=new cc.MenuItemImage(res.BTN_FRIEND_SEARCH, res.BTN_FRIEND_SEARCH, self.sendFriendSearch, this);//new Button("res/home.png");
        this.btnSearchFriend.setPosition(bgSize.width-320,bgSize.height-topPosY*3);
        mu.addChild(this.btnSearchFriend);

        //新的好友列表
        this.tableViewNewFriend = new cc.TableView(this, cc.size(350, 580));
        this.tableViewNewFriend.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableViewNewFriend.setPosition(925,0);
        this.tableViewNewFriend.setDelegate(this);
        this.tableViewNewFriend.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.friendAddNode.addChild(this.tableViewNewFriend,3);
        cc.log("setNewFriend:function()");
        this.tableViewNewFriend.reloadData();


        // self.searchLabel = new cc.LabelTTF("手机号/昵称",res.FONT_TYPE,fontSize,cc.size(300,50));
        // self.searchLabel.setColor(fontBlueColor);
        // self.searchLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;//居左显示
        // self.searchLabel.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
        // this.searchBtn = new cc.MenuItemLabel(self.searchLabel, self.refreshSearchFriendView, self);//new cc.MenuItemFont("普通模式", self.generalMatch, this);
        // this.searchBtn.setPosition(bgSize.width-160,bgSize.height-topPosY*3);
        // mu.addChild(this.searchBtn);

        var normal9SpriteBg=new cc.Scale9Sprite(res.LESS_BG_png);
        var _showName = new cc.EditBox(cc.size(270, 45),normal9SpriteBg);
        _showName.setName("showName");
        _showName.x = bgSize.width-160;
        _showName.y = bgSize.height-topPosY*3;
        _showName.setFontSize(fontSize);
        _showName.setDelegate(this);
        _showName.setMaxLength(20);
        _showName.setPlaceholderFontSize(fontSize);
        _showName.setPlaceHolder("手机号/昵称");
        _showName.setPlaceholderFontColor(fontBlueColor);
        _showName.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        // this._userName.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);//修改为使用密文
        _showName.setFontColor(cc.color.WHITE);
        this.friendAddNode.addChild(_showName,this.infoNumber);

    },
    setFriendSearchNode:function () {
        var self = this;
        var titleSize = 30;
        var fontSize = 25;
        var topPosY = this.bgRTopSprite.height/2;
        var bgSize = this.backgroundSprite.getContentSize();
        var posX = 30;
        var infoTitle = new cc.LabelTTF("搜索好友", res.FONT_TYPE, titleSize,cc.size(140,45));
        infoTitle.setPosition(bgSize.width-150,bgSize.height-topPosY);
        this.friendSearchNode.addChild(infoTitle,5);
        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.friendSearchNode.addChild(mu, this.muNumber);
        this.btnBack=new cc.MenuItemImage(res.BG_FRIEND_BACK, res.BG_FRIEND_BACK, self.sendFriendAdd, this);//new Button("res/home.png");
        this.btnBack.setPosition(bgSize.width-320,bgSize.height-topPosY);
        // this.btnBack.setVisible(false);
        mu.addChild(this.btnBack);
        var searchBg = new cc.Sprite(res.BG_FRIEND_SEARCH_S);
        searchBg.setPosition(bgSize.width-180-posX,bgSize.height-topPosY*3);
        // searchBg.setVisible(false);
        this.friendSearchNode.addChild(searchBg,self.infoNumber);
        this.btnSearchFriend=new cc.MenuItemImage(res.BTN_FRIEND_SEARCH, res.BTN_FRIEND_SEARCH, self.sendFriendSearch, this);//new Button("res/home.png");
        this.btnSearchFriend.setPosition(bgSize.width-320,bgSize.height-topPosY*3);
        mu.addChild(this.btnSearchFriend);
        self.searchLabel = new cc.LabelTTF("搜索",res.FONT_TYPE,28,cc.size(100,70));
        self.searchLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
        self.searchLabel.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
        this.searchBtn = new cc.MenuItemLabel(self.searchLabel, self.sendFriendSearch, self);//new cc.MenuItemFont("普通模式", self.generalMatch, this);
        this.searchBtn.setPosition(bgSize.width-50,bgSize.height-topPosY*3);
        mu.addChild(this.searchBtn);


        //搜索到的好友列表
        this.tableViewSearchFriend = new cc.TableView(this, cc.size(350, 580));
        this.tableViewSearchFriend.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableViewSearchFriend.setPosition(925,0);
        this.tableViewSearchFriend.setDelegate(this);
        this.tableViewSearchFriend.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.friendSearchNode.addChild(this.tableViewSearchFriend,3);
        cc.log("setFriendSearchNode:function()");
        this.tableViewSearchFriend.reloadData();
        // (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg)
        // var normal9SpriteBg=new cc.Scale9Sprite(res.BLUE_BG_png);
        var normal9SpriteBg=new cc.Scale9Sprite(res.LESS_BG_png);
        // var press9SpriteBg=new cc.Scale9Sprite(res.BLACK_BG);
        // var disabled9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG1_png);
        // var fontSize = 30;
        // this._userName = new cc.EditBox(cc.size(300, 45),normal9SpriteBg,press9SpriteBg,disabled9SpriteBg );
        this._userName = new cc.EditBox(cc.size(200, 45),normal9SpriteBg);
        this._userName.setName("userName");
        this._userName.x = bgSize.width-160-posX;
        this._userName.y = bgSize.height-topPosY*3;
        this._userName.setFontSize(fontSize);
        this._userName.setDelegate(this);
        this._userName.setMaxLength(20);
        this._userName.setPlaceholderFontSize(fontSize);
        this._userName.setPlaceHolder("手机号/昵称");
        this._userName.setPlaceholderFontColor(fontBlueColor);
        this._userName.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        // this._userName.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);//修改为使用密文
        this._userName.setFontColor(cc.color.WHITE);
        this.friendSearchNode.addChild(this._userName,this.infoNumber);

    },
    editBoxEditingDidBegin: function (editBox) {
        cc.log("editBox " + editBox.getName() + " DidBegin !");
        if(null!=userInfo.friendSearchListData){
            userInfo.friendSearchListData=null;
        }
        this.refreshSearchFriendView();
    },

    editBoxEditingDidEnd: function (editBox) {
        cc.log("editBox " + editBox.getName() + " DidEnd !");
        // this.sendFriendSearch();
    },

    editBoxTextChanged: function (editBox, text) {
        // if("showName"==editBox.getName()){
        //     this.refreshSearchFriendView();
        // }
        cc.log("editBox " + editBox.getName() + ", TextChanged, text: " + text);
    },

    editBoxReturn: function (editBox) {
        cc.log("editBox " + editBox.getName() + " was returned !editBox.getString()=="+ editBox.getString());
        // if("showName"==editBox.getName()){
        //     this.refreshSearchFriendView();
        // }
        if("userName"==editBox.getName()&&null!=editBox.getString()&&''!=editBox.getString()){
            this.sendFriendSearch();
            cc.log("sendFriendSearch");
        }
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

    beginMatch:function () {
        cc.log("beginMatch:function");
        gSocketConn.SendBeginFriendMessage();

    },
    inviteQQMatch:function () {
        userInfo.inviteType = "QQ";//QQ/Wechat
        gSocketConn.inviteFriend(null,true,null);
        cc.log("inviteQQMatch:function");
    },
    inviteWechatMatch:function () {
        userInfo.inviteType = "Wechat";//QQ/Wechat
        gSocketConn.inviteFriend(null,true,null);
        cc.log("inviteWechatMatch:function");
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
        var data =null;
        if(userInfo.friendListData!=null&&this.friendListNode.isVisible()==true)
        {
            data = userInfo.friendListData[idx];
            if(data!=null){
                cell.setFriendInfo(data,AddFriendType.Type_SendFriend_Request);
            }
            cell.setCellView(idx);
        }
        else  if(null!=userInfo.friendAddData&&this.friendAddNode.isVisible()==true){
            // return userInfo.friendNewListData.length;
            data = userInfo.friendNewListData[idx];
            if(data!=null){
                cell.setFriendInfo(data,AddFriendType.Type_FindFriendRequest);
            }
            cell.setCellView(idx);
        }else if(null!=userInfo.friendAddData&&this.friendSearchNode.isVisible()==true){
            // return userInfo.friendSearchListData.length;
            data = userInfo.friendSearchListData[idx];
            if(data!=null){
                cell.setFriendInfo(data,AddFriendType.Type_SelectAdd_NewFriend);
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

        if(userInfo.friendListData!=null&&this.friendListNode.isVisible()==true)
        {
            cc.log("numberOfCellsInTableView:function (table)1");
            return userInfo.friendListData.length;
        }
        else  if(null!=userInfo.friendNewListData&&this.friendAddNode.isVisible()==true)
        {
            cc.log("numberOfCellsInTableView:function (table)2");
            return userInfo.friendNewListData.length;
        }else if(null!=userInfo.friendSearchListData&&this.friendSearchNode.isVisible()==true){
            cc.log("numberOfCellsInTableView:function (table)3");
            return userInfo.friendSearchListData.length;
        } else {
            cc.log("numberOfCellsInTableView:function (table)4");
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

    sendFriendList:function () {
        // userInfo.matchMode = MatchType.Type_Friend_Match;
        userInfo.friendListData = null;
        this.refreshFriendViewLayer();
        if(null!=gSocketConn){
            gSocketConn.getFriendList(userInfo.matchMode);
        }
    },
    sendFriendAdd:function () {
        // userInfo.friendNewListData = null;
        this.refreshAddFriendView();
        var addFriendType = AddFriendType.Type_FindFriendRequest;//AddFriendType.Type_SelectAdd_NewFriend;ddFriendType.Type_SendFriend_Request;AddFriendType.Type_FindFriendRequest;
        var content = new FindFriend_Request();
        content.setToken(userInfo.token);
        // userInfo.matchMode = MatchType.Type_Friend_Match;
        if(null!=gSocketConn){
            gSocketConn.addFriend(addFriendType,content);
        }
    },
    sendFriendSearch:function () {
        cc.log("sendFriendSearch:function");
        var self = this;
        // userInfo.friendSearchListData = null;
        this.refreshSearchFriendView();
        var addFriendType = AddFriendType.Type_SelectAdd_NewFriend//AddFriendType.Type_SelectAdd_NewFriend;ddFriendType.Type_SendFriend_Request;AddFriendType.Type_FindFriendRequest;
        var content = new SelectAdd_NewFriend();
        content.setToken(userInfo.token);
        if(null!=self._userName){
            cc.log("查询的好友名字：",self._userName.getString());
            content.setUserName(self._userName.getString());
        }
        if(null!=gSocketConn){
            gSocketConn.addFriend(addFriendType,content);
        }
    },
    sendAddFriend:function () {
        cc.log("sendAddFriend");
        var addFriendType = AddFriendType.Type_SendFriend_Request//AddFriendType.Type_SelectAdd_NewFriend;AddFriendType.Type_SendFriend_Request;AddFriendType.Type_FindFriendRequest;
        var content = new SendFriend_Request();
        content.setToken(userInfo.token);
        content.setFollowerId("");//申请人的uid
        content.setComment("");//申请好友的备注
        // userInfo.matchMode = MatchType.Type_Friend_Match;
        if(null!=gSocketConn){
            gSocketConn.addFriend(addFriendType,content);
        }
    },

    disableAllFriend:function () {
        this.friendListNode.setVisible(false);
        this.tableViewFriend.setVisible(false);

        this.friendAddNode.setVisible(false);
        this.tableViewNewFriend.setVisible(false);

        this.friendSearchNode.setVisible(false);
        this.tableViewSearchFriend.setVisible(false);
    },
    refreshAddFriendView:function(){
        var self =this;
        this.disableAllFriend();
        this.friendAddNode.setVisible(true);
        this.tableViewNewFriend.setVisible(true);
        if(self.tableViewNewFriend!=null)
        {
            cc.log("refreshAddFriendViewLayer:function()");
            this.tableViewNewFriend.reloadData();
        }

    },
    refreshSearchFriendView:function(){

        var self =this;
        this.disableAllFriend();
        this.friendSearchNode.setVisible(true);
        this.tableViewSearchFriend.setVisible(true);
        if(self.tableViewSearchFriend!=null)
        {
            cc.log("refreshSearchFriendView:function()");
            this.tableViewSearchFriend.reloadData();
        }


    },
    refreshFriendViewLayer:function() {
        this.disableAllFriend();
        this.friendListNode.setVisible(true);
        this.tableViewFriend.setVisible(true);
        if(this.tableViewFriend!=null)
        {
            cc.log("refreshFriendViewLayer:function()");
            this.tableViewFriend.reloadData();
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
                if(null!=this.btnAdd){
                    this.btnAdd.setVisible(false);
                }

            }else{
                if(this.infoBg == null){
                    this.infoBg = new cc.Sprite(res.BG_FRIEND_NO_png);
                    this.infoBg.setPosition(1100,460);
                    this.friendListNode.addChild(this.infoBg,2);
                }
                if(this.infoLabel==null){
                    // this.infoLabel =new cc.LabelTTF('抱歉，您目前还没有好友\n请到东航金融“账户”的\n“好友列表”里添加。', res.FONT_TYPE, 24,cc.size(35*10,300));
                    this.infoLabel =new cc.LabelTTF('抱歉，您目前还没有好友\n', res.FONT_TYPE, 24,cc.size(35*10,100));
                    // this.infoLabel.setPosition(1100,360);
                    this.infoLabel.setPosition(1100,400);
                    // this.infoLabel.enableStroke(ShadowColor, 2);
                    this.infoLabel.setLineHeight(40);
                    this.infoLabel.setAnchorPoint(0.5,1);
                    // this.infoLabel.setColor(cc.color(18,122,272,55));
                    this.infoLabel.setColor(cc.color(18,122,186,55));
                    this.infoLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
                    this.infoLabel.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
                    // this.infoLabel.setAnchorPoint(0.5,0.5);
                    this.friendListNode.addChild(this.infoLabel,2);
                }
                if(null!=this.btnAdd){
                    this.btnAdd.setVisible(true);
                }
                this.infoBg.setVisible(true);
                this.infoLabel.setVisible(true);
            }
        }
        else {
            if(this.infoBg == null){
                this.infoBg = new cc.Sprite(res.BG_FRIEND_NO_png);
                this.infoBg.setPosition(1100,460);
                this.friendListNode.addChild(this.infoBg,2);
            }
            if(this.infoLabel==null){
                this.infoLabel =new cc.LabelTTF('抱歉，您目前还没有好友\n', res.FONT_TYPE, 24,cc.size(35*10,100));
                // this.infoLabel.setPosition(1100,360);
                this.infoLabel.setPosition(1100,400);
                // this.infoLabel.enableStroke(ShadowColor, 2);
                this.infoLabel.setLineHeight(40);
                this.infoLabel.setAnchorPoint(0.5,1);
                // this.infoLabel.setColor(cc.color(18,122,272,55));
                this.infoLabel.setColor(cc.color(18,122,186,55));
                this.infoLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;//居中显示
                this.infoLabel.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
                // this.infoLabel.setAnchorPoint(0.5,0.5);
                this.friendListNode.addChild(this.infoLabel,2);
            }
            if(null!=this.btnAdd){
                this.btnAdd.setVisible(true);
            }
            this.infoBg.setVisible(true);
            this.infoLabel.setVisible(true);
        }
    },
    refreshInviteFriend:function(players) {
        var self =this;
        var owenerFlag = false;
        var opponentPlayer = null;
        for(var j=0;null!=players&&j<players.length&&null!=players[j];j++){
            if(userInfo.nickName==players[j].userName){
                owenerFlag = players[j].owener;
            }else{
                opponentPlayer = players[j];
            }
        }

        if(null==opponentPlayer){

            self.opponentNameLabel.setString("-- -- -- --");
            self.opponentHead.initWithFile(res.BG_FRIEND_HEAD_WAIT_png);
        }
        if(null!=opponentPlayer&&null!=opponentPlayer.headPicture)
        {
            var url = opponentPlayer.headPicture;
            cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                if(err){
                    cc.log(err);
                    cc.log("fail loadImg="+url); // self.addChild(logo);
                }
                if(img)
                {
                    var texture2d = new cc.Texture2D();
                    texture2d.initWithElement(img);
                    texture2d.handleLoadedTexture();
                   self.opponentHead.initWithTexture(texture2d);

                    var size = self.opponentHead.getContentSize();
                    self.opponentHead.setScale(130/size.width,130/size.height);
                    self.opponentHead.setPosition(self.opponentBg.getPosition());
                    cc.log("refreshInviteFriend success loadImg="+url); // self.addChild(logo);
                }
            });
        }
        if(null!=opponentPlayer&&null!=opponentPlayer.userName&&null!=self.opponentNameLabel){
            self.opponentNameLabel.setString(opponentPlayer.userName);
        }

        if(null!=players&&players.length>1&&owenerFlag){
            this.btnBegin.setEnabled(true);
        }else{
            this.btnBegin.setEnabled(false);
        }
        cc.log("refreshInviteFriend");
    }
});


