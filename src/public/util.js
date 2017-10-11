// JavaScript Document
// 'use strict';
function getResult(num,n){//取余数
    return (num - parseInt(num/n)*n);
}
var pageTimer = {} ; //定义计算器全局变量
var setLabelColor = function(gain){
    if(gain>0){
        return RedColor;
    }else if(gain == 0){
        return WhiteColor;
    }else {
        return GreenColor;
    }
}

function GetLength(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

//js截取字符串，中英文都能用
//如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。
//字符串，长度

/**
 * js截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    var str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        var  a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }

        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }else{
            str_cut = str_cut.concat(a);
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}

function refreshUrl(seconds)
{
    if(testFlag!=true){
        pageTimer["refreshUrl"] = setTimeout(function () {
            alert('服务断开重新登录');
            window.location.reload();

        },seconds*1000);
    }
}

function clearRefreshUrl()
{
    if(null!=pageTimer["refreshUrl"]){
        clearInterval(pageTimer["refreshUrl"]);
    }
    // pageTimer["refreshUrl"] = setTimeout("window.location.reload()",seconds*1000);
}

function gotoshare()
{
    //注意：该函数无任何作用，只是为了给APP分享时捕获链接用的

    window.open("shareGame.html");
}

function getQueryString()
{
    var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));
    for(var i = 0; i < result.length; i++)
    {
        result[i] = result[i].substring(1);
    }
    return result;
}

//根据QueryString参数名称获取值
function getQueryStringByName(name)
{
    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
    if(result == null || result.length < 1)
    {
        return "";
    }
    return result[1];
}

//根据QueryString参数索引获取值
function getQueryStringByIndex(index)
{
    if(index == null)
    {
        return "";
    }

    var queryStringList = getQueryString();
    if (index >= queryStringList.length)
    {
        return "";
    }

    var result = queryStringList[index];
    var startIndex = result.indexOf("=") + 1;
    result = result.substring(startIndex);
    return result;
}
//检查用户名是否合法
function checkUsername()
{
    var regex = new RegExp("^[A-Za-z0-9]+$");
    var username=this.usernameInputEx.getString();
    if(regex.test(username)==false)
    {
        return false;
    }
    return true;
}



//检查电话号是否合法
function checkPhoneNumber(v)
{
//     电信号段:133/153/180/181/189/177；
// 联通号段:130/131/132/155/156/185/186/145/176；
// 移动号段：134/135/136/137/138/139/150/151/152/157/158/159/182/183/184/187/188/147/178。
//     var regBox = {
//         regEmail : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,//邮箱
//         regName : /^[a-z0-9_-]{3,16}$/,//用户名
//         regMobile : /^0?1[3|4|5|8][0-9]\d{8}$/,//手机
//         regTel : /^0[\d]{2,3}-[\d]{7,8}$/
//     }


    // var a = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|17[678]\d{8}|18\d{9}$/ ;
    var a = /^((\(\d{3}\))|(\d{3}\-))?1[3|4|5|7|8][0-9]\d{8}$/ ;
    if( v.length!=11||!v.match(a) )
    {
        alert("请输入正确的手机号码!");
        return false;
    }
    else{
        return true;
        // cc.log("电话号码=="+v);
    }

}

//检查密码是否合法
function checkPassword()
{
    var regex = new RegExp("^[A-Za-z0-9]+$");
    var password=this.pwdInputEx.getString();
    if(regex.test(password)==false)
    {
        return false;
    }
    return true;
}
var sys = cc.sys;//记录平台信息

// function getURL(url) {
//     var xmlhttp = new ActiveXObject( "Microsoft.XMLHTTP");
//     xmlhttp.open("GET", url, false);
//     xmlhttp.send();
//     if(xmlhttp.readyState==4) {
//         if(xmlhttp.Status != 200) alert("不存在");
//         return xmlhttp.Status==200;
//     }
//     return false;
// }
function testApp(urlAnd,urlIos) {
    // table._lineCount = lineCount?lineCount:2;//默认行数为2
    urlAnd = urlAnd|| "http://m.cesfutures.com/kiiikweixin/apppro/phoned.jsp";//下载地址
    urlIos = urlIos|| "http://m.cesfutures.com/kiiikweixin/apppro/phoned.jsp";//下载地址
    if(sys.os===sys.OS_IOS) {//苹果
        // var ifr = document.createElement("iframe");
        // ifr.src = "mobileplatform://"; /***打开app的协议，有ios同事提供***/
        // ifr.style.display = "none";
        // document.body.appendChild(ifr);
        window.location.href="mobileplatform://"; /***打开app的协议，有ios同事提供***/
        window.setTimeout(function(){
            alert('打开失败'+sys.os);// document.body.removeChild(ifr);
            return false;
            // window.location.href = urlAnd; /***下载app的地址***/
        },2000)

    }else if(sys.os===sys.OS_ANDROID){//android
        window.location.href = "kiiikmobile://start.home?"; /***打开app的协议，有安卓同事提供***///pagename=KGAME&inviteCode=1234567890
        window.setTimeout(function(){
            alert('打开失败'+sys.os);// window.location.href = urlIos; /***下载app的协议，有安卓同事提供***/
            return false;
        },2000);

    }else{
        return false;
        // window.location.href = "http://m.cesfutures.com/kiiikweixin/apppro/phoned.jsp";
    }
    // if(sys.isMobile){//移动端模式
    //
    // }
}


