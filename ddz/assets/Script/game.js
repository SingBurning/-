// 游戏内
let commonConfig = require("./globalConfig")
cc.Class({
    extends: cc.Component,

    properties: {
        menuLayerNode:{
            default:null,
            type:cc.Node
        },

        gameTypeLabel:{
            default:null,
            type:cc.Label
        },

        finalCardsTab:{
            default:[],
            type:cc.Sprite
        },

        helpLayerNode:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.menuLayerNode.setScale(1,0);
        this.menuLayerOpen = false;
        this.startGameBtnNode = this.node.getChildByName("startGameButton");
        this.showCardSp = this.node.getChildByName("showCard").getComponent(cc.Sprite);
        this.leftNode = this.node.getChildByName("playerLeft");
        this.rightNode = this.node.getChildByName("playerRight");
        this.clockNode = this.node.getChildByName("clock");
    },

    start () {
        this.gameTypeLabel.string = commonConfig.gameType;
        this.startGameBtnNode.active = true;
        for (let index = 0; index < this.finalCardsTab.length; index++) {
            this.finalCardsTab[index].node.active = false;
        }
        this.showCardSp.node.active = false;
        this.leftNode.active = false;
        this.rightNode.active = false;
        this.clockNode.active = false;
    },

    menuBtnOnClick:function (event) {
        let menuBtnSp = event.target.getComponent(cc.Sprite);
        if (this.menuLayerOpen) {
            menuBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_menu.png"));
            this.menuLayerNode.runAction(cc.scaleTo(0.2,1,0));
        }else{
            menuBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_menu_pressed.png"));
            this.menuLayerNode.runAction(cc.scaleTo(0.2,1,1));
        }
        
        this.menuLayerOpen = !this.menuLayerOpen
    },

    backBtnOnClick:function () {
        commonConfig.nextSceneName = "HallScene";
        cc.director.loadScene("LoadingScene");
    },

    menuListBtnOnClick:function (event, customEventData) {
        let onClickBtnSp = event.target.getComponent(cc.Sprite);
        switch (customEventData) {
            case "music":
                if (commonConfig.musicTurn == "on") {
                    onClickBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_music_pressed.png"));
                    commonConfig.musicTurn = "off";
                }else{
                    onClickBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_music.png"));
                    commonConfig.musicTurn = "on";
                }
                cc.sys.localStorage.setItem(commonConfig.playerName + "_music", commonConfig.musicTurn);
                break;
            case "sound":
                if (commonConfig.soundTurn == "on") {
                    onClickBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_sound_pressed.png"));
                    commonConfig.soundTurn = "off";
                }else{
                    onClickBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_sound.png"));
                    commonConfig.soundTurn = "on";
                }
                cc.sys.localStorage.setItem(commonConfig.playerName + "_sound", commonConfig.soundTurn);
                break;
            case "help":
                this.helpLayerNode.active = true;
                break;
        
            default:
                break;
        }
    },

    helpLayerCloseOnClick:function () {
        this.helpLayerNode.active = false;
    },

    startBtnOnClick:function (event) {
        event.target.active = false;
    },

    initLeftAndRight:function (isshow) {
        if (isshow) {
            let headNode_L = this.leftNode.getChildByName("headleft");
            this.headSp_L = headNode_L.getChildByName("headIconLeft").getComponent(cc.Sprite);
            this.dizhuIconNode_L = headNode_L.getChildByName("dizhuIcon");
            this.playerNameLabel_L = this.leftNode.getChildByName("leftNameLabel").getComponent(cc.Label);
            this.cardsCountLabel_L = this.leftNode.getChildByName("leftCardBack").getChildByName("leftCardNumLabel").getComponent(cc.Label);

            let headNode_R = this.rightNode.getChildByName("headright");
            this.headSp_R = headNode_R.getChildByName("headIconRight").getComponent(cc.Sprite);
            this.dizhuIconNode_R = headNode_R.getChildByName("dizhuIcon");
            this.playerNameLabel_R = this.leftNode.getChildByName("rightNameLabel").getComponent(cc.Label);
            this.cardsCountLabel_R = this.leftNode.getChildByName("rightCardBack").getChildByName("rightCardNumLabel").getComponent(cc.Label);
        }

        this.leftNode.active = isshow;
    }


    // update (dt) {},
});
