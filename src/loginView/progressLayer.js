// JavaScript Document
var ProgressLayer= cc.Layer.extend({
	loadbgSprite:null,
	rotateSprite:null,
	rotateSpriteInner:null,
	
	combineAction:null,
	combineActionInner:null,
	
	runned:false,
	
	
	ctor:function(width,height)
	{
		this._super();
		this.width=width;
		this.height=height;
	},
	
	onEnter:function () 
	{
		this._super();
		
		// this.loadbgSprite = cc.Sprite.create("res/load-bg.png");
		// this.loadbgSprite.setPosition(this.width / 2, this.height / 2);
		// this.loadbgSprite.setScale(1);
		// this.addChild(this.loadbgSprite,1);
		
		
		var rotAction1=new cc.RotateTo(0.5,90,90);
		var rotAction2=new cc.RotateTo(0.5,180,180);
		var rotAction3=new cc.RotateTo(0.5,270,270);
		var rotAction4=new cc.RotateTo(0.5,360,360);
		
		this.combineAction=new cc.Sequence(rotAction1,rotAction2,rotAction3,rotAction4);
		
		var rotAction_Inner1=new cc.RotateTo(0.5,90,90);
		var rotAction_Inner2=new cc.RotateTo(0.5,180,180);
		var rotAction_Inner3=new cc.RotateTo(0.5,270,270);
		var rotAction_Inner4=new cc.RotateTo(0.5,360,360);
		
		this.combineActionInner=new cc.Sequence(rotAction_Inner1,rotAction_Inner2,rotAction_Inner3,rotAction_Inner4);
	},
	
	rotate:function()
	{
		cc.log("rotate..............");
		
		this.rotateSprite = cc.Sprite.create("res/rotate.png");
		this.rotateSprite.setPosition(this.width / 2, this.height / 2);
		this.rotateSprite.setScale(1);
		this.addChild(this.rotateSprite,3);
		
		this.rotateSpriteInner = cc.Sprite.create("res/rotate_shadow.png");
		this.rotateSpriteInner.setPosition(this.width / 2+3, this.height / 2-3);
		this.rotateSpriteInner.setScale(1);
		this.addChild(this.rotateSpriteInner,2);

		
		this.setVisible(true);
		
		if(this.runned==false)
		{
			this.rotateSprite.runAction(new cc.RepeatForever(this.combineAction));
			this.rotateSpriteInner.runAction(new cc.RepeatForever(this.combineActionInner));
		}
		else
		{
			this.rotateSprite.resume();
			this.rotateSpriteInner.resume();
			
			this.rotateSprite.runAction(new cc.RepeatForever(this.combineAction));
			this.rotateSpriteInner.runAction(new cc.RepeatForever(this.combineActionInner));
		}
        cc.log("rotate: sceneBase::sys.os=="+sys.os);

        // if(sys.os===sys.OS_WINDOWS||sys.os===sys.OS_OSX) {//浏览器模式
        //
        // }

        if(sys.isMobile==false&&sys.isNative==false) {//浏览器模式
			cc.log("rotate: sceneBase::sys.os=="+sys.os);
        }
        else if(sys.os === sys.OS_IOS || sys.os === sys.OS_OSX){
			cc.log("rotate: sceneBase::sys.os=="+sys.os);
			refreshUrl(10);
        }
	},
	
	stop:function()
	{
		if(this.rotateSprite!=null&&this.rotateSpriteInner!=null)
		{
			this.rotateSprite.stopAllActions();
			this.rotateSpriteInner.stopAllActions();
			this.rotateSprite.removeFromParent(true);
			this.rotateSpriteInner.removeFromParent(true);
			this.setVisible(false);
		}
		if(sys.os === sys.OS_IOS || sys.os === sys.OS_OSX){
			clearRefreshUrl();
		}

	}
	
});