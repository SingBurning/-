// 手牌prefab
let commonConfig = require("./globalConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},

    //传入手牌图片地址，以及手牌对应的牌面数字
    updateCardShow:function (spritepath, cardNumber) {
        this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(spritepath));
        this.isSelected = false;
        this.card = cardNumber;
    },

    cardOnClick:function () {
        if (this.isSelected) {
            this.node.setPosition(cc.p(this.node.position.x, this.node.position.y - 30));
            commonConfig.cardSelect = 0;
        }else{
            this.node.setPosition(cc.p(this.node.position.x, this.node.position.y + 30));
            commonConfig.cardSelect = this.card;
        }

        this.isSelected = !this.isSelected;
    }

});
