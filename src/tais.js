// JavaScript Document
/*
function Person(name, age)
{
	this.name = name;
    this.age = age;
}

Person.prototype.getName= function() {
    return this.name;
}

Person.prototype.getAge= function() {
    return this.age;
}


function Students(name, age, sid)
{
	Person.call(this, name, age);
	this.sid = sid;
}

Students.prototype = new Person(); //把Person放到Students的原型链上实现继承机制
//Students.prototype.constructor = Students;
Students.prototype.getResults = function() {
	return this.sid;
}

Students.prototype.getAge= function() {
    return this.age+10000;
}

function GoodStudents(name,age,sid,score)
{
	Students.call(this, name, age,sid);
	this.score=score;
}

GoodStudents.prototype=new Students();
GoodStudents.prototype.getSid=function()
{
	return this.sid;
}



var person1=new Person("jyc",34);
cc.log("name="+person1.getName());

var student1=new Students("zl",1,123);
cc.log("name2="+student1.getName());
cc.log("score2="+student1.getResults());
cc.log("age2="+student1.getAge());

var goodstudent=new GoodStudents("cxy",999,888,777);
cc.log("goodstudent sid="+goodstudent.getSid());






cc.log("person1.__proto__=");//Person
cc.log(person1.__proto__);
cc.log("person1.constructor="+person1.constructor);//自己试试看会是什么吧
cc.log("Person.prototype=");
cc.log(Person.prototype);//指向原型对象Person


cc.log("student1.__proto__=");//Person
cc.log(student1.__proto__);
cc.log("student1.constructor="+student1.constructor);//自己试试看会是什么吧
cc.log("Students.prototype=");
cc.log(Students.prototype);//指向原型对象Person


function LQBZ()
{
	this.a="1";
}

cc.log("LQBZ.prototype:");
cc.log(LQBZ.prototype);

cc.log("LQBZ.prototype.__proto__:");
cc.log(LQBZ.prototype.__proto__);

function Base(name)
{
	
}

Base.prototype.name="bbb";

function Derive(name,age)
{
	//Base.call(this,name);
	this.age=age;
};

Derive.prototype=new Base();

var d=new Derive("aaa",12);
alert("d.name="+d.name);
*/

///表示指标的一个点
function TaiPoint(value,pointType)
{
	this.color=null;		//这个点的颜色，来自cc.Color
	this.value=value;		//数值，如果为空则表示可能不存在
	this.pointType=pointType;	//这个点的类型，0表示不显示在图上，1为点状，-1则表示柱状
	this.date=null;			//这个点的日期，格式为yyyyMMdd HHmmss
}

//一个指标的一套分数值，例如MACD里面的DEA，DIFF或者MACD，又或者是KDJ里面的K,d或者j
function Tai(tais,shownName,defaultColor)
{
	this.values=[];		//一个TaiPoint的数组，用于存放所有的点的数值
	this.prevValues=[];		
	this.isVisible=true;	//是否是可见的
	this.shownName=shownName;	//显示的名字，比如MACD里面的DIFF或者DEA
	this.defaultColor=defaultColor;	//默认的颜色，来自cc.Color
	this.parent=tais;
}

//显示文字
Tai.prototype.getShownString=function(index)
{
	var ret=this.shownName+": ";
	if(this.values!=null && this.values[index]!=null && this.values[index].value!=null)
	{
		ret+=this.values[index].value.toFixed(2);
	}
	else
	{
		ret=ret+"   ";
	}
	return ret;
}

Tai.prototype.clear=function()
{
	this.values=[];
	this.prevValues=[];		
}

//一个指标，例如MACD，或者KDJ，也或者是均线
function Tais()
{
	this.isEmaLikeFeature=false;		//有些指标的计算是递归的，例如EMA，需要从第一天开始算
	this.isMainGraph=false;				//是否是主图指标
	this.taiArray=[];					//一个Tai的数组，存放所有的Tai，当然也可能只有一个
	this.parentLayer=null;				//这个指标是属于哪个图的
	this.isMaxMinNeeded=true;			//表示这个指标是否需要计算最大最小值，例如均线的指标，在和蜡烛线图合用时，均线的最大最小值对蜡烛图有影响，这种情况下为true
	this.klineData=null;
	this.klineDataPrev=null;
	this.shownName=null;				//显示在界面上的名字
	this.briefName=null;				//简单容易记住的名字，例如MACD,EMA,KDJ等
	this.isEnabled=true;				//是否是激活的
	this.rawDataArray=null;				//纯数据，对于MA，EMA等计算时用
}

