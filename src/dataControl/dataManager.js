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
var ShadowColor=cc.color(0,133,200,255);//描边

if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
    throw(new Error("ProtoBuf.js is not present. Please see www/index.html for manual setup instructions."));
}
// 创建ProtoBuf
var ProtoBuf = dcodeIO.ProtoBuf;
//emnu
var MessageType =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("MessageType");
var MatchType =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("MatchType");
var AiType =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("AiType");
var FaceType = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("FaceType");
var ToolType = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("ToolType");

//message
var Message =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Message");
var HallInfo = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("HallInfo");
var AiInfo = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("AiInfo");
var Warn = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Warn");
var Share = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Share");
var MatchRecord = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("MatchRecord");
var Face = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Face");
var Tool = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Tool");
var FriendMatch_Invite = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("FriendMatch_Invite");
var FriendMatch_Answer = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("FriendMatch_Answer");
var HistoryMatches = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("HistoryMatches");
var RankList = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("RankList");
// var FriendMatch_Answer =



var OneDayInfo =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("OneDayInfo");
var MatchUserInfo = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("MatchUserInfo");
var HisdataInfo =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("HisdataInfo");
var BuyOrSell =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("BuyOrSell");
var Score = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Score");
var Request_Match =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Request_Match");
var EndMatch_Info = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("EndMatch_Info");
var Fast_Lgoin =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Fast_Lgoin");
var Use_DeviceId_Login =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Use_DeviceId_Login");
var Mobile_Login =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Mobile_Login");

var userInfo ={
    //主界面数据
    userId:null,//
    deviceId:null,//设备号
    source:null,
    operationType:0,//1为登录，2为快速登录

    //
    nickName:"无名的游客",
    headSprite:null,	//头像
    score:null,
    // userName:null,
    // userPassword:null,
// {"uid":"43562","nickName":"坎坎坷坷6xcvd","winOfMatchForOne":1,"sumOfMatchForOne":28,"winOfMatchForMore":37,"sumOfMatchForMore":67,"winOfMatchForAI":16,"sumOfMatchForAI":51,"gainCumulation":"-11.285","sumOfAllMatch":28,"winMatchFriend":5,"sumMatchFriend":8,"headPicture":"http://qiniu.kiiik.com/SM-N9200__1481620525057__449948_1253"}
    winOfMatchForOne:0,//练习场胜利次数
    sumOfMatchForOne:0,//练习场总次数
    winOfMatchForMore:0,//多人赛胜利次数
    winOfMatchForMore:0,//多人赛总次数
    winOfMatchForAI:0,//人机赛胜利次数
    sumOfMatchForAI:0,//人机赛总次数
    winMatchFriend:0,//人机赛胜利次数"winMatchFriend":5,"sumMatchFriend":8
    sumMatchFriend:0,//人机赛总次数
    gainCumulation:0,//收益率
    sumOfAllMatch:0,//比赛总场数
    onLineNum:0,

    //战绩数据
    totalCount:null,//总战斗场数
    winRate:null,//胜率
    AvgGain:null,//平局收益率
    MatchListData:null,//比赛记录
    matchRecordFlag:false,//标识数据来源
    businessInfo:null,//交易记录

    playerListData:null,//玩家列表
    friendListData:null,//好友列表


    /*enum MatchType{
     Type_Practice_Match=0;
     Type_ArtificialMatch=1;
     Type_PlainMultiplayer_Match=2;
     Type_Tool_Match=3;
     Type_Friend_Match=4;
     }*/
    //matchMode
    matchMode:MatchType.Type_Practice_Match,//游戏模式0：练习场，1：多人战，2：人机战
    matchFlag:false,//false 比赛中，true 观看记录
    matchDayCount:120,
    // matchAiMode:"DON",//游戏模式0：练习场，1：多人战，2：人机战3|matchType#aiType#mainDayCount|
    matchAiMode:AiType.Type_DonChannel,//游戏模式0：练习场，1：多人战，2：人机战3|matchType#aiType#mainDayCount|
    recordMode:MatchType.Type_Practice_Match,//战绩模式0：练习场，1：多人战，2：人机战

    matchId:null,
    endInfoOfAllPlayers:null,//对战结束后玩家信息
    myRanking:null,//我的排名信息
    rankList:null,//排名列表信息

    bgSoundFlag:false,//背景音乐
    buttonSoundFlag:true,//音效设置
    viewFlag:true,
    toolsFlag:0,//0表示无道具，1表示K线颠倒
}

