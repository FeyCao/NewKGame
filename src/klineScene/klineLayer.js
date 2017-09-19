// JavaScript Document
var KlineLayer= BaseGraphLayer.extend({
	upArrowSprites:[],			//向上的箭头的图片
	downArrowSprites:[],		//向下的箭头的图片

	upArrowSpriteIndexs:[],		//向上箭头的图片是在哪个index的位置
	downArrowSpriteIndexs:[],		//向下箭头的图片是在哪个index的位置
	currentCode:null,
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
	setCodeName:function (codeName) {
		this.currentCode = codeName;
    },
	getCodeName:function () {
		return this.currentCode;
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
		cc.log("KlineLayer calculateMaxMinBetweenIndex 计算以前的 start="+start);
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
	//重载
	drawDailyTradeLine:function(candleIndex)
	{
		cc.log("drawDailyTradeLine called index="+candleIndex);
		var lineColor=cc.color(255,255,11,255);	//黄色
		var candleIndexPosXNeedle=this.getCandlePosX_Needle(candleIndex);
		if(this.klineData[candleIndex].avg!=null)
		{
			var lastValue=null;
			var thisValue=candleIndex<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex].avg:this.klineData[candleIndex].avg;
			var lastCandleIndexPosXNeedle=null;

			if(candleIndex>=1)
			{
				lastValue=candleIndex<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex-1].avg:this.klineData[candleIndex-1].avg;
				lastCandleIndexPosXNeedle=this.getCandlePosX_Needle(candleIndex-1);
			}

			if(thisValue!=null)
			{
				var thisValueY=this.getCandlePosYByValue(thisValue);
				var lastValueY=null;

				//graphArea.drawDots([cc.p(candleIndexPosXNeedle,thisValueY)],1,tai.defaultColor);
				if(lastValue==null)
				{
					//画点
					this.graphArea.drawDots([cc.p(candleIndexPosXNeedle,thisValueY)],1,lineColor);
				}
				else
				{
					//画线
					lastValueY=this.getCandlePosYByValue(lastValue);
					//cc.log("lastValueY="+lastValueY.toFixed(2)+" thisValueY="+thisValueY.toFixed(2));
					this.graphArea.drawSegment(cc.p(lastCandleIndexPosXNeedle,lastValueY),cc.p(candleIndexPosXNeedle,thisValueY),0.3,lineColor);
				}
			}
		}

	},
	//重载
	drawOneDailyTradeLine:function(candleIndex)
	{
        cc.log("drawOneDailyTradeLine called index="+candleIndex);
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
	//重载
	drawReFiveDailyTradeLine:function(candleIndex)
	{
		cc.log("drawFiveDailyTradeLine called index="+candleIndex);
		this.graphAreaFive.clear();
		if(candleIndex%5+1==5){
			return;
		}
		var index = parseInt(candleIndex/5);//丢掉小数部分取整
		cc.log("drawReFiveDailyTradeLine called index="+5*index);
		var posX=this.getCandlePosX(5*index)+this.candleWidth/2;//取第1个坐标中心为起始位置
		var posY_O=this.getCandlePosYByValue(this.klineData[5*index].o);
		var posY_C=this.getCandlePosYByValue(this.klineData[candleIndex].c);
		var min = this.klineData[5*index].i;
		var max = this.klineData[5*index].x;
		for(var i=5*index;i<candleIndex;i++){
			min = min<this.klineData[i].i?min:this.klineData[i].i;
			max = max>this.klineData[i].x?max:this.klineData[i].x;
		}
		var posY_X=this.getCandlePosYByValue(max);
		var posY_I=this.getCandlePosYByValue(min);
		var posX_Needle=this.getCandlePosX(5*index+2)+this.candleWidth/2;//中心为第三个柱子的中心

		//cc.log("posx="+posX+" posY_O="+posY_O+" posY_C="+posY_C+" posY_X="+posY_X+" posY_I="+posY_I);

		var origin=cc.p(posX,posY_O<posY_C?posY_O:posY_C);
		var destination=cc.p(2*posX_Needle-posX,origin.y+Math.abs(posY_O-posY_C));

		var frameColor=cc.color(252,0,1,255);		//涨色
		var innerColor=cc.color(252,0,1,255);

		var needleColor=cc.color(145,145,145,255);		//上下影线的颜色



		if(posY_O<posY_C)
		{
			frameColor=cc.color(6,226,0,255);	//跌色
			innerColor=cc.color(6,226,0,255);
		}

		needleColor=frameColor;

		//cc.log("c="+this.klineData[candleIndex].c+" o="+this.klineData[candleIndex].o+" x="+this.klineData[candleIndex].x+" i="+this.klineData[candleIndex].i+" frameColor.r="+frameColor.r+" g="+frameColor.g+" b="+frameColor.b);


		this.graphAreaFive.drawSegment(cc.p(posX_Needle,posY_O>posY_C?posY_O:posY_C),cc.p(posX_Needle,posY_X),0.4*3,needleColor);//上影线
		this.graphAreaFive.drawSegment(cc.p(posX_Needle,posY_I),cc.p(posX_Needle,posY_O<posY_C?posY_O:posY_C),0.4*3,needleColor);//下影线
		this.graphAreaFive.drawRect(origin,destination,innerColor,1,frameColor);		//实体

	},
	//重载
	drawFiveDailyTradeLine:function(candleIndex)
	{
		// cc.log("drawFiveDailyTradeLine called index="+candleIndex);
		if(candleIndex%5+1!=5){
			return;
		}
		var index = candleIndex/5;
		var posX=this.getCandlePosX(candleIndex-4)+this.candleWidth/2;//取第1个坐标中心为起始位置
		cc.log("drawFiveDailyTradeLine called index="+candleIndex-4);
		var posY_O=this.getCandlePosYByValue(this.klineData[candleIndex-4].o);
		var posY_C=this.getCandlePosYByValue(this.klineData[candleIndex].c);
		var min = this.klineData[candleIndex].i;
		var max = this.klineData[candleIndex].x;
		for(var i=1;i<5;i++){
			min = min<this.klineData[candleIndex-i].i?min:this.klineData[candleIndex-i].i;
			max = max>this.klineData[candleIndex-i].x?max:this.klineData[candleIndex-i].x;
		}
		var posY_X=this.getCandlePosYByValue(max);
		var posY_I=this.getCandlePosYByValue(min);
		var posX_Needle=this.getCandlePosX(candleIndex-2)+this.candleWidth/2;//中心为第三个柱子的中心

		//cc.log("posx="+posX+" posY_O="+posY_O+" posY_C="+posY_C+" posY_X="+posY_X+" posY_I="+posY_I);

		var origin=cc.p(posX,posY_O<posY_C?posY_O:posY_C);
		var destination=cc.p(2*posX_Needle-posX,origin.y+Math.abs(posY_O-posY_C));

		var frameColor=cc.color(252,0,1,255);		//涨色
		var innerColor=cc.color(252,0,1,255);

		var needleColor=cc.color(145,145,145,255);		//上下影线的颜色



		if(posY_O<posY_C)
		{
			frameColor=cc.color(6,226,0,255);	//跌色
			innerColor=cc.color(6,226,0,255);
		}

		needleColor=frameColor;

		//cc.log("c="+this.klineData[candleIndex].c+" o="+this.klineData[candleIndex].o+" x="+this.klineData[candleIndex].x+" i="+this.klineData[candleIndex].i+" frameColor.r="+frameColor.r+" g="+frameColor.g+" b="+frameColor.b);


		this.graphArea.drawSegment(cc.p(posX_Needle,posY_O>posY_C?posY_O:posY_C),cc.p(posX_Needle,posY_X),0.4*3,needleColor);//上影线
		this.graphArea.drawSegment(cc.p(posX_Needle,posY_I),cc.p(posX_Needle,posY_O<posY_C?posY_O:posY_C),0.4*3,needleColor);//下影线
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
	setUpArrowIndex:function(index,isOpen)//买
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
		// if()
		var posTem =20;
		var posX=this.getCandlePosX(upArrowSpriteIndex);
		var posY_I=this.getCandlePosYByValue(this.klineData[upArrowSpriteIndex].i);
		var posY_X=this.getCandlePosYByValue(this.klineData[upArrowSpriteIndex].x);
		var posX_Needle=posX+this.candleWidth/2;
		// upArrowSprite.setPosition(posX_Needle,posY_I-upArrowSprite.height*2/3-duplicateCount*upArrowSprite.height);
		var posY_Needle=posY_I-posTem ;

		var klineDataThis=upArrowSpriteIndex<0?this.klineDataPrev[this.klineDataPrev.length+upArrowSpriteIndex]:this.klineData[upArrowSpriteIndex];
		if(klineDataThis.c>klineDataThis.o)
		{
			upArrowSprite.setFlippedY(true);
			// upArrowSprite.setRotation(180);
			posY_Needle=posY_X+posTem;
		}else {
			// upArrowSprite.setRotation(0);
		}
		if(this.lineType==1){
			if(klineDataThis.c>klineDataThis.o)
			{
				posY_Needle =this.getCandlePosYByValue(this.klineData[upArrowSpriteIndex].c)+posTem ;
			}else {
				posY_Needle =this.getCandlePosYByValue(this.klineData[upArrowSpriteIndex].c)-posTem ;
			}

		}
		upArrowSprite.setPosition(posX_Needle,posY_Needle);
	},

	//clearUpArrow:function()
	//{
	//	this.upArrowSprite.setVisible(false);
	//},
	
	///处理向下的箭头
	setDownArrowIndex:function(index,isOpen)//卖
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

		var posTem = 20;//校准
		var posX=this.getCandlePosX(downArrowSpriteIndex);
		var posY_X=this.getCandlePosYByValue(this.klineData[downArrowSpriteIndex].x);
		var posY_I=this.getCandlePosYByValue(this.klineData[downArrowSpriteIndex].i);
		var posX_Needle=posX+this.candleWidth/2;
		var posY_Needle=posY_X+posTem;

		var klineDataThis=downArrowSpriteIndex<0?this.klineDataPrev[this.klineDataPrev.length+downArrowSpriteIndex]:this.klineData[downArrowSpriteIndex];
		if(klineDataThis.c<klineDataThis.o)
		{
			// downArrowSprite.setFlippedY(true);
			downArrowSprite.setRotation(180);
			posY_Needle=posY_I-posTem;
		}else {
			// downArrowSprite.setFlippedY(false);
			// downArrowSprite.setRotation(0);
		}
		if(this.lineType==1){
			if(klineDataThis.c<klineDataThis.o)
			{
				posY_Needle =this.getCandlePosYByValue(this.klineData[downArrowSpriteIndex].c)-posTem ;
			}else {
				posY_Needle =this.getCandlePosYByValue(this.klineData[downArrowSpriteIndex].c)+posTem ;
			}

		}
		downArrowSprite.setPosition(posX_Needle,posY_Needle);
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