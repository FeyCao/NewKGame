// JavaScript Document
function TaisEma(dayCountArray,priceType)
{
	Tais.call(this);		//成员变量的继承
	this.briefName="EMA";
	
	this.dayCountArray=dayCountArray;			//多少天的均线
	if(priceType==undefined || priceType==null)
	{
		this.priceType=0;
	}
	else
	{
		this.priceType=priceType;		//价格类型，如果是0则表示收盘价，1则表示成交量
	}
	this.init();
}

TaisEma.prototype=new Tais();		//成员函数的继承

TaisEma.prototype.init=function()
{
	
	for(var i=0;i<this.dayCountArray.length;i++)
	{
		var tai=new Tai(this,"EMA"+this.dayCountArray[i]);
		var lineColor=null;
		if(i==0)
		{
			lineColor=cc.color(255,255,255,255);	//白色
		}
		else if(i==1)
		{
			lineColor=cc.color(255,255,11,255);	//黄色
		}
		else if(i==2)
		{
			lineColor=cc.color(255,128,255,255);	//粉色
		}
		else if(i==3)
		{
			lineColor=cc.color(0,230,0,255);	//绿色
		}
		else if(i==4)
		{
			lineColor=cc.color(2,226,244,255);	//蓝色
		}
		tai.defaultColor=lineColor;
		this.taiArray.push(tai);
	}
}

//重载
TaisEma.prototype.calculateData=function()
{
	var rawData=[];
	//先将this.klineDataPrev和this.klineData中的数据合并到一起
	if(this.klineDataPrev!=null)
	{
		for(var i=0;i<this.klineDataPrev.length;i++)
		{
			rawData.push(this.priceType==0?this.klineDataPrev[i].c:this.klineDataPrev[i].v);
		}
	}
	for(var i=0;i<this.klineData.length;i++)
	{
		rawData.push(this.priceType==0?this.klineData[i].c:this.klineData[i].v);
	}
	
	//设置一下纯数据，并且计算
	this.setRawDataAndCalculate(rawData,(rawData.length-this.klineData.length));
}


//重载	
TaisEma.prototype.calculateRawData=function(startSaveIndex)
{
	for(var i=0;i<this.taiArray.length;i++)
	{
		var tai=this.taiArray[i];
		var dayCount=this.dayCountArray[i];
		var lastEmaValue=null;
		//cc.log("开始计算EMA数据,dayCount="+dayCount);
		for(var j=0;j<this.rawDataArray.length;j++)
		{
			//公式为f(x)=(2x+(N-1)*f(x'))/(N+1),其中f(x')为上一个周期的值
			var thisEmaValue=null;
			if(lastEmaValue==null)
			{
				thisEmaValue=this.rawDataArray[j];
			}
			else
			{
				thisEmaValue=(2*this.rawDataArray[j]+(dayCount-1)*lastEmaValue)/(dayCount+1);
			}
			lastEmaValue=thisEmaValue;
			if(j>=startSaveIndex)
			{
				var taiPoint=new TaiPoint(thisEmaValue,1); 
				tai.values.push(taiPoint);
			}
			else
			{
				var taiPoint=new TaiPoint(thisEmaValue,1); 
				tai.prevValues.push(taiPoint);
			}
		}
		//cc.log("均线:"+tai.shownName+" 计算完毕");
	}
}

//重载，在某个位置开始画指标
TaisEma.prototype.drawCandle=function(candleIndex)
{
	//重载
	//cc.log("drawCandle candleIndex="+candleIndex);
	var graphArea=this.getGraphArea();
	for(var i=0;i<this.taiArray.length;i++)
	{
		var tai=this.taiArray[i];
		var candleIndexPosXNeedle=this.getCandlePosX_Needle(candleIndex);
		if(tai.isVisible==true)
		{
			var lastValue=null;
			var thisValue=tai.values[candleIndex].value;
			var lastCandleIndexPosXNeedle=null;
			if(candleIndex>=1)
			{
				lastValue=tai.values[candleIndex-1].value;
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
					graphArea.drawDots([cc.p(candleIndexPosXNeedle,thisValueY)],1,tai.defaultColor);
				}
				else
				{
					//画线
					lastValueY=this.getCandlePosYByValue(lastValue);
					//cc.log("lastValueY="+lastValueY.toFixed(2)+" thisValueY="+thisValueY.toFixed(2));
					graphArea.drawSegment(cc.p(lastCandleIndexPosXNeedle,lastValueY),cc.p(candleIndexPosXNeedle,thisValueY),0.3,tai.defaultColor);
				}
			}
		}
	}
}// JavaScript Document