/**
 * Created by Administrator on 2016-11-30.
 */

var InvitedViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,

    ctor:function () {
        this._super();
        // this.onEnter();
        this.init();

    },

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

    init:function () {
        var winSize = cc.director.getWinSize();
        var self=this;

        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;


        this.bgColorLayer=new cc.LayerColor(cc.color(0,0,0,127),size.width,size.height);
        this.addChild(this.bgColorLayer);
        this.backgroundSprite=new cc.Sprite(res.BG_FRIEND_ACCEPT);
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(0,0);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);
        this.bgColorLayer.addChild(this.backgroundSprite);




        var bgSize = this.backgroundSprite.getContentSize();
        var posD = 340;
        this.selfBg = new cc.Sprite(res.BG_FRIEND_HEAD_VS_png);
        this.selfBg.setPosition(bgSize.width/2,posD);
        this.backgroundSprite.addChild(this.selfBg,2);
        var fontSize = 25;

        this.selfNameLabel = cc.LabelTTF.create(inviteInfo.friendName, "Arial", fontSize);
        this.selfNameLabel.setPosition(bgSize.width/2,posD-110);
        this.selfNameLabel.enableStroke(ShadowColor,2);
        // this.selfNameLabel.enableShadow();
        this.backgroundSprite.addChild(this.selfNameLabel,2);

        // this.selfNameLabelShadow = cc.LabelTTF.create(inviteInfo.friendName, "Arial", fontSize+1);
        // this.selfNameLabelShadow.setColor(ShadowColor);
        // this.selfNameLabelShadow.setPosition(bgSize.width/2,posD-110);
        // this.backgroundSprite.addChild(this.selfNameLabelShadow,1);

        this.opponentNameLabel = cc.LabelTTF.create("邀请你参加好友战", "Arial", fontSize);
        this.opponentNameLabel.setPosition(bgSize.width/2,posD-160);
        this.backgroundSprite.addChild(this.opponentNameLabel,2);


        if(inviteInfo.inviterPic!=null)
        {
            var url = inviteInfo.inviterPic;
            cc.loader.loadImg(url, {isCrossOrigin : false }, function(err,img){
                if(err){
                    cc.log(err);
                    cc.log("fail loadImg="+inviteInfo.inviterPic); // self.addChild(logo);
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
                    cc.log("refreshViewLayer inviteInfo success loadImg="+url); // self.addChild(logo);
                }
            });
        }
        if(inviteInfo.inviterName!=null&&self.selfNameLabel!=null)
        {
            self.selfNameLabel.setString(cutstr(inviteInfo.inviterName,18));
        }




        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu,3);
        // closeBtn=new Button("res/close.png");
        var  closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
        closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        mu.addChild(closeBtn);
        var macthButtonPosY = 100;

        this.rejectButton=new cc.MenuItemImage(res.BTN_REJECT,res.BTN_REJECT, self.rejectFriend, this);//new CheckButton("res/btn_begin.png","res/btn_begin.png");//new Button("res/btn_mode1d.png");
        this.rejectButton.setPosition(cc.p(bgSize.width/2-120,macthButtonPosY));
        mu.addChild(this.rejectButton);


        this.agreeButton=new cc.MenuItemImage(res.BTN_AGREE, res.BTN_AGREE, self.agreeFriend, this);//new CheckButton("res/btn_unmatch.png","res/btn_unmatch.png");//new Button("res/btn_mode1d.png");
        this.agreeButton.setPosition(cc.p(bgSize.width/2+120,macthButtonPosY));
        // this.agreeButton.setVisible(false);
        mu.addChild(this.agreeButton);

        // cc.MenuItemFont.setFontName("fonts/Self.ttf");
        // cc.MenuItemFont.setFontSize(30);
        //
        // var item1 = new cc.MenuItemFont("拒绝", self.rejectFriend, this);
        // // item1.setAnchorPoint(0,0.5);
        // item1.setPosition(cc.p(bgSize.width/2-80,macthButtonPosY+5));
        // mu.addChild(item1,2);
        //
        // var item2 = new cc.MenuItemFont("同意", self.agreeFriend, this);
        // // item2.setAnchorPoint(0,0.5);
        // item2.setPosition(cc.p(bgSize.width/2+80,macthButtonPosY+5));
        // mu.addChild(item2,2);

        return true;
    },

    toMainScene:function () {

        this.hideLayer();
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
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

    rejectFriend:function () {
        this.agreeButton.unselected();
        this.rejectButton.selected();
        gSocketConn.ansInviteFriend(false,inviteInfo);
        this.toMainScene();

    },

    agreeFriend:function () {
        this.agreeButton.selected();
        this.rejectButton.unselected();
        gSocketConn.ansInviteFriend(true,inviteInfo);
        this.toMainScene();
    },
});


