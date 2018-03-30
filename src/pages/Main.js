import React, { Component } from 'react';
import {
    Button,
    Text,
    View,
    WebView,
    StyleSheet
} from 'react-native';
import Header from "../components/Header";
import {CandleStickChart} from 'react-native-charts-wrapper';
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
            <View style={styles.root}>
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
    root:{
        flex:1
    },
    chart:{
        flex:1
    }
})
export default Main;