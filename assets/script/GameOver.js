
cc.Class({
    extends: cc.Component,

    properties: {
        btn_play: cc.Button,
        score: cc.Label
    },

    // 加载Game场景(重新开始游戏)
    restart: function () {
        cc.director.loadScene('GameScene');
    },

    // update (dt) {},
});
