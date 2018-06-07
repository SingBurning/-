//luanch初始化界面

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar:{
            default: null,
            type: cc.ProgressBar
        }
    },

    // onLoad () {},

    start () {
        this.progressBar.progress = 0;
        this.updateProgressBar("LoginScene");
    },

    updateProgressBar: function (sceneName) {
        let info = cc.director._getSceneUuid(sceneName);
        if (info) {
            cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({uuid:info.uuid, type:'uuid'},
                (completedCount, totalCount, item) => {
                    let _loadingNextStep = (completedCount / totalCount * 100);
                    // cc.log(_loadingNextStep);
                    this.progressBar.progress = _loadingNextStep;
                    if (_loadingNextStep == 100) {
                        cc.director.loadScene(sceneName)
                    }
                },
                function (error, asset) {
                    if (error) {
                        cc.log("加载错误："+error.message);
                    }else{
                        cc.log("加载结束");
                    }
                }
            );
        }else{
            cc.log("未发现场景 "+sceneName);
        }
    }

    // update (dt) {},
});
