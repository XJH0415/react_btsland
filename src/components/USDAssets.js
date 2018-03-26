import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import DefaultConfig from "../DefaultConfig";
import AssetItem from './AssetItem'
import DataPool from "../service/DataPool";

export default class CNYAssets extends React.Component{
    render(){
        return(
            <View style={styles.root}>
                <FlatList style={styles.root}
                    numColumns={3}
                    keyExtractor={index=>index}
                    data={DefaultConfig.defaultQuote}
                    renderItem={({item})=><AssetItem quote={item} base={'USD'} onPress={(base,quote)=>{
                        DataPool.tradeHeader.hideBottom();
                        DataPool.tradeHeader.setState({base:base,quote:quote})
                        DataPool.trade.headerTabOnPress(base,quote);
                    }}/>}
                />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    root:{
        flex:1
    }
})