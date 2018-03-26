import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import MyAssetItem from "./MyAssetItem";
import BitsharesUtil from "../utils/BitsharesUtil";
import NumberUtil from "../utils/NumberUtil";
import DataPool from "../service/DataPool";

export default class AccountAssets extends React.Component{

    static defaultProps={
        fullAccount:{},
    }

    state={
        fullAccount:this.props.fullAccount,
        balances:[],
        collaNum:0,
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }
    showBalances=(fullAccount)=>{
        if(!fullAccount){
            return;
        }
        this.setState({
            fullAccount:fullAccount
        })
        var {myBalances,myCall_orders}=this.state.fullAccount;
        if(!myCall_orders){
            myCall_orders=new Map()
        }
        var collaNum=0;
        myCall_orders.forEach((value)=>{
            collaNum+=value.collaNum;
        })
        this.setState({
            collaNum:collaNum
        })
        if(!myBalances){
            myBalances=new Map();
        }
        var balances=[];
        myBalances.forEach((value,key)=>{
            balances.push(value);
        })
        this.setState({
            balances:balances
        })
    }
    render(){
        var {myCall_orders,myLimit_orders}=this.state.fullAccount;
        var {balances,collaNum}=this.state;
        var accountName=this.state.fullAccount&&this.state.fullAccount.account?this.state.fullAccount.account.name:'';
        return(
            <View  style={styles.root}>


                <FlatList style={styles.root}
                    keyExtractor={item=>item.asset_type}
                    data={balances}
                    ItemSeparatorComponent={()=><View style={{height:3,backgroundColor: '#DfDfDf'}}/>}
                    renderItem={({item})=>{
                        var asset_object=DataPool.assetMap.get(item.asset_type)?DataPool.assetMap.get(item.asset_type):{precision:4,id:item.asset_type};
                        var dept=myCall_orders&& myCall_orders.get(item.asset_type)&&myCall_orders.get(item.asset_type).deptNum
                            ?
                            myCall_orders.get(item.asset_type).deptNum
                            :0;

                        var limitNum=myLimit_orders&&myLimit_orders.get(item.asset_type)&&myLimit_orders.get(item.asset_type).limitNum
                            ?
                            myLimit_orders.get(item.asset_type).limitNum
                            :0;
                        return (
                            <MyAssetItem
                                accountName={accountName}
                                asset_object={asset_object}
                                name={item.name}
                                num={item.num?item.num:0}
                                callOrder={item.name==='BTS'? collaNum:dept}
                                limitOrder={limitNum}
                                market={item.market?item.market.latest:0}
                            />
                        )
                    }}
                />
            </View>
        );
    }

    /**
     * 渲染后，只会调用一次
     */
    componentDidMount(){
        this.showBalances(this.state.fullAccount)
    }

    /**
     * 当props发生变化时
     * @param nextProps 变化后的props
     */
    componentWillReceiveProps(nextProps){

    }

    /**
     * 当props和state发生变化时调用,根据返回值判断是否渲染
     * @param nextProps
     * @param nextState
     */
    // shouldComponentUpdate(nextProps,nextState){
    //     return true
    // }

    /**
     * 更新前调用
     * @param nextProps
     * @param nextState
     */
    componentWillUpdate(nextProps,nextState){

    }

    /**
     * 更新后调用
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate(prevProps,prevState){

    }

    /**
     * 当组件被销毁的时候
     */
    componentWillUnmount(){

    }

}

const styles=StyleSheet.create({
    root:{
        flex:1
    },

})