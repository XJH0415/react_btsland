import BitsharesUtil from "../utils/BitsharesUtil";
import DataPool from "./DataPool";
import MyUtil from "../utils/MyUtil";
import DataRobot from "./DataRobot";

export default class thisTest{
    static startFullAccount(names){


        BitsharesUtil.db_api('get_full_accounts',[names,true],(fullAccounts)=>{
            fullAccounts.map((item)=>{
                DataRobot.setFullAccount(item[1])
            });
        })

        names.map((item)=>{
            DataRobot.addMyFullAccountListeners(item,'account',(fullAccount)=>{
                alert('fullAccount1'+JSON.stringify(fullAccount))
            })
        });

    }

    static startMarketTicker(base,quote){

        DataRobot.addMarketTickerListener(MyUtil.makeMarketKey(base,quote),'aaa',(marketTicker)=>{
            alert(JSON.stringify(marketTicker))
        });
        BitsharesUtil.db_api('get_ticker',[base,quote],(marketTicker)=>{
            DataRobot.updateMarketTicker(marketTicker);
        });
        DataRobot.removeMarketTickerListener(MyUtil.makeMarketKey(base,quote),'aaa')
    }
}