var wsURL = 'ws://' + cc.game.config[cc.game.CONFIG_KEY.serverURL];
// if (window.location.protocol == 'http:') {
//     wsURL = 'ws://' + cc.game.config[cc.game.CONFIG_KEY.serverURL];
// } else {
//     wsURL  = 'wss://' + cc.game.config[cc.game.CONFIG_KEY.serverURL];//  + window.location.host + target;
// }
if(cc.game.config["testMyFlag"]==true){
    wsURL = 'ws://' + cc.game.config["serverMyURL"];
}
var testFlag = cc.game.config["testMyFlag"];//记录测试模式信息
if(cc.game.config["testFlag"]==true){
    wsURL = 'ws://' + cc.game.config["serverTestURL"];
}

function add0(m){return m<10?'0'+m:m }//显示时间加0修正

// 自动根据文本的宽度稳定滚动速率text.width/width*5
/**
 *  创建滚动字幕
 * @param txt
 * @param fontsize
 * @param {cc.Color|null} color
 * @param width
 * @param height
 * @returns {cc.Node|*}
 */
// var createClipRoundText = function(txt,fontsize,color,width,height){
//     var text = new cc.LabelTTF(txt,"Arial",fontsize);
//     console.log('text width:'+text.width);
//     text.setColor(color?color:cc.color.BLUE);
//     text.anchorX = 0;
//     // if(text.width<=width){
//     //     text.anchorY = 0;
//     //     return text;
//     // }
//     var cliper = new cc.ClippingNode();
//     var drawNode = new cc.DrawNode();
//     drawNode.drawRect(cc.p(0,0),cc.p(width,height),cc.color.BLUE);
//     cliper.setStencil(drawNode);
//     cliper.anchorX = 0.5;
//     cliper.anchorY = 0.5;
//     text.y = height/2;
//     cliper.addChild(text);
//     text.x = width+fontsize;
//     text.runAction(cc.repeatForever(cc.sequence(
//         cc.moveTo(text.width/width*5,cc.p(-text.width,text.y)),
//         cc.callFunc(function(){
//             text.x = width+fontsize;
//         }))));
//     return cliper;
// };


var createClipRoundNode = cc.Node.extend({
    _text:null,
    _fontSize:null,
    _color:null,
    _width:null,
    _height:null,
    _cliper:null,
    ctor: function (txt,fontsize,color,width,height) {
        var self = this;
        cc.Node.prototype.ctor.call(self);
        self._text = new cc.LabelTTF(txt,"Arial",fontsize);
        self._text.setColor(color?color:cc.color.BLUE);
        var cliper = new cc.ClippingNode();
        var drawNode = new cc.DrawNode();
        drawNode.drawRect(cc.p(0,0),cc.p(width,height),cc.color.BLUE);
        cliper.setStencil(drawNode);
        cliper.anchorX = 0.5;
        cliper.anchorY = 0.5;
        self._text.y = height/2;
        cliper.addChild(self._text);
        self._text.x = width+fontsize;
        self._text.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(self._text.width/width*5,cc.p(-self._text.width,self._text.y)),
            cc.callFunc(function(){
                self._text.x = width+fontsize;
            }))));
        self.addChild(cliper);
    },
    setString:function (txt) {
        this._text.setString(txt);
    },
    setColor:function (color) {
        this._text.setColor(color?color:cc.color.BLUE);
    }

});


// function bubbleSort(arr,compare) {
//     var len=arr.length,j;
//     var temp;
//     while(len>0){
//         for(j=0;j<len-1;j++){
//             if(arr[j]>arr[j+1]){
//                 temp=arr[j];
//                 arr[j]=arr[j+1];
//                 arr[j+1]=temp;
//             }
//         }
//         i--;
//     }
//     return arr;
//
// }

