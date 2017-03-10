/**
 * Created by Administrator on 2017-3-8.
 */
var WinGameUI = BaseLayer.extend({
    listener:null,
    btnListener:null,
    num:0,
    share:null,
    playAgain:null,
    mainUI:null,
    time:null,
    desprition:null,//获胜描述
    ctor:function(mainUI,time){
        this._super(cc.color(0,0,0,180),640,960);

        this.mainUI = mainUI;
        this.time = time;


        this.share = new cc.Sprite(res.share);
        this.addChild(this.share);
        this.share.x = WINSIZE.width/2 - 68;
        this.share.y = WINSIZE.height/2;

        this.playAgain = new cc.Sprite(res.playAgain);
        this.addChild(this.playAgain);
        this.playAgain.x = this.share.x + 150;
        this.playAgain.y = this.share.y;


        var str = "太棒了，你用时"+this.time.toFixed(2)+"秒完成游戏";
        this.desprition = new cc.LabelTTF(str, "Verdana", 24);
        this.addChild(this.desprition);
        this.desprition.x =  WINSIZE.width/2;
        this.desprition.y = this.share.y + 100;

        var self = this;
        this.btnListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.opacity = 180;
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                target.setOpacity(255);
                if(target ==  self.playAgain){
                    self.mainUI.start();
                    self.destroy();
                }
                console.log("logged!:"+(++self.num));
            }
        });

        cc.eventManager.addListener(this.btnListener, this.share);
        cc.eventManager.addListener(this.btnListener.clone(), this.playAgain);
    },
    destroy:function(){
        BaseLayer.prototype.destory.apply(this,arguments);
        this.removeChild(this.desprition);
        this.removeChild(this.playAgain);
        this.removeChild(this.share);
        cc.eventManager.removeListener(this.btnListener);
        this.removeFromParent();
    }
});