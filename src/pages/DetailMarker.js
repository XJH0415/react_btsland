import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet, processColor, TouchableHighlight
} from 'react-native';
import Application from "../Application";
import DataPool from "../service/DataPool";
import Header from '../components/Header'
import {CombinedChart} from 'react-native-charts-wrapper';
import BitsharesUtil from "../utils/BitsharesUtil";
import NumberUtil from "../utils/NumberUtil";
import MyUtil from "../utils/MyUtil";
import _ from 'lodash';
import update from "immutability-helper";
import DefaultConfig from "../DefaultConfig";

export default class DetailMarker extends React.Component {
  static defaultProps = {
    base: '',
    quote: '',
  }
  state = {
    dataDesc1:{
      event:'',
      ma5:'',
      ma10:'',
      ma20:'',
      ma30:'',
    },
    dataDesc2:{
      event:'',
      vma5:'',
      vma10:''
    },
    marketTicker: null,
    max:0.0,
    min:0.0,
    newOpen:0.0,
    base: this.props.base,
    quote: this.props.quote,
    bucketSize: 24 * 60 * 60,
    legend: {
      enabled: true,
      textSize: 10,
      textColor: processColor('white'),
      form: 'CIRCLE',
      wordWrapEnabled: true
    },
    data1: {
      lineData: {
        dataSets: [
          {
            values: [{x: 0, y: 0}],
            label: 'MA5',
            config: {
              drawValues: false,
              colors: [processColor('white')],
              mode: "CUBIC_BEZIER",
              drawCircles: false,
              lineWidth: 2,
            }
          }
        ],
      },
    },
    data2: {
      barData: {
        dataSets: [{
          values: [{y: 0}],
          label: 'VOL',
          config: {
            color: processColor('#71BD6A'),
            highlightAlpha: 10000,
            highlightColor: processColor('#D14B5A'),
          }
        }]
      },
    },
    marker: {
      enabled: true,
      markerColor: processColor('#2c3e50AA'),
      textColor: processColor('white'),
    },
    zoom: {scaleX: 3, scaleY: 1, xValue: 70, yValue: 0, axisDependency: 'LEFT'}
  }

