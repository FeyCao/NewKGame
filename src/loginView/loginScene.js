// JavaScript Documentvar 
LoginScene = SceneBase.extend(
{
	loginButton:null,
	quickLoginButton:null,
	
	remPwdCheckBox:null,
	autoLoginCheckBox:null,
	
	usernameInputEx:null,
	pwdInputEx:null,
	
	spriteScaleX:1,
	spriteScaleY:1,
	
	
	
	username:null,
	password:null,
	source:null,
	
	operationType:0,	//1为登录，2为注册并登录
	
	
	onEnter:function () 
	{
		this._super();
		var self=this;
		
		//测试用
		//this.removeLocalStorageItems();
		
		if(cc.sys.isMobile==false)
		{
			this.addKeyDownEventListener();
		}
		
		var size = cc.director.getWinSize();
		
	


		this.sprite = cc.Sprite.create("res/login.png");
		this.sprite.setPosition(size.width / 2, size.height / 2);
		this.sprite.setScale(1.0);
		this.addChild(this.sprite, 0);
		
		gLoginManager=new LoginManager();
  
		username=getQueryStringByName("username");
		password=getQueryStringByName("password");
		var source=getQueryStringByName("source");
		
		
		this.usernameInputEx=new InputEx("","Arial",22);
		this.usernameInputEx.setPosition(310,204);
		this.usernameInputEx.setTouchSize(cc.size(205,31));
		this.usernameInputEx.setTouchAreaEnabled(true);
		this.usernameInputEx.setTipMessage("请输入用户名");
		this.usernameInputEx.lostFocusEvent=function(){self.autoloadPwd();};
		this.addChild(this.usernameInputEx, 1);
		cc.log("usernameInputEx instanceid="+this.usernameInputEx.__instanceId);
		
		
		this.pwdInputEx=new InputEx("","Arial",22);
		this.pwdInputEx.setPasswordEnabled(true);
		this.pwdInputEx.setPasswordStyleText("*");
		this.pwdInputEx.setPosition(310,157);
		this.pwdInputEx.setTouchSize(cc.size(188,31));
		this.pwdInputEx.setTouchAreaEnabled(true);
		this.pwdInputEx.setTipMessage("请输入密码");
		this.addChild(this.pwdInputEx, 1);
		cc.log("pwdInputEx instanceid="+this.pwdInputEx.__instanceId);
		
		
		
		
		
		var spriteLogoWidth=this.sprite.width;
		var spriteLogoHeight=this.sprite.height;
		
		this.loginButton=new Button("res/loginbutton.png");
		this.loginButton.setPosition(279,55);
		this.loginButton.setClickEvent(function(source){
			self.login(source);
		});
		
		this.addChild(this.loginButton, 1);
		
		this.quickLoginButton=new Button("res/quicklogin.png");
		this.quickLoginButton.setPosition(470,55);
		this.quickLoginButton.setClickEvent(function(){
			self.quickLogin();
		});
		this.addChild(this.quickLoginButton, 1);
		
		this.remPwdCheckBox=new CheckBox("res/selected.png");
		this.remPwdCheckBox.setPosition(246,129);
		this.remPwdCheckBox.setValidSize(108,22);
		this.addChild(this.remPwdCheckBox, 1);
		
		this.autoLoginCheckBox=new CheckBox("res/selected.png");
		this.autoLoginCheckBox.setPosition(400,129);
		this.autoLoginCheckBox.setValidSize(108,22);
		this.addChild(this.autoLoginCheckBox, 1);
		
		this.remPwdCheckBox.setChecked(localStorage.remPwd=="true"?true:false);	
		this.autoLoginCheckBox.setChecked(localStorage.autologin=="true"?true:false);	
		
		if(localStorage.lastusername!="" && localStorage.lastusername!=undefined)
		{
			this.usernameInputEx.setString(localStorage.lastusername);
			if(localStorage.autologin=="true")
			{
				var pwd=this.getPasswordFromLocalStorage(localStorage.lastusername);
				this.pwdInputEx.setString(pwd);
	
				var self=this;
				//如果是自动登录的
				setTimeout(function(){self.login();},500);
			}
			else
			{
				 if(localStorage.remPwd=="true")
				 {
					//如果是记住密码的
					var pwd=this.getPasswordFromLocalStorage(localStorage.lastusername);
					this.pwdInputEx.setString(pwd);
				 }
				 else
				 {
					 if(cc.sys.isMobile==false)
					 {
						 this.pwdInputEx._textFieldRenderer.attachWithIME();
					 }
				 }
			}
		}
		else
		{
			 if(cc.sys.isMobile==false)
			 {
				 this.usernameInputEx._textFieldRenderer.attachWithIME();
			 }
		}
		
	},
	
	removeLocalStorageItems:function()
	{
		localStorage.removeItem("remPwd");
		localStorage.removeItem("autologin");
		localStorage.removeItem("lastusername");
		localStorage.removeItem("usrnamepwdDict");
	},
	
	
	autoloadPwd:function()
	{
		if(this.remPwdCheckBox.ischecked==true)
		{
			var username=this.usernameInputEx.getString();
			var pwd=this.getPasswordFromLocalStorage(username);
			if(pwd!=null)
			{
				this.pwdInputEx.setString(pwd);
			}
		}
	},
	
	//添加监听TAB的事件
	addKeyDownEventListener:function()
	{
		var self=this;
		//var gameCanvasObj=document.getElementById("gameCanvas");
		//gameCanvasObj.addEventListener("keydown", function(){self.tabDown();});
		cc.imeDispatcher.tabProcessFunction=function(){self.tabDown();};
	},
	
	tabDown:function()
	{
		if(this.usernameInputEx.isSelected()==true)
		{
			cc.log("tab down call detachWithIME");
			this.usernameInputEx._textFieldRenderer.detachWithIME();
			cc.log("tab down call attachWithIME");
			this.pwdInputEx._textFieldRenderer.attachWithIME();
		}
	},
	
	
	getPasswordFromLocalStorage:function(username)
	{
		var dict=localStorage.usrnamepwdDict;
		if(dict==undefined || dict==null) return null;
		var fields=dict.split("#");
		for(var i=0;i<fields.length;i=i+2)
		{
			if(fields[i]==username)
			{
				if(i+1<fields.length)
				{
					return fields[i+1];
				}
			}
		}
		return null;
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
	
	login:function(source)
	{
		//this.showMessageBox("用户名或密码错误");
		//登录
		var self=this;
		var src="";
		if(source!=undefined)
		{
			src=source;
		}
		if(src=="" && this.checkUsername()==false)
		{
			self.showErrorBox("用户名只能包含英文和数字",function(){self.errorBoxClosed();});
			return;
		}
		if(src=="" && this.checkPassword()==false)
		{
			self.showErrorBox("密码只能包含英文和数字",function(){self.errorBoxClosed();});
			return;
		}
		
		this.operationType=1;
		//this.showOrHideTextBoxUILabel(true);
		
		var self=this;
		
		this.username=this.usernameInputEx.getString();
		this.password=this.pwdInputEx.getString();
		
		gLoginManager.Login(this.username,this.password,src,function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
		this.showProgress();
		
		
	},
		
	///快速登录，即随机注册后直接登录
	quickLogin:function()
	{
		var self=this;
		gLoginManager.QuickLogin(function(packet){self.messageCallback(packet)},function(){self.connectErrorCallBack()});
		this.showProgress();
	},
	
	//一般是登录名或者密码错误之类的框关闭以后
	messageBoxClosed:function()
	{
		//this.showOrHideTextBoxUILabel(false);
	},
	
	connectErrorCallBack:function()
	{
		var self=this;
		//setTimeout(function(){
		//	self.stopProgress();
		//	self.showMessageBox("服务器连接失败，请稍候再试！",function(){self.messageBoxClosed();});
		//	},2000);
		this.stopProgress();
		this.showErrorBox("服务器连接失败，请稍候再试！",function(){this.errorBoxClosed();});
	},
	
	messageCallback:function(packet)
	{
		cc.log("login scene message callback packet.msgType="+packet.msgType+" content="+packet.content);
		var self=this;
		if(packet.msgType=="1")
		{
			gPlayerName=packet.content;
			//登录成功
			this.OnLogined(packet.content);
		}
		else if(packet.msgType=="2")
		{
			//登录失败
			this.stopProgress();
			this.showErrorBox("登录失败:"+packet.content,function(){self.errorBoxClosed();});
		}
		else if(packet.msgType=="B")
		{
			//快速登录成功
			gPlayerName=packet.content.split("#")[0];
			
			this.username=gPlayerName;
			this.password=packet.content.split("#")[1];
			this.source=packet.content.split("#")[2];
			this.usernameInputEx.setString(this.username);
			this.pwdInputEx.setString(this.password);
			this.stopProgress();
			//this.showMessageBox("快速登录失败:"+packet.content,function(){self.messageBoxClosed();});
			//此处还需要设置很多内容，比如自动登录，记住密码
			this.remPwdCheckBox.setChecked(true);
			this.autoLoginCheckBox.setChecked(true);
			self.login();
		}
		else if(packet.msgType=="C")
		{
			//注册失败
			this.stopProgress();
			this.showErrorBox("快速登录失败:"+packet.content,function(){self.errorBoxClosed();});
		}
	},
	
	OnLogined:function(username)
	{
		this.saveCheckboxState();
		var self=this;
		var diff=this.getSceneElapsedMilliSeconds();
		cc.log("diff="+diff);
		//登录成功，这里需要考虑对于自动登录的情况，前一个切换到loginScene场景的效果还未结束，如果此时再切换的话会导致后面的场景无法显示
		if(diff<1000)
		{
			cc.log("diff="+diff);
			setTimeout(function(){
				self.moveToNextScene();
			},1000);
		}
		else
		{
			this.moveToNextScene();
		}
	},
	
	//保存状态
	saveCheckboxState:function()
	{
		localStorage.remPwd=this.remPwdCheckBox.ischecked;
		localStorage.autologin=this.autoLoginCheckBox.ischecked;
		localStorage.lastusername=this.username;
		var fields=null;
		if(localStorage.remPwd=="true")
		{
			var dict=localStorage.usrnamepwdDict;
			if(dict==undefined)
			{
				dict="";
			}
			fields=dict.split("#");
			var bFound=false;
			for(var i=0;i<fields.length;i=i+2)
			{
				if(fields[i]==this.username)
				{
					fields[i+1]=this.password;
					bFound=true;
					break;
				}
			}
			if(bFound==false)
			{
				fields.push(this.username);
				fields.push(this.password);
			}
		}
		
		if(fields!=null)
		{
			dict="";
			for(var i=0;i<fields.length;i++)
			{
				if(fields[i]!="")
				{
					dict=dict+fields[i]+"#";
				}
			}
			localStorage.usrnamepwdDict=dict;
		}
	},
	
	moveToNextScene:function()
	{
		this.stopProgress();
		cc.log("登录成功，准备切换到下一个场景");
		if(gMainMenuScene==null)
		{
			gMainMenuScene=new MainMenuScene();
		}
		cc.director.runScene(cc.TransitionFade.create(0.5,gMainMenuScene,cc.color(255,255,255,255)));
		//cc.director.runScene(new WaitingScene());
		cc.log("切换场景调用完毕");
	},
});

