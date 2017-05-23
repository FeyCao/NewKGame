// JavaScript Document
var KlineLayer= BaseGraphLayer.extend({
	upArrowSprites:[],			//向上的箭头的图片
	downArrowSprites:[],		//向下的箭头的图片

	upArrowSpriteIndexs:[],		//向上箭头的图片是在哪个index的位置
	downArrowSpriteIndexs:[],		//向下箭头的图片是在哪个index的位置

	ctor:function(width,height)
	{
		this._super(width,height);
	},
	
	onEnter:function () 
	{
		this._super();
		this.clearUpDownArrows();
	},
	onExit:function ()
	{
		this._super();
		this.clearUpDownArrows();
	},
	//如果最大最小改变了，则需要重新绘制之前的蜡烛
	calculateMaxMinAtIndex:function(index)
	{
		var prevClose=this.getFirstPrevClose();
		cc.log("calculateMaxMinAtIndex before index="+index+" this.maxValue="+this.maxValue+", this.minValue="+this.minValue);
		if(prevClose==0)
		{
			//如果不存在昨收，则取开盘价
			prevClose=this.klineData[0].o;
		}
		if(this.minValue==null || this.maxValue==null)
		{
			this.minValue=prevClose*0.95;
			this.maxValue=prevClose*1.05;
		}
		var thisX=index<0?this.klineDataPrev[this.klineDataPrev.length+index].x:this.klineData[index].x;
		var thisI=index<0?this.klineDataPrev[this.klineDataPrev.length+index].i:this.klineData[index].i;
		if(thisX>=this.maxValue)
		{
			this.maxValue=thisX;
		}
		if(thisI<=this.minValue)
		{
			this.minValue=thisI;
		}
		cc.log("calculateMaxMinAtIndex index="+index+" this.maxValue="+this.maxValue+", this.minValue="+this.minValue);
	},
	
	//计算最大最小值，直到位置index
	calculateMaxMinBetweenIndex:function(start,end)
	{
		//重载
		
		if(start<0)
		{
			start=this.klineDataPrev.length+start;
			cc.log("calculateMaxMinBetweenIndex 计算以前的 start="+start);
			
			this.minValue=this.klineDataPrev[start].c;
			this.maxValue=this.klineDataPrev[start].c;
			
			var tempEnd=this.klineDataPrev.length;
			if(end<0)
			{
				tempEnd=this.klineDataPrev.length+end+1;
			}
			for(var i=start;i<tempEnd;i++)
			{
				if(this.klineDataPrev[i].x>this.maxValue)
				{
					//cc.log("max this.klineDataPrev["+i+"].x="+this.klineDataPrev[i].x);
					this.maxValue=this.klineDataPrev[i].x;
				}
				if(this.klineDataPrev[i].i<this.minValue)
				{
					//cc.log("min this.klineDataPrev["+i+"].i="+this.klineDataPrev[i].i);
					this.minValue=this.klineDataPrev[i].i;
				}
			}
			start=0;
		}
		else
		{
			this.minValue=this.klineData[start].c;
			this.maxValue=this.klineData[start].c;
		}
		
		
		
		for(var i=start;i<=end;i++)
		{
			if(this.klineData[i].x>this.maxValue)
			{
				cc.log("max this.klineData["+i+"].x="+this.klineData[i].x);
				this.maxValue=this.klineData[i].x;
			}
			if(this.klineData[i].i<this.minValue)
			{
				cc.log("min this.klineData["+i+"].i="+this.klineData[i].i);
				this.minValue=this.klineData[i].i;
			}
		}
		//cc.log("calculateMaxMinBetweenIndex start="+start+" end="+end+", this.maxValue="+this.maxValue+", this.minValue="+this.minValue);
	},
	
	//重载
	drawCandle:function(candleIndex)
	{
		//cc.log("drawCandle called index="+candleIndex);
		
		//开始画this.currentCandleIndex
		var posX=this.getCandlePosX(candleIndex);
		var posY_O=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].o):this.getCandlePosYByValue(this.klineData[candleIndex].o);
		var posY_C=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].c):this.getCandlePosYByValue(this.klineData[candleIndex].c);
		var posY_X=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].x):this.getCandlePosYByValue(this.klineData[candleIndex].x);
		var posY_I=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].i):this.getCandlePosYByValue(this.klineData[candleIndex].i);
		var posX_Needle=posX+this.candleWidth/2;
		
		//cc.log("posx="+posX+" posY_O="+posY_O+" posY_C="+posY_C+" posY_X="+posY_X+" posY_I="+posY_I);
		
		var origin=cc.p(posX,posY_O<posY_C?posY_O:posY_C);
		var destination=cc.p(origin.x+this.candleWidth,origin.y+Math.abs(posY_O-posY_C));
		
		var frameColor=cc.color(252,0,1,255);		//涨色
		var innerColor=cc.color(252,0,1,255);
		
		var needleColor=cc.color(145,145,145,255);		//上下影线的颜色
		
		//cc.log("candleIndex="+candleIndex);
		var klineDataThis=candleIndex<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex]:this.klineData[candleIndex];
		var klineDataPrev=null;
		if(candleIndex!=0 || this.klineDataPrev!=null)
		{
			klineDataPrev=(candleIndex-1)<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex-1]:this.klineData[candleIndex-1];
		}
		
		if(klineDataThis.c<klineDataThis.o)
		{
			frameColor=cc.color(6,226,0,255);	//跌色
			innerColor=cc.color(6,226,0,255);
		}
		else if(klineDataThis.c==klineDataThis.o)
		{
			if(klineDataPrev!=null)
			{
				if(klineDataThis.c<klineDataPrev.c)
				{
					frameColor=cc.color(6,226,0,255);	//跌色
					innerColor=cc.color(6,226,0,255);
				}
			}
		}
		
		
		needleColor=frameColor;
		
		//cc.log("c="+this.klineData[candleIndex].c+" o="+this.klineData[candleIndex].o+" x="+this.klineData[candleIndex].x+" i="+this.klineData[candleIndex].i+" frameColor.r="+frameColor.r+" g="+frameColor.g+" b="+frameColor.b);
		
		
		this.graphArea.drawSegment(cc.p(posX_Needle,posY_O>posY_C?posY_O:posY_C),cc.p(posX_Needle,posY_X),0.4,needleColor);//上影线
		this.graphArea.drawSegment(cc.p(posX_Needle,posY_I),cc.p(posX_Needle,posY_O<posY_C?posY_O:posY_C),0.4,needleColor);//下影线
		this.graphArea.drawRect(origin,destination,innerColor,1,frameColor);		//实体
	},

	//画出相反色柱图
	drawOppositeCandle:function(candleIndex)
	{
		//cc.log("drawCandle called index="+candleIndex);

		//开始画this.currentCandleIndex
		var posX=this.getCandlePosX(candleIndex);
		var posY_O=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].o):this.getCandlePosYByValue(this.klineData[candleIndex].o);
		var posY_C=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].c):this.getCandlePosYByValue(this.klineData[candleIndex].c);
		var posY_X=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].x):this.getCandlePosYByValue(this.klineData[candleIndex].x);
		var posY_I=candleIndex<0?this.getCandlePosYByValue(this.klineDataPrev[this.klineDataPrev.length+candleIndex].i):this.getCandlePosYByValue(this.klineData[candleIndex].i);
		var posX_Needle=posX+this.candleWidth/2;

		//cc.log("posx="+posX+" posY_O="+posY_O+" posY_C="+posY_C+" posY_X="+posY_X+" posY_I="+posY_I);

		var origin=cc.p(posX,posY_O<posY_C?posY_O:posY_C);
		var destination=cc.p(origin.x+this.candleWidth,origin.y+Math.abs(posY_O-posY_C));

		var frameColor=cc.color(252,0,1,255);		//涨色
		var innerColor=cc.color(252,0,1,255);

		var needleColor=cc.color(145,145,145,255);		//上下影线的颜色

		//cc.log("candleIndex="+candleIndex);
		var klineDataThis=candleIndex<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex]:this.klineData[candleIndex];
		var klineDataPrev=null;
		if(candleIndex!=0 || this.klineDataPrev!=null)
		{
			klineDataPrev=(candleIndex-1)<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex-1]:this.klineData[candleIndex-1];
		}

		if(klineDataThis.c>klineDataThis.o)
		{
			frameColor=cc.color(6,226,0,255);	//跌色
			innerColor=cc.color(6,226,0,255);
		}
		else if(klineDataThis.c==klineDataThis.o)
		{
			if(klineDataPrev!=null)
			{
				if(klineDataThis.c>klineDataPrev.c)
				{
					frameColor=cc.color(6,226,0,255);	//跌色
					innerColor=cc.color(6,226,0,255);
				}
			}
		}else{
			frameColor=cc.color(252,0,1,255);		//涨色
			innerColor=cc.color(252,0,1,255);
		}


		needleColor=frameColor;

		//cc.log("c="+this.klineData[candleIndex].c+" o="+this.klineData[candleIndex].o+" x="+this.klineData[candleIndex].x+" i="+this.klineData[candleIndex].i+" frameColor.r="+frameColor.r+" g="+frameColor.g+" b="+frameColor.b);


		this.graphArea.drawSegment(cc.p(posX_Needle,posY_O>posY_C?posY_O:posY_C),cc.p(posX_Needle,posY_X),0.4,needleColor);//上影线
		this.graphArea.drawSegment(cc.p(posX_Needle,posY_I),cc.p(posX_Needle,posY_O<posY_C?posY_O:posY_C),0.4,needleColor);//下影线
		this.graphArea.drawRect(origin,destination,innerColor,1,frameColor);		//实体
	},

	///处理向上的箭头
	setUpArrowIndex:function(index,isOpen)
	{
		 index=index-1;
		 var upArrowSprite=null;
		 if(isOpen==true)
		 {
	 		upArrowSprite=cc.Sprite.create("res/buyOpenTag.png");
		 }
		 else
		 {
			 upArrowSprite=cc.Sprite.create("res/buyCloseTag.png");
		 }
		 
		 upArrowSprite.setPosition(0,0);
		 this.graphArea.addChild(upArrowSprite, 10);		
		 
		 this.upArrowSprites.push(upArrowSprite);
 		 this.upArrowSpriteIndexs.push(index);
		 
		 this.moveUpArrowToItsPosition(this.upArrowSpriteIndexs.length-1);
	},
	
	moveAllUpArrowToItsPosition:function()
	{
		for(var i=0;i<this.upArrowSpriteIndexs.length;i++)
		{
			this.moveUpArrowToItsPosition(i);
		}
	},
	
	moveUpArrowToItsPosition:function(arrayIndex)
	{
		var upArrowSpriteIndex=this.upArrowSpriteIndexs[arrayIndex];
		var upArrowSprite=this.upArrowSprites[arrayIndex];
		
		var duplicateCount=0;
		for(var j=arrayIndex-1;j>=0;j--)
		{
			if(this.upArrowSpriteIndexs[arrayIndex]==this.upArrowSpriteIndexs[j])
			{
				duplicateCount=duplicateCount+1;
			}
			else
			{
				break;
			}
		}
		
		var posX=this.getCandlePosX(upArrowSpriteIndex);
		var posY_I=this.getCandlePosYByValue(this.klineData[upArrowSpriteIndex].i);
		var posX_Needle=posX+this.candleWidth/2;
		upArrowSprite.setPosition(posX_Needle,posY_I-upArrowSprite.height*2/3-duplicateCount*upArrowSprite.height);
	},

	//clearUpArrow:function()
	//{
	//	this.upArrowSprite.setVisible(false);
	//},
	
	///处理向下的箭头
	setDownArrowIndex:function(index,isOpen)
	{
		 index=index-1;
		 var downArrowSprite=null;
		 if(isOpen==true)
		 {
	 		 downArrowSprite=cc.Sprite.create("res/sellOpenTag.png");
		 }
		 else
		 {
			 downArrowSprite=cc.Sprite.create("res/sellCloseTag.png");
		 }
		 downArrowSprite.setPosition(0,0);
		 this.graphArea.addChild(downArrowSprite, 10);		
		 
		 this.downArrowSprites.push(downArrowSprite);
 		 this.downArrowSpriteIndexs.push(index);
		 this.moveDownArrowToItsPosition(this.downArrowSpriteIndexs.length-1);
	},
	
	moveAllDownArrowToItsPosition:function()
	{
		for(var i=0;i<this.downArrowSpriteIndexs.length;i++)
		{
			this.moveDownArrowToItsPosition(i);
		}
	},
	
	moveDownArrowToItsPosition:function(arrayIndex)
	{
		var downArrowSpriteIndex=this.downArrowSpriteIndexs[arrayIndex];
		var downArrowSprite=this.downArrowSprites[arrayIndex];
		
		var duplicateCount=0;
		for(var j=arrayIndex-1;j>=0;j--)
		{
			if(this.downArrowSpriteIndexs[arrayIndex]==this.downArrowSpriteIndexs[j])
			{
				duplicateCount=duplicateCount+1;
			}
			else
			{
				break;
			}
		}
		
		var posX=this.getCandlePosX(downArrowSpriteIndex);
		var posY_X=this.getCandlePosYByValue(this.klineData[downArrowSpriteIndex].x);
		var posX_Needle=posX+this.candleWidth/2;
		downArrowSprite.setPosition(posX_Needle,posY_X+downArrowSprite.height*2/3+duplicateCount*downArrowSprite.height);
	},
	
	//重载，当重画后，可能需要重画除了K线，技术指标之外的其余内容，比如买入卖出标记等，给派生类自己实现
	redrawExceptCandles:function()
	{
		//还需要画买入卖出的标志
		this.moveAllUpArrowToItsPosition();
		this.moveAllDownArrowToItsPosition();
	},
	
	clearUpDownArrows:function()
	{
		for(var i=0;i<this.upArrowSprites.length;i++)
		{
			this.upArrowSprites[i].removeFromParent(true);
		}
		this.upArrowSprites=[];
		this.upArrowSprites.length=0;
		for(var i=0;i<this.downArrowSprites.length;i++)
		{
			this.downArrowSprites[i].removeFromParent(true);
		}
		this.downArrowSprites=[];
		this.downArrowSprites.length=0;
		this.upArrowSpriteIndexs=[];		//向上箭头的图片是在哪个index的位置
		this.upArrowSpriteIndexs.length=0;
		this.downArrowSpriteIndexs=[];		//向下箭头的图片是在哪个index的位置
		this.downArrowSpriteIndexs.length=0;
		cc.log("clearUpDownArrows");
	},
});