var inviteInfo =new FriendMatch_Invite();
// var inviteInfo ={
//     friendName:null,
//     code:null,
//     picUrl:null,
// }
//
/*
message FriendMatch_Invite{
    required string inviteeName=1;//被邀请人
    optional string inviterName=2;//邀请人
    optional string inviterPic=3;//邀请人头像
    optional string inviteCode=4;
}*/
// WARN_FOR_REMOTE_LOGIN(-400,"您的账号已在其他地方登陆，请确保密码安全"),
//     WARN_FOR_GET_HISDATA(-401, "获取历史行情失败，请重新再试"),
//     WARN_FOR_VISTOR_APP(-402,"更多功能，请登录东航金融APP"),
//     WARN_FOR_VISTOR_WEB(-403,"更多功能，请下载东航金融APP"),
//     WARN_FOR_REPEAT_MATCHING(-404,"重复匹配"),
//     WARN_FOR_MATCHING_MATCHNOTFINSH(-405,"您有一场比赛尚未结束，请等待"),
//     ERROR_LOGIN_DIVCODE(-406,"登录校验失败"),
//     VERIFY_CODE_SEND_SUCCESS(-407,"验证码发送成功"),
//     WARN_NO_SUCH_TOOL(-408,"尚未提供该种类类道具"),
//     WARN_NO_SUCH_MATCH_TYPE(-409,"每局每种道具只能使用两次，请您下局再使用"),
//     WARN_NOT_ENOUGH_MONEY(-410,"金币不足"),
//     WARN_NOT_ENOUGH_POSITION(-411,"仓位不足"),
//     WARN_NOT_MATCH_MOBILE_CODE(-412,"手机号验证码校验失败"),
//     WARN_LOGIN_AGAIN(-413,"请重新登录");


// var g_resources =["res/title.png","res/battle_bg.png","res/bg_select.png","res/bg_select0.png","res/sound/home_bg.mp3","res/sound/button.mp3","res/playerInfo_bg.png","res/rank_bg.png","res/rank1.png","res/rank2.png","res/rank3.png","res/ko.png","res/vs.png","res/zhanji_bg.png","res/close.png","res/line_bg.png","res/selected.png","res/rotate.png","res/rotate_shadow.png","res/bg_touxiang.png","res/touxiangAI.png","res/bg_control.png","res/btn_open.png","res/btn_close.png","res/bg_message.png","res/btn_login.png","res/btn_download.png","res/btn_general.png","res/btn_hd.png","res/btn_hd1.png","res/btn_general1.png","res/btnBuyDisable.png","res/btnBuyEnable.png","res/btnCloseBuy.png","res/btnCloseDisable.png","res/btnCloseSell.png","res/btnSellDisable.png","res/btnSellEnable.png","res/buyOpenTag.png","res/buyCloseTag.png","res/sellOpenTag.png","res/sellCloseTag.png","res/cursor.png","res/selectedBar.png","res/matchMoreEnd.png","res/matchEnd.png","res/btnEnd.png","res/meBtnReplay.png","res/meBtnAgain.png","res/btnStart.png","res/meBtnShare.png","res/btn_sc_d_normal.png","res/btn_sc_a_normal.png","res/btn_sc_d_double.png","res/btn_sc_a_double.png","res/btn_sc_d_half.png","res/btn_sc_a_half.png","res/btn_sc_play.png","res/btn_sc_bg.png","res/btn_sc_pause.png","res/mainMenu_bg.png","res/btn_control.png","res/btn_zhanji.png","res/btn_paihang.png","res/btn_help.png","res/btn_mode1_u.png","res/btn_mode1_d.png","res/btn_mode2_u.png","res/btn_mode2_d.png","res/btn_mode3_u.png","res/btn_mode3_d.png","res/btn_mode4_u.png","res/btn_mode4_d.png","res/xunzhang.png","res/btnRecord.png","res/btn_mode1d.png", "res/btn_mode1u.png","res/btn_mode2d.png", "res/btn_mode2u.png","res/btn_mode3d.png", "res/btn_mode3u.png","res/btn_mode4d.png", "res/btn_mode4u.png","res/home.png","res/blue_bg.png","res/less_bg.png","res/touxiang_1.png","res/touxiang_2.png","res/touxiang_3.png","res/touxiang_4.png","res/touxiang_5.png","res/touxiang_6.png","res/touxiang_7.png","res/touxiang_8.png","res/touxiang_9.png","res/touxiang_0.png","res/select_1.png","res/select_2.png","res/select_3.png","res/select_4.png","res/select_60.png","res/select_120.png","res/select_180.png","res/select_240.png","res/select_bg.png","fonts/Arial.ttf"];

