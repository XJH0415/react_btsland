import React, { Component } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView
} from 'react-native';
import Header from '../components/Header'
import DefaultConfig from "../DefaultConfig";
import {Apis} from "bitsharesjs-ws";
import OrderItem from "../components/OdrerItem";
import * as Dimensions from "react-native/Libraries/Utilities/Dimensions";
import DataPool from "../service/DataPool";
import BitsharesUtil from "../utils/BitsharesUtil";
import FillOrderItem from "../components/FillOrderItem";
import MyUtil from "../utils/MyUtil";
import NumberUtil from "../utils/NumberUtil";
// import * as bitsharesjs from 'bitsharesjs';
class Trade extends React.Component{
    static navigationOptions = {
        title: '交易',
    };
    static defaultProps={
        title:'行情',
        base:'CNY',
        quote:'BTS',
    }
    state={
        type:'buy',
        history:'market',
        base:this.props.base,
        quote:this.props.quote,
        asks:[],
        bids:[],
        market:{
            base: this.props.base,
            quote: this.props.quote,
            latest: '0.0',
            lowest_ask: '0.0',
            highest_bid: '0.0',
            percent_change: '0.0',
            base_volume: '0.0',
            quote_volume: '0.0',
        },
        fillOrders:[]
    }
    baseObj=null;
    quoteObj=null;
    getOrderBook=()=>{
        var {base,quote}=this.state;
        if(!this.baseObj||!this.quoteObj||this.baseObj.symbol!==base||this.quoteObj.symbol!==quote){
            BitsharesUtil.db_api('lookup_asset_symbols', [[this.state.base,this.state.quote]],(obj)=>{
                this.baseObj=obj[0];
                this.quoteObj=obj[1];
                //查询广播
                BitsharesUtil.db_api('get_order_book', [this.baseObj.id,this.quoteObj.id,10],(orderBook)=>{
                    if(orderBook.base===this.baseObj.id&&orderBook.quote===this.quoteObj.id){
                        this.setState({
                            asks:orderBook.asks,
                            bids:orderBook.bids
                        })
                    }
                });
                BitsharesUtil.history_api('get_fill_order_history', [this.baseObj.id,this.quoteObj.id, 20],(fillOrders)=>{
                    this.setState({
                        fillOrders:fillOrders
                    })
                })
            })
        }else {
            BitsharesUtil.db_api('get_order_book', [this.baseObj.id,this.quoteObj.id,10],(orderBook)=>{
                if(orderBook.base===this.baseObj.id&&orderBook.quote===this.quoteObj.id){
                    this.setState({
                        asks:orderBook.asks,
                        bids:orderBook.bids
                    })
                }
            });
            BitsharesUtil.history_api('get_fill_order_history', [this.baseObj.id,this.quoteObj.id, 20],(fillOrders)=>{
                this.setState({
                    fillOrders:fillOrders
                })
            })
        }

    }
    getMarket=()=>{
        BitsharesUtil.db_api('get_ticker', [this.state.base,this.state.quote],(market)=>{
            this.setState({
                market:market
            })
        })
    }

    timer = null;
    componentDidMount() {
        this.getOrderBook();
        this.getMarket();
        this.timer = setInterval(
            () => {
                this.getOrderBook();
                this.getMarket();
            },
            5000
        );
        DataPool.trade=this
    }

