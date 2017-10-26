/**
 * Created by Administrator on 2016-11-30.
 */

var EmoticonViewLayer = cc.LayerColor.extend({

    closeCallBackFunction:null,

    ctor:function () {
        this._super(cc.color(0,0,0,0),200,40);
        // this.onEnter();
        this.init();

    },

    onEnter: function () {
        this._super();
        // this.setColor();
        // this.setOpacity(160);
        cc.log("showemoticonView onEnter");
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // target.opacity = 180;
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // target.opacity = 180;
                    console.log("logged!:");
                }else{
                    console.log("logged  2222!:");
                }


            }
        });
        cc.eventManager.addListener(listener, this);
        this._listener = listener;
        this.hideLayer();
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener);
        this._super();
    },

    init:function () {

        cc.log("showemoticonView init");

        var self=this;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;
        //
        // var bg = cc.Sprite.create(res.btn_Emoticon_png);
        // bg.setVisible(false);
        // this.addChild(bg);
        //
        // var bgSize = bg.getContentSize();

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.addChild(mu,3);

        var posX = 60;
        var posY = 20;
        var posBase = 20;

        var  emoBtn1 = new cc.MenuItemImage(res.Emoticon_BTN1_png, "", this.sendFace1, this);
        emoBtn1.setPosition(cc.p(posBase,posY));
        emoBtn1.setScale(fXScale,fYScale);
        mu.addChild(emoBtn1);
        var  emoBtn2 = new cc.MenuItemImage(res.Emoticon_BTN2_png, "", this.sendFace2, this);

        emoBtn2.setPosition(cc.p(posBase+posX,posY));
        emoBtn2.setScale(fXScale,fYScale);
        cc.log("emoBtn2.setPosition=("+emoBtn2.getPosition().x+"|"+emoBtn2.getPosition().y+")");
        mu.addChild(emoBtn2);
        var  emoBtn3 = new cc.MenuItemImage(res.Emoticon_BTN3_png, "", this.sendFace3, this);
        emoBtn3.setPosition(cc.p(posBase+posX*2,posY));
        emoBtn3.setScale(fXScale,fYScale);
        mu.addChild(emoBtn3);

        // this.refreshHelpViewLayer();

        return true;
    },


    toMainScene:function () {
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
    },

    showLayer:function()
    {
        cc.log("showLayer:function()");
        this.setVisible(true);
        this.scheduler.resumeTarget(this);
        this.actionManager && this.actionManager.resumeTarget(this);
        cc.eventManager.resumeTarget(this,true);
    },

    sendFace1:function () {

        this.hideLayer();
        var userName = userInfo.nickName;
        cc.log("FACE NAME1=="+userName+"|FaceType.Face_laugh="+FaceType.Face_laugh);
        gSocketConn.SendFaceMessage(userName,FaceType.Face_laugh);
        // gSocketConn.SendFaceMessage(userName,1);

    },
    sendFace2:function () {
        this.hideLayer();
        var userName = userInfo.nickName;
        cc.log("FACE NAME2=="+userName+"|FaceType.Face_rage="+FaceType.Face_rage);
        gSocketConn.SendFaceMessage(userName,FaceType.Face_rage);
    },
    sendFace3:function () {
        this.hideLayer();
        var userName = userInfo.nickName;
        cc.log("FACE NAME3=="+userName+"|FaceType.Face_cry="+FaceType.Face_cry);
        gSocketConn.SendFaceMessage(userName,FaceType.Face_cry);
    },
    hideLayer:function()
    {
        cc.log("hideLayer:function()");
        this.setVisible(false);
        this.scheduler.pauseTarget(this);
        this.actionManager && this.actionManager.pauseTarget(this);
        cc.eventManager.pauseTarget(this,true);
    },
    // destroy:function(){
    //     cc.eventManager.removeListener(this._listener);
    //     this.removeFromParent();
    // }
});

