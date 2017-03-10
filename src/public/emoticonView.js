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
                    target.opacity = 180;
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
                    target.opacity = 180;
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

        // this.bg = cc.Sprite.create(res.BLUE_BG_png);

        // var press9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG2_png);
        // 第一个rc参数是整体大小   第二个rc参数是中间区域的范围
        // var bg = new cc.Scale9Sprite(res.BLUE_BG_png, cc.rect(0, 0, 10, 10), cc.rect(2, 2, 7, 7));//cc.Scale9Sprite(res.BLUE_BG_png);
        // bg.x = 0;
        // bg.y = 0;
        // bg.width = 50;
        // bg.height = 100;

        var bg = cc.Sprite.create(res.btn_Emoticon_png);
        bg.setVisible(false);
        this.addChild(bg);

        var bgSize = bg.getContentSize();

        // var imageBg = cc.Sprite.create("res/help/bg_text.png");
        // // imageBg.setAnchorPoint(0,0);
        // imageBg.setPosition(bgSize.width/2,bgSize.height/2+posY);



        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.addChild(mu,3);
        // closeBtn=new Button("res/close.png");
        // var  closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
        // closeBtn.setPosition(cc.p(0,0));
        // mu.addChild(closeBtn);

        var posX = 70;
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

        // mu.setScale(fXScale);
        // var  emoBtn1 = new cc.MenuItemImage(res.Emoticon_BTN1_png, "", self.toMainScene, this);
        // emoBtn1.setPosition(cc.p(40,40));
        // mu.addChild(emoBtn1);


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
        cc.log("FACE NAME=="+userName);
        gSocketConn.SendFaceMessage(userName,1);

    },
    sendFace2:function () {
        this.hideLayer();
        var userName = userInfo.nickName;
        cc.log("FACE NAME=="+userName);
        gSocketConn.SendFaceMessage(userName,2);
    },
    sendFace3:function () {
        this.hideLayer();
        var userName = userInfo.nickName;
        cc.log("FACE NAME=="+userName);
        gSocketConn.SendFaceMessage(userName,3);
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


