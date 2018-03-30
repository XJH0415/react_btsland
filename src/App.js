/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StackNavigator,
    TabNavigator,
} from 'react-navigation';
import {
    Image,
    StyleSheet,
} from 'react-native';
import Main from "./pages/Main";
import Market from "./pages/Market";
import Wallet from "./pages/Wallet";
import U2U from "./pages/U2U";
import Trade from "./pages/Trade";
import AccountInfo from './pages/AccountInfo';
import MyAssets from './pages/MyAssets';
import LimitOrders from "./pages/LimitOrders";
import DetailMarker from "./pages/DetailMarker";

const MainTab = TabNavigator({
    //图标地址
    //http://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.d9df05512&cid=8327
    //http://www.iconfont.cn/search/index?q=%E4%BA%A4%E6%98%93
    Main: {
        screen: Main,
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <Image style={styles.tabIcon} source={focused===false?require('./icon/资讯.png'):require('./icon/资讯(1).png')}/>
            )
        }
    },
    Market: {screen: Market,
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <Image style={styles.tabIcon} source={focused===false?require('./icon/行情.png'):require('./icon/行情(1).png')}/>
            )
        }
    },
    Trade:{screen:Trade,
        navigationOptions:{
            tabBarIcon: ({focused, tintColor}) => (
                <Image style={styles.tabIcon} source={focused===false?require('./icon/交易.png'):require('./icon/交易(1).png')}/>
            )
        },

    },
    U2U: {screen: U2U,
        navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <Image style={styles.tabIcon} source={focused===false?require('./icon/货币兑换.png'):require('./icon/货币兑换(1).png')}/>
            )
        },
    },
    Wallet: {screen: Wallet,navigationOptions: {
            tabBarIcon: ({focused, tintColor}) => (
                <Image style={styles.tabIcon} source={focused===false?require('./icon/钱包.png'):require('./icon/钱包(1).png')}/>
            )
        }
    },

},{
    tabBarPosition:'bottom',
    swipeEnabled:false,
    indicatorStyle:{
        height:0
    },
    tabBarOptions:{
        iconStyle:{

        },
        labelStyle: {
            fontSize: 12,
            marginBottom:3,
            fontWeight:'bold'
        },
        style: {

        },
    }
},{

});
const MyStack = StackNavigator({
    Tab: {screen: MainTab},
    Market: {screen: Market},
    AccountInfo:{screen:AccountInfo},
    MyAssets:{screen:MyAssets},
    LimitOrders:{screen:LimitOrders},
    DetailMarker:{screen:DetailMarker}
},
{
    headerMode:'none'
});

const styles=StyleSheet.create({
    tabIcon:{
        width:22,
        height:22
    }
})
export default MyStack;

