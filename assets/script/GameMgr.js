var Player = require('Player');
var Scroller = require('Scroller');

var State = cc.Enum({
    Menu: -1,
    Run : -1,
    Over: -1
});

var GameMgr = cc.Class({
    extends: cc.Component,

    properties: {
        player: Player,

        groundBack: cc.Node,
        //-- 获取gameOver对象
        gameOverMenu: cc.Node,
        //-- 获取分数对象
        scoreText: cc.Label,
    },

    statics: {
        State,

    },

    onLoad:function ()
    {
        cc.game.setFrameRate(30);
        Game.GameMgr = GameMgr;
        Game.Game = this;

        // activate colliders
        cc.director.getCollisionManager().enabled = true;

        //-- 分数
        this.score = 0;
        this.scoreText.string = this.score;

        //-- 游戏状态
        this.State = State.Menu;
        this.gameOverMenu.active = false;
        this.player.active = false;
        this.player.init();

    },

    getPlayerState:function()
    {
        return this.player.state;
    },

    start:function () {
        this.State = State.Run;
        this.score = 0;
        Game.LoopMgr.startSpawn();

        this.player.startRun();
    },

    gameOver:function()
    {
        //Game.LoopMgr.reset();
        this.State = State.Over;
        this.gameOverMenu.active = true;
        this.gameOverMenu.getComponent('GameOver').score.string = this.score;
        this.player.node.active = false;
        Game.LoopMgr.despawnPipe();
        this.CancelFollow();
    },

    gainScore:function()
    {
        //-- 分数+1
        this.score++;
        this.scoreText.string = this.score;
        //-- 分数增加音效
        //cc.audioEngine.playEffect(this.scoreAudio);
    },

    getSpeed:function()
    {
        return this.player.getSpeed();
    },

    getCollision:function()
    {
        return this.bCollision;
    },

    onCollisionEnter:function()
    {
        //Game.LoopMgr.spawnLoop(400);
        this.bCollision = true;
    },

    onCollisionExit:function()
    {
        this.bCollision = false;
    },

    FollowCamera:function()
    {
        var CameraNode = this.node.getChildByName("Camera");
        if(CameraNode)
        {
            var CameraComp = CameraNode.getComponent('cc.Camera');
            if(CameraComp)
            {
                CameraComp._targets[0] = this.player.node;
                CameraComp._targets[1] = this.groundBack.getChildByName("LayerLoop");
            }
        }

        var BottomNode = this.groundBack.getChildByName("groundbottom")
        var BottomCollider = BottomNode.addComponent('cc.BoxCollider');
        if(BottomNode)
        {
            //BottomNode._enabled = true;
            BottomNode.opacity = 0;
        }

    },
    CancelFollow:function()
    {
        var CameraNode = this.node.getChildByName("Camera");
        if(CameraNode)
        {
            var CameraComp = CameraNode.getComponent('cc.Camera');
            if(CameraComp)
            {
                CameraComp._targets[0] = null;
                CameraComp._targets[1] = null;
            }
        }
        var BottomNode = this.groundBack.getChildByName("groundbottom")
        BottomNode.removeComponent('cc.BoxCollider');
        BottomNode.opacity = 255;
    },

    stopSelect:function()
    {
        var SelectNode = this.node.getChildByName("UI").getChildByName("Select");
        var SelectComp = SelectNode.getComponent("Select");
        if(SelectComp)
        {
            SelectNode.run = false;
            SelectNode.active = false;
        }

    },

});
