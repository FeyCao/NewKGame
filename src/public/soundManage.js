/**
 * Created by Administrator on 2016-11-30.
 */

function resumeBgSound(){
    cc.audioEngine.resumeMusic();
}

function pauseBgSound() {
    cc.audioEngine.pauseMusic();
}
var musicFile = "res/sound/home_bg.mp3";
function openBgSound(){
    if(cc.audioEngine.isMusicPlaying()==true)
    {
        resumeBgSound();
    }else{
        cc.audioEngine.playMusic(res.SOUND_HOME_BG,true);
    }
}

function closeBgSound(){

    cc.audioEngine.stopMusic(musicFile);
}
function isBgMusicPlaying() {

    myObj.fun1FromAndroid("调用android本地方法fun1FromAndroid(String name)！！");
    return cc.audioEngine.isMusicPlaying()==true;
}

function  playBuySound() {
    cc.audioEngine.playEffect(res.SOUND_BUY,false);
}
function  playSellSound() {
    cc.audioEngine.playEffect(res.SOUND_SELL,false);
}
function  playLoseSound() {
    cc.audioEngine.playEffect(res.SOUND_LOSE,false);
}
function  playWinSound() {
    cc.audioEngine.playEffect(res.SOUND_WIN,false);
}
//cc.audioEngine.playEffect( clip, false );
// var Singleton = (function () {
//     var instantiated;
//     function init() {
//         /*这里定义单例代码*/
//         return {
//             publicMethod: function () {
//                 cc.log('hello world');
//             },
//             publicProperty: 'test'
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
//
//
// /*调用公有的方法来获取实例:*/
// Singleton.getInstance().publicMethod();