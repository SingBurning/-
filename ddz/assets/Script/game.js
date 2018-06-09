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
        },

        dizhuWinNode:{
            default:null,
            type:cc.Node
        },

        nongminWinNode:{
            default:null,
            type:cc.Node
        },

        cardSound:{
            default:null,
            url:cc.AudioClip
        },

        btnSound:{
            default:null,
            url:cc.AudioClip
        },

        bgMusic:{
            default:null,
            type:cc.AudioSource,
        },

        winSound:{
            default:null,
            url:cc.AudioClip
        },

        loseSound:{
            default:null,
            url:cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.menuLayerNode.setScale(1,0);
        this.menuLayerOpen = false;
        this.startGameBtnNode = this.node.getChildByName("startGameButton");
        this.showCardSp = this.node.getChildByName("showCard").getComponent(cc.Sprite);
        cc.log("showCardSp" + typeof(this.showCardSp))
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
        this.lastPlayeIndex = 0;

        this.gameRuleBtn = this.helpLayerNode.getChildByName("guizeButton").getComponent(cc.Button);
        this.gameInfoBtn = this.helpLayerNode.getChildByName("jieshaoButton").getComponent(cc.Button);
        this.gameContentLabel = this.helpLayerNode.getChildByName("contentLabel").getComponent(cc.Label);

        this.cardsShowNode = this.node.getChildByName("cardsShowNode");
    },

    start () {
        this.gameTypeLabel.string = commonConfig.gameType;

        if (commonConfig.musicTurn == "on") {
            this.bgMusic.resume();
        }else if(commonConfig.musicTurn == "on"){
            this.bgMusic.pause();
        }
        
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

        this.dizhuWinNode.active = false;
        this.nongminWinNode.active = false;

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
        let randomX = Math.floor(Math.random()*(m - n + 1)) + 1;
        return randomX;
    },

    randomRobotName:function () {
        let nameIndex = Math.floor(Math.random()*10);
        return commonConfig.nickNameDefault[nameIndex];
    },

    menuBtnOnClick:function (event) {
        this.playBtnSound();
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
        this.playBtnSound();
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
                    this.bgMusic.pause();
                }else{
                    onClickBtnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/btn_music.png"));
                    commonConfig.musicTurn = "on";
                    this.bgMusic.resume();
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

        this.playBtnSound();
    },

    helpLayerCloseOnClick:function () {
        this.playBtnSound();
        this.gameRuleBtn.interactable = false;
        this.gameInfoBtn.interactable = true;
        this.gameContentLabel.string = commonConfig.rule;
        this.helpLayerNode.active = false;
    },

    startBtnOnClick:function (event) {
        this.playBtnSound();
        this.totalcardsTab = this.buildCardsTab();
        event.target.active = false;

        this.dizhuWinNode.active = false;
        this.nongminWinNode.active = false;

        this.showCardSp.node.active = false;
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
        this.playBtnSound();
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
                this.lastPlayeIndex = 1;
                this.selectNode.active = true;
                break;
            case "not":
                let randomDiZhu = Math.floor(Math.random()*2);

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

                if (randomDiZhu > 1) {
                    this.dizhuIconNode_R.active = true;
                    this.randomShowCard(2);
                    this.scheduleOnce(function () {
                        this.detectionTurnToShowCard(2);
                    },2)
                }else{
                    this.dizhuIconNode_L.active = true;
                    commonConfig.dizhuIndex = 3;
                    this.randomShowCard(3);
                    this.scheduleOnce(function () {
                        this.detectionTurnToShowCard(3);
                    },1)
                }

                
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
        if (this.myCardsPrefabTab.length > 0) {
            for (let index = 0; index < this.myCardsPrefabTab.length; index++) {
                this.myCardsPrefabTab[index].destroy();
            }
            this.myCardsPrefabTab = [];
        }
        
        for (let index = 0; index < this.myCardsTab.length; index++) {
            let spPath = cardsTool.getCardSpriteFramePath(this.myCardsTab[index]);
            let card = cc.instantiate(this.cardPrefab);

            let cardScript = card.getComponent("card");
            cardScript.updateCardShow(spPath, this.myCardsTab[index]);
            this.cardsShowNode.addChild(card);
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

    //检测是否赢牌
    detectionWin:function () {
        let myCardsCount_left = this.myCardsTab.length;
        let rigthtCardsCount_left = this.rightCardsTab.lenth;
        let leftCardsCount_left = this.leftCardsTab.length;

        if (myCardsCount_left == 0) {
            if (commonConfig.dizhuIndex == 1) {
                this.updateFinishShow(true);
                this.playFinalSound(true);
            }else{
                this.updateFinishShow(false);
                this.playFinalSound(false);
            }
            return true;
        } else if (rigthtCardsCount_left == 0){
            if (commonConfig.dizhuIndex == 2) {
                this.updateFinishShow(true);
                this.playFinalSound(false);
            } else {
                this.updateFinishShow(false);
                this.playFinalSound(true);
            }
            return true;
        } else if(leftCardsCount_left == 0){
            if (commonConfig.dizhuIndex == 3) {
                this.updateFinishShow(true);
                this.playFinalSound(false);
            } else {
                this.updateFinishShow(false);
                this.playFinalSound(true);
            }
            return true;
        }

        return false;
    },

    updateFinishShow:function (isWin) {
        this.dizhuWinNode.active = isWin;
        this.nongminWinNode.active = !isWin;
        this.startGameBtnNode.active = true;

        //清空界面数据
        if (this.myCardsPrefabTab.length > 0) {
            for (let index = 0; index < this.myCardsPrefabTab.length; index++) {
                this.myCardsPrefabTab[index].destroy();
            }
            this.myCardsPrefabTab = [];
        }

        this.myCardsTab = [];
        this.leftCardsTab = [];
        this.rightCardsTab = [];
    },

    //检测是否该玩家出牌
    detectionTurnToShowCard:function (index) {
        let checkOutFinal = this.detectionWin();
        if (checkOutFinal) {
            return;
        }
        let turnIndex = index + 1;
        if (index == 3) {
            turnIndex = 1;
        }
        this.selectNode.active = (turnIndex == 1);
        if (turnIndex == 2) {
            this.callDiZhuLabel_R.string = "";
            if (this.lastPlayeIndex == turnIndex) {
                this.randomShowCard(turnIndex);
            }else{
                let checkOutResult = cardsTool.detectionCards(commonConfig.lastCardNum, this.rightCardsTab);
                if (checkOutResult.bigger) {
                    let checkOutCard = cardsTool.getCardSpriteFramePath(this.rightCardsTab[checkOutResult.cardIndex]);
                    this.showCardSp.node.active = true;
                    this.showCardSp.spriteFrame = new cc.SpriteFrame(cc.url.raw(checkOutCard));
                    commonConfig.lastCardNum = this.rightCardsTab[checkOutResult.cardIndex];
                    this.rightCardsTab.splice(checkOutResult.cardIndex,1);
                    this.cardsCountLabel_R.string = this.rightCardsTab.length;
                    this.lastPlayeIndex = turnIndex;
                    this.playCardSound();
                } else {
                    this.callDiZhuLabel_R.string = "不出";
                }
            }
            this.scheduleOnce(function () {
                this.detectionTurnToShowCard(turnIndex);
            },2)
        } else if(turnIndex == 3) {
            this.callDiZhuLabel_L.string = "";
            if (this.lastPlayeIndex == turnIndex) {
                this.randomShowCard(turnIndex);
            }else{
                let checkOutResult = cardsTool.detectionCards(commonConfig.lastCardNum, this.leftCardsTab);
                if (checkOutResult.bigger) {
                    let checkOutCard = cardsTool.getCardSpriteFramePath(this.leftCardsTab[checkOutResult.cardIndex]);
                    this.showCardSp.node.active = true;
                    this.showCardSp.spriteFrame = new cc.SpriteFrame(cc.url.raw(checkOutCard));
                    commonConfig.lastCardNum = this.leftCardsTab[checkOutResult.cardIndex];
                    this.leftCardsTab.splice(checkOutResult.cardIndex,1);
                    this.cardsCountLabel_L.string = this.leftCardsTab.length;
                    this.lastPlayeIndex = turnIndex;
                    this.playCardSound();
                } else {
                    this.callDiZhuLabel_L.string = "不出";
                }
            }
            this.scheduleOnce(function () {
                this.detectionTurnToShowCard(turnIndex);
            },1)
        }
    },

    //随机出牌
    randomShowCard:function (playerindex) {
        if (playerindex == 1) {
            
        }else if (playerindex == 2) {
            this.lastPlayeIndex = 2;
            let randomCardIndex = Math.floor(Math.random()*this.rightCardsTab.length)
            let randomCard = cardsTool.getCardSpriteFramePath(this.rightCardsTab[randomCardIndex]);
            this.showCardSp.node.active = true;
            this.showCardSp.spriteFrame = new cc.SpriteFrame(cc.url.raw(randomCard));
            commonConfig.lastCardNum = this.rightCardsTab[randomCardIndex];
            this.rightCardsTab.splice(randomCardIndex,1);
            this.cardsCountLabel_R.string = this.rightCardsTab.length;
            this.playCardSound();
        }else if (playerindex == 3) {
            this.lastPlayeIndex = 3;
            let randomCardIndex = Math.floor(Math.random()*this.leftCardsTab.length)
            let randomCard = cardsTool.getCardSpriteFramePath(this.leftCardsTab[randomCardIndex]);
            this.showCardSp.node.active = true;
            this.showCardSp.spriteFrame = new cc.SpriteFrame(cc.url.raw(randomCard));
            commonConfig.lastCardNum = this.leftCardsTab[randomCardIndex];
            this.leftCardsTab.splice(randomCardIndex,1);
            this.cardsCountLabel_L.string = this.leftCardsTab.length;
            this.playCardSound();
        }
    },

    selectBtnOnClick:function (event, customEventData) {
        this.playBtnSound();
        this.selectNode.active = false;
        switch (customEventData) {
            case "yes":
                this.checkOutMyShowCard();
                break;
            case "no":
                this.scheduleOnce(function () {
                    this.detectionTurnToShowCard(1);
                },1);
                break;
            default:
                break;
        }
    },

    //检测自己手牌手否符合出牌规则
    checkOutMyShowCard:function () {
        if (commonConfig.cardSelect.length < 1) {
            return;
        }else{
            if (commonConfig.cardSelect.length < 1) {
                return;
            }
            if (this.lastPlayeIndex == 1) {
                let selectCardSpFrame = cardsTool.getCardSpriteFramePath(commonConfig.cardSelect[0]);
                cc.log("选择的："+commonConfig.cardSelect[0]);
                this.showCardSp.node.active = true;
                this.showCardSp.spriteFrame = new cc.SpriteFrame(cc.url.raw(selectCardSpFrame));
                let cardIndex = this.myCardsTab.indexOf(commonConfig.cardSelect[0]);
                commonConfig.lastCardNum = commonConfig.cardSelect[0];
                cc.log("删除前："+this.myCardsTab.length+"  "+this.myCardsPrefabTab.length)
                this.myCardsTab.splice(cardIndex,1);
                this.myCardsPrefabTab[cardIndex].destroy();
                this.myCardsPrefabTab.splice(cardIndex,1);
                cc.log("删除后："+this.myCardsTab.length+"  "+this.myCardsPrefabTab.length)
                this.updateShowMyCards();
                this.lastPlayeIndex = 1;
                this.scheduleOnce(function () {
                    this.detectionTurnToShowCard(1);
                },1);
            } else {
                let myCardSelectValue = cardsTool.exchangeCardForTrueValue(commonConfig.cardSelect[0]);
                let lastCardValue = cardsTool.exchangeCardForTrueValue(commonConfig.lastCardNum);
                if (myCardSelectValue > lastCardValue) {
                    let selectCardSpFrame = cardsTool.getCardSpriteFramePath(commonConfig.cardSelect[0]);
                    this.showCardSp.node.active = true;
                    this.showCardSp.spriteFrame = new cc.SpriteFrame(cc.url.raw(selectCardSpFrame));
                    let cardIndex = this.myCardsTab.indexOf(commonConfig.cardSelect[0]);
                    commonConfig.lastCardNum = commonConfig.cardSelect[0];
                    this.myCardsTab.splice(cardIndex,1);
                    this.myCardsPrefabTab[cardIndex].destroy();
                    this.myCardsPrefabTab.splice(cardIndex,1);
                    this.updateShowMyCards();
                    this.lastPlayeIndex = 1;
                    this.scheduleOnce(function () {
                        this.detectionTurnToShowCard(1);
                    },1);
                }else{
                    return;
                }
            }
            this.playCardSound();
        }
    },

    playCardSound:function () {
        let soundStatus = cc.sys.localStorage.getItem(commonConfig.playerName + "_sound");
        if (soundStatus == "on") {
            cc.audioEngine.play(this.cardSound, false, 1);
        }
    },

    playBtnSound:function () {
        let soundStatus = cc.sys.localStorage.getItem(commonConfig.playerName + "_sound");
        if (soundStatus == "on") {
            cc.audioEngine.play(this.btnSound, false, 1);
        }
    },

    playFinalSound:function (iswin) {
        let soundStatus = cc.sys.localStorage.getItem(commonConfig.playerName + "_sound");
        if (soundStatus == "on") {
            if (iswin) {
                cc.audioEngine.play(this.winSound, false, 1);
            }else{
                cc.audioEngine.play(this.loseSound, false, 1);
            }
        }
    },

    helpInfoOnClick:function (event, customEventData) {
        this.playBtnSound();
        switch (customEventData) {
            case "rule":
                this.gameRuleBtn.interactable = false;
                this.gameInfoBtn.interactable = true;
                this.gameContentLabel.string = commonConfig.rule;
                break;
            case "info":
                this.gameRuleBtn.interactable = true;
                this.gameInfoBtn.interactable = false;
                this.gameContentLabel.string = commonConfig.paixing;
                break;
        
            default:
                break;
        }
    }


    // update (dt) {},
});
