/**
 * Created by Administrator on 2016-12-13.
 */
var LoginViewLayer = cc.Layer.extend({

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

        console.log("res.LOGIN_BG_png=="+res.LOGIN_BG_png);
        this.backgroundSprite=cc.Sprite.create(res.LOGIN_BG_png);
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
        var  loginButton = new cc.MenuItemImage(res.LOGIN_BTN_png,res.LOGIN_BTN_png, self.login, this);
        // knowBtn.setPosition(cc.p(bgSize.width/2,bgSize.height/7));
        loginButton.setPosition(cc.p(bgSize.width/2,100));
        mu.addChild(loginButton);

        return true;
    },

    toMainScene:function () {
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
    },

    login:function()
    {
        //this.showMessageBox("用户名或密码错误");
        //登录
        var self=this;
        var src="";
        // if(src=="" && this.checkUsername()==false)
        // {
        //     self.showErrorBox("用户名只能包含英文和数字",function(){self.errorBoxClosed();});
        //     return;
        // }
        // if(src=="" && this.checkPassword()==false)
        // {
        //     self.showErrorBox("密码只能包含英文和数字",function(){self.errorBoxClosed();});
        //     return;
        // }
        //
        // this.username=this.usernameInputEx.getString();
        // this.password=this.pwdInputEx.getString();
        //
        // gLoginManager.Login(this.username,this.password,src,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
        // this.showProgress();
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
    //检查用户名是否合法
    checkUsername:function()
    {
        var regex = new RegExp("^[A-Za-z0-9]+$");
        var username=this.usernameInputEx.getString();
        if(regex.test(username)==false)
        {
            return false;
        }
        return true;
    },

    //检查密码是否合法
    checkPassword:function()
    {
        var regex = new RegExp("^[A-Za-z0-9]+$");
        var password=this.pwdInputEx.getString();
        if(regex.test(password)==false)
        {
            return false;
        }
        return true;
    },
});