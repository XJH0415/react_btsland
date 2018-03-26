import BitsharesUtil from "../utils/BitsharesUtil";
import MyUtil from "../utils/MyUtil";

export default {
    assetMap:new Map(),
    tradeHeader:null,
    trade:null,



    ALLLISTENER:'00000',
    /**
     * 用户信息
     */
    fullAccount:new Map(),
    MyFullAccount:new Map(),
    /**
     * 用户信息监听器
     */
    fullAccountListeners:new Map(),
    /**
     * 交易对行情
     */
    marketTickers:new Map(),
    /**
     * 交易对行情监听器
     */
    marketTickerListeners:new Map(),


}