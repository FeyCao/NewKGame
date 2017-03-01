// JavaScript Document
function TaisMacd(param1,param2,param3)
{
	Tais.call(this);		//成员变量的继承
	this.briefName="MACD";
	this.shownName="MACD("+param1+","+param2+","+param3+")";
	this.param1=param1;				//12
	this.param2=param2;				//26
	this.param3=param3;				//9
	
	this.macdUpColor=cc.color(255,0,0,255);
	this.macdDownColor=cc.color(0,255,0,255);
	this.init();
}

TaisMacd.prototype=new Tais();		//成员函数的继承

TaisMacd.prototype.init=function()
{
	this.emaTais=new TaisEma([this.param1,this.param2],0);
}

//重载
TaisMacd.prototype.calculateData=function()
{
	//先计算DIFF
	var diffTai=new Tai(this,"DIFF");
	diffTai.defaultColor=cc.color(255,255,255,255);
	
	var closeRawData=[];
	//先将this.klineDataPrev和this.klineData中的数据合并到一起
	if(this.klineDataPrev!=null)
	{
		for(var i=0;i<this.klineDataPrev.length;i++)
		{
			closeRawData.push(this.klineDataPrev[i].c);
		}
	}
	for(var i=0;i<this.klineData.length;i++)
	{
		closeRawData.push(this.klineData[i].c);
	}
	
	//这里将整个数据全部设置到emaTais中去，包括当前的数据和前面一幅图的数据
	this.emaTais.setRawDataAndCalculate(closeRawData,0);
	
	var shortEma=this.emaTais.taiArray[0];
	var longEma=this.emaTais.taiArray[1];
	
	var deaRawData=[];
	for(var i=0;i<closeRawData.length;i++)
	{
		var diffValue=shortEma.values[i].value-longEma.values[i].value;
		if(this.klineDataPrev!=null)
		{
			if(i>=this.klineDataPrev.length)
			{
				diffTai.values.push(new TaiPoint(diffValue,1));
			}
			else
			{
				diffTai.prevValues.push(new TaiPoint(diffValue,1));
			}
		}
		else
		{
			diffTai.values.push(new TaiPoint(diffValue,1));
		}
		deaRawData.push(diffValue);
	}
	
	//再计算DEA
	var deaTais=new TaisEma([this.param3],1);
	deaTais.setRawDataAndCalculate(deaRawData,closeRawData.length-this.klineData.length);
	
	var deaTai=new Tai(this,"DEA");
	deaTai.defaultColor=cc.color(255,255,11,255);
	
	
	var macdTai=new Tai(this,"MACD");

	this.taiArray.push(macdTai);
	this.taiArray.push(diffTai);
	this.taiArray.push(deaTai);
	
	//最后计算MACD
	for(var i=0;i<deaTais.taiArray[0].values.length;i++)
	{
		deaTai.values.push(new TaiPoint(deaTais.taiArray[0].values[i].value,1)); 
		var macdValue=2*(diffTai.values[i].value-deaTais.taiArray[0].values[i].value);
		
		var macdTaiPoint=new TaiPoint(macdValue,-1);
		if(macdValue>0)
		{
			macdTaiPoint.color=this.macdUpColor;
		}
		else if(macdValue<0)
		{
			macdTaiPoint.color=this.macdDownColor;
		}
		macdTai.values.push(macdTaiPoint); 
	}
	
	for(var i=0;i<deaTais.taiArray[0].prevValues.length;i++)
	{
		deaTai.prevValues.push(new TaiPoint(deaTais.taiArray[0].prevValues[i].value,1)); 
		var macdValue=2*(diffTai.prevValues[i].value-deaTais.taiArray[0].prevValues[i].value);
		
		var macdTaiPoint=new TaiPoint(macdValue,-1);
		if(macdValue>0)
		{
			macdTaiPoint.color=this.macdUpColor;
		}
		else if(macdValue<0)
		{
			macdTaiPoint.color=this.macdDownColor;
		}
		macdTai.prevValues.push(macdTaiPoint); 
	}
}

