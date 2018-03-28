import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import AccountAssets from '../components/AccountAssets';
import Header from '../components/Header';
import Application from "../Application";
import DataPool from "../service/DataPool";
import DataRobot from "../service/DataRobot";
import Tab from "../components/Tab";
import AccountLimitOrders from "../components/AccountLimitOrders";
import AccountHistorys from "../components/AccountHistorys";
export default class MyAssets extends React.Component{
    state={
        circaCNY:0,
        index:0
    }
    /**
     * 渲染前
     */
    componentWillMount(){
        this.AccountHistorys=<AccountHistorys accountName={DataPool.fullAccount.get(Application.account)?DataPool.fullAccount.get(Application.account).account.id:null} />
    }
    AccountAssets;
    AccountLimitOrders;
    switchTab(index) {
        this.setState({
            index:index
        })
    }
    render(){
        return(
            <View style={styles.root}>
                <Header navigation={this.props.navigation} leftType={'back'} rightType={'none'} title={'全部资产'}/>
                <View style={styles.circaCNY}>
                    <Text style={styles.circaCNYText}>总资产折合</Text>
                    <Text style={styles.circaCNYText}>{this.state.circaCNY.toFixed(2)}CNY</Text>
                </View>
                <Tab onPress={(index)=>{this.switchTab(index)}}/>
                {
                    this.state.index===0?
                        <AccountAssets ref={(instance)=>{this.AccountAssets=instance}} fullAccount={DataPool.MyFullAccount.get(Application.account)} />
                        :
                        <AccountLimitOrders ref={(instance)=>{this.AccountLimitOrders=instance}} limit_orders={DataPool.MyFullAccount.get(Application.account)?DataPool.MyFullAccount.get(Application.account).limit_orders:{}} />
                }

            </View>
        )
    }

    /**
     * 渲染后，只会调用一次
     */
    componentDidMount(){
        DataRobot.addMyFullAccountListeners(Application.account,'myAssets',(fullAccount)=>{
            if(this.AccountAssets){
                this.AccountAssets.showBalances(fullAccount);
            }
            if(this.AccountLimitOrders){
                this.AccountLimitOrders.showLimitOrders(fullAccount.limit_orders);
            }
            var {myBalances,myCall_orders,myLimit_orders}=fullAccount;
            if(!myBalances) {
                myBalances = new Map()
            }
            var circaCNY=0;
            myBalances.forEach((value, key) => {
                var num = value.num ? (value.num * 1).toFixed(2) : 0;
                var deptNum = myCall_orders&&myCall_orders.get(key) && myCall_orders.get(key).deptNum ? (myCall_orders.get(key).deptNum * 1).toFixed(2) : 0;
                var limitNum =myLimit_orders&&myLimit_orders.get(key) && myLimit_orders.get(key).limitNum ? (myLimit_orders.get(key).limitNum * 1).toFixed(2) : 0
                var latest = value.market ? value.market.latest : 0;
                circaCNY += (num * 1 + deptNum * 1 + limitNum * 1) * (latest / 1).toFixed(2);
            })
            this.setState({
                circaCNY:circaCNY
            })
        })
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
     * 当组件要被从界面上移除的时候
     */
    componentWillUnmount(){
        DataRobot.removeFullAccountListeners(Application.account,'myAssets')
    }

}

const styles=StyleSheet.create({
    root:{
        flex:1
    },
    circaCNY:{
        backgroundColor:'#4682B4',
        height:80,
        padding:20
    },
    circaCNYText:{
        color:'white',
        fontSize:18,
        lineHeight:20,
        textAlign:'center',
        fontWeight:'bold'
    }
})