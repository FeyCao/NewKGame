/**
 * Created by Administrator on 2016-11-30.
 */

var ControlViewLayer = cc.Layer.extend({

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


        this.backgroundSprite=cc.Sprite.create("res/bg_control.png");
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);
        this.addChild(this.backgroundSprite);

        var bgSize = this.backgroundSprite.getContentSize();


        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu,3);
        // closeBtn=new Button("res/close.png");
        var  closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
        closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        mu.addChild(closeBtn);
        // this.closeButton=new Button("res/close.png");
        // // this.closeButton.setScale(fXScale,fYScale);
        // //this.closeButton.setPosition(cc.p(size.width,size.height));
        // this.closeButton.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        // this.closeButton.setClickEvent(function(){
        //     cc.log("closeButton ClickEvent");
        //     self.toMainScene();
        // });
        // this.backgroundSprite.addChild(this.closeButton);

        var fontSize = 40;
        // var posY = bgSize.height/2-20;
        // var posX = 100;
        var posX = 100;
        var posY = bgSize.height/2-50;
        var posX1 =50;
        // var posY1 =20;
        var text1Label = new cc.LabelTTF( "音乐", "Arial", fontSize);
        text1Label.setPosition(cc.p(posX+posX1,posY+120));
        text1Label.setAnchorPoint(0,0.5);
        text1Label.setColor(WhiteColor);
        this.backgroundSprite.addChild(text1Label);

        var text2Label = new cc.LabelTTF( "音效", "Arial", fontSize);
        text2Label.setPosition(cc.p(posX+posX1,posY));
        text2Label.setAnchorPoint(0,0.5);
        text2Label.setColor(WhiteColor);
        this.backgroundSprite.addChild(text2Label);

        var text3Label = new cc.LabelTTF( "清晰度", "Arial", fontSize);
        text3Label.setPosition(cc.p(posX,posY-100));
        text3Label.setAnchorPoint(0,0.5);
        text3Label.setColor(WhiteColor);

        var soundBgButton=new CheckButton("res/btn_open.png","res/btn_close.png");//new Button("res/btn_mode1d.png");
        soundBgButton.setPosition(cc.p(bgSize.width/2+posX1,posY+120));
        // soundBgButton.setScale(0.8);
        soundBgButton.setClickEvent(function(){
            cc.log("soundBgButton ClickEvent cc.audioEngine.isMusicPlaying() ="+cc.audioEngine.isMusicPlaying());
            if(soundBgButton.isSelected==true)
            {
                cc.log("soundBgButton.isSelected()==true");
                userInfo.bgSoundFlag=true;
            }
            else
            {
                userInfo.bgSoundFlag=false;
            }

            if(userInfo.bgSoundFlag==true){
                openBgSound();
               // self.openBgSound();
            }
            else
            {
                closeBgSound();
              //  self.closeBgSound();
            }
            // cc.audioEngine.stopMusic();

        });
        soundBgButton.setTextureByStatus(userInfo.bgSoundFlag);
        this.backgroundSprite.addChild(soundBgButton,5);

        var soundButton=new CheckButton("res/btn_open.png","res/btn_close.png");//new Button("res/btn_mode1d.png");
        soundButton.setPosition(cc.p(bgSize.width/2+posX1,posY));
        // soundButton.setScale(0.8);
        soundButton.setClickEvent(function(){
            cc.log("soundButton ClickEvent cc.audioEngine.isMusicPlaying() ="+cc.audioEngine.isMusicPlaying());
            if(soundButton.isSelected==true)
            {
                cc.log("soundButton.isSelected()==true");
                userInfo.buttonSoundFlag =true;
                // var musicFile = "res/sound/home_bg.mp3";
                // cc.audioEngine.playMusic(musicFile,true);
            }
            else
            {
                cc.log("soundButton.isSelected()==false");
                userInfo.buttonSoundFlag =false;// cc.audioEngine.stopMusic();
            }
            // cc.audioEngine.stopMusic();

        });
        soundButton.setTextureByStatus(userInfo.buttonSoundFlag);
        this.backgroundSprite.addChild(soundButton,5);

        // this.refreshControlViewLayer();

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
    // refreshControlViewLayer:function()
    // {
    //     ;
    // },
});