    headerTabOnPress=(base,quote)=>{
        this.getOrderBook()
        this.setState({
            base:base,
            quote:quote
        })
    }
    layout(event) {
        //使用大括号是为了限制let结构赋值得到的变量的作用域，因为接来下还要结构解构赋值一次
        {
            //获取根View的宽高，以及左上角的坐标值
            let {x, y, width, height} = event.nativeEvent.layout;
            alert(width)
        }

        //通过Dimensions API获取屏幕宽高
        let {width, height} = Dimensions.get('window');
    }
    render() {
        var {base,quote}=this.props;
        var {asks,bids}=this.state;
        var max=0.0;
        asks.map((item)=>{
            if(item.quote/1>max){
                max=item.quote;
            }
        });
        bids.map((item)=>{
            if(item.quote/1>max){
                max=item.quote
            }
        });
        return (
            <View style={styles.root}>
                <Header ref={instance=>{DataPool.tradeHeader=instance}} rightType={'market'} centerCanClick={true} leftType={'share'} title={quote+'/'+base}/>
                <ScrollView style={styles.root}>

                    {/*盘*/}
                    <View style={styles.orderRoot}>
                        <View style={[styles.orderList,styles.orderView]}>
                            <OrderItem onLayout={({nativeEvent:e})=>this.layout(e)} type={'buy'} index={'买'} price={'价格'} vol={'量'}/>
                            <FlatList style={styles.orderList}
                                data={bids}
                                keyExtractor={index=>index+1}
                                renderItem={({item,index})=>
                                    <TouchableOpacity>
                                        <OrderItem maxNum={max} type={'buy'} index={(index+1)} price={item.price} vol={item.quote}/>
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                        <View style={[styles.orderList,styles.orderView]}>
                            <OrderItem type={'sell'} index={'卖'} price={'价格'} vol={'量'}/>
                            <FlatList style={styles.orderList}
                                data={asks}
                                keyExtractor={index=>index+1}
                                renderItem={({item,index})=>
                                    <TouchableOpacity>
                                        <OrderItem maxNum={max} type={'sell'} index={(index+1)} price={item.price} vol={item.quote}/>
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                    </View>
                    {/*成交价*/}
                    <View style={styles.priceRoot}>
                        <Text style={styles.priceText}>{'最新价格:'}</Text><Text style={[styles.priceNum,this.state.market.percent_change<0?{color:DefaultConfig.red}:{color:DefaultConfig.green}]}>{this.state.market.latest.substring(0,8)}</Text><Text style={styles.priceCoin}>{base}</Text>
                    </View>
                    {/*表单*/}
                    <View style={styles.trade}>
                        <View style={styles.tradeTop}>
                            <TouchableWithoutFeedback onPress={()=>{this.setState({type:'buy'})}}>
                                <View  style={this.state.type==='buy'?{borderBottomColor:DefaultConfig.green,borderBottomWidth:3}:{}}><Text style={[styles.tradeText,styles.tradeBuy]}>买入</Text></View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.setState({type:'sell'})}} style={this.state.type==='sell'?{borderBottomColor:DefaultConfig.red,borderBottomWidth:3}:{}}>
                                <View  style={this.state.type==='sell'?{borderBottomColor:DefaultConfig.red,borderBottomWidth:3}:{}}><Text style={[styles.tradeText,styles.tradeSell]}>卖出</Text></View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.tradeCenter}>
                            <TextInput placeholder={'价格'} selectionColor={this.state.type==='buy'?DefaultConfig.green:DefaultConfig.red} style={styles.inputPrice}/>
                            <TextInput placeholder={'数量'} selectionColor={this.state.type==='buy'?DefaultConfig.green:DefaultConfig.red} style={styles.inputPrice}/>
                            <TextInput placeholder={'总价'} selectionColor={this.state.type==='buy'?DefaultConfig.green:DefaultConfig.red} style={styles.inputPrice}/>
                        </View>
                        <View style={styles.tradeBottom}>
                            <TouchableOpacity>
                                <Text style={[styles.tradeBottomText,this.state.type==='buy'?{backgroundColor:DefaultConfig.green}:{backgroundColor:DefaultConfig.red}]}>{this.state.type==='buy'?'买入':'卖出'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.history}>
                        <View style={styles.historyTop}>
                            <View style={[styles.historyTopView,this.state.history==='market'?{borderBottomColor:DefaultConfig.blue,borderBottomWidth:3}:{}]}>
                                <TouchableWithoutFeedback onPress={()=>{this.setState({history:'market'})}}>
                                    <Text style={styles.historyTopText}>交易历史</Text>
                                </TouchableWithoutFeedback>
                            </View>
                            {
                                this.state.quote==='BTS'?
                                    <View style={[styles.historyTopView,this.state.history==='maker'?{borderBottomColor:DefaultConfig.blue,borderBottomWidth:3}:{}]}>
                                        <TouchableWithoutFeedback onPress={()=>{this.setState({history:'maker'})}}>
                                            <Text style={styles.historyTopText}>清算单</Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    :
                                    null
                            }
                            <View style={[styles.historyTopView,this.state.history==='my'?{borderBottomColor:DefaultConfig.blue,borderBottomWidth:3}:{}]}>
                                <TouchableWithoutFeedback onPress={()=>{this.setState({history:'my'})}}>
                                    <Text style={styles.historyTopText}>我的委托</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={styles.historyBottom}>
                            {
                                this.state.history==='market'
                                    ?
                                    <FlatList
                                          keyExtractor={item=>item.id}
                                          data={this.state.fillOrders}
                                          ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#D3D3D3'}}/>}
                                          ListHeaderComponent={()=><FillOrderItem price={'价格'} quote={this.state.quote} base={this.state.base} time={'生成时间'}/>}
                                          renderItem={({item,index})=>{
                                              if(index%2===0){
                                                  var price=0;
                                                  var quoteNum=0;
                                                  var baseNum=0;
                                                  var newBase=item.op.fill_price.base;
                                                  var newQuote=item.op.fill_price.quote;
                                                  var type='';
                                                  if(newBase.asset_id===item.key.base&&newQuote.asset_id===item.key.quote){
                                                      price=(NumberUtil.assetNum(item.op.fill_price.quote.amount,this.baseObj.precision)/
                                                          NumberUtil.assetNum(item.op.fill_price.base.amount,this.quoteObj.precision)).toFixed(this.baseObj.precision);

                                                      baseNum=NumberUtil.assetNum(item.op.receives.amount,this.baseObj.precision).toFixed(this.baseObj.precision);
                                                      quoteNum=NumberUtil.assetNum(item.op.pays.amount,this.quoteObj.precision).toFixed(this.quoteObj.precision);
                                                      type='buy';
                                                  }else if (newBase.asset_id===item.key.quote&&newQuote.asset_id===item.key.base) {
                                                      price=(NumberUtil.assetNum(item.op.fill_price.base.amount,this.baseObj.precision)/
                                                          NumberUtil.assetNum(item.op.fill_price.quote.amount,this.quoteObj.precision)).toFixed(this.baseObj.precision);

                                                      quoteNum=NumberUtil.assetNum(item.op.receives.amount,this.quoteObj.precision).toFixed(this.quoteObj.precision);
                                                      baseNum=NumberUtil.assetNum(item.op.pays.amount,this.baseObj.precision).toFixed(this.baseObj.precision);
                                                      type='sell';
                                                  }
                                                  if(!item.op.is_maker){
                                                      type='maker'
                                                  }
                                                  var time = MyUtil.TtimeToMyTime(item.time);
                                                  return (<FillOrderItem price={price} quote={quoteNum} base={baseNum} time={time} type={type}/>)
                                              }else {
                                                  return null
                                              }

                                          }}
                                    />
                                    :
                                    this.state.history==='maker'?
                                        <FlatList style={{flex:1}}
                                              ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#D3D3D3'}}/>}
                                              ListHeaderComponent={()=><FillOrderItem price={'价格'} quote={this.state.quote} base={this.state.base} time={'生成时间'}/>}
                                        />
                                        :
                                    <FlatList style={{flex:1}}/>
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>

        );
    }
    componentDidUpdate(){
        DataPool.trade=this
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        DataPool.trade=null;
    }
}
export default Trade;

