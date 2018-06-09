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

    //传入手牌图片地址，以及手牌对应的牌面数字(1-54)
    updateCardShow:function (spritepath, cardNumber) {
        this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(spritepath));
        this.isSelected = false;
        this.card = cardNumber;
        cc.log("手牌："+this.card)
    },

    cardOnClick:function () {
        if (this.isSelected) {
            this.node.setPosition(cc.p(this.node.position.x, this.node.position.y - 30));
            let selectIndex = commonConfig.cardSelect.indexOf(this.card);
            commonConfig.cardSelect.splice(selectIndex);
        }else{
            commonConfig.cardSelect = [];
            let handCardsTab = this.node.parent.parent.getComponent("game").myCardsPrefabTab;
            
            for (let index = 0; index < handCardsTab.length; index++) {
                let cardInfo = handCardsTab[index].getComponent("card");
                if (cardInfo.card != this.card) {
                    handCardsTab[index].setPosition(cc.p(handCardsTab[index].position.x, this.node.position.y))
                    cardInfo.isSelected = false;
                }
            }

            this.node.setPosition(cc.p(this.node.position.x, this.node.position.y + 30));
            commonConfig.cardSelect.push(this.card)
            cc.log("选择手牌列表：" + commonConfig.cardSelect.length + "   "+this.card);
        }

        this.isSelected = !this.isSelected;
    }

});
