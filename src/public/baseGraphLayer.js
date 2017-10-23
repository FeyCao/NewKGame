// JavaScript Document
var BaseGraphLayer= cc.Layer.extend({
		
	graphArea:null,				//画线的区域，并非整个区域，上面还是指标数字等显示
	graphAreaFive:null,				//5分钟变化K线区域

	topIndexAreaHeight:20,		//顶部显示指标数组的区域的高度
	
	lblTaisInfos:null,			//指标的数值的区域，还有颜色信息等
	candleWidth:null,			//蜡烛宽度
	candleGapWidth:null,		//蜡烛间距离
	dailyTradeGapWidth:null,		//分时线距离
	barvsgapratio:1,			//蜡烛宽度和蜡烛间距离的比值
	
	klineData:null,				//K线数据，一个数组，数组中存放的是开高低收量
	klineDataPrev:null,			//前面日期的K线数据，
	
	maxValue:null,				//这个图上的最大值
	minValue:null,				//这个图上的最小值

	taisArray:null,				//当前指标，可能没有，也可能有多个
	taisInfoLabelArray:null,	//当前所有的指标Label
	
	clickevent:null,			//这个层按下的回调函数
	
	pageIndex:null,				//主游戏界面是分页的，这个表示当前是第几页
	maxCandleCountPerPage:null,	//每一页上最多多少个蜡烛数
	historyCandleCount:null,	//每一页上前面的历史蜡烛线的个数
	lineType:0,//分时线为1,1k线为2,5k线为3

	ctor:function(width,height)
	{
		this._super();
		this.width=width;
		this.height=height;
		this.taisArray=[];
		cc.log("KLine this.width="+this.width+"this.height="+this.height);
		//this.maxCandleCountPerPage=60;
		//this.historyCandleCount=10;
		//this.pageIndex=0;
		this.maxCandleCountPerPage=60;
		this.historyCandleCount=0;
		this.pageIndex=0;
	},
	
	onEnter:function () 
	{
		this._super();
		this.graphArea=new cc.DrawNodeCanvas();
		//设置K线图的区域
		this.graphArea.setPosition(cc.p(0,0));
		this.graphArea.width=this.width;
		this.graphArea.height=this.height-this.topIndexAreaHeight;
		this.addChild(this.graphArea, 5);
		this.graphAreaFive=new cc.DrawNodeCanvas();
		//设置5分钟K线图的区域
		this.graphAreaFive.setPosition(cc.p(0,0));
		this.graphAreaFive.width=this.width;
		this.graphAreaFive.height=this.height-this.topIndexAreaHeight;
		this.addChild(this.graphAreaFive, 5);
		this.drawAreaBorder();
		
		this.taisInfoLabelArray=[];
		
		this.calculateCandleWidth();
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
				if(self.isVisible()==true)
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
						cc.log("onTouchBegan");
					}
					else
					{
	
					}
				}
				return true;
			},
			
			onTouchEnded: function (touch, event) {	
				if(self.isVisible()==true)
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
						cc.log("onTouchEnded");
						if(self.clickevent!=null)
						{
							self.clickevent();
						}
					}
					else
					{
	
					}
				}
				
			},
		});
		
		cc.eventManager.addListener(this.listener, this);
	},
	
	//给这个图设置K线数据
	setKLineData:function(klineData,klineDataPrev)
	{
		// cc.log("basegraphlayer setKLineData instanceid="+this.__instanceid+" klineData="+klineData+" klineDataPrev="+klineDataPrev);
		this.klineData=klineData;
		this.maxValue=null;
		this.minValue=null;
		if(this.klineData!=null){
			this.maxCandleCountPerPage = this.klineData.length;
		}

		cc.log("this.maxCandleCountPerPage=="+this.maxCandleCountPerPage);
		if(klineDataPrev!=undefined)
		{
			this.klineDataPrev=klineDataPrev;
			this.barvsgapratio=2;
		}
		else
		{
			this.klineDataPrev=null;
			this.barvsgapratio=1;
		}

		if(this.graphArea!=null)
		{
			this.graphArea.clear();
		}
		if(this.klineData==null)
		{
			//清除所有数据
			for(var i=0;i<this.taisInfoLabelArray.length;i++)
			{
				this.taisInfoLabelArray[i].setVisible(false);
			}

			this.clearKLineDataForTais();
		}
		else
		{
			this.calculateCandleWidth();
			//如果有指标，需要给指标设置数据
			this.setKLineDataForTais();
		}

		var totalCandleCount=this.klineData.length;
		cc.log("totalCandleCount=="+totalCandleCount);
		// if(totalCandleCount>240)
		// {
		// 	this.width *=totalCandleCount/240;
		// }

	},
	getKlineData:function () {

		return this.klineData;
    },
	clearKLineDataForTais:function()
	{
		for(var i=0;i<this.taisArray.length;i++)
		{
			this.taisArray[i].klineData=null;
			this.taisArray[i].klineDataPrev=null;
		}
	},
	
	//将klineData和klineDataPrev的内容设置到指标中
	setKLineDataForTais:function()
	{
		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].isEnabled==true)
			{
				this.taisArray[i].setKlineData(this.klineData,this.klineDataPrev);
			}
		}
	},
	
	getFirstPrevClose:function()
	{
		if(this.klineDataPrev==null) return 0;
		return this.klineDataPrev[this.klineDataPrev.length-1].c;
	},
	
	drawAreaBorder:function()
	{
		 //给这个矩形区域添加红色的边框
		 //this.graphArea.drawRect(cc.p(0,0),cc.p(this.graphArea.width, this.graphArea.height),cc.color(0,0,0,0),1,cc.color(0,255,255,255));
		 //this.graphArea.drawRect(cc.p(0,0),cc.p(this.width, this.height),cc.color(0,0,0,0),1,cc.color(255,255,255,255));
	},
	
	///计算蜡烛的宽度和蜡烛之间的距离
	calculateCandleWidth:function()
	{
		if(this.graphArea!=null && this.klineData!=null)
		{
			if(this.klineDataPrev==null)
			{
				var length = this.klineData.length>180?240:this.klineData.length;
				cc.log("var length=",length);
				this.candleGapWidth=(this.graphArea.width)/(1+length*(this.barvsgapratio+1));
 				this.candleWidth=this.candleGapWidth*this.barvsgapratio;
			}
			else
			{
				this.candleGapWidth=(this.graphArea.width)/(1+this.maxCandleCountPerPage*(this.barvsgapratio+1));
				this.candleWidth=this.candleGapWidth*this.barvsgapratio;
				cc.log("this.candleGapWidth="+this.candleGapWidth+" this.candleWidth="+this.candleWidth);
			}
		}
	},
	

	
	//得到当前页面中历史蜡烛的个数
	getHistoryCandleCountByPageIndex:function()
	{
		if(this.klineDataPrev==null) return 0;
		if(this.historyCandleCount==0) return 0;		//注意：这段话只是为了适配老版本
		//pageIndex
		
		var remaining=this.klineData.length%(this.maxCandleCountPerPage-this.historyCandleCount);
		var pageCount=(this.klineData.length-remaining)/(this.maxCandleCountPerPage-this.historyCandleCount);
		if(remaining!=0)
		{
			pageCount=pageCount+1;
		}
		cc.log("pageCount="+pageCount+" remaining="+remaining);
		if(this.pageIndex!=pageCount-1)
		{
			return this.historyCandleCount;
		}
		return this.maxCandleCountPerPage-remaining;
	},
	
	//得到当前页面中历史蜡烛的索引，可能返回值为负数，如果为负数则表示历史蜡烛的索引是在klineDataPrev中
	getHistoryCandleIndexByPageIndex:function()
	{
		//cc.log("getHistoryCandleIndexByPageIndex="+this.getHistoryCandleCountByPageIndex());
		var historyCandleCount=this.getHistoryCandleCountByPageIndex();
		var ret=this.pageIndex*(this.maxCandleCountPerPage-this.historyCandleCount)-historyCandleCount;
		//cc.log("this.pageIndex="+this.pageIndex+" ret="+ret);
		return ret;
	},
	
	//根据蜡烛的索引和this.candleGapWidth和this.candleWidth，得到该蜡烛的X位置，最左侧的
	getCandlePosX:function(index)
	{
		if(index>this.klineData.length) return -1;
		
		var historyCandleCount=this.getHistoryCandleCountByPageIndex();
		
		
		
		return (historyCandleCount+index)*(this.candleGapWidth+this.candleWidth)+this.candleGapWidth;
	},
	
	//根据蜡烛的索引和this.candleGapWidth和this.candleWidth，得到该蜡烛的X位置，蜡烛正中间的位置
	getCandlePosX_Needle:function(index)
	{
		if(index>this.klineData.length) return -1;
		var historyCandleCount=this.getHistoryCandleCountByPageIndex();
		
		return (historyCandleCount+index)*(this.candleGapWidth+this.candleWidth)+this.candleGapWidth+this.candleWidth/2;
	},
	
	//根据参数的值，获取到该值在图像上的位置
	getCandlePosYByValue:function(value)
	{
		if(value>this.maxValue||value<this.minValue){
			cc.log("getCandlePosYByValue currentIndex=="+this.getHistoryCandleCountByPageIndex()+" this.Value="+value+" ,this.maxValue="+this.maxValue+", this.minValue="+this.minValue)
		}
		return (value-this.minValue)*this.graphArea.height/(this.maxValue-this.minValue);
	},
	
	///画位于CurrentIndex的蜡烛线，如果大小变化了则需要重画
	drawSingleCandleLineByCurrentIndex:function(currentIndex)
	{
		var totalCandleCount=this.klineData.length;
		if(currentIndex>=totalCandleCount)
		{
			//表示已经结束了
            cc.log("已经结束了totalCandleCount=="+totalCandleCount+"currentIndex=="+currentIndex);
			return true;
		}
		
		var lastmax=this.maxValue;
		var lastmin=this.minValue;
		if(lastmax==null && lastmin==null)
		{
			var startIndex=(0>currentIndex-120?0:currentIndex-120);
			if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
				startIndex=0;
			}
			// if(this.klineDataPrev!=null)
			// {
			// 	startIndex=this.getHistoryCandleIndexByPageIndex();
			// }
			this.calculateMaxMinBetweenIndex(startIndex,currentIndex);
			//再计算指标图的最大最小
			this.calculateMaxMinBetweenIndexForAllTais(startIndex,currentIndex);
		}
		else
		{
			//先计算非指标的最大最小，一般是蜡烛图，成交量图
			this.calculateMaxMinAtIndex(currentIndex);
			//再计算指标图的最大最小
			this.calculateMaxMinAtIndexForAllTais(currentIndex);
		}

		
		if( lastmax!=this.maxValue  ||  lastmin!=this.minValue )
		{
			//如果最大最小改变了，则需要重画之前所有的蜡烛图
			cc.log("need redraw prev");
			this.redrawCandlesToIndex(currentIndex);
			this.redrawExceptCandles();
		}
		
		//cc.log("drawSingleCandleLineByCurrentIndex called currentIndex="+currentIndex);
		//绘制K线
		this.drawSingleDayGraphInfos(currentIndex);
		return false;
	},
	
	calculateMaxMinAtIndexForAllTais:function(index)
	{
		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].isMaxMinNeeded && this.taisArray[i].isEnabled==true)
			{
				this.taisArray[i].calculateMaxMinAtIndex(index);
			}
		}
	},
	
	///为所有的指标计算从0开始直到index的最大最小值,不需要返回
	calculateMaxMinBetweenIndexForAllTais:function(start,end)
	{
		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].isMaxMinNeeded && this.taisArray[i].isEnabled==true)
			{
				if(this.taisArray[i].calculateMaxMinBetweenIndex(start,end))
				{
					maxminchanged=true;
				}
			}
		}
	},
	
	
	redrawCandlesToIndex:function(index)
	{
		if(this.graphArea!=null){
			this.graphArea.clear();
		}

		this.drawAreaBorder();
		// var startIndex=this.getHistoryCandleIndexByPageIndex();
		var lastmax=this.maxValue;
		var lastmin=this.minValue;

		var startIndex=(0>index-120?0:index-120);
		if(userInfo.matchMode==MatchType.Type_DailyTrade_Match){
			startIndex=0;
		}
		// if(this.klineDataPrev!=null)
		// {
		// 	startIndex=this.getHistoryCandleIndexByPageIndex();
		// }
		this.calculateMaxMinBetweenIndex(startIndex,index);
		//再计算指标图的最大最小
		this.calculateMaxMinBetweenIndexForAllTais(startIndex,index);
		this.redrawExceptCandles();
		cc.log("redrawCandlesToIndex:function(index)="+index+"|this.maxValue="+this.maxValue+"|this.minValue="+this.minValue);
		// var startIndex=(0>index-120?0:index-120);
		for(var i=startIndex;i<index;i++)
		{
			this.drawSingleDayGraphInfos(i);
		}
		if( lastmax!=this.maxValue  ||  lastmin!=this.minValue )
		{
			//如果最大最小改变了，则需要重画之前所有的蜡烛图
			cc.log("need redraw prev");
			this.redrawExceptCandles();
		}
	},
	redrawDailyTradeLineToIndex:function(index)
	{
		if(this.graphArea!=null){
			this.graphArea.clear();
		}

		this.drawAreaBorder();
		// var startIndex=this.getHistoryCandleIndexByPageIndex();
		var lastmax=this.maxValue;
		var lastmin=this.minValue;

		var startIndex=0;
		// if(this.klineDataPrev!=null)
		// {
		// 	startIndex=this.getHistoryCandleIndexByPageIndex();
		// }
		this.calculateMaxMinBetweenIndex(startIndex,index);
		//再计算指标图的最大最小
		this.calculateMaxMinBetweenIndexForAllTais(startIndex,index);
		this.redrawExceptCandles();
		cc.log("redrawCandlesToIndex:function(index)="+index+"|this.maxValue="+this.maxValue+"|this.minValue="+this.minValue);
		// var startIndex=(0>index-120?0:index-120);
		for(var i=startIndex;i<index;i++)
		{
			this.drawSingleDayGraphInfos(i);
		}
		if( lastmax!=this.maxValue  ||  lastmin!=this.minValue )
		{
			//如果最大最小改变了，则需要重画之前所有的蜡烛图
			cc.log("need redraw prev");
			this.redrawExceptCandles();
		}
	},

	//立刻显示所有的蜡烛
	drawAllCandlesAll:function()
	{
		cc.log("drawAllCandlesAll一次性绘制");
		
		if(this.klineData==null)
		{
			cc.log("drawAllCandlesAll一klineData==null");
			return;
		}
		var endIndex=this.klineData.length-1;
		//cc.log("||||drawAllCandlesAll var endIndex = " + endIndex);
		this.calculateMaxMinBetweenIndex(0,endIndex);
		this.calculateMaxMinBetweenIndexForAllTais(0,endIndex);
		for(var i=0;i<=endIndex;i++)
		{
			this.drawSingleDayGraphInfos(i);
		}
		this.redrawExceptCandles();
	},
	
	///立刻显示所有的蜡烛，该函数仅用在显示历史数据时
	drawAllCandlesTillIndexOrEnd:function(endIndex)
	{
		if(this.klineData==null)
		{
			return;
		}
		if(endIndex==undefined)
		{
			endIndex=this.klineData.length-1;
		}
		this.calculateMaxMinBetweenIndex(0,endIndex);
		this.calculateMaxMinBetweenIndexForAllTais(0,endIndex);
		for(var i=0;i<=endIndex;i++)
		{
			this.drawSingleDayGraphInfos(i);
		}
	},

	///立刻显示startIndex-endIndex所有的蜡烛，
	drawAllCandlesTillBetweenIndex:function(startIndex,endIndex)
	{
		if(this.klineData==null)
		{
			return;
		}
		if(endIndex==undefined)
		{
			endIndex=this.klineData.length-1;
		}
		this.calculateMaxMinBetweenIndex(startIndex,endIndex);
		this.calculateMaxMinBetweenIndexForAllTais(startIndex,endIndex);
		for(var i=startIndex;i<=endIndex;i++)
		{
			this.drawSingleDayGraphInfos(i);
		}
	},



	drawCandleForAllTais:function(candleIndex)
	{
		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].isEnabled==true)
			{
				this.taisArray[i].drawCandle(candleIndex);
			}
		}
	},
	
	//显示某个时刻的指标的数值
	drawTaisValueInfo:function(candleIndex)
	{
		//cc.log(".........drawTaisValueInfo candleIndex="+candleIndex);
		// cc.log(".........指标位置this.getPositionX()="+this.getPositionX());
		var labelIndex=0;		// if()
		var leftXStart=10;
		if(this.getPositionX()>0){
			leftXStart=10;
		}else{
			leftXStart=10-this.getPositionX();
		}
		// if(userInfo.matchMode>0){

		// }else{
		// 	leftXStart=10-this.getPositionX();
		// }
		// cc.log(".........this.getPositionX()leftXStart="+leftXStart);

		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].shownName!=null && this.taisArray[i].isEnabled==true)
			{
				var taisFulleNameLabel=null;				
				if(this.taisInfoLabelArray.length<=labelIndex)
				{
					taisFulleNameLabel=new cc.LabelTTF.create("", "Arial", 12);
					taisFulleNameLabel.width=500;
					taisFulleNameLabel.Height=20;
					taisFulleNameLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
					taisFulleNameLabel.setAnchorPoint(0,1);
					this.addChild(taisFulleNameLabel,2); 
					this.taisInfoLabelArray.push(taisFulleNameLabel);
				}
				else
				{
					taisFulleNameLabel=this.taisInfoLabelArray[labelIndex];
				}
				labelIndex=labelIndex+1;
				taisFulleNameLabel.setString(this.taisArray[i].shownName);
				taisFulleNameLabel.setPosition(leftXStart, this.height-5);//-this.topIndexAreaHeight/2);
				taisFulleNameLabel.setColor(cc.color(252,0,1,255));
				taisFulleNameLabel.setVisible(true);
				
				var size=taisFulleNameLabel.getContentSize();
				leftXStart=leftXStart+size.width+20;
			}
			for(var j=0;j<this.taisArray[i].taiArray.length;j++)
			{
				if(this.taisArray[i].isEnabled==true)
				{
					var taiInst=this.taisArray[i].taiArray[j];
					var shownString=taiInst.getShownString(candleIndex);
	
					var taisInfoLabel=null;				
					if(this.taisInfoLabelArray.length<=labelIndex)
					{
						taisInfoLabel=new cc.LabelTTF.create("", "Arial", 12);
						taisInfoLabel.width=500;
						taisInfoLabel.Height=20;
						taisInfoLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
						taisInfoLabel.setAnchorPoint(0,1);
						this.addChild(taisInfoLabel,2); 
						this.taisInfoLabelArray.push(taisInfoLabel);
					}
					else
					{
						taisInfoLabel=this.taisInfoLabelArray[labelIndex];
					}
					labelIndex=labelIndex+1;
					taisInfoLabel.setString(shownString);
					taisInfoLabel.setPosition(leftXStart, this.height-5);//-this.topIndexAreaHeight/2);
					taisInfoLabel.setVisible(true);
					if(taiInst.defaultColor!=null)
					{
						taisInfoLabel.setColor(taiInst.defaultColor);
					}
					else if(taiInst.values!=null && taiInst.values[candleIndex]!=null)
					{
						var taipointColor=taiInst.values[candleIndex].color;
						if(taipointColor!=null)
						{
							taisInfoLabel.setColor(taipointColor);
						}
					}
					var size=taisInfoLabel.getContentSize();
					leftXStart=leftXStart+size.width+20;
				}
				//还要将没有的隐藏掉
				for(var k=labelIndex;k<this.taisInfoLabelArray.length;k++)
				{
					this.taisInfoLabelArray[k].setVisible(false);
				}
			}
		}
	},
	
	//在某个时刻，画所有图像内容的函数，包括画蜡烛线，指标和其他内容
	drawSingleDayGraphInfos:function(candleIndex)
	{

		//cc.log("drawSingleDayGraphInfos candleIndex="+candleIndex);
		if(this.lineType==0){
			this.drawCandle(candleIndex);
		}else if(this.lineType==1){
			this.drawDailyTradeLine(candleIndex);

		}else if(this.lineType==2){//1分钟K线
			this.drawOneDailyTradeLine(candleIndex);

		}else if(this.lineType==3){//5分钟K线
			this.drawReFiveDailyTradeLine(candleIndex);
			this.drawFiveDailyTradeLine(candleIndex);
		}
		//指标线放在K线后面
		this.drawCandleForAllTais(candleIndex);
		this.drawTaisValueInfo(candleIndex);

	},
	//在某个时刻，画所有图像内容的函数，包括画分时线，指标和其他内容
	drawSingleDailyTradeLineGraphInfos:function(candleIndex)
	{
		//cc.log("drawSingleDayGraphInfos candleIndex="+candleIndex);
		this.drawDailyTradeLine(candleIndex);
		this.drawCandleForAllTais(candleIndex);
		this.drawTaisValueInfo(candleIndex);

	},


	//在某个时刻，画所有图像内容的函数，包括画蜡烛线，指标和其他内容
	drawOppositeSingleDayGraphInfos:function(candleIndex)
	{
		//cc.log("drawSingleDayGraphInfos candleIndex="+candleIndex);
		this.drawOppositeCandle(candleIndex);
		this.drawCandleForAllTais(candleIndex);
		this.drawTaisValueInfo(candleIndex);
	},


	//添加指标
	addNewTais:function(tais)
	{
		this.taisArray.push(tais);
		tais.parentLayer=this;
	},
	
	//切换到显示其他的技术指标
	changeToOtherTais:function(taisTypeArray)
	{
		var activatedTais=[];
		for(var i=0;i<this.taisArray.length;i++)
		{
			var bEnabled=false;
			for(var j=0;j<taisTypeArray.length;j++)
			{
				if(this.taisArray[i].briefName==taisTypeArray[j])
				{
					bEnabled=true;
					activatedTais.push(this.taisArray[i]);
					break;
				}
			}
			this.taisArray[i].isEnabled=bEnabled;
		}
		
		for(var i=0;i<activatedTais.length;i++)
		{
			if(activatedTais[i].klineData==null)
			{
				activatedTais[i].setKlineData(this.klineData,this.klineDataPrev);
			}
		}
	},
	
	clearMaxAndMinValue:function()
	{
		this.maxValue=null;
		this.minValue=null;
	},
	
	//清除所有的内容，包括画的线和指标信息表示
	clearAllContents:function()
	{
		// this.clearMaxAndMinValue();
		if(this.graphArea!=null){
			this.graphArea.clear();
		}
		for(var i=0;i<this.taisInfoLabelArray.length;i++)
		{
			this.taisInfoLabelArray[i].setVisible(false);
		}
	},

	clearKlineData:function () {
		this.clearUpDownArrows();
		this.klineData=null;
		this.maxValue=null;
		this.minValue=null;
		this.klineDataPrev=null;
		this.taisArray =null;			//当前指标，可能没有，也可能有多个
		this.taisInfoLabelArray=null;//当前所有的指标Label
	},

	//判断某个指标是否是显示着的
	isTaisEnabled:function(taisBriefName)
	{
		var bEnabled=false;
		for(var i=0;i<this.taisArray.length;i++)
		{
			if(this.taisArray[i].briefName==taisBriefName && this.taisArray[i].isEnabled==true)
			{
				bEnabled=true;
				break;
			}
		}
		return bEnabled;
	},

	
	//*************************************** 以下为重载
	
	//重载,如果最大最小改变了，则需要重新绘制之前的蜡烛
	calculateMaxMinAtIndex:function(index)
	{
		return false;
	},
	
	//重载,计算最大最小值，在start和end两个index之间的最大最小值，此处的start和end可以小于0
	//当index小于0时，表示历史K线
	calculateMaxMinBetweenIndex:function(start,end)
	{
		
	},
	
	
	//重载，在当前的位置画蜡烛图，或者成交量，或者其他技术指标等
	drawCandle:function(candleIndex)
	{
			
	},

	//重载，在当前的位置画分时线，或者成交量，或者其他技术指标等
	drawDailyTradeLine:function(candleIndex)
	{

	},
	//重载，在当前的位置画分时线，或者成交量，或者其他技术指标等
	drawOneDailyTradeLine:function(candleIndex)
	{

	},
	//重载，在当前的位置画分时线，或者成交量，或者其他技术指标等
	drawFiveDailyTradeLine:function(candleIndex)
	{

	},
	//重载，在当前的位置画分时线，或者成交量，或者其他技术指标等
	drawReFiveDailyTradeLine:function(candleIndex)
	{

	},

	//重载，在当前的位置画蜡烛图，或者成交量，或者其他技术指标等
	drawOppositeCandle:function(candleIndex)
	{

	},

	//重载，当重画后，可能需要重画除了K线，技术指标之外的其余内容，比如买入卖出标记，画的支撑压力线等，给派生类自己实现
	redrawExceptCandles:function()
	{
		
	},
	//重载，当重画后，可能需要重画除了分时线，技术指标之外的其余内容，比如买入卖出标记，画的支撑压力线等，给派生类自己实现
	redrawExceptDailyTradeLine:function()
	{

	},
	clearUpDownArrows:function()
	{

	},
});