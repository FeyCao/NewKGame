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
/*调用公有的方法来获取实例:*/
Singleton.getInstance().publicMethod();
var BaseLocalData = {};
/*
 * 写入数据，将数据存储在本地
 * @param jsonName:json文件名字
 */
var baseData = [{a:1},{b:2},{c:3},{d:4},{e:5},{f:6},{g:7}];
BaseLocalData.setItem = function(jsonName)
{
    var baseData = JSON.stringify(jsonName);
    sys.localStorage.setItem("baseData", baseData);
};
/*
 * 读取基础数据
 * 还回json格式数据
 */
BaseLocalData.getItem = function()
{
    var baseData1 = JSON.stringify(baseData); //将json格式转换成string
    sys.localStorage.setItem("baseData", baseData1); //将数据存储在本地
    var baseDataa = sys.localStorage.getItem("baseData"); //从本地读取数据
    baseDataa = JSON.parse(baseDataa); //将string转换成json
    return baseDataa;
};
/*
 * 删除数据
 */
BaseLocalData.deleteItem = function()
{
    sys.localStorage.removeItem("baseData");
};
var codeLocalData = {};
/*
 * 写入数据，将数据存储在本地
 * @param jsonName:json文件名字
 */
// var baseData = [{a:1},{b:2},{c:3},{d:4},{e:5},{f:6},{g:7}];
codeLocalData.setItem = function(jsonName,data)
{
    var baseData = JSON.stringify(data);
    sys.localStorage.setItem(jsonName, baseData);
};
/*
 * 读取基础数据
 * 还回json格式数据
 */
codeLocalData.getItem = function(jsonName)
{
    var baseDataa = sys.localStorage.getItem(jsonName); //从本地读取数据
    baseDataa = JSON.parse(baseDataa); //将string转换成json
    return baseDataa;
};
/*
 * 删除数据
 */
codeLocalData.clearItem = function()
{
    sys.localStorage.clear();
};

// var codeDataInfoList = (function () {
//     var codeDataList;
//     function init() {
//         /*这里定义单例代码*/
//         return {
//             setItem:function (name,data) {
//                 if(null==codeDataList){
//                     codeDataList = new Array();
//                 }
//                 var codeData = new Object();
//                 codeData.codeName = name;
//                 codeData.codeData = data;
//                 codeDataList.push(codeData);
//             },
//             getItem:function (name) {
//                 if(null==codeDataList){
//                     return null;
//                 }else{
//                     for(var i=0;i<codeDataList.length;i++){
//                         if(name==codeDataList[i].codeName){
//                             return codeDataList[i];
//                         }
//                     }
//                 }
//             },
//             clearCodeData: function () {
//                 // var codeDataList = codeDataInfoList.getInstance();
//                 if(null!=codeDataList){
//                     for (var i = 0; i<codeDataList.length; i++){
//                         for(var key in codeDataList[i]){
//                             // for (var  j= 0; j< codeDataList[i][key]; j++){
//                             //     cc.log('clearData codeDataList[i][key]='+j);
//                             //     delete codeDataList[i][key].j;
//                             // }
//                             delete codeDataList[i][key];
//                         }
//                         cc.log('clearData codeDataList[]='+key);
//                     }
//                     codeDataList=null;
//                 }
//                 cc.log('clearData codeDataList');
//             },
//             publicSetItem: 'setItem'
//         };
//
//         // return {
//         //
//         //     publicGetItem: 'getItem'
//         // };
//         // return {
//         //
//         //     clearProperty: 'clear'
//         // };
//         return {
//             otherMethod: function () {
//                 cc.log('other world');
//             },
//             otherProperty: 'other'
//         };
//     }
//     return {
//         getInstance: function () {
//             if (!codeDataList) {
//                 codeDataList = init();
//             }
//             return codeDataList;
//         }
//     };
// })();
// var codeDataList = codeDataInfoList.getInstance();

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





SOURCE_DHJK = "DHJK";     //东航金控APP
SOURCE_ZSQQ = "ZKQQ";     //掌上全球APP
SOURCE_ZZFW = "ZZFW";     //增值服务中心网站
SOURCE_TEST = "TEST";     //东航金控APP
SOURCE_WEB = "SWEB";      //通过web访问
var RedColor=cc.color(255,27,27,255);//红色
var YellowColor=cc.color(255,217,0,255);//黄色
var GreenColor=cc.color(6,224,0,255);//绿色
var WhiteColor=cc.color(255,255,255,255);//白色
var GrayColor=cc.color(166,166,166,255);//灰色
// var WhiteColor=cc.WHITE;//白色GRAY

