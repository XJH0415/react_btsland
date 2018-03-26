import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    processColor
} from 'react-native';
import NumberUtil from '../utils/NumberUtil';
import {Apis} from "bitsharesjs-ws";
import DefaultConfig from '../DefaultConfig';

export default class MarketItem extends React.Component {
    static defaultProps = {
        base: '',
        quote: 'BTS',
    }
    state = {
        base: this.props.base,
        quote: this.props.quote,
        latest: '0.0',
        lowest_ask: '0.0',
        highest_bid: '0.0',
        percent_change: '0.0',
        base_volume: '0.0',
        quote_volume: '0.0',
    }

    getMarket = () => {
        Apis.instance(DefaultConfig.server, true).init_promise.then((res) => {
            Apis.instance().db_api().exec('get_ticker', [this.state.base,this.state.quote]).then((market)=>{
                this.showMarket(market);
            });
        });
    }
    showMarket=(market) => {
        this.setState({
            base: market.base,
            quote: market.quote,
            latest: market.latest==='inf'?this.state.latest:market.latest,
            lowest_ask: market.lowest_ask==='inf'?this.state.lowest_ask:market.lowest_ask,
            highest_bid: market.highest_bid==='inf'?this.state.highest_bid:market.highest_bid,
            percent_change: market.percent_change==='inf'?this.state.percent_change:market.percent_change,
            base_volume: market.base_volume==='inf'?this.state.base_volume:market.base_volume,
            quote_volume: market.quote_volume==='inf'?this.state.quote_volume:market.quote_volume,
        });
    }
    timer = null;
    componentDidMount() {
        if (this.props.base === this.props.quote) {
            return;
        }
        this.getMarket();
    }

    render() {
        if (this.props.base === this.props.quote) {
            return null;
        }
        var {base,quote,latest,percent_change,base_volume} = this.state;
        var newLatest='';
        if (base === 'CNY') {
            newLatest = DefaultConfig.CNY;
        } else if (base === 'USD') {
            newLatest = DefaultConfig.USD;
        } else if (base === 'BTC') {
            newLatest = DefaultConfig.BTC;
        }
        newLatest = newLatest+latest.substring(0, 7);
        var bacColor = DefaultConfig.green;
        if (percent_change < 0) {
            bacColor = DefaultConfig.red;
        } else {
            bacColor = DefaultConfig.green;
        }
        return (
            <TouchableOpacity style={styles.root}>
                <View style={styles.column}>
                    <View style={[styles.column, {flexDirection: 'row'}]}>
                        <Text style={[styles.big]}
                              numberOfLines={1}>
                            {quote}
                        </Text>
                        <Text style={[styles.small, {lineHeight: 18}]}>
                            /{base}
                        </Text>
                    </View>
                    <Text style={[styles.small]}
                          numberOfLines={1}>
                        24H量 {NumberUtil.formatVol(base_volume)}
                    </Text>
                </View>
                <View style={[styles.column]}>
                    <Text style={[styles.latest, styles.big]}
                          numberOfLines={1}>{newLatest}</Text>
                    {/*<Text style={[styles.column,styles.marginLeft,styles.small]}>$12354.6</Text>*/}
                </View>
                <View style={[styles.percent,{backgroundColor: bacColor}]}>
                    <Text style={[styles.column, styles.center]}
                          numberOfLines={1}>{NumberUtil.formatPercent(percent_change)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor:'white',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        height: 50,
        padding:10
    },
    column: {
        flex: 1
    },
    big: {
        fontSize: 16,
        lineHeight: 16,
        fontWeight: 'bold',
    },
    small: {
        fontSize: 10,
        lineHeight: 10,
        color: 'gray',
    },
    center: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 24
    },
    latest: {
        textAlign: 'right',
        marginRight: 20
    },
    percent: {
        borderRadius:5,
        width: 70,
        marginTop:3,
        marginBottom:3,
        backgroundColor:DefaultConfig.green
    }
})