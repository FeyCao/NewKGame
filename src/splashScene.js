// JavaScript Document
var SplashScene = SceneBase.extend(
{
	ctor: function ()
	{
		this._super();
	},
	
	onEnter:function () 
	{
		this._super();
		var size = cc.director.getWinSize();
		var sprite = cc.Sprite.create("res/title.png");
		sprite.setPosition(size.width / 2, size.height / 2);
		sprite.setScale(1.0);
		this.addChild(sprite, 0);
		
		var self=this;
		//2秒后切换
		setTimeout(function(){self.splashSceneOver();},500);
	},
	
	splashSceneOver:function()
	{
		cc.director.runScene(cc.TransitionSlideInT.create(0.5,new LoginScene()));
	}
});