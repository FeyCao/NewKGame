// JavaScript Document
var VolumnTechLayer= BaseGraphLayer.extend({
	barMaxScale:1.05,				//最大的成交量的柱状图的放大倍数
    currentCode:null,
	ctor:function(width,height)
	{
		this._super(width,height);
	},
	
	onEnter:function () 
	{
		this._super();
	},

    setCodeName:function (codeName) {
        this.currentCode = codeName;
    },
    getCodeName:function () {
        return this.currentCode;
    },
	//是否可以显示成交量
	canVolumnShown:function()
	{
		if(this.taisArray==null) return true;
		var bCanshow=true;
		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].isEnabled && this.taisArray[i].briefName!="MA")
			{
				bCanshow=false;
				break;
			}
		}
		return bCanshow;
	},

	
	//如果最大最小改变了，则需要重新绘制之前的蜡烛
	calculateMaxMinAtIndex:function(index)
	{
		if(this.canVolumnShown()==true)
		{
			if(this.maxValue==null)
			{
				this.maxValue=index<0?this.klineDataPrev[this.klineDataPrev.length+index].v:this.klineData[index].v;
			}
			else
			{
				if((index<0?this.klineDataPrev[this.klineDataPrev.length+index].v:this.klineData[index].v)>=this.maxValue)
				{
					this.maxValue=(index<0?this.klineDataPrev[this.klineDataPrev.length+index].v:this.klineData[index].v)*this.barMaxScale;
				}
			}
			this.minValue=0;
		}
	},
	
	//计算最大最小值，直到位置index
	calculateMaxMinBetweenIndex:function(start,end)
	{
		cc.log("volumnTechLayer calculateMaxMinBetweenIndex 计算以前的 start="+start);
		if(this.canVolumnShown()==true)
		{
			this.maxValue=0;
			
			if(start<0)
			{
				start=this.klineDataPrev.length+start;
				var tempEnd=this.klineDataPrev.length;
				if(end<0)
				{
					tempEnd=this.klineDataPrev.length+end+1;
				}
				for(var i=start;i<tempEnd;i++)
				{
					if(this.klineDataPrev[i].v>this.maxValue)
					{
						this.maxValue=this.klineDataPrev[i].v;
					}
				}
				start=0;
			}

            for(var i=start;i<=end&&null!=this.klineData[i];i++)
			{
				if(this.klineData[i].v>this.maxValue)
				{
					this.maxValue=this.klineData[i].v;
				}
			}
			this.maxValue=this.maxValue*this.barMaxScale;
			this.minValue=0;
		}
	},
	drawCandle:function(candleIndex)
	{
		//cc.log("---------------drawCandle for volumn candleIndex="+candleIndex);
		//重载		
		if(this.canVolumnShown()==true)
		{
			var posX=this.getCandlePosX_Needle(candleIndex);
			var posY_V=this.getCandlePosYByValue(candleIndex<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex].v:this.klineData[candleIndex].v);
			
			var origin=cc.p(posX-this.candleWidth/2,0);
			var destination=cc.p(posX+this.candleWidth/2,posY_V);
			
			var barColor=cc.color(252,0,1,255);
			
			var klineDataThis=candleIndex<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex]:this.klineData[candleIndex];
			var klineDataPrev=null;
			if(candleIndex!=0 || this.klineDataPrev!=null)
			{
				klineDataPrev=(candleIndex-1)<0?this.klineDataPrev[this.klineDataPrev.length+candleIndex-1]:this.klineData[candleIndex-1];
			}
			
			if(klineDataThis.c<klineDataThis.o)
			{
				barColor=cc.color(6,226,0,255);	//跌色
			}
			else if(klineDataThis.c==klineDataThis.o)
			{
				if(klineDataPrev!=null)
				{
					if(klineDataThis.c<klineDataPrev.c)
					{
						barColor=cc.color(6,226,0,255);	//跌色
					}
				}
			}
			
			this.graphArea.drawRect(origin,destination,barColor,1,barColor);		//实体
		}
	},
	//重载
	drawFiveDailyTradeLine:function(candleIndex)
	{
		cc.log("drawFiveDailyTradeLine called index="+candleIndex);
		if(candleIndex%5+1!=5){
			return;
		}
		var index = candleIndex/5;
		if(this.canVolumnShown()==true)
		{
			var posX=this.getCandlePosX(candleIndex-3);//取第二个坐标为起始位置
			var posY_V=0;
			for(var i=0;i<5;i++){
				posY_V += this.klineData[candleIndex-i].v;
			}
			var posX_Needle=this.getCandlePosX(candleIndex-2)+this.candleWidth/2;//中心为第三个柱子的中心
			var origin=cc.p(posX,0);
			var destination=cc.p(2*posX_Needle-posX+this.candleWidth/2,posY_V);

			var barColor=cc.color(252,0,1,255);

			var posY_O=this.getCandlePosYByValue(this.klineData[candleIndex-4].v);
			var posY_C=this.getCandlePosYByValue(this.klineData[candleIndex].v);
			if(posY_O<posY_C)
			{
				barColor=cc.color(6,226,0,255);	//跌色
			}

			this.graphArea.drawRect(origin,destination,barColor,1,barColor);		//实体
		}

	},

});