  /**
   * 渲染前
   */
  componentWillMount() {
    var {state} = this.props.navigation;
    this.setState({
      quote: state.params.quote,
      base: state.params.base
    })
    this.showData();


  }
  base=null;
  quote=null;
  showData() {
    let bucketCount = 200;
    let bucketSize = this.state.bucketSize;
    let startDate = new Date();
    let endDate = new Date();
    startDate = new Date(
      startDate.getTime() -
      bucketSize * bucketCount * 1000
    );
    endDate.setDate(endDate.getDate() + 1);

    let candles = [];
    let line5s = [];
    let line10s = [];
    let line20s = [];
    let line30s = [];
    let tables = [];
    let vBar = [];
    let vLine5s = [];
    let vLine10s = [];
    let vLine20s = [];
    let vLine30s = [];
    BitsharesUtil.db_api('lookup_asset_symbols', [[this.state.quote, this.state.base]], (assetObjs) => {
      this.quote = assetObjs[0];
      this.base = assetObjs[1];
      var MA5 = 0;
      var MA10 = 0;
      var MA20 = 0;
      var MA30 = 0;
      var VMA5 = 0;
      var VMA10 = 0;
      var VMA20 = 0;
      var VMA30 = 0;
      BitsharesUtil.db_api('get_ticker', [this.state.base, this.state.quote], (marketTicker) => {
        this.setState({
          marketTicker: marketTicker
        });
      })
      BitsharesUtil.history_api('get_market_history', [
        this.base.id,
        this.quote.id,
        bucketSize,
        startDate.toISOString().slice(0, -5),
        endDate.toISOString().slice(0, -5)], (charts) => {
        if (!charts || charts.length === 0) {
          alert(charts.length)
          return;
        }
        var max=0.0;
        var min=0.0;
        charts.map((item, index) => {
          var {key, high_base, high_quote, low_base, low_quote, open_base, open_quote, close_base, close_quote, base_volume, quote_volume} = item;
          var market = {};
          if (key.base !== this.base.id) {
            market = {
              time: this.state.bucketSize === 24 * 60 * 60 ? MyUtil.TtimeToMyTime(key.open) : MyUtil.TtimeToMyTime2(key.open, 'hh:mm'),
              high: NumberUtil.assetNum(high_quote, this.base.precision) / NumberUtil.assetNum(high_base, this.quote.precision) * 1,
              low: NumberUtil.assetNum(low_quote, this.base.precision) / NumberUtil.assetNum(low_base, this.quote.precision) * 1,
              open: NumberUtil.assetNum(open_quote, this.base.precision) / NumberUtil.assetNum(open_base, this.quote.precision) * 1,
              close: NumberUtil.assetNum(close_quote, this.base.precision) / NumberUtil.assetNum(close_base, this.quote.precision) * 1,
              base_volume: NumberUtil.assetNum(base_volume, this.quote.precision) * 1,
              quote_volume: NumberUtil.assetNum(quote_volume, this.base.precision) * 1
            };
          } else {
            market = {
              time: this.state.bucketSize === 24 * 60 * 60 ? MyUtil.TtimeToMyTime(key.open) : MyUtil.TtimeToMyTime2(key.open, 'hh:mm'),
              high: NumberUtil.assetNum(high_base, this.base.precision) / NumberUtil.assetNum(high_quote, this.quote.precision) * 1,
              low: NumberUtil.assetNum(low_base, this.base.precision) / NumberUtil.assetNum(low_quote, this.quote.precision) * 1,
              open: NumberUtil.assetNum(open_base, this.base.precision) / NumberUtil.assetNum(open_quote, this.quote.precision) * 1,
              close: NumberUtil.assetNum(close_base, this.base.precision) / NumberUtil.assetNum(close_quote, this.quote.precision) * 1,
              base_volume: NumberUtil.assetNum(base_volume, this.base.precision) * 1,
              quote_volume: NumberUtil.assetNum(quote_volume, this.quote.precision) * 1
            };
          }
          if(market.high>max||index===0){
            max=market.high;
          }
          if(market.open>max||index===0){
            max=market.open;
          }
          if(market.close>max||index===0){
            max=market.close;
          }
          if(market.low<min||index===0){
            min=market.low
          }
          if(market.open<min||index===0){
            min=market.open
          }
          if(market.close<min||index===0){
            min=market.close
          }
          MA5 += market.close;
          if (index - 5 >= 0) {
            MA5 -= candles[index - 5].close;
            line5s.push({x: index, y: (MA5 / 5).toFixed(this.base.precision) * 1})
          }
          MA10 += market.close;
          if (index - 10 >= 0) {
            MA10 -= candles[index - 10].close;
            line10s.push({x: index, y: (MA10 / 10).toFixed(this.base.precision) * 1})
          }
          MA20 += market.close;
          if (index - 20 >= 0) {
            MA20 -= candles[index - 20].close;
            line20s.push({x: index, y: (MA20 / 20).toFixed(this.base.precision) * 1})
          }
          MA30 += market.close;
          if (index - 30 >= 0) {
            MA30 -= candles[index - 30].close;
            line30s.push({x: index, y: (MA30 / 30).toFixed(this.base.precision) * 1})
          }
          candles.push({
            x: market.time,
            shadowH: market.high.toFixed(this.base.precision) * 1,
            shadowL: market.low.toFixed(this.base.precision) * 1,
            open: market.open.toFixed(this.base.precision) * 1,
            close: market.close.toFixed(this.base.precision) * 1,
            market: market
          });
          tables.push(market.time);
          vBar.push(market.base_volume);


          VMA5 += market.base_volume;
          if (index - 5 >= 0) {
            VMA5 -= vBar[index - 5];
            vLine5s.push({x: index, y: (VMA5 / 5).toFixed(this.base.precision) * 1})
          }
          VMA10 += market.base_volume;
          if (index - 10 >= 0) {
            VMA10 -= vBar[index - 10];
            vLine10s.push({x: index, y: (VMA10 / 10).toFixed(this.base.precision) * 1})
          }
          VMA20 += market.base_volume;
          if (index - 20 >= 0) {
            VMA20 -= vBar[index - 20];
            vLine20s.push({x: index, y: (VMA20 / 20).toFixed(this.base.precision) * 1})
          }
          VMA30 += market.base_volume;
          if (index - 30 >= 0) {
            VMA30 -= vBar[index - 30];
            vLine30s.push({x: index, y: (VMA30 / 30).toFixed(this.base.precision) * 1})
          }

        });
        this.setState({
          max:max,
          min:min,
          newOpen:candles[charts.length-1].open,
          data1: {
            candleData: {
              dataSets: [{
                values: candles,
                label: 'K',
                config: {
                  highlightColor: processColor('darkgray'),
                  shadowColor: processColor('black'),
                  shadowWidth: 1,
                  shadowColorSameAsCandle: true,
                  increasingColor: processColor('#71BD6A'),
                  increasingPaintStyle: 'fill',
                  decreasingColor: processColor('#D14B5A'),
                  drawValues: false,
                  drawCircles: false,
                },
              }],
            },
            lineData: {
              dataSets: [
                {
                  values: line5s,
                  label: 'MA5',
                  config: {
                    drawValues: false,
                    colors: [processColor('white')],
                    mode: "CUBIC_BEZIER",
                    drawCircles: false,
                    lineWidth: 0.8,
                  }
                },
                {
                  values: line10s,
                  label: 'MA10',
                  config: {
                    drawValues: false,
                    colors: [processColor('yellow')],
                    mode: "CUBIC_BEZIER",
                    drawCircles: false,
                    lineWidth: 0.8,
                  }
                },
                {
                  values: line20s,
                  label: 'MA20',
                  config: {
                    drawValues: false,
                    colors: [processColor('blue')],
                    mode: "CUBIC_BEZIER",
                    drawCircles: false,
                    lineWidth: 0.8,
                  }
                },
                {
                  values: line30s,
                  label: 'MA30',
                  config: {
                    drawValues: false,
                    colors: [processColor('purple')],
                    mode: "CUBIC_BEZIER",
                    drawCircles: false,
                    lineWidth: 0.8,
                  }
                }],
            },
          },
          xAxis: {
            valueFormatter: tables,
            granularityEnabled: true,
            granularity: 1,
          },
          data2: {
            barData: {
              dataSets: [{
                values: vBar,
                label: 'VOL',
                config: {
                  color: processColor('#71BD6A'),
                  highlightAlpha: 10000,
                  highlightColor: processColor('#D14B5A'),
                  drawValues: false,
                  drawCircles: false,
                }
              }]
            },
            lineData: {
              dataSets: [
                {
                  values: vLine5s,
                  label: 'VMA5',
                  config: {
                    drawValues: false,
                    colors: [processColor('white')],
                    mode: "CUBIC_BEZIER",
                    drawCircles: false,
                    lineWidth: 0.8,
                  }
                },
                {
                  values: vLine10s,
                  label: 'VMA10',
                  config: {
                    drawValues: false,
                    colors: [processColor('yellow')],
                    mode: "CUBIC_BEZIER",
                    drawCircles: false,
                    lineWidth: 0.8,
                  }
                }],
            },
          },
          zoom: {
            scaleX: 3,
            scaleY: 1,
            xValue: candles.length - (candles.length / 3 / 3),
            yValue: 0,
            axisDependency: 'LEFT'
          }
        });
      })
    })
  }
  showEvent1(event){
    var x=event.nativeEvent.x;
    if(x){

    }else {
      var data=event.nativeEvent.data;
      if(data){
        x=data.x;
      }else {
        x=-1;
      }
    }
    var lineData=this.state.data1.lineData;
    var candleData=this.state.data1.candleData
    var line5=lineData&&lineData.dataSets&&lineData.dataSets[0]&&lineData.dataSets[0].values[x-5]?lineData.dataSets[0].values[x-5]:null;
    var line10=lineData&&lineData.dataSets&&lineData.dataSets[1]&&lineData.dataSets[1].values[x-10]?lineData.dataSets[1].values[x-10]:null;
    var line20=lineData&&lineData.dataSets&&lineData.dataSets[2]&&lineData.dataSets[2].values[x-20]?lineData.dataSets[2].values[x-20]:null;
    var line30=lineData&&lineData.dataSets&&lineData.dataSets[3]&&lineData.dataSets[3].values[x-30]?lineData.dataSets[3].values[x-30]:null;
    var candle=candleData&&candleData.dataSets&&candleData.dataSets[0]&&candleData.dataSets[0].values[x]?candleData.dataSets[0].values[x]:null;
    this.setState({
      dataDesc1:{
        event:candle?'O:'+candle.open+' H:'+candle.shadowH+' L:'+candle.shadowL+' C:'+candle.close+' V:'+candle.market.base_volume.toFixed(4)+' Time:'+candle.market.time:'',
        ma5:line5?'MA5:'+line5.y:'',
        ma10:line10?'MA10:'+line10.y:'',
        ma20:line20?'MA10:'+line20.y:'',
        ma30:line30?'MA10:'+line30.y:'',
      }
    })
  }
  showEvent2(event){
    var x=event.nativeEvent.x;
    if(x){

    }else {
      var data=event.nativeEvent.data;
      if(data){
        x=data.x;
      }else {
        x=-1;
      }
    }
    var lineData=this.state.data2.lineData;
    var barData=this.state.data2.barData
    var candleData=this.state.data1.candleData;
    var line5=lineData&&lineData.dataSets&&lineData.dataSets[0]&&lineData.dataSets[0].values[x-5]?lineData.dataSets[0].values[x-5]:null;
    var line10=lineData&&lineData.dataSets&&lineData.dataSets[1]&&lineData.dataSets[1].values[x-10]?lineData.dataSets[1].values[x-10]:null;
    var bar=barData&&barData.dataSets&&barData.dataSets[0]&&barData.dataSets[0].values[x]?barData.dataSets[0].values[x]:null;
    var candle=candleData&&candleData.dataSets&&candleData.dataSets[0]&&candleData.dataSets[0].values[x]?candleData.dataSets[0].values[x]:null;
    this.setState({
      dataDesc2:{
        event:(bar?'V:'+bar:'')+(candle?'Time:'+candle.market.time:''),
        vma5:line5?'VMA5:'+line5.y:'',
        vma10:line10?'VMA10:'+line10.y:'',
      }
    })
  }
  render() {
    var marketTicker = this.state.marketTicker;
    return (
      <View style={styles.root}>
        <Header style={{backgroundColor: 'white'}} navigation={this.props.navigation} leftType={'back'}
                rightType={'none'} title={this.state.quote + '/' + this.state.base + '行情'}/>
        <View style={styles.top}>
          <View style={{flex: 1.5}}>
            <Text numberOfLines={1}  style={[styles.text,{fontSize:20,lineHeight:24, fontWeight:'bold'},marketTicker&&marketTicker.percent_change*1<=0?{color:DefaultConfig.red}:{color:DefaultConfig.green}]}>{marketTicker&&this.base? (marketTicker.latest*1).toFixed(this.base.precision) : 0.0}</Text>
            <Text style={[styles.text,marketTicker&&marketTicker.percent_change*1<=0?{color:DefaultConfig.red}:{color:DefaultConfig.green}]}>{marketTicker?(marketTicker.percent_change*1).toFixed(2)+'%':0+'%'}</Text>
            {/*<View style={{flexDirection: 'row'}}>*/}
              {/*<Text style={[styles.text,styles.tab]}>喂价：</Text>*/}
              {/*<Text numberOfLines={1}  style={styles.text}>1.2</Text>*/}
            {/*</View>*/}
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text,styles.tab]}>最高：</Text>
              <Text numberOfLines={1}  style={styles.text}>{this.base?this.state.max.toFixed(this.base.precision):0.0}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text,styles.tab]}>最低：</Text>
              <Text numberOfLines={1}  style={styles.text}>{this.base?this.state.min.toFixed(this.base.precision):0.0}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text,styles.tab]}>24量：</Text>
              <Text numberOfLines={1}  style={styles.text}>{marketTicker&&this.quote? (marketTicker.base_volume*1).toFixed(this.base.precision) : 0.0}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text,styles.tab]}>开盘：</Text>
              <Text numberOfLines={1}  style={styles.text}>{this.state.newOpen}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text,styles.tab]}>收盘：</Text>
              <Text numberOfLines={1}  style={styles.text}>{marketTicker&&this.base? (marketTicker.latest*1).toFixed(this.base.precision) : 0.0}</Text>
            </View>
          </View>
        </View>
        <View style={{marginLeft:8,marginRight:8}}>
          <Text style={styles.dataDesc}>{this.state.dataDesc1.event}</Text>
        </View>
        <View style={{flexDirection:'row',marginLeft:8,marginRight:8}}>
          <Text style={[styles.dataDesc,{color:'white'}]}>{this.state.dataDesc1.ma5}</Text>
          <Text style={[styles.dataDesc,{color:'yellow'}]}>{this.state.dataDesc1.ma10}</Text>
          <Text style={[styles.dataDesc,{color:'blue'}]}>{this.state.dataDesc1.ma20}</Text>
          <Text style={[styles.dataDesc,{color:'purple'}]}>{this.state.dataDesc1.ma30}</Text>
        </View>
        <CombinedChart
          legend={this.state.legend}
          chartDescription={{text: ''}}
          style={styles.chart1}
          marker={this.state.marker}
          data={this.state.data1}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          autoScaleMinMaxEnabled={true}
          zoom={this.state.zoom}
          onChange={(event)=>{this.showEvent1(event)}}
          onSelect={(event)=>{this.showEvent1(event)}}
        />
        <View style={{flexDirection:'row',marginLeft:8,marginRight:8}}>
          <Text style={[styles.dataDesc,{color:'white'}]}>{this.state.dataDesc2.vma5}</Text>
          <Text style={[styles.dataDesc,{color:'yellow'}]}>{this.state.dataDesc2.vma10}</Text>
          <Text style={styles.dataDesc}>{this.state.dataDesc2.event}</Text>
        </View>
        <CombinedChart
          legend={this.state.legend}
          chartDescription={{text: ''}}
          data={this.state.data2}
          style={styles.chart2}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          autoScaleMinMaxEnabled={true}
          zoom={this.state.zoom}
          onChange={(event)=>{this.showEvent2(event)}}
          onSelect={(event)=>{this.showEvent2(event)}}
        />
        <View style={styles.bottom}>
          <TouchableHighlight onPress={() => {
            this.setState({
              bucketSize: 5 * 60
            });
            this.showData();
          }} style={[styles.bottomButtonView, this.state.bucketSize === 5 * 60 ? {backgroundColor: '#708090'} : {}]}>
            <Text style={styles.bottomButton}>5分</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            this.setState({
              bucketSize: 60 * 60
            });
            this.showData();
          }} style={[styles.bottomButtonView, this.state.bucketSize === 60 * 60 ? {backgroundColor: '#708090'} : {}]}>
            <Text style={styles.bottomButton}>1时</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            this.setState({
              bucketSize: 24 * 60 * 60
            });
            this.showData();
          }}
                              style={[styles.bottomButtonView, this.state.bucketSize === 24 * 60 * 60 ? {backgroundColor: '#708090'} : {}]}>
            <Text style={styles.bottomButton}>日线</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  /**
   * 渲染后，只会调用一次
   */
  componentDidMount() {
    this.timer = setInterval(() => {
      this.showData();
    }, 5000);
    this.setState(
      update(this.state, {
          xAxis: {
            $set: {
              drawLabels: true,
              drawGridLines: true,
              position: 'BOTTOM',
              textColor: processColor('white'),
              textSize: 10,

            }
          },
          yAxis: {
            $set: {
              left: {
                textSize: 0
              },
              right: {
                valueFormatter: '#.####',
                textColor: processColor('white'),
                textSize: 10,
              },

            }
          },
          zoomXValue: {
            $set: 99999
          }
        }
      ));
  }

  /**
   * 当props发生变化时
   * @param nextProps 变化后的props
   */
  componentWillReceiveProps(nextProps) {

  }

  /**
   * 当props和state发生变化时调用,根据返回值判断是否渲染
   * @param nextProps
   * @param nextState
   */
  // shouldComponentUpdate(nextProps,nextState){
  //     return true
  // }

  /**
   * 更新前调用
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate(nextProps, nextState) {

  }

  /**
   * 更新后调用
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate(prevProps, prevState) {

  }

  /**
   * 当组件要被从界面上移除的时候
   */
  componentWillUnmount() {
    clearInterval(this.timer)
  }

}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#36648B'
  },
  top: {
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8
  },
  tab:{
    color:'gray'
  },
  text: {
    lineHeight: 20,
    fontSize:12,
    color:'white'
  },
  chart1: {
    flex: 1,
  },
  chart2: {
    height: 200
  },
  bottom: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  bottomButton: {
    width: 100,
    textAlign: 'center',
    lineHeight: 30,
    color: 'white',
    fontWeight: 'bold'
  },
  bottomButtonView: {
    borderColor: 'gray',
    borderWidth: 1
  },
  dataDesc:{
    lineHeight:12,
    fontSize:10,
    color:'white'
  }
})