//-- 角色状态
var State = cc.Enum({
    None   : -1,
    Run    : -1,
    Jump   : -1,
    Drop   : -1,
    DropEnd: -1,
    Dead   : -1
});

var Color = cc.Enum({
    Red : 0,
    Blue : 1,
    Green: 2,
    Yellow: 3,
});
var Player = cc.Class({
    extends: cc.Component,

    properties: {
        // 颜色
        color:Color.Red,
        //-- Y轴最大高度
        maxY: 0,
        //-- 地面高度
        groundY: 0,
        //-- 重力
        gravity: 0,
        //-- 起跳速度
        initJumpSpeed: 0,
        //-- 绵羊状态
        collisonNum:0,
        _state: {
            default: State.None,
            type: State,
            visible: false
        },
        state: {
            get: function () {
                return this._state;
            },
            set: function(value){
                if (value !== this._state) {
                    this._state = value;
                    if (this._state !== State.None) {
                        var animName = State[this._state];
                        this.anim.stop();
                        this.anim.play();
                    }
                }
            },
            type: State
        },
    },

    init () {

        var entity = this.getEntity(this.color);

        //-- 当前播放动画组件
        this.anim = entity.getComponent(cc.Animation);
        //-- 当前速度
        this.currentSpeed = 0;
        //-- 绵羊图片渲染
        this.sprite = entity.getComponent(cc.Sprite);
        this.registerInput();

    },
    startRun () {
        this.node.active = true;
        this.state = State.Run;
        this.enableInput(true);
    },
    //-- 初始化
    registerInput () {
        //-- 添加绵羊控制事件(为了注销事件缓存事件)
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                this.jump();
            }.bind(this)
        }, this.node);
        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                this.jump();
                return true;
            }.bind(this)
        }, this.node);
    },
    //-- 删除
    enableInput: function (enable) {
        if (enable) {
            cc.eventManager.resumeTarget(this.node);
        } else {
            cc.eventManager.pauseTarget(this.node);
        }
    },

    getEntity:function(color)
    {
        this.color = color;
        var key = "";
        switch(color)
        {
        case Color.Red:
            {
                key = "red";
                break;
            }
        case Color.Blue:
            {
                key = "blue";
                break;
            }
        case Color.Green:
            {
                key = "green";
                break;
            }
        case Color.Yellow:
            {
                key = "yellow";
                break;
            }
        }

        var childrens = this.node._children;
        for(var i = 0;i < childrens.length;i++)
        {
            var Value = childrens[i];
            if(Value && Value.name == key)
            {
                Value.active = true;
            }else
            {
                Value.active = false;
            }
        }

        var entity = this.node.getChildByName(key);
        return entity;
    },


    //-- 更新
    update (dt) {
        switch (this.state) {
            case State.Jump:
                if (this.currentSpeed < 0) {
                    this.state = State.Drop;
                }
                break;
            case State.Drop:
                if (this.node.y < this.groundY) {
                    this.node.y = this.groundY;
                    this.state = State.DropEnd;
                    this.spawnDust();
                }
                break;
            case State.None:
            case State.Dead:
                return;
        }
        var flying = this.state === State.Jump || this.node.y > this.groundY;
        if (flying) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
        }
 
    },

    // invoked by animation
    onDropFinished () {
        this.state = State.Run;
    },

        //-- 开始跳跃设置状态数据，播放动画
    jump: function () {
        this.state = State.Jump;
        this.currentSpeed = this.initJumpSpeed;
        //-- 播放跳音效
        //cc.audioEngine.playEffect(this.jumpAudio);
        this.spawnDust();
    },

    getSpeed:function()
    {
        return this.currentSpeed;
    },

    getPos:function()
    {
        return {x:this.node.x,y:this.node.y};
    },

    spawnDust (animName) {
        /*
        let dust = null;
        if (cc.pool.hasObject(Dust)) {
            dust = cc.pool.getFromPool(Dust);
        } else {
            dust = cc.instantiate(this.dustPrefab).getComponent(Dust);
        }
        this.node.parent.addChild(dust.node);
        dust.node.position = this.node.position;
        dust.playAnim();
        */
    },

    onCollisionEnter: function (other) {
        if (this.state !== State.Dead) {
            var group = cc.game.groupList[other.node.groupIndex];
            if (group === 'Obstacle') {
                // bump
                this.state = State.Dead;
                Game.Game.gameOver();
                this.enableInput(false);
            }
            else if (group === 'NextLoop') {
                // jump over

                if(this.color == other.tag)
                {
                    cc.log("Enter Y:" + this.node.y + ",tag:" + other.tag);
                    this.collisonNum++;

                    if(this.collisonNum % 2 == 1)
                    {
                        Game.Game.gainScore();
                        Game.Game.onCollisionEnter();
                    }

                    
                }else if(other.tag == 4)
                {
                    cc.log("CollisionEnter Center");
                    var scoreNode = other.node._parent.getChildByName("score");
                    var dingNode = other.node._parent.getChildByName("ding");
                    if(scoreNode && dingNode)
                    {
                        var anim = dingNode.getComponent(cc.Animation);
                        anim.on('finished',  function(Node){
                            scoreNode.active = false;
                            dingNode.active = false;
                        }, scoreNode);

                        anim.play("dingClip");
                        
                    }


                }else
                {
                    this.state = State.Dead;
                    Game.Game.gameOver();
                    this.enableInput(false);
                    cc.log("GameOver");
                }

                
            }else if(group == 'Select')
            {
                var select = other.node.getComponent('Select');
                this.getEntity(select.getColor());
                Game.Game.FollowCamera();
                Game.Game.stopSelect();
            }
       }
    }, 

    onCollisionExit:function (other)
    {
        //cc.log("Exit Y:" + this.node.y);
        Game.Game.onCollisionExit();
    },

    onCollisionStay:function (other)
    {
        //cc.log("Stay Y:" + this.node.y);
    },
});
