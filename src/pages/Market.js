import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Header from "../components/Header";
import MarketTab from '../components/MarketTab'
export default class Market extends React.Component{
    static navigationOptions = {
        title:'行情'
    };
    static defaultProps={
        title:'行情'
    }
    render(){
        var {title}=this.props;
        return (
            <View style={styles.root}>
                <Header rightType={'search'} leftType={'share'} title={title}/>
                <MarketTab/>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    root:{
        flex:1,
    }
})

