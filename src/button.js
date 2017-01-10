// JavaScript Document
var buttonLogFlag = false;
Button=cc.Sprite.extend({
	clickevent:null,		//按钮按下的回调函数
	clickeventparam:null,	//回调函数的参数
	listener:null,
	isPressedDown:false,
    isDisabled:false,		//是否是被禁用的
	ctor: function (fileName, rect, rotated)
	{
		this._super(fileName, rect, rotated);

	},
	onExit:function()
	{
		cc.log("Button onExit end"+self.__instanceId);
		this._super();
		cc.eventManager.removeListener(this.listener);
		this.removeAllChildrenWithCleanup(true);


	},
	setClickEvent:function(clickevent)
	{
		this.clickevent=clickevent;
		// cc.MenuItemImage
		var self=this;
		this.listener= cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: false,
			//onTouchBegan event callback function						
			onTouchBegan: function (touch, event) {
                cc.log("Button onTouchBegan"+self.__instanceId);
				if(self.isVisible()==true&& self.isDisabled==false)
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
						if(buttonLogFlag!=false)
                        cc.log("begin..x="+ locationInNode.x+",y="+locationInNode.y+",s.width="+s.width+",s.height="+ s.height);
						//self.shrink();
						this.isPressedDown=true;
					}
					else
                    {
						if(buttonLogFlag!=false)
                        cc.log("begin..x="+ locationInNode.x+",y="+locationInNode.y+",s.width="+s.width+",s.height="+ s.height);
                        cc.log("Button onTouchBegan doesn't contain "+self.__instanceId);
					}
				}
				return true;
			},
            //onTouchMoved: null,
            //onTouchEnded: null,
            //onTouchCancelled: null,
            //
			onTouchEnded: function (touch, event) {	
				if(self.isVisible()==true&& self.isDisabled==false)
				{
					if(buttonLogFlag!=false)
                     cc.log("Button onTouchEnded");
					//var nextSceneM=new NextScene();
					var target = event.getCurrentTarget();	
					var touchLocation=touch.getLocation();
					//Get the position of the current point relative to the button
					var locationInNode = target.convertToNodeSpace(touchLocation);	
					var s = target.getContentSize();
					var rect = cc.rect(0, 0, s.width, s.height);
					//Check the click area

					// target.setContentSize();
					if (this.isPressedDown==true&&cc.rectContainsPoint(rect, locationInNode))
					{
						if(buttonLogFlag!=false)
                        cc.log("Button onTouchEnded .x="+ locationInNode.x+",y="+locationInNode.y+",s.width="+s.width+"s.height="+ s.height);
						//cc.log("onTouchEnded");
						//self.unshrink();
						if(self.clickevent!=null)
						{
							self.clickevent();
						}
                        this.isPressedDown=false;
						if(buttonLogFlag!=false)
						cc.log("Button onTouchEnded "+self.__instanceId);
					}
					else
					{
						if(buttonLogFlag!=false)
						cc.log("Button onTouchEnded doesn't contain "+self.__instanceId);
					}
				}
				
			},
            onTouchCancelled:function (touch, event) {
                if(self.isVisible()==true&& self.isDisabled==false)
                {
                    //self.unshrink();
					if(buttonLogFlag!=false)
                    cc.log("Button onTouchCancelled");
                    //var nextSceneM=new NextScene();
                    var target = event.getCurrentTarget();
                    var touchLocation=touch.getLocation();
                    //Get the position of the current point relative to the button
                    var locationInNode = target.convertToNodeSpace(touchLocation);
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    //Check the click area

                    if (this.isPressedDown==true&&!cc.rectContainsPoint(rect, locationInNode))
                    {
						if(buttonLogFlag!=false)
                        cc.log("begin..x="+ locationInNode.x+",y="+locationInNode.y+",s.width="+s.width+"s.height="+ s.height);
                        //cc.log("onTouchEnded");
                       // self.unshrink();
                       //  if(self.clickevent!=null)
                       //  {
                       //      self.clickevent();
                       //  }
                        this.isPressedDown=false;
                    }
                    else
                    {
						if(buttonLogFlag!=false)
                        cc.log("Button onTouchCancelled doesn't contain "+self.__instanceId);
                    }
                }

            },
		});
		
		cc.eventManager.addListener(this.listener, this);
	},
    setDisabled:function(isDisabled)
    {
        this.isDisabled=isDisabled;
    },
	///当按钮按下去的时候，缩小
	shrink:function()
	{
        var self=this;
		var actionNormal=new cc.ScaleTo(0.032,self.scale*0.8,self.scale*0.8);
		this.runAction(actionNormal);
	},

	///当按钮弹起来的时候，放大
	unshrink:function()
	{
        var self=this;
        var actionNormal=new cc.ScaleTo(0.032,self.scale*1.25,self.scale*1.25);
		this.runAction(actionNormal);
	},
});