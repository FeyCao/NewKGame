/**
 * Created by Administrator on 2016-10-18.
 */
var Singleton = (function () {
    var instantiated;
    function init() {
        /*这里定义单例代码*/
        return {
            publicMethod: function () {
                cc.log('hello world sys=='+sys.os);
                cc.log("sys.OS_WINDOWS=="+sys.OS_WINDOWS+"sys.isMobile=="+sys.isMobile+"sys.isNative=="+sys.isNative);
            },
            publicProperty: 'test'
        };

        return {
            otherMethod: function () {
                cc.log('other world');
            },
            otherProperty: 'other'
        };
    }

    return {
        getInstance: function () {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        }
    };
})();


// var gSocketConn=null;
// var gPlayerName=null;			//用户名
// var gPlayerAvatarSprite=null;	//头像
//
// var gLoginManager=null;
//
// var gDesignResolutionWidth=736;
// var gDesignResolutionHeight=414;
//
// var gKlineScene=null;//K 线界面
// var gMainMenuScene=null;// 大厅界面



/*调用公有的方法来获取实例:*/
Singleton.getInstance().publicMethod();

SOURCE_DHJK = "DHJK";     //东航金控APP
SOURCE_ZSQQ = "ZKQQ";     //掌上全球APP
SOURCE_ZZFW = "ZZFW";     //增值服务中心网站
SOURCE_TEST = "TEST";     //东航金控APP
SOURCE_WEB = "SWEB";      //通过web访问
var RedColor=cc.color(255,27,27,255);//红色
var YellowColor=cc.color(255,217,0,255);//黄色
var GreenColor=cc.color(6,224,0,255);//绿色
var WhiteColor=cc.color(255,255,255,255);//白色
var BlueColor=cc.color(7,64,111,255);//蓝色
var lightBlueColor=cc.color(22,95,146,100);//浅蓝色
var BlackColor=cc.color(0,0,0,255);//黑色

var userInfo ={
    //主界面数据
    userId:null,//
    deviceId:null,//设备号
    source:null,
    operationType:0,//1为登录，2为快速登录

    //
    nickName:"无名的游客",
    headSprite:null,	//头像
    // userName:null,
    // userPassword:null,
// "winOfMatchForOne":0,"sumOfMatchForOne":3,"winOfMatchForMore":0,"sumOfMatchForMore":0,"winOfMatchForAI":8,"sumOfMatchForAI":11,"gainCumulation":"-6.223","sumOfAllMatch":3}
    winOfMatchForOne:0,//练习场胜利次数
    sumOfMatchForOne:0,//练习场总次数
    winOfMatchForMore:0,//多人赛胜利次数
    winOfMatchForMore:0,//多人赛总次数
    winOfMatchForAI:0,//人机赛胜利次数
    sumOfMatchForAI:0,//人机赛总次数
    gainCumulation:0,//收益率
    sumOfAllMatch:0,//比赛总场数

    //战绩数据
    totalCount:null,//总战斗场数
    winRate:null,//胜率
    AvgGain:null,//平局收益率
    MatchListData:null,//比赛记录
    businessInfo:null,//交易记录

    playerListData:null,//玩家列表
    friendListData:null,//好友列表


    //matchMode
    matchMode:0,//游戏模式0：练习场，1：多人战，2：人机战
    matchFlag:false,//false 比赛中，true 观看记录
    matchDayCount:120,
    matchAiMode:"DON",//游戏模式0：练习场，1：多人战，2：人机战3|matchType#aiType#mainDayCount|
    recordMode:0,//战绩模式0：练习场，1：多人战，2：人机战

    matchId:null,
    endInfoOfAllPlayers:null,//对战结束后玩家信息
    myRanking:null,//我的排名信息
    rankList:null,//排名列表信息

    bgSoundFlag:false,//背景音乐
    buttonSoundFlag:true,//音效设置
    viewFlag:true,
    toolsFlag:0,//0表示无道具，1表示K线颠倒
}

var inviteInfo ={
    friendName:null,
    code:null,
    picUrl:null,
}
// var AIOperation ={
//     isBuy:null,
//     index:null,
//     price:null,
// }
// var g_resources =["res/title.png","res/battle_bg.png","res/bg_select.png","res/bg_select0.png","res/sound/home_bg.mp3","res/sound/button.mp3","res/playerInfo_bg.png","res/rank_bg.png","res/rank1.png","res/rank2.png","res/rank3.png","res/ko.png","res/vs.png","res/zhanji_bg.png","res/close.png","res/line_bg.png","res/selected.png","res/rotate.png","res/rotate_shadow.png","res/bg_touxiang.png","res/touxiangAI.png","res/bg_control.png","res/btn_open.png","res/btn_close.png","res/bg_message.png","res/btn_login.png","res/btn_download.png","res/btn_general.png","res/btn_hd.png","res/btn_hd1.png","res/btn_general1.png","res/btnBuyDisable.png","res/btnBuyEnable.png","res/btnCloseBuy.png","res/btnCloseDisable.png","res/btnCloseSell.png","res/btnSellDisable.png","res/btnSellEnable.png","res/buyOpenTag.png","res/buyCloseTag.png","res/sellOpenTag.png","res/sellCloseTag.png","res/cursor.png","res/selectedBar.png","res/matchMoreEnd.png","res/matchEnd.png","res/btnEnd.png","res/meBtnReplay.png","res/meBtnAgain.png","res/btnStart.png","res/meBtnShare.png","res/btn_sc_d_normal.png","res/btn_sc_a_normal.png","res/btn_sc_d_double.png","res/btn_sc_a_double.png","res/btn_sc_d_half.png","res/btn_sc_a_half.png","res/btn_sc_play.png","res/btn_sc_bg.png","res/btn_sc_pause.png","res/mainMenu_bg.png","res/btn_control.png","res/btn_zhanji.png","res/btn_paihang.png","res/btn_help.png","res/btn_mode1_u.png","res/btn_mode1_d.png","res/btn_mode2_u.png","res/btn_mode2_d.png","res/btn_mode3_u.png","res/btn_mode3_d.png","res/btn_mode4_u.png","res/btn_mode4_d.png","res/xunzhang.png","res/btnRecord.png","res/btn_mode1d.png", "res/btn_mode1u.png","res/btn_mode2d.png", "res/btn_mode2u.png","res/btn_mode3d.png", "res/btn_mode3u.png","res/btn_mode4d.png", "res/btn_mode4u.png","res/home.png","res/blue_bg.png","res/less_bg.png","res/touxiang_1.png","res/touxiang_2.png","res/touxiang_3.png","res/touxiang_4.png","res/touxiang_5.png","res/touxiang_6.png","res/touxiang_7.png","res/touxiang_8.png","res/touxiang_9.png","res/touxiang_0.png","res/select_1.png","res/select_2.png","res/select_3.png","res/select_4.png","res/select_60.png","res/select_120.png","res/select_180.png","res/select_240.png","res/select_bg.png","fonts/Arial.ttf"];

