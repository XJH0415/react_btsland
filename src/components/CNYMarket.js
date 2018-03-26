import React, { Component } from 'react';
import MarketItem from './MarketItem';
import{
    FlatList,
    View
}from 'react-native';
import DefaultConfig from "../DefaultConfig";
import {Apis} from "bitsharesjs-ws";

export default class CNYMarket extends React.Component{
    static navigationOptions = {
        title:'CNY',
    };
    static defaultProps={
        base:'CNY',
        quote:DefaultConfig.defaultQuote,
    }
    didBlur=null;
    didFocus=null;
    isShow=true;
    componentWillMount(){
        this.didBlur=this.props.navigation.addListener(
            'didBlur',
            () => {
                this.isShow=false;
            }
        )
        this.didFocus=this.props.navigation.addListener(
            'didFocus',
            () => {
                this.isShow=true;
            }
        )

    }
    itemMap=new Map();
    marketMap=new Map();
    getMarket = (base,quote) => {
        if(this.isShow) {
            Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
                Apis.instance().db_api().exec('get_ticker', [base, quote]).then((market) => {
                    var key = quote + '/' + base;
                    if (this.itemMap.get(key) && this.isShow) {
                        this.itemMap.get(key).showMarket(market);
                    }
                });
            });
        }
    }
    render(){
        return (
            <FlatList
                keyExtractor={item=>item+'/'+this.props.base}
                data={this.props.quote}
                ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor: '#D3D3D3'}}/>}
                renderItem={({item})=>{
                    var key=item+'/'+this.props.base;
                    var timer=setInterval(()=>this.getMarket(this.props.base,item),3000)
                    this.marketMap.set(key,timer);
                    return (<MarketItem ref={instance=>this.itemMap.set(key,instance)} base={this.props.base} quote={item} />)
                }}
            />
        )
    }
    componentWillUnmount() {
        this.didBlur && this.didBlur.remove();
        this.didFocus && this.didFocus.remove();
        this.marketMap.clear();
    }

}