/**
 * Created by Administrator on 2016-11-30.
 */
var Singleton = (function () {
    var instantiated;
    function init() {
        /*这里定义单例代码*/
        return {
            publicMethod: function () {
                cc.log('hello world');
            },
            publicProperty: 'test'
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