Tais.prototype.setKlineData=function(klineData,klineDataPrev)
{
	this.klineData=klineData;
	this.klineDataPrev=klineDataPrev;
	this.rawDataArray=null;
	if(this.klineData!=null)
	{
		this.calculateData();
	}
	else
	{
		this.rawDataArray=null;		
		this.taiArray=[];
		this.init();	
	}
}

Tais.prototype.init=function()
{
	
}



///给这个指标设置纯数据，例如360个长度的收盘价数据，当startSaveIndex=240时，表示从240->359的数据经过该指标计算后要被当作TAIPOINT存入taiArray中
Tais.prototype.setRawDataAndCalculate=function(rawDataArray,startSaveIndex)
{
	this.rawDataArray=rawDataArray;
	this.calculateRawData(startSaveIndex);
}

Tais.prototype.getMaxValue=function()
{
	if(this.parentLayer!=null)
	{
		return this.parentLayer.maxValue;
	}
	return null;
}

Tais.prototype.getMinValue=function()
{
	if(this.parentLayer!=null)
	{
		return this.parentLayer.minValue;
	}
	return null;
}

Tais.prototype.setMaxValue=function(maxValue)
{
	if(this.parentLayer!=null)
	{
		this.parentLayer.maxValue=maxValue;
	}
}

Tais.prototype.setMinValue=function(minValue)
{
	if(this.parentLayer!=null)
	{
		this.parentLayer.minValue=minValue;
	}
}

Tais.prototype.getGraphArea=function()
{
	if(this.parentLayer!=null)
	{
		return this.parentLayer.graphArea;
	}
	return null;
}


//根据蜡烛的索引和this.candleGapWidth和this.candleWidth，得到该蜡烛的X位置，最左侧的
Tais.prototype.getCandlePosX=function(index)
{
	if(this.parentLayer!=null)
	{
		return this.parentLayer.getCandlePosX(index);
	}
	return null;
}
	
//根据蜡烛的索引和this.candleGapWidth和this.candleWidth，得到该蜡烛的X位置，蜡烛正中间的位置
Tais.prototype.getCandlePosX_Needle=function(index)
{
	if(this.parentLayer!=null)
	{
		return this.parentLayer.getCandlePosX_Needle(index);
	}
	return null;
}

//根据参数的值，获取到该值在图像上的位置
Tais.prototype.getCandlePosYByValue=function(value)
{
	if(this.parentLayer!=null)
	{
		return this.parentLayer.getCandlePosYByValue(value);
	}
	return null;
}

//重载，需要计算指标的最大最小值
Tais.prototype.calculateMaxMinAtIndex=function(index)
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
	if(maxValue!=null)
	{
		this.setMaxValue(maxValue);
	}
	if(minValue!=null)
	{
		this.setMinValue(minValue);
	}
	cc.log("tais at index="+index+", maxValue="+maxValue+", minValue="+minValue);
}

//重载,计算最大最小值，在start和end两个index之间的最大最小值，此处的start和end可以小于0
//当index小于0时，表示历史K线
Tais.prototype.calculateMaxMinBetweenIndex=function(start,end)
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
	if(maxValue!=null)
	{
		this.setMaxValue(maxValue);
	}
	if(minValue!=null)
	{
		this.setMinValue(minValue);
	}
	cc.log("tais till index="+end+", maxValue="+maxValue+", minValue="+minValue);
}


//重载，根据日线数据计算结果
Tais.prototype.calculateData=function()
{
	//重载
}

//重载，计算纯数据，例如360个长度的收盘价数据，当startSaveIndex=240时，表示从240->359的数据经过该指标计算后要被当作TAIPOINT存入taiArray中
Tais.prototype.calculateRawData=function(startSaveIndex)
{
	//重载	
}

//重载，在某个位置开始画指标
Tais.prototype.drawCandle=function(candleIndex)
{
	//重载
}