//
var barInfoLayer = cc.Layer.extend({
    sprite:null,
    text:null,
    ctor:function(txt,fontsize,color,width,height)
    {
        this._super();
        this.text = new cc.LabelTTF(txt,"Arial",fontsize);
        // console.log('text width:'+text.width);
        this.text.setColor(color?color:cc.color.BLUE);

        var self = this;
        var cliper = new cc.ClippingNode();
        var drawNode = new cc.DrawNode();
        drawNode.drawRect(cc.p(0,0),cc.p(width,height),cc.color.BLUE);
        cliper.setStencil(drawNode);
        cliper.anchorX = 0.5;
        cliper.anchorY = 0.5;
        this.text.y = height/2;
        cliper.addChild(this.text);
        this.text.x = width+fontsize;
        this.text.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(self.text.width/width*5,cc.p(-self.text.width,self.text.y)),
            cc.callFunc(function(){
                self.text.x = width+fontsize;
            }))));
        this.addChild(cliper);
    },

    onEnter:function ()
    {
        this._super();
        this.sprite = new cc.Sprite(res.BG_BAR_png);
        this.addChild(this.sprite, 0);
    },
    setString:function (txt) {
        this.text.setString(txt);
    }


});
// var Singleton = (function () {
//     var instantiated;
//     function init() {
//         /*这里定义单例代码*/
//         return {
//             publicMethod: function () {
//                 cc.log('hello world sys=='+sys.os);
//                 cc.log("sys.OS_WINDOWS=="+sys.OS_WINDOWS+"sys.isMobile=="+sys.isMobile+"sys.isNative=="+sys.isNative);
//             },
//             publicProperty: 'test'
//         };
//
//         return {
//             otherMethod: function () {
//                 cc.log('other world');
//             },
//             otherProperty: 'other'
//         };
//     }
//
//     return {
//         getInstance: function () {
//             if (!instantiated) {
//                 instantiated = init();
//             }
//             return instantiated;
//         }
//     };
// })();

// refresh(600);//调用方法启动定时刷新，数值单位：秒。
// cc.LoaderScene.preload(["res/title.png","res/battle_bg.png","res/sound/home_bg.mp3","res/sound/button.mp3","res/playerInfo_bg.png","res/rank_bg.png","res/rank1.png","res/rank2.png","res/rank3.png","res/ko.png","res/vs.png","res/zhanji_bg.png","res/close.png","res/line_bg.png","res/selected.png","res/rotate.png","res/rotate_shadow.png","res/bg_touxiang.png","res/touxiang.plist","res/touxiang.png","res/bg_control.png","res/btn_open.png","res/btn_close.png","res/bg_message.png","res/btn_login.png","res/btn_download.png","res/btn_general.png","res/btn_hd.png","res/btn_hd1.png","res/btn_general1.png","res/btnBuyDisable.png","res/btnBuyEnable.png","res/btnCloseBuy.png","res/btnCloseDisable.png","res/btnCloseSell.png","res/btnSellDisable.png","res/btnSellEnable.png","res/buyOpenTag.png","res/buyCloseTag.png","res/sellOpenTag.png","res/sellCloseTag.png","res/cursor.png","res/selectedBar.png","res/matchMoreEnd.png","res/matchEnd.png","res/btnEnd.png","res/meBtnReplay.png","res/meBtnAgain.png","res/btnStart.png","res/meBtnShare.png","res/btn_sc_d_normal.png","res/btn_sc_a_normal.png","res/btn_sc_d_double.png","res/btn_sc_a_double.png","res/btn_sc_d_half.png","res/btn_sc_a_half.png","res/btn_sc_play.png","res/btn_sc_bg.png","res/btn_sc_pause.png","res/mainMenu_bg.png","res/btn_control.png","res/btn_zhanji.png","res/btn_paihang.png","res/btn_help.png","res/btn_mode1_u.png","res/btn_mode1_d.png","res/btn_mode2_u.png","res/btn_mode2_d.png","res/btn_mode3_u.png","res/btn_mode3_d.png","res/btn_mode4_u.png","res/btn_mode4_d.png","res/xunzhang.png","res/btnRecord.png","res/btn_mode1d.png", "res/btn_mode1u.png","res/btn_mode2d.png", "res/btn_mode2u.png","res/btn_mode3d.png", "res/btn_mode3u.png","res/btn_mode4d.png", "res/btn_mode4u.png","res/home.png","res/blue_bg.png","res/less_bg.png","fonts/Arial.ttf"]
//
