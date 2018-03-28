import {Apis} from "bitsharesjs-ws";
import DefaultConfig from "./DefaultConfig";
import BitsharesUtil from "./utils/BitsharesUtil";
import NumberUtil from "./utils/NumberUtil";
import DataPool from "./service/DataPool";
import DataRobot from "./service/DataRobot";
export default class Application{
    static start=()=>{
        // //检测网络是否连接
        // NetInfo.isConnected.fetch().done((isConnected) => {
        //     alert(isConnected?'网络在线': '离线')
        // });
        //
        // //检测网络连接信息
        // NetInfo.fetch().done((connectionInfo) => {
        //     alert('检测网络连接信息:'+JSON.stringify(connectionInfo));
        // });
        //
        // //监听网络变化事件
        // NetInfo.addEventListener('change', (isConnected) => {
        //     alert('监听网络变化事件:'+isConnected)
        // })

        /**
         * 获得用户
         */
        Application.init();
        Application.getAllAssetObjects();
        Application.account='xjh1009';
        Application.getFullAccount(Application.account);
        setInterval(()=>{Application.getFullAccount(Application.account)},10000);

        // Application.get_fill_order_history();

        var date=new Date();
        // Application.getMarginPositions()
        /**
         *
         */
    };
    static init(){
        Date.prototype.format = function(format) {
            var date = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S+": this.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        }
    }
    static getAllAssetObjects(){
        BitsharesUtil.db_api('lookup_asset_symbols',[DefaultConfig.defaultQuote],(asset_objects)=>{
            if(asset_objects){
                asset_objects.map((item)=>{
                    DefaultConfig.assetMap.set(item.id,item);
                })
            }
        })
    }
    /**
     * 根据名称获得用户
     * @param name
     */
    static getFullAccount(name){
        BitsharesUtil.db_api('get_full_accounts', [[name],false],(accounts) => {
            //保存数据到全局变量
            var fullAccount = accounts[0][1];
            var assetIds=[];
            fullAccount.balances.map((item)=>{
                if(!DataPool.assetMap.get(item.asset_type)){
                    assetIds.push(item.asset_type);
                }
            });
            BitsharesUtil.getAssetObject(assetIds,()=>{});
            DataRobot.setFullAccount(fullAccount);
        });

    }


    static get_market_history(){
        Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
            // Apis.instance().db_api().exec('get_margin_positions', [name]).then((objects) => {
            //     alert(JSON.stringify(objects))
            // });
            let bucketCount=10;
            let bucketSize=5*60;
            let startDate = new Date();
            let endDate = new Date();
            let startDateShort = new Date();
            startDate = new Date(
                startDate.getTime() -
                bucketSize * bucketCount * 1000
            );
            endDate.setDate(endDate.getDate() + 1);
            startDateShort = new Date(
                startDateShort.getTime() - 3600 * 50 * 1000
            );
            Apis.instance().history_api().exec('get_market_history',[
                '1.3.113',
                '1.3.0',
                bucketSize,
                startDate.toISOString().slice(0, -5),
                endDate.toISOString().slice(0, -5)]).then((objects)=>{

                alert(JSON.stringify(objects))
            });
        });
    }
    static get_fill_order_history(){
        Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
            let startDate = new Date();
            let endDate = new Date();
            Apis.instance().history_api().exec('get_fill_order_history',['1.3.0', '1.3.113', 2]).then((objects)=>{
                alert('1111'+JSON.stringify(objects[0].op));
                alert(JSON.stringify(objects[0].op.is_maker));
            });
        });
    }
}