import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import Header from "../components/Header";
import RowItem from "../components/RowItem";
import DefaultConfig from "../DefaultConfig";
import DataPool from "../service/DataPool";
import DataRobot from "../service/DataRobot";
import Application from "../Application";

export default class AccountInfo extends React.Component{

    state={
        data:[]
    }
    /**
     * 渲染前
     */
    componentWillMount(){
        DataRobot.addMyFullAccountListeners(Application.account,'Info',this.showAccount)
    }
    showAccount=(fullAccount)=>{
        if(fullAccount) {
            var {
                account,    //基本信息
                statistics, //手续费支出
                registrar_name, //注册人
                referrer_name,  //推荐人
                lifetime_referrer_name, //终身推荐人
                vesting_balances,   //待解冻
            } = fullAccount;
            this.setState({
                data: [
                    {tab: '用户名', text: account.name},
                    {tab: 'id', text: '#' + account.id.split('.')[2]},
                    {tab: '账户类型', text: account.lifetime_referrer === account.id ? '终身会员' : '普通用户'},
                    {tab: '网络收取', text: '20%'},
                    {
                        tab: '终身会员推荐人',
                        text: lifetime_referrer_name + ' (' + account.lifetime_referrer_fee_percentage / 100 + '%)'
                    },
                    {tab: '注册人', text: registrar_name + ' (0%)'},
                    {
                        tab: '推荐人',
                        text: referrer_name + ' (' + (80 - (account.lifetime_referrer_fee_percentage / 100)) + '%)'
                    },
                    {
                        tab: '手续费总支出',
                        text: (statistics ? (statistics.lifetime_fees_paid / Math.pow(10, 5)).toFixed(5) : +0) + ' BTS'
                    },
                    {
                        tab: '待解冻金额',
                        text: (vesting_balances&&vesting_balances[0]?(vesting_balances[0].balance.amount / Math.pow(10, 5)).toFixed(5) : 0) + ' BTS'
                    }
                ]
            });

        }
    }
    render(){
        var data=this.state.data
        return(
            <View style={styles.root}>
                <Header navigation={this.props.navigation} leftType={'back'} rightType={'none'} title={'账户信息'}/>
                <View style={styles.view}>
                    <Text style={styles.tab}>账户基本信息</Text>
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[0]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[1]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[2]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <Text style={styles.tab}>手续费分配</Text>
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[3]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[4]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[5]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[6]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <Text style={styles.tab}>手续费及现金返还</Text>
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[7]:null} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowItem content={data?data[8]:null} />
                </View>
            </View>
        );
    }

    /**
     * 渲染后，只会调用一次
     */
    componentDidMount(){

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
        DataRobot.removeFullAccountListeners(Application.account,'Info');
    }

}

const styles=StyleSheet.create({
    root:{
        flex:1
    },
    tab:{
        backgroundColor:'#D3D3D3',
        fontSize:10,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:5,
        paddingBottom:5,
        color:DefaultConfig.blue
    }
})