
/**
 * 数值计算
 */
export default class NumberUtil{
    /**
     * 格式化显示涨跌幅
     * @param percent
     * @returns {*}
     */
    static formatPercent(percent){
        if(percent>0){
            percent='+'+(percent/1).toFixed(2)+'%';
        }else if(percent<0) {
            percent=(percent/1).toFixed(2)+'%';
        }else {
            percent=(percent/1).toFixed(2)+'%';
        }
        return percent;
    }
    static formatVol(vol){
        if(vol>1000000){
            vol=(vol/1000000).toFixed(3)+'M';
        }else if(vol>1000){
            vol=(vol/1000).toFixed(3)+'K';
        }else if(vol>1){
            vol=(vol/1).toFixed(3);
        }else {
            vol=(vol/1).toFixed(5);
        }
        return vol;
    }
    static assetNum(amount,pos){
        return amount/(Math.pow(10,pos));
    }
}