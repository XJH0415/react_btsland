import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {TabNavigator} from "react-navigation";
import CNYAssets from "./CNYAssets";
import USDAssets from "./USDAssets";
import BTCAssets from "./BTCAssets";
const AssetTab=TabNavigator({
    CNY:{
        screen:CNYAssets,
    },
    USD:{
        screen:USDAssets,
    },
    BTC:{
        screen:BTCAssets,
    }},
    {
        tabBarPosition:'top',
        swipeEnabled:true,
        animationEnabled:true,
        removeClippedSubviews:true,
        initialRouteName:'CNY',
        activeTintColor:'transparent',
        tabBarOptions:{
            labelStyle: {
                fontSize: 15,
                marginBottom:3,
                fontWeight:'bold',
                lineHeight:40,
            },
            style: {
                height:40,
                backgroundColor:'#F0F0F0',
                borderTopWidth:0,
                borderBottomWidth:1,
                borderBottomColor:'#D3D3D3'
            },
        }
    });

const styles=StyleSheet.create({

})
export default AssetTab;