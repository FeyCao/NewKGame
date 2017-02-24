/**
 * Created by Administrator on 2016-11-30.
 */

var HelpViewLayer = cc.Layer.extend({

    closeCallBackFunction:null,

    ctor:function () {
        this._super();
        // this.onEnter();
        this.init();

    },

    onEnter: function () {
        this._super();
        // this.setColor();
        this.setOpacity(160);
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }
        });
        cc.eventManager.addListener(listener, this);
        this._listener = listener;
    },

    onExit: function () {
        cc.eventManager.removeListener(this._listener);
        this._super();
    },

    init:function () {
        var winSize = cc.director.getWinSize();
        var self=this;

        var size = cc.director.getWinSize();
        var fXScale = size.width/1280;
        var fYScale = size.height/720;


        this.backgroundSprite=cc.Sprite.create("res/help/bg_help.png");
        this.backgroundSprite.setScale(fXScale,fYScale);
        this.backgroundSprite.setPosition(size.width/2,size.height/2);
        this.addChild(this.backgroundSprite);

        var bgSize = this.backgroundSprite.getContentSize();
        var fontSize = 40;
        // var posY = bgSize.height/2-20;
        // var posX = 100;
        var posX = 100;
        var posY = 12;
        var posX1 =50;

        var imageBg = cc.Sprite.create("res/help/bg_text.png");
        // imageBg.setAnchorPoint(0,0);
        imageBg.setPosition(bgSize.width/2,bgSize.height/2+posY);


        // var temp = new cc.Component()
        // this.backgroundSprite.addChild(imageBg,1);
        // "res/help/bg_text.png","res/help/bg_slide.png","res/help/btn_slide.png","res/help/btn_know.png"];

        var mu = new cc.Menu();
        mu.x = 0;
        mu.y = 0;
        this.backgroundSprite.addChild(mu,3);
        // closeBtn=new Button("res/close.png");
        var  closeBtn = new cc.MenuItemImage("res/close.png", "res/close.png", self.toMainScene, this);
        closeBtn.setPosition(cc.p(bgSize.width-40,bgSize.height-40));
        mu.addChild(closeBtn);
        var  knowBtn = new cc.MenuItemImage("res/help/btn_know.png", "res/help/btn_know.png", self.toMainScene, this);
        knowBtn.setPosition(cc.p(bgSize.width/2,bgSize.height/7));
        mu.addChild(knowBtn);

        this.addTextView();

        // this.refreshHelpViewLayer();

        return true;
    },

    addTextView:function(){
        var self = this;
        var fontSize = 26;
        // //设置View的大小，相当于是显示的区域
        var viewSize = cc.size(610,270);
        //
        var contentSize = cc.size(610,2300);
        // var contentSize = cc.size(610,270*8.2);
        // var sp =cc.Sprite.create("res/help/bg_help.png");
        var container = new cc.LayerColor();

        var containerColor=cc.color(0,32,52,255);//
        container.setColor(containerColor);
        container.setAnchorPoint(0,0);
        // container.addChild(sp);
        container.setPosition(0,0) ;
        container.setVisible(true);
        var posTopY = contentSize.height;
        var scroll_card = new cc.ScrollView();
        scroll_card.setContainer(container);
        scroll_card.setContentSize(contentSize);
        scroll_card.setViewSize(viewSize);
        scroll_card.setAnchorPoint(0,0);
        scroll_card.setPosition(cc.p(80,130));
        scroll_card.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scroll_card.setVisible(true);
        scroll_card.setBounceable(true);
        // scroll_card.jumpToTop();
        scroll_card.setContentOffset(scroll_card.minContainerOffset() , false);
        cc.log("scroll_card.minContainerOffset()x=="+scroll_card.minContainerOffset().x+"y=="+scroll_card.minContainerOffset().y);
        cc.log("scroll_card.maxContainerOffset()x=="+scroll_card.maxContainerOffset().x+"y=="+scroll_card.maxContainerOffset().y);

        this.backgroundSprite.addChild(scroll_card);
        //layer的锚点默认是(0,0),现在设置ImageView
        // 添加文档
        // var tittleText = new cc.LabelTTF( "1.游戏简介：", "res/fonts/Arial.ttf", fontSize);
        // tittleText.setAnchorPoint(0,1);
        // tittleText.setPosition(0,posTopY);
        // textContent.setContentSize(cc.size(600,6840))
        // container.addChild(tittleText,3);
        var  textContent = new cc.LabelTTF( "1.游戏简介：\n   趋势突击是由东航金融自主开发的一款有趣的期市模拟操作游戏，功能包括练习场、人机战、多人战、圈子战、战绩、排名等，游戏中采用的数据均是真实的期(股)市数据，玩家可以通过本游戏锻炼自己对K线走势的感觉，从而在真实的期市中开拓一片自己的疆土。\n    \n2.练习场：\n   练习场玩法：\n   a.选择数据时长，就是可供您买卖操作的天数，选择完点击“开始比赛”按钮。\n   b.开始游戏前，先浏览120天的历史数据，浏览完毕，点击“开始游戏”按钮。  \n   c.比赛中，少侠需要把握时机，对未来的K线走势有个估算，待时机成熟再来“买”“卖”，如果K线走的太快(慢)，您也可点击屏幕中下方的调速按钮进行调速。\n   \n3.人机战：\n   想必少侠一定久闻江湖上赫赫有名的“唐奇安”,“三均线”,“单均线”,“布林轨道”,“红三兵”了，如果少侠已在江湖小有名气，不妨与之一战~。\n   人机战玩法：\n   a.选择数据时长，就是可供您买卖操作的天数。\n   b.选择机器策略，然后点击”开始比赛”。\n   c.开始游戏前，先浏览120天的历史数据，浏览完毕，点击“开始游戏”按钮。\n   d.比赛中，人机少侠需要把握时机，对未来的K线走势有个估算，待时机成熟再来“买”“卖”，如果K线走的太快(慢)，您也可点击屏幕中下方的调速按钮进行调速~。 \n   \n4.多人战：\n   练习场、人机战，吾视之如草芥！少侠可能已难寻敌手，那么打开传送门，去与远方的高手探讨一下期市的真谛吧~。\n   多人战玩法：\n   a.点击开始匹配进行多人匹配，或取消匹配退回至大厅。 \n   b.多人战中给少侠3秒钟浏览120天历史数据，浏览完毕，自动进入游戏。\n   c.比赛中，人机少侠需要把握时机，对未来的K线走势有个估算，待时机成熟再来“买”“卖”。\n\n5.战绩：\n   战绩上记载了少侠的每一刀，每一剑、磨难和荣耀！\n   \n6. 排名：\n   期货江湖上，究竟孰强孰弱？大家一看便知（江湖规矩：胜场数>平均收益>总场数）\n   \n7.名词解释：\n   MA10:比赛界面左上方出现,表示前10日的平均收盘价。\n   MA20:比赛界面左上方出现,表示前20日的平均收盘价。\n   MA30:比赛界面左上方出现,表示前30日的平均收盘价。\n   MA5:比赛界面界面左下方出现，表示前5天的平均成交量。\n   MA10:比赛界面界面左下方出现，表示前10天的平均成交量。\n   DIFF:收盘价短期、长期指数平滑移动平均线间的差。\n   DEA:DIFF线的M日指数平滑移动平均线。\n   MACD:(DIFF线-DEA线)*2，相对0轴的高度 \n   MACD(12,26,9):SHORT(短期)，LONG(长期)，M 天数：一般为12、26、9。 \n   \n   ", "res/fonts/Arial.ttf", fontSize,contentSize);

        // textContent.setDimensions(contentSize.width);
        cc.log("textContent.getContentSize().x==",textContent.getContentSize().width);
        textContent.setAnchorPoint(0,1);
        textContent.setPosition(0,posTopY);
        // textContent.setContentSize(cc.size(1200,300*3))
        container.addChild(textContent,3);

        // 添加文档
        // var tittleText1 = new cc.LabelTTF( "2.练习场：", "res/fonts/Arial.ttf", fontSize);
        // tittleText1.setAnchorPoint(0,1);
        // tittleText1.setPosition(0,posTopY-viewSize.height);
        // // textContent.setContentSize(cc.size(600,6840))
        // container.addChild(tittleText1,3);
        // var  textContent1 = new cc.LabelTTF( "1.游戏简介：\n     趋势突击是由东航金融自主开发的一款有趣的期市模拟操作游戏，功能包括练习场、人机战、多人战、圈子战、战绩、排名等，游戏中采用的数据均是真实的期(股)市数据，玩家可以通过本游戏锻炼自己对K线走势的感觉，从而在真实的期市中开拓一片自己的疆土。   \n    \n   2.练习场：\n     练习场玩法：\n     a.选择数据时长，就是可供您买卖操作的天数，选择完点击“开始比赛”按钮。\n     b.开始游戏前，先浏览120天的历史数据，浏览完毕，点击“开始游戏”按钮。\n     c.比赛中，少侠需要把握时机，对未来的K线走势有个估算，待时机成熟再来“买”“卖”，如果K线走的太快(慢)，您也可点击屏幕中下方的调速按钮进行调速。\n   \n   3.人机战：\n     想必少侠一定久闻江湖上赫赫有名的“唐奇安”、“三均线”“单均线”“布林轨道”“红三兵”了，如果少侠已在江湖小有名气，不妨与之一战~。\n    人机战玩法：\n      a.选择数据时长，就是可供您买卖操作的天数。\n      b.选择机器策略，然后点击”开始比赛”。\n      c.开始游戏前，先浏览120天的历史数据，浏览完毕，点击“开始游戏”按钮。\n      d.比赛中，人机少侠需要把握时机，对未来的K线走势有个估算，待时机成熟再来“买”“卖”，如果K线走的太快(慢)，您也可点击屏幕中下方的调速按钮进行调速~。 \n   \n   4.多人战：\n     练习场、人机战，吾视之如草芥！少侠可能已难寻敌手，那么打开传送门，去与远方的高手探讨一下期市的真谛吧~。\n      多人战玩法：\n     a.点击开始匹配进行多人匹配，或取消匹配退回至大厅。 \n      b.多人战中给少侠3秒钟浏览120天历史数据，浏览完毕，自动进入游戏。\n         c.比赛中，人机少侠需要把握时机，对未来的K线走势有个估算，待时机成熟再来“买”“卖”。\n      5.战绩：\n       战绩上记载了少侠的每一刀，每一剑、磨难和荣耀！\n   6. 排名：\n       期货江湖上，究竟孰强孰弱？大家一看便知（江湖规矩：胜场数>平均收益>总场数）\n   \n   7.名词解释：\n       MA10:比赛界面左上方出现,表示前10日的平均收盘价。\n       MA20:比赛界面左上方出现,表示前20日的平均收盘价。\n       MA30:比赛界面左上方出现,表示前30日的平均收盘价。\n       MA5:比赛界面界面左下方出现，表示前5天的平均成交量。\n       MA10:比赛界面界面左下方出现，表示前10天的平均成交量。\n       DIFF:收盘价短期、长期指数平滑移动平均线间的差 \n       DEA:DIFF线的M日指数平滑移动平均线 \n       MACD:(DIFF线-DEA线)*2，相对0轴的高度 \n       MACD(12,26,9):SHORT(短期)、LONG(长期)、M 天数，一般为12、26、9 \n   \n    ", "res/fonts/Arial.ttf", fontSize,viewSize);
        // textContent1.setAnchorPoint(0,1);
        // textContent1.setPosition(0,posTopY-viewSize.height);
        // // textContent.setContentSize(cc.size(1200,300*3))
        // container.addChild(textContent1,3);

    },

    toMainScene:function () {
        if(this.closeCallBackFunction!=null){
            this.closeCallBackFunction();
        }
    },

    showLayer:function()
    {
        this.setVisible(true);
        this.scheduler.resumeTarget(this);
        this.actionManager && this.actionManager.resumeTarget(this);
        cc.eventManager.resumeTarget(this,true);
    },

    hideLayer:function()
    {
        this.setVisible(false);
        this.scheduler.pauseTarget(this);
        this.actionManager && this.actionManager.pauseTarget(this);
        cc.eventManager.pauseTarget(this,true);
    },
    // refreshHelpViewLayer:function()
    // {
    //     ;
    // },
});


