import MyUtil from "../utils/MyUtil";
import DataPool from './DataPool'
import BitsharesUtil from "../utils/BitsharesUtil";
import NumberUtil from "../utils/NumberUtil";
export default class DataRobot{
     static setFullAccount(fullAccount){
        if(fullAccount) {
            if(!DataPool.fullAccount){
                DataPool.fullAccount=new Map();
            }
            var name=fullAccount.account.name;
            DataPool.fullAccount.set(name,fullAccount);//保存数据
            var myFullAccount=DataPool.MyFullAccount.get(name);//备份数据
            if(!myFullAccount){
                myFullAccount=fullAccount;
            }
            DataPool.MyFullAccount.set(name,fullAccount);//替换最新数据
            //恢复已经处理好的数据
            DataPool.MyFullAccount.get(name).myCall_orders=myFullAccount.myCall_orders;
            DataPool.MyFullAccount.get(name).myBalances=myFullAccount.myBalances;
            DataPool.MyFullAccount.get(name).myLimit_orders=myFullAccount.myLimit_orders;
            if(fullAccount){
                var {balances,call_orders,limit_orders}=fullAccount;
                if(call_orders){
                    if(!DataPool.MyFullAccount.get(name).myCall_orders){
                        DataPool.MyFullAccount.get(name).myCall_orders=new Map();
                    }

                    call_orders.map((item)=>{
                        var {collateral,debt}=item;
                        var {base,quote}=item.call_price;

                        DataPool.MyFullAccount.get(name).myCall_orders.set(quote.asset_id,item);
                        BitsharesUtil.getAssetObject(base.asset_id,(asset_objects)=>{
                            DataPool.MyFullAccount.get(name).myCall_orders.get(quote.asset_id).collaNum=NumberUtil.assetNum(collateral,asset_objects.precision);

                        })
                        BitsharesUtil.getAssetObject(quote.asset_id,(asset_objects)=>{
                            DataPool.MyFullAccount.get(name).myCall_orders.get(quote.asset_id).deptNum=NumberUtil.assetNum(debt,asset_objects.precision);
                        })

                    })
                }
                if(balances){
                    if(!DataPool.MyFullAccount.get(name).myBalances){
                        DataPool.MyFullAccount.get(name).myBalances=new Map()
                    }
                    balances.map((item,index)=>{
                        var ban=DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type);//备份
                        if(!ban){
                            ban=item;
                        }
                        DataPool.MyFullAccount.get(name).myBalances.set(item.asset_type,item);//替换
                        //恢复
                        DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).num=ban.num;
                        DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).name=ban.name;
                        DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).market=ban.market;
                        //更新
                        BitsharesUtil.getAssetObject(item.asset_type,(asset_object)=>{
                            DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).num=NumberUtil.assetNum(item.balance,asset_object.precision);
                            DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).name=asset_object.symbol;
                            if(asset_object.symbol!=='CNY') {
                                BitsharesUtil.db_api('get_ticker', ['CNY', asset_object.symbol], (market) => {
                                    DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).market = market;
                                })
                            }else {
                                DataPool.MyFullAccount.get(name).myBalances.get(item.asset_type).market = {
                                    latest:'1'
                                };
                            }
                        });
                    })
                }
                if(limit_orders){
                    if(!DataPool.MyFullAccount.get(name).myLimit_orders){
                        DataPool.MyFullAccount.get(name).myLimit_orders=new Map();
                    }
                    limit_orders.map((item)=>{
                        var {sell_price}=item;
                        var limit=DataPool.MyFullAccount.get(name).myLimit_orders.get(sell_price.base.asset_id);//备份
                        if(!limit){
                            limit=item
                        }
                        DataPool.MyFullAccount.get(name).myLimit_orders.set(sell_price.base.asset_id,item);//替换
                        DataPool.MyFullAccount.get(name).myLimit_orders.get(sell_price.base.asset_id).limitNum=limit.limitNum;//恢复
                        BitsharesUtil.getAssetObject(sell_price.base.asset_id,(asset_object)=> {
                            //更新
                            DataPool.MyFullAccount.get(name).myLimit_orders.get(sell_price.base.asset_id).limitNum=NumberUtil.assetNum(sell_price.base.amount,asset_object.precision);
                        })
                    })
                }

            }
            if(DataPool.fullAccountListeners) {
                var nameListener = DataPool.fullAccountListeners.get(name);
                if (nameListener) {
                    nameListener.forEach((value) => value(DataPool.MyFullAccount.get(name)));//通知监听器
                }
                var allListener = DataPool.fullAccountListeners.get(DataPool.ALLLISTENER);
                if (allListener) {
                    allListener.forEach((value) => value(DataPool.MyFullAccount.get(name)));//通知监听器
                }
            }
        }
    }
    static addMyFullAccountListeners(nameKey,key,listener){
        if(listener) {
            if(!DataPool.fullAccountListeners){
                DataPool.fullAccountListeners=new Map();
            }
            if(!DataPool.fullAccountListeners.get(nameKey)){
                DataPool.fullAccountListeners.set(nameKey,new Map());
            }
            DataPool.fullAccountListeners.get(nameKey).set(key,listener);
            if(DataPool.MyFullAccount.get(nameKey)){
                listener(DataPool.MyFullAccount.get(nameKey))  ;
            }
        }
    }
    static removeFullAccountListeners(nameKey,key){
        if(nameKey&&key) {
            if(DataPool.fullAccountListeners.get(nameKey)) {
                DataPool.fullAccountListeners.get(nameKey).delete(key);
            }
        }
    }

    static updateMarketTicker(marketTicker){
        if(marketTicker){
            if(!DataPool.marketTickers){
                DataPool.marketTickers=new Map();
            }
            var marketKey=MyUtil.makeMarketKey(marketTicker.base,marketTicker.quote);
            DataPool.marketTickers.set(marketKey,marketTicker);
            if(DataPool.marketTickerListeners){
                var listeners=DataPool.marketTickerListeners.get(marketKey);
                if(listeners&&listeners.size>0){
                    listeners.forEach((value)=>{value(marketTicker)});//通知监听器
                }
                var allListener=DataPool.marketTickerListeners.get(DataPool.ALLLISTENER);
                if(allListener){
                    allListener.forEach((value)=>{value(marketTicker)});//通知监听器
                }
            }


        }
    }
    static addMarketTickerListener(marketKey,key,listener){
        if(key&&marketKey&&listener){
            if(!DataPool.marketTickerListeners){
                DataPool.marketTickerListeners=new Map();
            }
            var listeners=DataPool.marketTickerListeners.get(marketKey);
            if(!listeners){
                DataPool.marketTickerListeners.set(marketKey,new Map());
            }
            DataPool.marketTickerListeners.get(marketKey).set(key,listener);
            if(DataPool.marketTickers.get(marketKey)){
                listener(DataPool.marketTickers.get(marketKey))
            }
        }
    }
    static removeMarketTickerListener(marketKey,key){
        if(key&&marketKey){
            if(DataPool.marketTickerListeners.get(marketKey)){
                DataPool.marketTickerListeners.get(marketKey).delete(key)
            }
        }
    }
}