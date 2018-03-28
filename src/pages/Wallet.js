import React, { Component } from 'react';
import {
    Button,
    Text,View,StyleSheet,WebView,FlatList,ScrollView,ART
} from 'react-native';
import RowOnPressItem from '../components/RowOnPressItem'
import {Apis} from "bitsharesjs-ws";
import DefaultConfig from "../DefaultConfig";
import DataPool from "../service/DataPool";
import Application from "../Application";
import DataRobot from "../service/DataRobot";
import sha256 from 'js-sha256';
import Photo from "../components/Photo";
import LimitOrders from "./LimitOrders";
class Wallet extends React.Component{
    static navigationOptions = {
        title: '钱包',
    };
    state={
        fullAccount:null,
        isVIP:false,
        data:[],
        circaCNY:0
    }
    componentWillMount(){
        const { navigate } = this.props.navigation;
        this.setState({
            data:[
                {
                    leftImage:undefined,
                    leftText:'钱包信息',
                    leftTextDesc:'包含全部资产，当前委单，操作记录',
                    rightText:'≈'+this.state.circaCNY+'CNY',
                    rightImage:undefined,
                    onPress:function(){
                        navigate('MyAssets', { name: 'MyAssets' })
                    }
                },
                {
                    leftImage:undefined,
                    leftText:'账户信息',
                    leftTextDesc:null,
                    rightText:this.state.isVIP?'终身会员':'',
                    rightImage:undefined,
                    onPress:function(){
                        navigate('AccountInfo', { name: 'AccountInfo' })
                    }
                },
                {
                    leftImage:undefined,
                    leftText:'当前委单',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },
                {
                    leftImage:undefined,
                    leftText:'交易历史',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:function(){
                        navigate('LimitOrders', { name: 'LimitOrders' })
                    }
                },
                {
                    leftImage:undefined,
                    leftText:'转账',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },
                {
                    leftImage:undefined,
                    leftText:'借款（抵押）',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },
                {
                    leftImage:undefined,
                    leftText:'还款',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },
                {
                    leftImage:undefined,
                    leftText:'抵押排行榜',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },

                {
                    leftImage:undefined,
                    leftText:'账户查询',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },
                {
                    leftImage:undefined,
                    leftText:'资产查询',
                    leftTextDesc:null,
                    rightText:undefined,
                    rightImage:undefined,
                    onPress:undefined
                },
            ]
        })
    }
    timer=null;
    componentDidMount(){
        DataRobot.addMyFullAccountListeners(Application.account,'wallet',this.showData);
    }
    showData=(fullAccount)=>{
        if(fullAccount){
            this.setState({
                fullAccount:fullAccount,
                isVIP:fullAccount.account.registrar===fullAccount.account.id
            });
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
            circaCNY:circaCNY.toFixed(2)
        });
        var data=this.state.data;
        data[1].rightText=this.state.isVIP?'终身会员':'';
        data[0].rightText='≈'+this.state.circaCNY+'CNY';
        this.setState({
            data:data
        })
    }
    render() {
        var account=this.state.fullAccount?this.state.fullAccount.account:null;
        const path = ART.Path();
        path.moveTo(1,1); //将起始点移动到(1,1) 默认(0,0)
        path.lineTo(300,1); //连线到目标点(300,1)
        return (
            <View style={styles.root}>

                <View style={styles.topRoot}>
                    <View style={styles.photoRoot}>
                        <View style={styles.photo}>
                            <Photo width={90} height={90} account={account?account.name:null}/>
                        </View>
                    </View>
                    <View style={styles.userInfo}>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <Text style={styles.userName}>{account?account.name:''}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <Text style={styles.userName2}>{account?'#'+account.id.split('.')[2]:''}</Text>
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.root}>
                    <Text style={styles.tab}>钱包及账户信息</Text>
                    <RowOnPressItem config={
                        this.state.data[0]
                    } />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[1]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <Text style={styles.tab}>钱包操作</Text>
                    <RowOnPressItem config={this.state.data[2]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[3]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[4]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[5]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[6]} />
                    <Text style={styles.tab}>工具</Text>
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[7]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[8]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                    <RowOnPressItem config={this.state.data[9]} />
                    <View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>
                </ScrollView>
            </View>
        );
    }
    componentWillUnmount(){
        this.showData(DataPool.fullAccount[Application.account]);
    }
}
export default Wallet;

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
    },
    topRoot:{
        paddingTop:20,
        backgroundColor:'#4682B4',
    },
    photoRoot:{
        flexDirection:'row',
        justifyContent:'center',
    },
    photo:{
        marginTop:20,
        height:90,
        width:90,
    },
    userInfo:{
        paddingTop:5,
        paddingBottom:5,
    },
    userName:{
        fontSize:20,
        color:'white',
        fontWeight:'bold',
        marginTop:5,
    },
    userName2:{
        fontSize:14,
        color:'white',
        fontWeight:'bold',
        marginTop:5
    }
})