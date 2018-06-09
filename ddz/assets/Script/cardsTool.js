// 计算牌面
module.exports = {
    allocationCards:function (tab) {
        let oldTab = tab;
        let selectTab = new Array();
        for (let index = 0; index < 17; index++) {
            //随机从[1,供选择的数组长度]选出17个下标，将每个下表对应的数字加入新数组，删除供选择的数组内相应的元素
            let selectIndex = Math.floor(Math.random()*(oldTab.length - 1 + 1))
            selectTab.push(oldTab[selectIndex]);
            oldTab.splice(selectIndex, 1);
        }
        //返回选出的牌的数组，以及剩余牌的数组
        return {tab_1:selectTab, tab_2:oldTab};
    },

    //根据牌面（1-54）返回相应的图片地址
    getCardSpriteFramePath:function (num) {
        let shang = Math.floor(num / 13);
        let yushu = num % 13;
        if (yushu == 0) {
            shang = shang - 1;
            yushu = 13;
        }

        yushu = yushu - 1;
        if (num == 53) {
            shang = 4;
            yushu = 1;
        }else if(num == 54){
            shang = 4;
            yushu = 2;
        }

        return "resources/cards/card_" + shang + "_" + yushu + ".png";
    },

    //传入上家出的牌，也索要检测的手牌集合，返回是否有可以大过上家的牌，如果有，返回该牌在相应数组内的索引
    detectionCards:function (lastcard, detectiontab) {
        let lastcardValue = this.exchangeCardForTrueValue(lastcard);
        cc.log("上家出牌"+lastcardValue + "  "+lastcard);
        for (let index = 0; index < detectiontab.length; index++) {
            let cardValue = this.exchangeCardForTrueValue(detectiontab[index]);
            if (cardValue > lastcardValue) {
                return {bigger:true, cardIndex:index};
            }
        }
        return {bigger:false, cardIndex: null};
    },

    //将1-54转换为3-2（对应1-13），大小王为14，15
    exchangeCardForTrueValue:function (num) {
        let trueValue = num % 13;
        if (trueValue == 0) {
            trueValue = 13;
        }

        if(num == 53){
            trueValue = 14;
        }else if(num == 54){
            trueValue = 15;
        }
        return trueValue;
    }
};