const styles=StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:'white'
    },
    orderRoot:{
        flexDirection:'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    orderView:{
        height:180,
    },
    orderList:{
        flex:1
    },
    priceRoot:{
        height:40,
        flexDirection:'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        borderBottomWidth:1,
        borderBottomColor:'#D3D3D3'
    },
    priceText:{
        lineHeight:44,
        fontSize:12,
        fontWeight:'bold',
        color:'gray'
    },
    priceNum:{
        lineHeight:40,
        fontSize:20,
        fontWeight:'bold',
        color:DefaultConfig.green
    },
    priceCoin:{
        lineHeight:44,
        fontSize:12,
        color:'gray'
    },
    tradeTop:{
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    trade:{
        marginTop:5,
        paddingLeft:5,
        paddingRight:5
    },
    tradeText:{
        fontSize:20,
        fontWeight:'bold',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10

    },
    tradeBuy:{
        color:DefaultConfig.green
    },
    tradeSell:{
        color:DefaultConfig.red,
    },
    tradeCenter:{
        marginTop:5,
        marginBottom:5
    },
    inputPrice:{
        height:40,
        borderColor:'#D3D3D3',
        borderWidth:1,
        marginTop:5,
        marginBottom:5,
        paddingLeft:10,
        paddingRight:10,
        fontWeight:'bold',
        fontSize:16,
        borderRadius:3
    },
    tradeBottom:{
        height:40,
    },
    tradeBottomText:{
        textAlign:'center',
        fontSize:18,
        fontWeight:'bold',
        color:'white',
        lineHeight:40,
        backgroundColor:DefaultConfig.green
    },
    history:{
        marginTop:10,
        paddingLeft:5,
        paddingRight:5,
        borderTopWidth:1,
        borderTopColor:'#D3D3D3'
    },
    historyTop:{
        flexDirection:'row'
    },
    historyTopView:{
        flex:1,
    },
    historyTopText:{
        flex:1,
        fontSize:14,
        height:40,
        lineHeight:40,
        textAlign:'center'
    },
    historyBottom:{
        flex:1,
    }
})