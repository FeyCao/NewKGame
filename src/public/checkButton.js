// JavaScript Document
CheckButton=cc.Sprite.extend({
	clickevent:null,		//按钮按下的回调函数
	clickeventparam:null,	//回调函数的参数
	listener:null,
	shrinkPixels_Width:null,
	shrinkPixels_Height:null,
	shrinkRatioWidth:null,
	shrinkRatioHeight:null,
	isPressedDown:false,
	
	textureNameSelected:null,
	textureNameUnselected:null,
	isSelected:null,
	isDisabled:false,		//是否是被禁用的
	
	ctor: function (fileNameSelected,fileNameUnselected, rect, rotated)
	{
		this._super(fileNameUnselected, rect, rotated);
		
		this.isSelected=false;
		
		this.textureNameSelected=fileNameSelected;
		this.textureNameUnselected=fileNameUnselected;
		
		
		this.shrinkPixels_Width=4;
		this.shrinkPixels_Height=4;
		this.shrinkRatioWidth=(this.width-this.shrinkPixels_Width)/this.width;
		this.shrinkRatioHeight=(this.height-this.shrinkPixels_Height)/this.height;
	},
	
	
	
	setClickEvent:function(clickevent)
	{
		this.clickevent=clickevent;
		
		var self=this;
		this.listener= cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: false,
			//onTouchBegan event callback function						
			onTouchBegan: function (touch, event) {	
				if(self.isVisible()==true && self.isDisabled==false)
				{
					//var nextSceneM=new NextScene();
					var target = event.getCurrentTarget();	
					var touchLocation=touch.getLocation();
					//Get the position of the current point relative to the button
					var locationInNode = target.convertToNodeSpace(touchLocation);	
					var s = target.getContentSize();
					var rect = cc.rect(0, 0, s.width, s.height);
					//Check the click area
					if (cc.rectContainsPoint(rect, locationInNode)) 
					{		
						cc.log("CheckButton onTouchBegan");
						self.shrink();
						this.isPressedDown=true;
					}
					else
					{
	
					}
				}
				return true;
			},
			
			onTouchEnded: function (touch, event) {	
				if(self.isVisible()==true && self.isDisabled==false)
				{
					//var nextSceneM=new NextScene();
					var target = event.getCurrentTarget();	
					var touchLocation=touch.getLocation();
					//Get the position of the current point relative to the button
					var locationInNode = target.convertToNodeSpace(touchLocation);	
					var s = target.getContentSize();
					var rect = cc.rect(0, 0, s.width, s.height);
					if(this.isPressedDown==true)
					{
						cc.log("CheckButton onTouchEnded");
						self.unshrink();
						this.isPressedDown=false;
						self.isSelected=!self.isSelected;
						self.setChecked(self.isSelected);

					}
					//Check the click area
					//if (cc.rectContainsPoint(rect, locationInNode)) 
					//{		
					//	cc.log("onTouchEnded");
					//	self.unshrink();
					//	if(self.clickevent!=null)
					//	{
					//		self.clickevent();
					//	}
					//}
					//else
					//{
					//	cc.log("doesn't contain "+self.__instanceId);
					//}
				}
				
			},
		});
		
		cc.eventManager.addListener(this.listener, this);
	},
	
	setChecked:function(isChecked)
	{
		// this.isSelected=isChecked;
		this.setTextureByStatus(isChecked);

		if(this.clickevent!=null)
		{
			this.clickevent();
		}
	},
	
	setDisabled:function(isDisabled)
	{
		this.isDisabled=isDisabled;
	},
	
	setTextureByStatus:function(isChecked)
	{
		if(isChecked==true)
		{
			this.isSelected=true;
			this.setTexture(this.textureNameSelected);
		}
		else
		{
			this.isSelected=false;
			this.setTexture(this.textureNameUnselected);
		}
	},

	///当按钮按下去的时候，缩小
	shrink:function()
	{
		//var actionNormal=new cc.ScaleTo(0.032,this.shrinkRatioWidth,this.shrinkRatioHeight);
		//this.runAction(actionNormal);
	},
	
	///当按钮弹起来的时候，放大
	unshrink:function()
	{
		//var actionNormal=new cc.ScaleTo(0.032,1,1);
		//this.runAction(actionNormal);
	},
});// JavaScript Document