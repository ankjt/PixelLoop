
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0,
        botYRange: cc.p(0, 0),
        spacingRange: cc.p(0, 0),
        degree:0,
    },
    onEnable:function () 
    {
        /*
        let botYPos = this.botYRange.x + Math.random() * (this.botYRange.y - this.botYRange.x);
        let space = this.spacingRange.x + Math.random() * (this.spacingRange.y - this.spacingRange.x);
        let topYPos = botYPos + space;
        this.node.y = topYPos;
        */
    },

    update (dt) {
        if (Game.Game.State !== Game.GameMgr.State.Run) {
            return;
        }
        this.degree = this.degree + 115/30;
        this.node.rotation = this.degree;

        if(Game.Game.getPlayerState() !== 2)
        {
            return;
        }

        //this.node.y += (-Game.Game.getSpeed()) * dt;  

        var disappear = this.node.getBoundingBoxToWorld().yMax < 0;
        if (disappear) {
            Game.LoopMgr.despawnPipe(this);
        }
    }
});
