import DefaultConfig from "../DefaultConfig";
import {Apis} from "bitsharesjs-ws";
import DataPool from "../service/DataPool";

export default class BitsharesUtil{

    static db_api(method,params,callback){
        Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
            Apis.instance().db_api().exec(method, params).then((objects) => {
                callback(objects);
            });
        });
    }
    static history_api(method,params,callback){
        Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
            Apis.instance().history_api().exec(method, params).then((objects) => {
                callback(objects);
            });
        });
    }
    static async getAssetObject(assetIds,callback){
        if(Array.isArray(assetIds)){
            BitsharesUtil.db_api('get_assets',[assetIds],(asset_objects)=>{
                asset_objects.map((item)=>{
                    DataPool.assetMap.set(item.id,item);
                })
                callback(asset_objects);
            })
        }else {
            if(!DataPool.assetMap.get(assetIds)){
                BitsharesUtil.db_api('get_assets',[[assetIds]],(asset_objects)=>{
                    DataPool.assetMap.set(asset_objects[0].id,asset_objects[0]);
                    callback(asset_objects[0]);
                })
            }else {
                callback(DataPool.assetMap.get(assetIds));
            }

        }


    }
}