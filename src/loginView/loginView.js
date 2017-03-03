/**
 * Created by Administrator on 2016-12-13.
 */
var LoginViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,
    _userName:null,
    _password:null,
    countDownNumber:null,
    countDownSprite:null,
    countDownLabel:null,
    sendBtn:null,
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
        // 2.获取窗口大小
        var winSize = cc.director.getWinSize();

        // 3.窗口中心
        var centerpos = cc.p(winSize.width / 2, winSize.height / 2);

        var self=this;

        var fXScale = winSize.width/1280;
        var fYScale = winSize.height/720;

        console.log("res.LOGIN_BG_png=="+res.LOGIN_BG_png);
        this.backgroundSprite=cc.Sprite.create(res.LOGIN_BG_png);
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(centerpos);
        this.addChild(this.backgroundSprite);

        var bgSize = this.backgroundSprite.getContentSize();

        // 4.创建背景图片

        // (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg)
        var normal9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG1_png);
        var press9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG2_png);
        var disabled9SpriteBg=new cc.Scale9Sprite(res.LOGIN_BG1_png);
        var fontSize = 30;
        this._userName = new cc.EditBox(cc.size(300, 45),normal9SpriteBg,press9SpriteBg,disabled9SpriteBg );
        this._userName.x = bgSize.width/2;
        this._userName.y = 270;
        this._userName.setFontSize(fontSize);
        this._userName.setDelegate(this);
        this._userName.setMaxLength(15);
        this._userName.setPlaceholderFontSize(fontSize);
        this._userName.setPlaceHolder("请输入手机号码");
        this._userName.setPlaceholderFontColor(BlackColor);
        this._userName.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        // this._userName.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);//修改为使用密文
        this._userName.setFontColor(WhiteColor);
        this.backgroundSprite.addChild(this._userName);


        var normal9SpriteBg1=new cc.Scale9Sprite(res.LOGIN_BG1_png);
        this._password = new cc.EditBox(cc.size(300, 45),normal9SpriteBg1 );
        this._password.x = bgSize.width/2;
        this._password.y = 190;
        this._password.setFontSize(fontSize);
        this._password.setDelegate(this);
        this._password.setMaxLength(15);
        this._password.setPlaceholderFontSize(fontSize);
        this._password.setPlaceHolder("请输入验证码");
        this._password.setPlaceholderFontColor(BlackColor);
        this._password.setInputMode(cc.EDITBOX_INPUT_MODE_PHONENUMBER);
        // this._password.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);//修改为使用密文
        this._password.setFontColor(WhiteColor);
        this.backgroundSprite.addChild(this._password);

        // this._zhanghao.setName("zhaoguanghui");
        // this._zhanghao.setPosition(647, 355);
        // this._zhanghao.setDelegate(this);
        // this._zhanghao.setMaxLength(20);
        // this._zhanghao.setPlaceHolder("点击输出账号");
        // this._zhanghao.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);//修改为不使用密文
        // this._zhanghao.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu,3);
        // closeBtn=new Button("res/close.png");
        var  closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
        closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        mu.addChild(closeBtn);

        this.sendBtn = new cc.MenuItemImage(res.LOGIN_SEND_BTN_png, res.LOGIN_SEND_BTN_png, self.sendCode, this);
        this.sendBtn.setPosition(cc.p(bgSize.width-150,190));
        mu.addChild(this.sendBtn);

        if(this.countDownSprite==null)
        {
            this.countDownSprite= cc.Sprite.create(res.LOGIN_SEND_BG_png);
            this.countDownSprite.setPosition(cc.p(bgSize.width-150,190));
            this.backgroundSprite.addChild(this.countDownSprite,3);
            this.countDownLabel = cc.LabelTTF.create("已发送(30)","Arial",25);
            this.countDownLabel.setPosition(59,25);

            this.countDownSprite.addChild(this.countDownLabel,3);
            this.countDownSprite.setVisible(false);
        }

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

    sendCode:function () {
        var mobileNumber = this._userName.getString();
        if(checkPhoneNumber(mobileNumber)){
            cc.log("电话号码"+this._userName.getString());
            gSocketConn.SendMoblieMessage(mobileNumber);
            this.countDownNumber=10;
            this.setCountDownSprite();
        }else{
            cc.log("输入的手机号有误");
        }

    },
    login:function()
    {
        cc.log("login:function() begin");
        //登录
        var self=this;
        var phoneNumber = this._userName.getString();
        var phoneCode = this._password.getString();
        if(checkPhoneNumber(phoneNumber)&&phoneCode!=null){
            cc.log("电话号码=="+phoneNumber+"验证码=="+phoneCode);
            gSocketConn.toLogin(phoneNumber,phoneCode);
        }
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

    //设置游戏倒计时
    setCountDownSprite:function()
    {

        if(this.countDownNumber==0 && this.countDownSprite!=null)
        {
            this.countDownSprite.setVisible(false);
            if(this.sendBtn!=null){
                this.sendBtn.setVisible(true);
            }
            return;
        }
        if(this.sendBtn!=null){
            this.sendBtn.setVisible(false);
        }
        this.countDownNumber-=1;

        var str = "已发送("+this.countDownNumber+")";
        if(this.countDownLabel!=null&&this.countDownSprite!=null){
            this.countDownLabel.setString(str);
            this.countDownSprite.setVisible(true);
        }

        var self=this;
        pageTimer["beginTimer"] = setTimeout(function(){self.setCountDownSprite();},1000);
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