/**
 * Created by Administrator on 2016-11-30.
 */

var addFriendView = cc.Layer.extend({

    closeCallBackFunction:null,
    _className: "addFriendView",
    friendData:null,
    decLabel:null,
    _commentInfo:null,
    ctor:function () {
        this._super();
        // this.onEnter();
        this.init();

    },

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

    init:function () {
        var winSize = cc.director.getWinSize();
        var self=this;

        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;
        var fontSize = 28;


        this.bgColorLayer=new cc.LayerColor(cc.color(0,0,0,127),size.width,size.height);
        this.addChild(this.bgColorLayer);
        this.backgroundSprite=new cc.Sprite(res.BG_FRIEND_ACCEPT);
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(0,0);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);
        this.bgColorLayer.addChild(this.backgroundSprite);

        var bgSize = this.backgroundSprite.getContentSize();
        var posX = 125;//bgSize.width/2-100;
        var posD = bgSize.height/2+100;
        var commentInfo = "我是"+userInfo.nickName;

        this.decLabel = cc.LabelTTF.create("对方需要你的邀请信息", res.FONT_TYPE, fontSize,cc.size(300,45));
        this.decLabel.setPosition(posX,posD);
        this.decLabel.setAnchorPoint(0,0.5);
        this.backgroundSprite.addChild(this.decLabel,2);
        // (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg)
        // var normal9SpriteBg=new cc.Scale9Sprite(res.BLUE_BG_png);
        var SpriteBg=new cc.Scale9Sprite(res.BG_FRIEND_SEARCH);
        SpriteBg.setContentSize(cc.size(528, 60));
        SpriteBg.setPosition(posX,posD-60);
        SpriteBg.setAnchorPoint(0,0.5);
        this.backgroundSprite.addChild(SpriteBg,2);
        var normal9SpriteBg=new cc.Scale9Sprite(res.LESS_BG_png);
        // var press9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG2_png);
        // var disabled9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG1_png);
        // var fontSize = 30;
        // this._userName = new cc.EditBox(cc.size(300, 45),normal9SpriteBg,press9SpriteBg,disabled9SpriteBg );
        this._commentInfo = new cc.EditBox(cc.size(528, 60),normal9SpriteBg);
        this._commentInfo.x = posX;
        this._commentInfo.y = posD-60;
        this._commentInfo.setFontSize(fontSize);
        this._commentInfo.setDelegate(self);
        this._commentInfo.setMaxLength(20);
        this._commentInfo.setPlaceholderFontSize(fontSize);
        this._commentInfo.setPlaceHolder(commentInfo);

        this._commentInfo.setPlaceholderFontColor(cc.color("#FFFFFF"));
        this._commentInfo.setPlaceholderFontColor(fontBlueColor);
        this._commentInfo.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        // this._userName.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);//修改为使用密文
        // this._commentInfo.setFontName(commentInfo);
        this._commentInfo.setFontColor(cc.color.WHITE);
        this._commentInfo.setFontColor(fontBlueColor);
        // this._commentInfo.
        this._commentInfo.setAnchorPoint(0,0.5);
        this.backgroundSprite.addChild(this._commentInfo,3);


        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu,3);
        // closeBtn=new Button("res/close.png");
        var  closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
        closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        mu.addChild(closeBtn);
        var macthButtonPosY = 100;

        this.confirmButton=new cc.MenuItemImage(res.BTN_CONFIRM, res.BTN_CONFIRM, self.addFriend, this);//new CheckButton("res/btn_unmatch.png","res/btn_unmatch.png");//new Button("res/btn_mode1d.png");
        this.confirmButton.setPosition(cc.p(bgSize.width/2,macthButtonPosY));
        mu.addChild(this.confirmButton);

        return true;
    },

    toMainScene:function () {

        this.hideLayer();
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
    },
    setFriendData:function (content) {
        this.friendData = content;
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
        this.removeFromParentAndCleanup(true);
    },

    addFriend:function () {
        var self = this;
       //AddFriendType.Type_SelectAdd_NewFriend;AddFriendType.Type_SendFriend_Request;AddFriendType.Type_FindFriendRequest;
        if(null!=self.friendData){
            var addFriendType = AddFriendType.Type_SendFriend_Request;
            var content = self.friendData;//SendFriend_Request
            // content.setToken(self.friendInfo["token"]);
            // content.setFollowerId(self.friendInfo["uid"]);//申请人的uid
            content.setComment(self._commentInfo.getString());//申请好友的备注
            gSocketConn.addFriend(addFriendType,content);
        }
        self.toMainScene();
    },
});


