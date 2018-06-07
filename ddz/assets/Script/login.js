// 登陆界面
let commonConfig = require("./globalConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        nickNameEdit:{
            default:null,
            type:cc.EditBox
        },

        passwordEdit:{
            default:null,
            type:cc.EditBox
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nickNameText = cc.sys.localStorage.getItem("nickname");
        if (this.nickNameText == null) {
            let nameIndex = Math.floor(Math.random()*11);
            this.nickNameText = commonConfig.nickNameDefault[nameIndex];
        }

        this.passwordText = cc.sys.localStorage.getItem(this.nickNameText);

        if (this.passwordText == null) {
            this.passwordText = "123456";
        }
    },

    start () {
        cc.log("昵称："+this.nickNameText);
        cc.log("密码："+this.passwordText);
        this.nickNameEdit.string = this.nickNameText;
        this.passwordEdit.string = this.passwordText;

        cc.director.preloadScene("LoadingScene",null);
    },

    enterGameBtnOnClick: function () {
        let nickName = this.nickNameEdit.string;
        let password = this.passwordEdit.string;
        cc.log("昵称："+nickName);
        cc.log("密码："+password);

        //昵称
        cc.sys.localStorage.setItem("nickname",nickName);
        cc.sys.localStorage.setItem(nickName, password);
        commonConfig.playerName = nickName;

        //金币
        let goldKey = nickName + "_gold";
        let goldNum = cc.sys.localStorage.getItem(goldKey);
        if (goldNum == null) {
            goldNum = commonConfig.playerGold;
            cc.sys.localStorage.setItem(goldKey,goldNum);
        }
        commonConfig.playerGold = goldNum;
        
        //头像
        let headSpNameKey = nickName + "_head";
        let headSpName = cc.sys.localStorage.getItem(headSpNameKey);
        if (headSpName == null) {
            //[n,m]随机数公式Math.floor(Math.random()*(m-n+1))+n
            let headIndex = Math.floor(Math.random()*(10 - 1 + 1)) + 1;
            headSpName = headIndex + ".png"
            cc.sys.localStorage.setItem(headSpNameKey,headSpName);
        }
        commonConfig.playerHeadSp = headSpName;

        //音效音乐
        let musicStatus = cc.sys.localStorage.getItem(nickName + "_music");
        if (musicStatus == null) {
            musicStatus = "on";
            cc.sys.localStorage.setItem(nickName + "_music", musicStatus);
        }
        commonConfig.musicTurn = musicStatus;

        let soundStatus = cc.sys.localStorage.getItem(nickName + "_sound");
        if (soundStatus == null) {
            soundStatus = "on";
            cc.sys.localStorage.setItem(nickName + "_sound", soundStatus);
        }
        commonConfig.soundTurn = soundStatus;

        commonConfig.nextSceneName = "HallScene";
        cc.director.loadScene("LoadingScene");
    }

});
