/**
 * Created by Administrator on 2017-4-11.
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