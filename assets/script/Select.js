var Color = cc.Enum({
    Red : 0,
    Blue : 1,
    Green: 2,
    Yellow: 3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        color:Color.Red,
        lastTime:0,
        run:false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.run = true;
    },

    getColor:function()
    {
        return this.color;
    },

    update:function (dt) 
    {
        if(!this.run)
        {
            return;
        }
        this.lastTime += dt;
        this.color = Math.floor(Math.random() * 4);

        if(this.lastTime < 2)
        {
            return;
        }
        this.lastTime = 0;
        var key = "";
        switch(this.color)
        {
        case Color.Red:
            {
                key = "redqiu";
                break;
            }
        case Color.Blue:
            {
                key = "blueqiu";
                break;
            }
        case Color.Green:
            {
                key = "greenqiu";
                break;
            }
        case Color.Yellow:
            {
                key = "yellowqiu";
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
        if(entity)
        {
            var anim = entity.getComponent(cc.Animation);
            //anim.stop();
            //anim.play();
        }
        

    },
});
