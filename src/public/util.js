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

            if(sys.os === sys.OS_ANDROID){
                alert('服务断开请重新登录');
                window.location.href="http://analyse.kiiik.com";//回到东航app中
            }else {
                window.location.reload();
            }


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

    window.open("share.html");
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
// function isWeiXin(){
//     // alert('屏幕状态:'+window.neworientation.current+"||浏览器:"+sys.browserType+"||平台:"+sys.os);
//     var ua = window.navigator.userAgent.toLowerCase();
//     if(ua.match(/MicroMessenger/i) == 'micromessenger'){
//         return true;
//     }else{
//         return false;
//     }
// }
// var win = window, nav = win.navigator;
// var ua = nav.userAgent.toLowerCase();
// var isWeChat = ua.match(/MicroMessenger/i) == 'micromessenger'?'true':'false'
function testScene() {
    alert('屏幕状态:'+window.neworientation.current+"||浏览器:"+sys.browserType+"||平台:"+sys.os+"||isWeChat:"+isWeChat);
    // window.addEventListener('orientationchange', function(){
    //     if(window.neworientation.current === 'portrait|landscape'){
    //         alert('屏幕状态'+window.neworientation.current);// do something……
    //     } else {
    //         alert('屏幕状态'+window.neworientation.current);// do something……
    //     }
    // }, false);
}

function findDimensions() {

    var winWidth, winHeight;

    //获取窗口宽度

    if (window.innerWidth)

        winWidth = window.innerWidth;

    else if ((document.body) && (document.body.clientWidth))

        winWidth = document.body.clientWidth;

    //获取窗口高度

    if (window.innerHeight)

        winHeight = window.innerHeight;

    else if ((document.body) && (document.body.clientHeight))

        winHeight = document.body.clientHeight;

    //通过深入Document内部对body进行检测，获取窗口大小

    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {

        winHeight = document.documentElement.clientHeight;

        winWidth = document.documentElement.clientWidth;

    }

    return {

        "width": winWidth,

        "height": winHeight

    };

};
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