var BlueColor=cc.color(7,64,111,255);//蓝色
var fontBlueColor=cc.color("#1075b0");//蓝色
// var fontBlueColor=cc.color(16,117,116,255);//蓝色
var fontBlueBgColor=cc.color("#03284b");//蓝色#03284b
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
var AddFriendType = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("AddFriendType");

//message
var Message =  ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Message");
var HallInfo = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("HallInfo");
var AiInfo = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("AiInfo");
var Warn = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Warn");
var Share = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Share");
var MatchRecord = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("MatchRecord");
var Face = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Face");
var Tool = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Tool");
var Friend_Status = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("Friend_Status");
var FriendMatch_Invite = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("FriendMatch_Invite");
var FriendMatch_Answer = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("FriendMatch_Answer");
var HistoryMatches = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("HistoryMatches");
var RankList = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("RankList");
var AddFriend = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("AddFriend");
var FindFriend_Request = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("FindFriend_Request");
var SendFriend_Request = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("SendFriend_Request");
var ReceiveFriendRequest = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("ReceiveFriendRequest");
var SelectAdd_NewFriend = ProtoBuf.loadProtoFile(res.PROTOBUFF_KGAME).build("SelectAdd_NewFriend");
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

var treatyList =[
    {"name":"A:豆一","where":"大商所","start":"2003","end ":"2016","code":"A","status":"-1"},
    {"name":"AG:沪银","where":"上期所","start":"2013","end ":"2016","code":"AG","status":"-1"},
    {"name":"AL:沪铝","where":"上期所","start":"1999","end ":"2016","code":"AL","status":"-1"},
    {"name":"AU:沪金","where":"上期所","start":"2009","end ":"2016","code":"AU","status":"-1"},
    {"name":"BU:沥青","where":"上期所","start":"2014","end ":"2016","code":"BU","status":"-1"},
    {"name":"C:玉米","where":"大商所","start":"2005","end ":"2016","code":"C","status":"-1"},
    {"name":"CF:郑棉","where":"郑商所","start":"2005","end ":"2016","code":"CF","status":"-1"},
    {"name":"CS:淀粉","where":"大商所","start":"2015","end ":"2016","code":"CS","status":"-1"},
    {"name":"CU:沪铜","where":"上期所","start":"1997","end ":"2016","code":"CU","status":"-1"},
    {"name":"FG:玻璃","where":"郑商所","start":"2013","end ":"2016","code":"FG","status":"-1"},
    {"name":"HC:热卷","where":"上期所","start":"2015","end ":"2016","code":"HC","status":"-1"},
    {"name":"I:铁矿","where":"大商所","start":"2014","end ":"2016","code":"I","status":"-1"},
    {"name":"IC:IC","where":"中金所","start":"2016","end ":"2016","code":"IC","status":"-1"},
    {"name":"IF:IF","where":"中金所","start":"2011","end ":"2016","code":"IF","status":"-1"},
    {"name":"IH:IH","where":"中金所","start":"2016","end ":"2016","code":"IH","status":"-1"},
    {"name":"J:焦炭","where":"大商所","start":"2012","end ":"2016","code":"J","status":"-1"},
    {"name":"JD:鸡蛋","where":"大商所","start":"2014","end ":"2016","code":"JD","status":"-1"},
    {"name":"JM:焦煤","where":"大商所","start":"2014","end ":"2016","code":"JM","status":"-1"},
    {"name":"L:塑料","where":"大商所","start":"2008","end ":"2016","code":"L","status":"-1"},
    {"name":"M:豆粕","where":"大商所","start":"2001","end ":"2016","code":"M","status":"-1"},
    {"name":"MA:郑醇","where":"郑商所","start":"2012","end ":"2016","code":"MA","status":"-1"},
    {"name":"NI:沪镍","where":"上期所","start":"2016","end ":"2016","code":"NI","status":"-1"},
    {"name":"OI:郑油","where":"郑商所","start":"2008","end ":"2016","code":"OI","status":"-1"},
    {"name":"P:棕榈","where":"大商所","start":"2008","end ":"2016","code":"P","status":"-1"},
    {"name":"PP:PP","where":"大商所","start":"2015","end ":"2016","code":"PP","status":"-1"},
    {"name":"RB:螺纹","where":"上期所","start":"2010","end ":"2016","code":"RB","status":"-1"},
    {"name":"RM:菜粕","where":"郑商所","start":"2013","end ":"2016","code":"RM","status":"-1"},
    {"name":"RU:橡胶","where":"上期所","start":"1998","end ":"2016","code":"RU","status":"-1"},
    {"name":"SR:白糖","where":"郑商所","start":"2006","end ":"2016","code":"SR","status":"-1"},
    {"name":"T:T","where":"中金所","start":"2016","end ":"2016","code":"T","status":"-1"},
    {"name":"TA:PTA","where":"郑商所","start":"2007","end ":"2016","code":"TA","status":"-1"},
    {"name":"TF:TF","where":"中金所","start":"2014","end ":"2016","code":"TF","status":"-1"},
    {"name":"Y:豆油","where":"大商所","start":"2006","end ":"2016","code":"Y","status":"-1"},
    {"name":"ZC:郑煤","where":"郑商所","start":"2014","end ":"2016","code":"ZC","status":"-1"},
    {"name":"ZN:沪锌","where":"上期所","start":"2008","end ":"2016","code":"ZN","status":"-1"},
];
var userInfo ={
    //主界面数据
    userId:null,//
    deviceId:null,//设备号
    source:null,
    token:"",
    operationType:0,//1为登录，2为快速登录
    inviterUid:null,
    inviterCode:null,
    //
    nickName:"无名的游客",
    recordName:null,
    headSprite:null,	//头像
    score:null,
    // userName:null,
    // userPassword:null,
// {"uid":"43562","nickName":"坎坎坷坷6xcvd","winOfMatchForOne":1,"sumOfMatchForOne":28,"winOfMatchForMore":37,"sumOfMatchForMore":67,"winOfMatchForAI":16,"sumOfMatchForAI":51,"gainCumulation":"-11.285","sumOfAllMatch":28,"winMatchFriend":5,"sumMatchFriend":8,"headPicture":"http://qiniu.kiiik.com/SM-N9200__1481620525057__449948_1253"}
    winOfMatchForOne:0,//练习场胜利次数
    sumOfMatchForOne:0,//练习场总次数
    winOfMatchForDaily:0,//分时练习胜利次数
    sumMatchDaily:0,//分时练习总次数
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
    codeList:null,//多品种合约列表[code:"沥青主连"codeScore:0]
    codeSelected:null,//选中的合约codeName
    codeMainList:null,//显示的主力合约
    currentCode:null,
    startYear:null,
    friendListData:null,//好友列表
    friendNewListData:null,//新的好友列表
    friendSearchListData:null,//搜索到的好友列表
    friendAddData:null,//搜索到的好友列表



    /*enum MatchType{
     Type_Practice_Match=0;
     Type_ArtificialMatch=1;
     Type_PlainMultiplayer_Match=2;
     Type_Tool_Match=3;
     Type_Friend_Match=4;
     Type_DailyTrade_Match=5;
     }
     */
    //matchMode
    // matchMode:MatchType.Type_Practice_Match,//游戏模式0：练习场，1：多人战，2：人机战,分时战
    matchMode:MatchType.Type_Practice_Match,//游戏模式0：练习场，1：多人战，2：人机战,分时战
    matchFlag:false,//false 比赛中，true 观看记录
    matchDayCount:120,
    // matchAiMode:"DON",//游戏模式0：练习场，1：多人战，2：人机战3|matchType#aiType#mainDayCount|
    matchAiMode:AiType.Type_DonChannel,//游戏模式0：练习场，1：多人战，2：人机战3|matchType#aiType#mainDayCount|
    recordMode:MatchType.Type_Practice_Match,//战绩模式0：练习场，1：多人战，2：人机战

    matchId:null,
    endInfoOfAllPlayers:null,//对战结束后玩家信息
    endInfoOfAllcodes:null,//对战结束后合约信息
    myRanking:null,//我的排名信息
    rankList:null,//排名列表信息

    bgSoundFlag:false,//背景音乐
    buttonSoundFlag:true,//音效设置
    viewFlag:true,
    toolsFlag:0,//0表示无道具，1表示K线颠倒

    inviteType:null,//QQ/Wechat
    // selectedCode:null,
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

