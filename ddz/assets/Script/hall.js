// 大厅界面
let commonConfig = require("./globalConfig")
cc.Class({
    extends: cc.Component,

    properties: {
        headSp:{
            default:null,
            type:cc.Sprite
        },

        nickNameLabel:{
            default:null,
            type:cc.Label
        },

        gameGold:{
            default:null,
            type:cc.Label
        },

        settingNode:{
            default:null,
            type:cc.Node
        },

        musicTurnSp:{
            default:null,
            type:cc.Sprite
        },

        voiceTurnSp:{
            default:null,
            type:cc.Sprite
        },

        btnSound:{
            default:null,
            url:cc.AudioClip,
        },

        bgMusic:{
            default:null,
            type:cc.AudioSource
        }


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nickNameText = commonConfig.playerName;
        this.goldNumText = commonConfig.playerGold.toString();
        this.playerHeadSpName = commonConfig.playerHeadSp;
    },

    start () {
        this.nickNameLabel.string = this.nickNameText;
        this.gameGold.string = this.goldNumText;
        this.headSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/headIcon/" + this.playerHeadSpName));
        cc.director.preloadScene("LoadingScene",null);
        if (commonConfig.musicTurn == "on") {
            this.bgMusic.resume();
        }else if(commonConfig.musicTurn == "on"){
            this.bgMusic.pause();
        }
    },

    settingBtnOnClick:function () {
        this.playBtnSound();
        this.settingNode.active = true;
        this.musicNode = this.settingNode.getChildByName("musicTurnButton");
        
        this.soundNode = this.settingNode.getChildByName("voiceTurnButton");
        if (commonConfig.musicTurn == "on") {
            this.musicTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_open.png"));
            this.musicNode.setPosition(cc.p(88, this.musicNode.position.y));
            // this.musicNode.position.x = 88;
            
        }else{
            this.musicTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_close.png"));
            this.musicNode.setPosition(cc.p(28, this.musicNode.position.y));
            // this.musicNode.position.x = 28;
            
        }

        if (commonConfig.soundTurn == "on") {
            this.voiceTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_open.png"));
            this.soundNode.setPosition(cc.p(88, this.soundNode.position.y));
            // this.soundNode.position.x = 88;
        }else{
            this.voiceTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_close.png"));
            this.soundNode.setPosition(cc.p(28, this.soundNode.position.y));
            // this.soundNode.position.x = 28;
        }
        
    },

    musicBtnOnClick:function () {
        this.playBtnSound();
        if (this.musicNode.position.x <= 30) {
            this.musicNode.runAction(cc.moveTo(0.1,this.musicNode.position.x+60, this.musicNode.y))
            this.musicTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_open.png"));
            commonConfig.musicTurn = "on";
            this.bgMusic.resume();
            // cc.sys.localStorage.setItem(commonConfig.playerName + "_music", commonConfig.musicTurn);
        } else {
            this.musicNode.runAction(cc.moveTo(0.1,this.musicNode.position.x-60, this.musicNode.y))
            this.musicTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_close.png"));
            commonConfig.musicTurn = "off";
            this.bgMusic.pause();
            // cc.sys.localStorage.setItem(commonConfig.playerName + "_music", commonConfig.musicTurn);
        }
        cc.sys.localStorage.setItem(commonConfig.playerName + "_music", commonConfig.musicTurn);
    },

    soundBtnOnClick:function () {
        this.playBtnSound();
        if (this.soundNode.position.x <= 30) {
            this.soundNode.runAction(cc.moveTo(0.1,this.soundNode.position.x+60, this.soundNode.y))
            this.voiceTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_open.png"));
            commonConfig.soundTurn = "on"
            cc.audioEngine.play(this.btnSound, false, 1);
            // cc.sys.localStorage.setItem(commonConfig.playerName + "_sound", commonConfig.soundTurn);
        } else {
            this.soundNode.runAction(cc.moveTo(0.1,this.soundNode.position.x-60, this.soundNode.y))
            this.voiceTurnSp.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/ddz_t_close.png"));
            commonConfig.soundTurn = "off"
            // cc.sys.localStorage.setItem(commonConfig.playerName + "_sound", commonConfig.soundTurn);
        }
        cc.sys.localStorage.setItem(commonConfig.playerName + "_sound", commonConfig.soundTurn);
    },

    settingCloseBtnOnClick:function () {
        this.playBtnSound();
        this.settingNode.active = false;
    },

    enterRoomBtnOnClick:function (event, customEventData) {
        this.playBtnSound();
        commonConfig.gameType = customEventData;
        commonConfig.nextSceneName = "GameScene";
        cc.director.loadScene("LoadingScene");
    },

    playBtnSound:function () {
        let soundStatus = cc.sys.localStorage.getItem(this.nickNameText + "_sound");
        if (soundStatus == "on") {
            cc.audioEngine.play(this.btnSound, false, 1);
        }
    }



    // update (dt) {},
});