var ToolsViewLayer = cc.LayerColor.extend({

    closeCallBackFunction:null,

    ctor:function () {
        this._super(cc.color(0,0,0,0),200,40);
        // this.onEnter();
        this.init();

    },

    onEnter: function () {
        this._super();
        // this.setColor();
        // this.setOpacity(160);
        cc.log("showeToolsViewLayeronEnter");
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // target.opacity = 180;
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // target.opacity = 180;
                    console.log("logged!:");
                }else{
                    console.log("logged  2222!:");
                }


            }
        });
        cc.eventManager.addListener(listener, this);
        this._listener = listener;
        this.hideLayer();
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener);
        this._super();
    },

    init:function () {

        cc.log("showtoolView init");

        var self=this;
        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;

        var bg = cc.Sprite.create(res.btn_Emoticon_png);
        bg.setVisible(false);
        this.addChild(bg);

        var bgSize = bg.getContentSize();

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.addChild(mu,3);

        var posX = 70;
        var posY = 20;
        // var posBase = 20;
        var posBase = -30;

        //红绿颠倒
        var  toolBtn1 = new cc.MenuItemImage(res.Emoticon_BTN1_png, "", this.sendTool1, this);
        toolBtn1.setPosition(cc.p(posBase,posY));
        toolBtn1.setScale(fXScale,fYScale);
        toolBtn1.setVisible(false);
        mu.addChild(toolBtn1);

        //遮盖
        var  toolBtn2 = new cc.MenuItemImage(res.BTN_COVER_png, "", this.sendTool2, this);
        toolBtn2.setPosition(cc.p(posBase+posX,posY));
        toolBtn2.setScale(fXScale,fYScale);
        cc.log("toolBtn2.setPosition=("+toolBtn2.getPosition().x+"|"+toolBtn2.getPosition().y+")");
        mu.addChild(toolBtn2);

        //禁止买卖
        var  toolBtn3 = new cc.MenuItemImage(res.BTN_BAN_png, "", this.sendTool3, this);
        toolBtn3.setPosition(cc.p(posBase+posX*2,posY));
        toolBtn3.setScale(fXScale,fYScale);
        mu.addChild(toolBtn3);

        // this.refreshHelpViewLayer();

        return true;
    },


    toMainScene:function () {
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
    },

    showLayer:function()
    {
        cc.log("showLayer:function()");
        this.setVisible(true);
        this.scheduler.resumeTarget(this);
        this.actionManager && this.actionManager.resumeTarget(this);
        cc.eventManager.resumeTarget(this,true);
    },

    toolEnableCD:function () {

        cc.log("toolEnableCD==");
        gKlineScene.matchInfoLayer.disableToolButtons();
        setTimeout(function(){gKlineScene.matchInfoLayer.ableToolButtons();},5000);
    },


    // Tool_Cover=0;
    // Tool_Ban_keyboard=1;
    sendTool1:function () {//red2green,cover,ban

        this.hideLayer();
        this.toolEnableCD();
        var toolName = "red2green";//红绿颠倒效果
        cc.log("TOOL NAME1=="+toolName);
        // gSocketConn.SendToolMessage(toolName);
        gSocketConn.SendToolMessage(ToolType.Tool_red2green);
    },
    sendTool2:function () {//遮盖效果
        this.hideLayer();
        this.toolEnableCD();
        if(testFlag){
            gKlineScene.drawCoverCandlePart();
        }

        var toolName = "cover";
        cc.log("TOOL NAME2=="+toolName);
        // gSocketConn.SendToolMessage(toolName);
        gSocketConn.SendToolMessage(ToolType.Tool_Cover);
    },
    sendTool3:function () {//禁止买卖操作
        this.hideLayer();

        this.toolEnableCD();
        if(testFlag){
            gKlineScene.drawBanCandlePart();
        }
        var toolName = "ban";
        cc.log("TOOL NAME3=="+toolName);
        gSocketConn.SendToolMessage(ToolType.Tool_Ban_keyboard);
        // gSocketConn.SendToolMessage(toolName);
    },
    hideLayer:function()
    {
        cc.log("hideLayer:function()");
        this.setVisible(false);
        this.scheduler.pauseTarget(this);
        this.actionManager && this.actionManager.pauseTarget(this);
        cc.eventManager.pauseTarget(this,true);
    },
    // destroy:function(){
    //     cc.eventManager.removeListener(this._listener);
    //     this.removeFromParent();
    // }
});


