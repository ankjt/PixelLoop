const LoopGroup = require('Loop');

cc.Class({
    extends: cc.Component,

    properties: {
        loopPrefab: cc.Prefab,
        loopLayer: cc.Node,
        initLoopX: 0,
        initLoopY: 0,
        //-- 创建PipeGroup需要的时间
        spawnInterval: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () 
    { 
        Game.LoopMgr = this;
    },

    startSpawn () {
        //this.spawnLoop();
        //this.schedule(this.spawnLoop, this.spawnInterval);
        this.node.active = true;
    },

    //-- 创建圆
    spawnLoop (loopY = 0) {
        let loopGroup = null;
        if (cc.pool.hasObject(loopGroup)) {
            loopGroup = cc.pool.getFromPool(loopGroup);
        } else {
            loopGroup = cc.instantiate(this.loopPrefab).getComponent(LoopGroup);
        }
        this.loopLayer.addChild(loopGroup.node);
        loopGroup.node.active = true;
        loopGroup.node.x = this.initLoopX;
        loopGroup.node.y = this.initLoopY;
    },
    despawnPipe (loop) {
        //loop.node.removeFromParent();
        //loop.node.active = false;
        //cc.pool.putInPool(loop);
        this.node.active = false;
    },
    reset () {
        //this.despawnPipe();
        //this.unschedule(this.spawnLoop);
    }
});
