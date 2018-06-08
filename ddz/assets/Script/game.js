// 游戏内
let commonConfig = require("./globalConfig");
let cardsTool = require("./cardsTool");
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
        },

        myHeadSp:{
            default:null,
            type:cc.Sprite
        },

        myNameLabel:{
            default:null,
            type:cc.Label
        },

        myDiZhuIconNode:{
            default:null,
            type:cc.Node
        },

        callDiZhuNode:{
            default:null,
            type:cc.Node
        },

        qiangDiZhuNode:{
            default:null,
            type:cc.Node
        },

        selectNode:{
            default:null,
            type:cc.Node
        },

        cardPrefab:{
            default:null,
            type:cc.Prefab
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

        let headNode_L = this.leftNode.getChildByName("headleft");
        this.headSp_L = headNode_L.getChildByName("headIconLeft").getComponent(cc.Sprite);
        this.dizhuIconNode_L = headNode_L.getChildByName("dizhuIcon");
        this.playerNameLabel_L = this.leftNode.getChildByName("leftNameLabel").getComponent(cc.Label);
        this.cardsCountLabel_L = this.leftNode.getChildByName("leftCardBack").getChildByName("leftCardNumLabel").getComponent(cc.Label);
        this.callDiZhuLabel_L = this.leftNode.getChildByName("callDiZhuLabel").getComponent(cc.Label);

        let headNode_R = this.rightNode.getChildByName("headright");
        this.headSp_R = headNode_R.getChildByName("headIconRight").getComponent(cc.Sprite);
        this.dizhuIconNode_R = headNode_R.getChildByName("dizhuIcon");
        this.playerNameLabel_R = this.rightNode.getChildByName("rightNameLabel").getComponent(cc.Label);
        this.cardsCountLabel_R = this.rightNode.getChildByName("rightCardBack").getChildByName("rightCardNumLabel").getComponent(cc.Label);
        this.callDiZhuLabel_R = this.rightNode.getChildByName("callDiZhuLabel").getComponent(cc.Label);

        //[n,m]随机数公式Math.floor(Math.random()*(m-n+1))+n
        let headIndex_L = this.randomInt(1, 10);
        let headSpName_L = headIndex_L + ".png";
        this.leftHeadSpName = headSpName_L;

        let headIndex_R = this.randomInt(1, 10);
        let headSpName_R = headIndex_R + ".png";
        this.rightHeadSpName = headSpName_R;

        this.leftNickName = this.randomRobotName();
        this.rightNickName = this.randomRobotName();

        // this.totalcardsTab = this.buildCardsTab();
        this.myCardsPrefabTab = new Array();
    },

    start () {
        this.gameTypeLabel.string = commonConfig.gameType;
        
        for (let index = 0; index < this.finalCardsTab.length; index++) {
            this.finalCardsTab[index].node.active = false;
        }
        this.showCardSp.node.active = false;
        this.leftNode.active = false;
        this.rightNode.active = false;
        this.clockNode.active = false;

        this.myDiZhuIconNode.active = false;
        this.myHeadSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/headIcon/" + commonConfig.playerHeadSp));
        this.myNameLabel.string = commonConfig.playerName;

        this.callDiZhuNode.active = false;
        this.qiangDiZhuNode.active = false;
        this.selectNode.active = false;

        this.callDiZhuLabel_L.string = "";
        this.callDiZhuLabel_R.string = "";

        this.scheduleOnce(function () {
            this.startGameBtnNode.active = true;
        }, 0.5);
    },

    buildCardsTab:function () {
        let cardsTab = [];
        for (let i = 0; i < 54; i++) {
            let indexValue = i + 1;
            cardsTab.push(indexValue);
        }

        return cardsTab;
    },

    randomInt:function (n,m) {
        let randomX = Math.floor(Math.random()*(m - n + 1));
        return randomX;
    },

    randomRobotName:function () {
        let nameIndex = this.randomInt(0,10);
        return commonConfig.nickNameDefault[nameIndex];
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
        this.totalcardsTab = this.buildCardsTab();
        event.target.active = false;
        this.initLeftAndRight(true)
        
        this.initAllPlayerCards();
        // this.initShowMyCards();

        this.scheduleOnce(function () {
            this.callDiZhuNode.active = true;
        }, 0.5)
    },

    initLeftAndRight:function (isshow) {
        if (isshow) {
            this.headSp_L.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/headIcon/" + this.leftHeadSpName))
            this.playerNameLabel_L.string = this.leftNickName;
            this.dizhuIconNode_L.active = false;
            this.cardsCountLabel_L.string = "17";

            this.headSp_R.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/headIcon/" + this.rightHeadSpName))
            this.playerNameLabel_R.string = this.rightNickName;
            this.dizhuIconNode_R.active = false;
            this.cardsCountLabel_R.string = "17";

            for (let index = 0; index < this.finalCardsTab.length; index++) {
                this.finalCardsTab[index].spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/cards/card_back.png"));
                this.finalCardsTab[index].node.active = true;
            }
        }

        this.leftNode.active = isshow;
        this.rightNode.active = isshow;
    },

    callDizhuSelectOnClick:function (event, customEventData) {
        
        switch (customEventData) {
            case "call":
                this.myDiZhuIconNode.active = true;
                for (let index = 0; index < this.dizhuCardsTab.length; index++) {
                    let dizhuSpPath = cardsTool.getCardSpriteFramePath(this.dizhuCardsTab[index]);
                    this.finalCardsTab[index].spriteFrame = new cc.SpriteFrame(cc.url.raw(dizhuSpPath));
                    this.myCardsTab.push(this.dizhuCardsTab[index]);
                }
                this.initShowMyCards();
                commonConfig.dizhuIndex = 1;
                break;
            case "not":
                let randomDiZhu = Math.floor(Math.random()*2);
                if (randomDiZhu > 1) {
                    this.dizhuIconNode_R.active = true;
                    commonConfig.dizhuIndex = 2;
                }else{
                    this.dizhuIconNode_L.active = true;
                    commonConfig.dizhuIndex = 3;
                }

                for (let index = 0; index < this.dizhuCardsTab.length; index++) {
                    let dizhuSpPath = cardsTool.getCardSpriteFramePath(this.dizhuCardsTab[index]);
                    this.finalCardsTab[index].spriteFrame = new cc.SpriteFrame(cc.url.raw(dizhuSpPath));
                    if (randomDiZhu > 1) {
                        this.rightCardsTab.push(this.dizhuCardsTab[index]);
                    }else{
                        this.leftCardsTab.push(this.dizhuCardsTab[index]);
                    }
                }

                this.updateRobotCardsCount()
                break;
            default:
                break;
        }

        this.callDiZhuNode.active = false;
    },

    updateRobotCardsCount:function () {
        let leftCount = this.leftCardsTab.length;
        let rightCount = this.rightCardsTab.length;
        this.cardsCountLabel_L.string = leftCount.toString();
        this.cardsCountLabel_R.string = rightCount.toString();
    },

    initAllPlayerCards:function () {
        let CardsTab_0 =cardsTool.allocationCards(this.totalcardsTab);
        this.myCardsTab = CardsTab_0.tab_1;
        let CardsTab_1 = cardsTool.allocationCards(CardsTab_0.tab_2);
        this.rightCardsTab = CardsTab_1.tab_1;
        let CardsTab_2 = cardsTool.allocationCards(CardsTab_1.tab_2);
        this.leftCardsTab = CardsTab_2.tab_1;
        this.dizhuCardsTab = CardsTab_2.tab_2;

        // this.myCardsTab.sort();
        this.rightCardsTab.sort();
        this.leftCardsTab.sort();
        this.dizhuCardsTab.sort();

        this.scheduleOnce(function () {
            this.initShowMyCards();
        }, 0.5)
        
    },

    initShowMyCards:function () {
        this.myCardsPrefabTab = [];
        for (let index = 0; index < this.myCardsTab.length; index++) {
            let spPath = cardsTool.getCardSpriteFramePath(this.myCardsTab[index]);
            let card = cc.instantiate(this.cardPrefab);

            let cardScript = card.getComponent("card");
            cardScript.updateCardShow(spPath, this.myCardsTab[index]);
            this.node.addChild(card);
            this.myCardsPrefabTab.push(card);
        }

        this.updateShowMyCards();
    },

    updateShowMyCards:function () {
        let myCardsCount = this.myCardsTab.length;
        let yushu = myCardsCount % 2;
        let firstCardX = -400;
        let cardY = -250;
        if (yushu == 1) {
            firstCardX =  0 - (Math.floor(myCardsCount / 2) * 45);
        }else{
            firstCardX = 25 - (Math.floor(myCardsCount / 2) * 45);
        }

        for (let index = 0; index < this.myCardsPrefabTab.length; index++) {
            this.myCardsPrefabTab[index].setPosition(cc.p(firstCardX + (index * 50), cardY));
        }
    },


    // update (dt) {},
});