function weChatShare(url,title,desc){//链接 标题 描述
    url = url||window.location.href;
    title = title||'趋势突击';
    desc = desc||'趋势突击是由东航金融自主开发的一款有趣的期市模拟操作游戏，功能包括练习场、人机战、多人战、好友战、战绩、排名等，游戏中采用的数据均是真实的期(股)市数据，玩家可以通过本游戏锻炼自己对K线走势的感觉，从而在真实的期市中开拓一片自己的疆土。';
    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: url,
        imgUrl: 'https://ohfw64y24.bkt.clouddn.com/TRYH8L%600%60%5BZRQPESJ0NMLIX.png',
        trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            // alert('用户点击发送给朋友');
        },
        success: function (res) {
            // WeixinApi.hideToolbar();
            // alert('已分享');
        },
        cancel: function (res) {
            if(cc.game.config["showFPS"]==true){
                alert('已取消'+url);
            }
        },
        fail: function (res) {
            alert('fail:'+JSON.stringify(res));
        }
    });
    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareTimeline({
        title: title,
        desc: desc,
        link: url,
        imgUrl: 'https://ohfw64y24.bkt.clouddn.com/TRYH8L%600%60%5BZRQPESJ0NMLIX.png',
        trigger: function (res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            // alert('用户点击分享到朋友圈');
        },
        success: function (res) {
            // alert('已分享');
        },
        cancel: function (res) {
            if(cc.game.config["showFPS"]==true){
                alert('已取消'+url);
            }
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });

    // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareQQ({
        title: title,
        desc: desc,
        link: url,
        imgUrl: 'https://ohfw64y24.bkt.clouddn.com/TRYH8L%600%60%5BZRQPESJ0NMLIX.png',
        trigger: function (res) {
            // alert('用户点击分享到QQ');
        },
        complete: function (res) {
            alert(JSON.stringify(res));
        },
        success: function (res) {
            // alert('已分享');
        },
        cancel: function (res) {
            if(cc.game.config["showFPS"]==true){
                alert('已取消'+url);
            }
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
}

/*
 * 注意：
 * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
 * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
 * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
 *
 * 如有问题请通过以下渠道反馈：
 * 邮箱地址：weixin-open@qq.com
 * 邮件主题：【微信JS-SDK反馈】具体问题
 * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
 */

// wx.config({
//     debug: false,
//     appId: 'wxf8b4f85f3a794e77',
//     timestamp: 1510102080,
//     nonceStr: 'G6ipVdUsb4d0iOiW',
//     signature: 'b3d0fd6693d28511054f27751fdcc1b4c0fb9bc6',
//     jsApiList: [
//         'checkJsApi',
//         'onMenuShareTimeline',
//         'onMenuShareAppMessage',
//         'onMenuShareQQ',
//         'onMenuShareWeibo',
//         'onMenuShareQZone',
//         'hideMenuItems',
//         'showMenuItems',
//         'hideAllNonBaseMenuItem',
//         'showAllNonBaseMenuItem',
//         'translateVoice',
//         'startRecord',
//         'stopRecord',
//         'onVoiceRecordEnd',
//         'playVoice',
//         'onVoicePlayEnd',
//         'pauseVoice',
//         'stopVoice',
//         'uploadVoice',
//         'downloadVoice',
//         'chooseImage',
//         'previewImage',
//         'uploadImage',
//         'downloadImage',
//         'getNetworkType',
//         'openLocation',
//         'getLocation',
//         'hideOptionMenu',
//         'showOptionMenu',
//         'closeWindow',
//         'scanQRCode',
//         'chooseWXPay',
//         'openProductSpecificView',
//         'addCard',
//         'chooseCard',
//         'openCard'
//     ]
// });

/*// wx.ready(function () {
//     // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
//     document.querySelector('#checkJsApi').onclick = function () {
//         wx.checkJsApi({
//             jsApiList: [
//                 'getNetworkType',
//                 'previewImage'
//             ],
//             success: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//     };
//
//
//     wx.onMenuShareAppMessage({
//         title: '互联网之子',
//         desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//         link: 'http://movie.douban.com/subject/25785114/',
//         imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
//         trigger: function (res) {
//             // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//             alert('用户点击发送给朋友');
//         },
//         success: function (res) {
//             alert('已分享');
//         },
//         cancel: function (res) {
//             alert('已取消');
//         },
//         fail: function (res) {
//             alert(JSON.stringify(res));
//         }
//     });
//     // 2. 分享接口
//     // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
//     document.querySelector('#onMenuShareAppMessage').onclick = function () {
//         wx.onMenuShareAppMessage({
//             title: '互联网之子',
//             desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//             link: 'http://movie.douban.com/subject/25785114/',
//             imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
//             trigger: function (res) {
//                 // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//                 alert('用户点击发送给朋友');
//             },
//             success: function (res) {
//                 alert('已分享');
//             },
//             cancel: function (res) {
//                 alert('已取消');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//         alert('已注册获取“发送给朋友”状态事件');
//     };
//
//     // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
//     document.querySelector('#onMenuShareTimeline').onclick = function () {
//         wx.onMenuShareTimeline({
//             title: '互联网之子',
//             link: 'http://movie.douban.com/subject/25785114/',
//             imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
//             trigger: function (res) {
//                 // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//                 alert('用户点击分享到朋友圈');
//             },
//             success: function (res) {
//                 alert('已分享');
//             },
//             cancel: function (res) {
//                 alert('已取消');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//         alert('已注册获取“分享到朋友圈”状态事件');
//     };
//
//     // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
//     document.querySelector('#onMenuShareQQ').onclick = function () {
//         wx.onMenuShareQQ({
//             title: '互联网之子',
//             desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//             link: 'http://movie.douban.com/subject/25785114/',
//             imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
//             trigger: function (res) {
//                 alert('用户点击分享到QQ');
//             },
//             complete: function (res) {
//                 alert(JSON.stringify(res));
//             },
//             success: function (res) {
//                 alert('已分享');
//             },
//             cancel: function (res) {
//                 alert('已取消');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//         alert('已注册获取“分享到 QQ”状态事件');
//     };
//
//     // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
//     document.querySelector('#onMenuShareWeibo').onclick = function () {
//         wx.onMenuShareWeibo({
//             title: '互联网之子',
//             desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//             link: 'http://movie.douban.com/subject/25785114/',
//             imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
//             trigger: function (res) {
//                 alert('用户点击分享到微博');
//             },
//             complete: function (res) {
//                 alert(JSON.stringify(res));
//             },
//             success: function (res) {
//                 alert('已分享');
//             },
//             cancel: function (res) {
//                 alert('已取消');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//         alert('已注册获取“分享到微博”状态事件');
//     };
//
//     // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
//     document.querySelector('#onMenuShareQZone').onclick = function () {
//         wx.onMenuShareQZone({
//             title: '互联网之子',
//             desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//             link: 'http://movie.douban.com/subject/25785114/',
//             imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
//             trigger: function (res) {
//                 alert('用户点击分享到QZone');
//             },
//             complete: function (res) {
//                 alert(JSON.stringify(res));
//             },
//             success: function (res) {
//                 alert('已分享');
//             },
//             cancel: function (res) {
//                 alert('已取消');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//         alert('已注册获取“分享到QZone”状态事件');
//     };
//
//
//
//
//     // 6 设备信息接口
//     // 6.1 获取当前网络状态
//     document.querySelector('#getNetworkType').onclick = function () {
//         wx.getNetworkType({
//             success: function (res) {
//                 alert(res.networkType);
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//     };
//
//     // 7 地理位置接口
//     // 7.1 查看地理位置
//     document.querySelector('#openLocation').onclick = function () {
//         wx.openLocation({
//             latitude: 23.099994,
//             longitude: 113.324520,
//             name: 'TIT 创意园',
//             address: '广州市海珠区新港中路 397 号',
//             scale: 14,
//             infoUrl: 'http://weixin.qq.com'
//         });
//     };
//
//     // 7.2 获取当前地理位置
//     document.querySelector('#getLocation').onclick = function () {
//         wx.getLocation({
//             success: function (res) {
//                 alert(JSON.stringify(res));
//             },
//             cancel: function (res) {
//                 alert('用户拒绝授权获取地理位置');
//             }
//         });
//     };
//
//     // 8 界面操作接口
//     // 8.1 隐藏右上角菜单
//     document.querySelector('#hideOptionMenu').onclick = function () {
//         wx.hideOptionMenu();
//     };
//
//     // 8.2 显示右上角菜单
//     document.querySelector('#showOptionMenu').onclick = function () {
//         wx.showOptionMenu();
//     };
//
//     // 8.3 批量隐藏菜单项
//     document.querySelector('#hideMenuItems').onclick = function () {
//         wx.hideMenuItems({
//             menuList: [
//                 'menuItem:readMode', // 阅读模式
//                 'menuItem:share:timeline', // 分享到朋友圈
//                 'menuItem:copyUrl' // 复制链接
//             ],
//             success: function (res) {
//                 alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//     };
//
//     // 8.4 批量显示菜单项
//     document.querySelector('#showMenuItems').onclick = function () {
//         wx.showMenuItems({
//             menuList: [
//                 'menuItem:readMode', // 阅读模式
//                 'menuItem:share:timeline', // 分享到朋友圈
//                 'menuItem:copyUrl' // 复制链接
//             ],
//             success: function (res) {
//                 alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
//             },
//             fail: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//     };
//
//     // 8.5 隐藏所有非基本菜单项
//     document.querySelector('#hideAllNonBaseMenuItem').onclick = function () {
//         wx.hideAllNonBaseMenuItem({
//             success: function () {
//                 alert('已隐藏所有非基本菜单项');
//             }
//         });
//     };
//
//     // 8.6 显示所有被隐藏的非基本菜单项
//     document.querySelector('#showAllNonBaseMenuItem').onclick = function () {
//         wx.showAllNonBaseMenuItem({
//             success: function () {
//                 alert('已显示所有非基本菜单项');
//             }
//         });
//     };
//
//     // 8.7 关闭当前窗口
//     document.querySelector('#closeWindow').onclick = function () {
//         wx.closeWindow();
//     };
//
//     // 9 微信原生接口
//     // 9.1.1 扫描二维码并返回结果
//     document.querySelector('#scanQRCode0').onclick = function () {
//         wx.scanQRCode();
//     };
//     // 9.1.2 扫描二维码并返回结果
//     document.querySelector('#scanQRCode1').onclick = function () {
//         wx.scanQRCode({
//             needResult: 1,
//             desc: 'scanQRCode desc',
//             success: function (res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//     };
//
//     // 10 微信支付接口
//     // 10.1 发起一个支付请求
//     document.querySelector('#chooseWXPay').onclick = function () {
//         // 注意：此 Demo 使用 2.7 版本支付接口实现，建议使用此接口时参考微信支付相关最新文档。
//         wx.chooseWXPay({
//             timestamp: 1414723227,
//             nonceStr: 'noncestr',
//             package: 'addition=action_id%3dgaby1234%26limit_pay%3d&bank_type=WX&body=innertest&fee_type=1&input_charset=GBK&notify_url=http%3A%2F%2F120.204.206.246%2Fcgi-bin%2Fmmsupport-bin%2Fnotifypay&out_trade_no=1414723227818375338&partner=1900000109&spbill_create_ip=127.0.0.1&total_fee=1&sign=432B647FE95C7BF73BCD177CEECBEF8D',
//             signType: 'SHA1', // 注意：新版支付接口使用 MD5 加密
//             paySign: 'bd5b1933cda6e9548862944836a9b52e8c9a2b69'
//         });
//     };
//
//     // 11.3  跳转微信商品页
//     document.querySelector('#openProductSpecificView').onclick = function () {
//         wx.openProductSpecificView({
//             productId: 'pDF3iY_m2M7EQ5EKKKWd95kAxfNw',
//             extInfo: '123'
//         });
//     };
//
//     // 12 微信卡券接口
//     // 12.1 添加卡券
//     document.querySelector('#addCard').onclick = function () {
//         wx.addCard({
//             cardList: [
//                 {
//                     cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
//                     cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f6628bf94d8e56d56bfa6598e798d5bad54892e5"}'
//                 },
//                 {
//                     cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
//                     cardExt: '{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f6628bf94d8e56d56bfa6598e798d5bad54892e5"}'
//                 }
//             ],
//             success: function (res) {
//                 alert('已添加卡券：' + JSON.stringify(res.cardList));
//             },
//             cancel: function (res) {
//                 alert(JSON.stringify(res))
//             }
//         });
//     };
//
//     var codes = [];
//     // 12.2 选择卡券
//     document.querySelector('#chooseCard').onclick = function () {
//         wx.chooseCard({
//             cardSign: '1fdb2640c60e41f8823e9f762e70c531d161ae76',
//             timestamp: 1437997723,
//             nonceStr: 'k0hGdSXKZEj3Min5',
//             success: function (res) {
//                 res.cardList = JSON.parse(res.cardList);
//                 encrypt_code = res.cardList[0]['encrypt_code'];
//                 alert('已选择卡券：' + JSON.stringify(res.cardList));
//                 decryptCode(encrypt_code, function (code) {
//                     codes.push(code);
//                 });
//             },
//             cancel: function (res) {
//                 alert(JSON.stringify(res))
//             }
//         });
//     };
//
//     // 12.3 查看卡券
//     document.querySelector('#openCard').onclick = function () {
//         if (codes.length < 1) {
//             alert('请先使用 chooseCard 接口选择卡券。');
//             return false;
//         }
//         var cardList = [];
//         for (var i = 0; i < codes.length; i++) {
//             cardList.push({
//                 cardId: 'pDF3iY9tv9zCGCj4jTXFOo1DxHdo',
//                 code: codes[i]
//             });
//         }
//         wx.openCard({
//             cardList: cardList,
//             cancel: function (res) {
//                 alert(JSON.stringify(res))
//             }
//         });
//     };
//
//     var shareData = {
//         title: '微信JS-SDK Demo',
//         desc: '微信JS-SDK,帮助第三方为用户提供更优质的移动web服务',
//         link: 'http://demo.open.weixin.qq.com/jssdk/',
//         imgUrl: 'http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0'
//     };
//     wx.onMenuShareAppMessage(shareData);
//     wx.onMenuShareTimeline(shareData);
//
//     function decryptCode(code, callback) {
//         $.getJSON('/jssdk/decrypt_code.php?code=' + encodeURI(code), function (res) {
//             if (res.errcode == 0) {
//                 codes.push(res.code);
//             }
//         });
//     }
// });*/


/**!
 * 微信内置浏览器的Javascript API，功能包括：
 *
 * 1、分享到微信朋友圈
 * 2、分享给微信好友
 * 3、分享到腾讯微博
 * 4、隐藏/显示右上角的菜单入口
 * 5、隐藏/显示底部浏览器工具栏
 * 6、获取当前的网络状态
 * 7、调起微信客户端的图片播放组件
 * 8、关闭公众平台Web页面
 *
 * @author zhaoxianlie(http://www.baidufe.com)
 */
var WeixinApi = (function () {
    "use strict";
})();
/*// var WeixinApi = (function () {
//
//     "use strict";
//
//     **
//      * 分享到微信朋友圈
//      * @param       {Object}    data       待分享的信息
//      * @p-config    {String}    appId      公众平台的appId（服务号可用）
//      * @p-config    {String}    imageUrl   图片地址
//      * @p-config    {String}    link       链接地址
//      * @p-config    {String}    desc       描述
//      * @p-config    {String}    title      分享的标题
//      *
//      * @param       {Object}    callbacks  相关回调方法
//      * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
//      * @p-config    {Function}  ready(argv)             就绪状态
//      * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
//      * @p-config    {Function}  cancel(resp)    取消
//      * @p-config    {Function}  fail(resp)      失败
//      * @p-config    {Function}  confirm(resp)   成功
//      * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
//      *
//     function weixinShareTimeline(data, callbacks) {
//         callbacks = callbacks || {};
//         var shareTimeline = function (theData) {
//             WeixinJSBridge.invoke('shareTimeline', {
//                 "appid":theData.appId ? theData.appId : '',
//                 "img_url":theData.imgUrl,
//                 "link":theData.link,
//                 "desc":theData.title,
//                 "title":theData.desc, // 注意这里要分享出去的内容是desc
//                 "img_width":"120",
//                 "img_height":"120"
//             }, function (resp) {
//                 switch (resp.err_msg) {
//                     // share_timeline:cancel 用户取消
//                     case 'share_timeline:cancel':
//                         callbacks.cancel && callbacks.cancel(resp);
//                         break;
//                     // share_timeline:fail　发送失败
//                     case 'share_timeline:fail':
//                         callbacks.fail && callbacks.fail(resp);
//                         break;
//                     // share_timeline:confirm 发送成功
//                     case 'share_timeline:confirm':
//                     case 'share_timeline:ok':
//                         callbacks.confirm && callbacks.confirm(resp);
//                         break;
//                 }
//                 // 无论成功失败都会执行的回调
//                 callbacks.all && callbacks.all(resp);
//             });
//         };
//         WeixinJSBridge.on('menu:share:timeline', function (argv) {
//             if (callbacks.async && callbacks.ready) {
//                 window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
//                 if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
//                     window["_wx_loadedCb_"] = new Function();
//                 }
//                 callbacks.dataLoaded = function (newData) {
//                     window["_wx_loadedCb_"](newData);
//                     shareTimeline(newData);
//                 };
//                 // 然后就绪
//                 callbacks.ready && callbacks.ready(argv);
//             } else {
//                 // 就绪状态
//                 callbacks.ready && callbacks.ready(argv);
//                 shareTimeline(data);
//             }
//         });
//     }
//
//     /**
//      * 发送给微信上的好友
//      * @param       {Object}    data       待分享的信息
//      * @p-config    {String}    appId      公众平台的appId（服务号可用）
//      * @p-config    {String}    imageUrl   图片地址
//      * @p-config    {String}    link       链接地址
//      * @p-config    {String}    desc       描述
//      * @p-config    {String}    title      分享的标题
//      *
//      * @param       {Object}    callbacks  相关回调方法
//      * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
//      * @p-config    {Function}  ready(argv)             就绪状态
//      * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
//      * @p-config    {Function}  cancel(resp)    取消
//      * @p-config    {Function}  fail(resp)      失败
//      * @p-config    {Function}  confirm(resp)   成功
//      * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
//
//     function weixinSendAppMessage(data, callbacks) {
//         callbacks = callbacks || {};
//         var sendAppMessage = function (theData) {
//             WeixinJSBridge.invoke('sendAppMessage', {
//                 "appid":theData.appId ? theData.appId : '',
//                 "img_url":theData.imgUrl,
//                 "link":theData.link,
//                 "desc":theData.desc,
//                 "title":theData.title,
//                 "img_width":"120",
//                 "img_height":"120"
//             }, function (resp) {
//                 switch (resp.err_msg) {
//                     // send_app_msg:cancel 用户取消
//                     case 'send_app_msg:cancel':
//                         callbacks.cancel && callbacks.cancel(resp);
//                         break;
//                     // send_app_msg:fail　发送失败
//                     case 'send_app_msg:fail':
//                         callbacks.fail && callbacks.fail(resp);
//                         break;
//                     // send_app_msg:confirm 发送成功
//                     case 'send_app_msg:confirm':
//                     case 'send_app_msg:ok':
//                         callbacks.confirm && callbacks.confirm(resp);
//                         break;
//                 }
//                 // 无论成功失败都会执行的回调
//                 callbacks.all && callbacks.all(resp);
//             });
//         };
//         WeixinJSBridge.on('menu:share:appmessage', function (argv) {
//             if (callbacks.async && callbacks.ready) {
//                 window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
//                 if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
//                     window["_wx_loadedCb_"] = new Function();
//                 }
//                 callbacks.dataLoaded = function (newData) {
//                     window["_wx_loadedCb_"](newData);
//                     sendAppMessage(newData);
//                 };
//                 // 然后就绪
//                 callbacks.ready && callbacks.ready(argv);
//             } else {
//                 // 就绪状态
//                 callbacks.ready && callbacks.ready(argv);
//                 sendAppMessage(data);
//             }
//         });
//     }
//
//     /**
//      * 分享到腾讯微博
//      * @param       {Object}    data       待分享的信息
//      * @p-config    {String}    link       链接地址
//      * @p-config    {String}    desc       描述
//      *
//      * @param       {Object}    callbacks  相关回调方法
//      * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
//      * @p-config    {Function}  ready(argv)             就绪状态
//      * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
//      * @p-config    {Function}  cancel(resp)    取消
//      * @p-config    {Function}  fail(resp)      失败
//      * @p-config    {Function}  confirm(resp)   成功
//      * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
//
//     function weixinShareWeibo(data, callbacks) {
//         callbacks = callbacks || {};
//         var shareWeibo = function (theData) {
//             WeixinJSBridge.invoke('shareWeibo', {
//                 "content":theData.desc,
//                 "url":theData.link
//             }, function (resp) {
//                 switch (resp.err_msg) {
//                     // share_weibo:cancel 用户取消
//                     case 'share_weibo:cancel':
//                         callbacks.cancel && callbacks.cancel(resp);
//                         break;
//                     // share_weibo:fail　发送失败
//                     case 'share_weibo:fail':
//                         callbacks.fail && callbacks.fail(resp);
//                         break;
//                     // share_weibo:confirm 发送成功
//                     case 'share_weibo:confirm':
//                     case 'share_weibo:ok':
//                         callbacks.confirm && callbacks.confirm(resp);
//                         break;
//                 }
//                 // 无论成功失败都会执行的回调
//                 callbacks.all && callbacks.all(resp);
//             });
//         };
//         WeixinJSBridge.on('menu:share:weibo', function (argv) {
//             if (callbacks.async && callbacks.ready) {
//                 window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
//                 if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
//                     window["_wx_loadedCb_"] = new Function();
//                 }
//                 callbacks.dataLoaded = function (newData) {
//                     window["_wx_loadedCb_"](newData);
//                     shareWeibo(newData);
//                 };
//                 // 然后就绪
//                 callbacks.ready && callbacks.ready(argv);
//             } else {
//                 // 就绪状态
//                 callbacks.ready && callbacks.ready(argv);
//                 shareWeibo(data);
//             }
//         });
//     }
//
//     /**
//      * 调起微信Native的图片播放组件。
//      * 这里必须对参数进行强检测，如果参数不合法，直接会导致微信客户端crash
//      *
//      * @param {String} curSrc 当前播放的图片地址
//      * @param {Array} srcList 图片地址列表
//
//     function imagePreview(curSrc,srcList) {
//         if(!curSrc || !srcList || srcList.length == 0) {
//             return;
//         }
//         WeixinJSBridge.invoke('imagePreview', {
//             'current' : curSrc,
//             'urls' : srcList
//         });
//     }
//
//     /**
//      * 显示网页右上角的按钮
//
//     function showOptionMenu() {
//         WeixinJSBridge.call('showOptionMenu');
//     }
//
//
//     /**
//      * 隐藏网页右上角的按钮
//
//     function hideOptionMenu() {
//         WeixinJSBridge.call('hideOptionMenu');
//     }
//
//     /**
//      * 显示底部工具栏
//
//     function showToolbar() {
//         cc.log("function showToolbar()");
//         WeixinJSBridge.call('showToolbar');
//     }
//
//     /**
//      * 隐藏底部工具栏
//
//     function hideToolbar() {
//         WeixinJSBridge.call('hideToolbar');
//     }
//
//
//      * 返回如下几种类型：
//      *
//      * network_type:wifi     wifi网络
//      * network_type:edge     非wifi,包含3G/2G
//      * network_type:fail     网络断开连接
//      * network_type:wwan     2g或者3g
//      *
//      * 使用方法：
//      * WeixinApi.getNetworkType(function(networkType){
//      *
//      * });
//      *
//      * @param callback
//
//     function getNetworkType(callback) {
//         if (callback && typeof callback == 'function') {
//             WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
//                 // 在这里拿到e.err_msg，这里面就包含了所有的网络类型
//                 callback(e.err_msg);
//             });
//         }
//     }
//
//
//      * 关闭当前微信公众平台页面
//
//     function closeWindow() {
//         WeixinJSBridge.call("closeWindow");
//     }
//
//
//      * 当页面加载完毕后执行，使用方法：
//      * WeixinApi.ready(function(Api){
//      *     // 从这里只用Api即是WeixinApi
//      * });
//      * @param readyCallback
//
//     function wxJsBridgeReady(readyCallback) {
//         if (readyCallback && typeof readyCallback == 'function') {
//             var Api = this;
//             var wxReadyFunc = function () {
//                 readyCallback(Api);
//             };
//             if (typeof window.WeixinJSBridge == "undefined"){
//                 if (document.addEventListener) {
//                     document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);
//                 } else if (document.attachEvent) {
//                     document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);
//                     document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);
//                 }
//             }else{
//                 wxReadyFunc();
//             }
//         }
//     }
//
//     return {
//         version         :"1.8",
//         ready           :wxJsBridgeReady,
//         shareToTimeline :weixinShareTimeline,
//         shareToWeibo    :weixinShareWeibo,
//         shareToFriend   :weixinSendAppMessage,
//         showOptionMenu  :showOptionMenu,
//         hideOptionMenu  :hideOptionMenu,
//         showToolbar     :showToolbar,
//         hideToolbar     :hideToolbar,
//         getNetworkType  :getNetworkType,
//         imagePreview    :imagePreview,
//         closeWindow     :closeWindow
//     };
// })();*/
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
