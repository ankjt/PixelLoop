cc.Class({
    extends: cc.Component,

    properties: {
        // 滚动的速度，单位px/s
        speed: 1,
        // x到达此位置后开始重头滚动
        resetY: -4096
    },

    update (dt) {
        if(Game.Game.State !== Game.GameMgr.State.Run)
        {
            return;
        }

        if(Game.Game.getPlayerState() !== 2)
        {
            return;
        }

        var y = this.node.y;
        y += this.speed * dt;

        if(y <= this.resetY)
        {
            y -= this.resetY;
        }

        //this.node.y = y;
    },

});