//重载，在某个位置开始画指标
TaisMacd.prototype.drawCandle=function(candleIndex)
{
	var graphArea=this.getGraphArea();
	for(var i=0;i<this.taiArray.length;i++)
	{
		var tai=this.taiArray[i];
		var candleIndexPosXNeedle=this.getCandlePosX_Needle(candleIndex);
		if(tai.isVisible==true)
		{
			var lastTaiPoint=null;
			var thisTaiPoint=candleIndex<0?tai.prevValues[tai.prevValues.length+candleIndex]:tai.values[candleIndex];

			var lastCandleIndexPosXNeedle=null;
			if(thisTaiPoint.pointType==1)
			{
				if(this.parentLayer.getHistoryCandleIndexByPageIndex()!=candleIndex)
				{
					if(candleIndex>=1)
					{
						lastTaiPoint=tai.values[candleIndex-1];
						lastCandleIndexPosXNeedle=this.getCandlePosX_Needle(candleIndex-1);
					}
					else if(tai.prevValues.length!=0)
					{
						lastTaiPoint=tai.prevValues[candleIndex-1+tai.prevValues.length];
						lastCandleIndexPosXNeedle=this.getCandlePosX_Needle(candleIndex-1);
					}	
				}
				
				if(thisTaiPoint!=null)
				{
					var thisValueY=this.getCandlePosYByValue(thisTaiPoint.value);
					var lastValueY=null;
					
					//graphArea.drawDots([cc.p(candleIndexPosXNeedle,thisValueY)],1,tai.defaultColor);
					if(lastTaiPoint==null)
					{
						//画点
						graphArea.drawDots([cc.p(candleIndexPosXNeedle,thisValueY)],1,tai.defaultColor);
					}
					else
					{
						//画线
						lastValueY=this.getCandlePosYByValue(lastTaiPoint.value);
						//cc.log("lastValueY="+lastValueY.toFixed(2)+" thisValueY="+thisValueY.toFixed(2));
						graphArea.drawSegment(cc.p(lastCandleIndexPosXNeedle,lastValueY),cc.p(candleIndexPosXNeedle,thisValueY),0.3,tai.defaultColor);
					}
				}
			}
			else if(thisTaiPoint.pointType==-1)
			{
				//画柱
				//先得到0轴的位置
				var zeroY=this.getCandlePosYByValue(0);
				var thisValueY=this.getCandlePosYByValue(thisTaiPoint.value);
				graphArea.drawSegment(cc.p(candleIndexPosXNeedle,zeroY),cc.p(candleIndexPosXNeedle,thisValueY),0.4,thisTaiPoint.color);
			}
		}
	}
}


//重载，需要计算指标的最大最小值，使最大最小值对称
TaisMacd.prototype.calculateMaxMinAtIndex=function(index)
{
	//重载
	var maxValue=this.getMaxValue();
	var minValue=this.getMinValue();
	for(var i=0;i<this.taiArray.length;i++)
	{
		var tai=this.taiArray[i];
		var taiPoint=index<0?tai.prevValues[tai.prevValues.length+index]:tai.values[index];
		if(taiPoint!=null && taiPoint.value!=null)
		{
			if(maxValue==null)
			{
				maxValue=taiPoint.value;
			}
			else if(maxValue<taiPoint.value)
			{
				maxValue=taiPoint.value;
			}
			if(minValue==null)
			{
				minValue=taiPoint.value;
			}
			else if(minValue>taiPoint.value)
			{
				minValue=taiPoint.value;
			}
		}
	}
	//平均化
	if(Math.abs(maxValue)>Math.abs(minValue))
	{
		minValue=-maxValue;
	}
	else if(Math.abs(maxValue)<Math.abs(minValue))
	{
		maxValue=-minValue;
	}
	
	
	if(maxValue!=null)
	{
		this.setMaxValue(maxValue);
	}
	if(minValue!=null)
	{
		this.setMinValue(minValue);
	}
}

//重载，计算最大最小值，直到位置index,使最大最小值对称
TaisMacd.prototype.calculateMaxMinBetweenIndex=function(start,end)
{
	//重载
	var maxValue=this.getMaxValue();
	var minValue=this.getMinValue();
	for(var i=0;i<this.taiArray.length;i++)
	{
		var tai=this.taiArray[i];
		
		if(start<0)
		{
			start=tai.prevValues.length+start;
			var tempEnd=tai.prevValues.length;
			if(end<0)
			{
				tempEnd=tai.prevValues.length+end+1;
			}
			for(var j=start;j<tempEnd;j++)
			{
				var taiPoint=tai.prevValues[j];
				if(maxValue==null)
				{
					maxValue=taiPoint.value;
				}
				else if(maxValue<taiPoint.value)
				{
					maxValue=taiPoint.value;
				}
				if(minValue==null)
				{
					minValue=taiPoint.value;
				}
				else if(minValue>taiPoint.value)
				{
					minValue=taiPoint.value;
				}
			}
			start=0;
		}
		
		for(var j=start;j<=end;j++)
		{
			var taiPoint=tai.values[j];
			if(taiPoint!=null && taiPoint.value!=null)
			{
				if(maxValue==null)
				{
					maxValue=taiPoint.value;
				}
				else if(maxValue<taiPoint.value)
				{
					maxValue=taiPoint.value;
				}
				if(minValue==null)
				{
					minValue=taiPoint.value;
				}
				else if(minValue>taiPoint.value)
				{
					minValue=taiPoint.value;
				}
			}
		}
	}
	
	//平均化
	if(Math.abs(maxValue)>Math.abs(minValue))
	{
		minValue=-maxValue;
	}
	else if(Math.abs(maxValue)<Math.abs(minValue))
	{
		maxValue=-minValue;
	}
	
	
	if(maxValue!=null)
	{
		this.setMaxValue(maxValue);
	}
	if(minValue!=null)
	{
		this.setMinValue(minValue);
	}
}