/**
 * Created by Administrator on 2016-12-13.
 */
var MatchViewLayer = cc.Layer.extend({

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
        // this.onEnter();
        this.init();

    },

    init:function () {
        var winSize = cc.director.getWinSize();
        var self=this;

        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;


        this.backgroundSprite=cc.Sprite.create("res/bg_match.png");
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);
        this.addChild(this.backgroundSprite);

        var bgSize = this.backgroundSprite.getContentSize();

        cc.log("closeButton ClickEvent"+bgSize.width);
        this.closeButton=new Button("res/close.png");
        // this.closeButton.setScale(fXScale,fYScale);
        //this.closeButton.setPosition(cc.p(size.width,size.height));
        this.closeButton.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        this.closeButton.setClickEvent(function(){

            self.toMainScene();
        });
        this.backgroundSprite.addChild(this.closeButton);



        // var fontSize = 40;
        // // var posY = bgSize.height/2-20;
        // // var posX = 100;
        var posX = 100;
        var posY = 100;
        // var posX1 =50;
        // // var posY1 =20;
        // text1Label = new cc.LabelTTF( "音乐", "Arial", fontSize);
        // text1Label.setPosition(cc.p(posX+posX1,posY+120));
        // text1Label.setAnchorPoint(0,0.5);
        // text1Label.setColor(WhiteColor);
        // this.backgroundSprite.addChild(text1Label);
        //
        // text2Label = new cc.LabelTTF( "音效", "Arial", fontSize);
        // text2Label.setPosition(cc.p(posX+posX1,posY));
        // text2Label.setAnchorPoint(0,0.5);
        // text2Label.setColor(WhiteColor);
        // this.backgroundSprite.addChild(text2Label);
        //
        // text3Label = new cc.LabelTTF( "清晰度", "Arial", fontSize);
        // text3Label.setPosition(cc.p(posX,posY-100));
        // text3Label.setAnchorPoint(0,0.5);
        // text3Label.setColor(WhiteColor);


        beginButton=new CheckButton("res/btn_begin.png","res/btn_begin.png");//new Button("res/btn_mode1d.png");
        beginButton.setPosition(cc.p(bgSize.width/2,posY));
        // soundBgButton.setScale(0.8);
        beginButton.setClickEvent(function(){
            cc.log("soundBgButton ClickEvent");


        });
        // beginButton.setTextureByStatus(!userInfo.bgSoundFlag);
        this.backgroundSprite.addChild(beginButton,5);

        unmatchButton=new CheckButton("res/btn_unmatch.png","res/btn_unmatch.png");//new Button("res/btn_mode1d.png");
        unmatchButton.setPosition(cc.p(bgSize.width/2,posY));
        // soundButton.setScale(0.8);
        unmatchButton.setClickEvent(function(){

            // cc.audioEngine.stopMusic();
        });
        unmatchButton.setTextureByStatus(!userInfo.buttonSoundFlag);
        this.backgroundSprite.addChild(unmatchButton,5);

        this.refreshMatchViewLayer();

        return true;
    },

    toMainScene:function () {
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
    refreshMatchViewLayer:function()
    {


    },
});