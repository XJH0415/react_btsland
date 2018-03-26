import React, { Component } from 'react';
import {
    Button,
    Text,
    View,
    WebView,
    StyleSheet
} from 'react-native';
import Header from "../components/Header";
import MyAssetItem from '../components/MyAssetItem'
import Tab from "../components/Tab";
import FillOrderItem from "../components/FillOrderItem";
import Photo from "../components/Photo";
import LimitOrderItem from "../components/LimitOrderItem";
import {PrivateKey} from 'bitsharesjs/es'
class Main extends React.Component{
    static navigationOptions = {
        title:'资讯'
    };
    static defaultProps={
        title:'资讯'
    }

    render() {
        const { navigate } = this.props.navigation;
        var {title}=this.props;
        return (
            <View>
                <Header rightType={'none'} title={title} leftType={'share'}/>
                {/*<WebView*/}
                {/*source={{uri:'https://changjinglu.info/'}}*/}
                {/*style={styles.webView}*/}
                {/*/>*/}
            </View>

        );
    }
}
const styles=StyleSheet.create({
    webView:{
        flex:1
    }
})
export default Main;