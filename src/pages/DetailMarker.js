import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet, processColor,TouchableHighlight
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
export default class DetailMarker extends React.Component {
  static defaultProps = {
    base: 'BTS',
    quote: 'CNY',
  }
  state = {
    bucketSize:24*60*60,
    legend: {
      enabled: true,
      textSize: 10,
      textColor:processColor('white'),
      form: 'CIRCLE',
      wordWrapEnabled: true
    },
    data1:{
      lineData: {
        dataSets: [
          {
            values: [{x:2,y:2},{x:3,y:4}],
            label: 'MA5',
            config: {
              drawValues: false,
              colors: [processColor('white')],
              mode: "CUBIC_BEZIER",
              drawCircles: false,
              lineWidth: 2,
            }
          },
          {
            values: [{x:3,y:4},{x:4,y:5}],
            label: 'MA10',
            config: {
              drawValues: false,
              colors: [processColor('yellow')],
              mode: "CUBIC_BEZIER",
              drawCircles: false,
              lineWidth: 2,
            }
          },
          {
            values: [{x:4,y:6},{x:5,y:4}],
            label: 'MA30',
            config: {
              drawValues: false,
              colors: [processColor('red')],
              mode: "CUBIC_BEZIER",
              drawCircles: false,
              lineWidth: 2,
            }
          }
          ],
      },
    },
    data2:{
      barData: {
        dataSets: [{
          values: [{y: 100}, {y: 105}, {y: 102}, {y: 110}, {y: 114}, {y: 109}, {y: 105}, {y: 99}, {y: 95}],
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
  }

  /**
   * 渲染前
   */
  componentWillMount() {
    this.showData();


  }

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
    let line20s=[];
    let line30s = [];
    let tables = [];
    let vBar=[];
    let vLine5s=[];
    let vLine10s=[];
    let vLine20s=[];
    let vLine30s = [];
    var baseID = '1.3.0';
    var quoteID = '1.3.113'
    BitsharesUtil.history_api('get_market_history', [
      quoteID,
      baseID,
      bucketSize,
      startDate.toISOString().slice(0, -5),
      endDate.toISOString().slice(0, -5)], (charts) => {
      if(!charts||charts.length===0){
        alert(charts.length)
        return;
      }
      BitsharesUtil.getAssetObject([baseID, quoteID], (assetObjs) => {
        var base = assetObjs[0];
        var quote = assetObjs[1];
        var MA5 = 0;
        var MA10 = 0;
        var MA20=0;
        var MA30 = 0;
        var VMA5 = 0;
        var VMA10 = 0;
        var VMA20=0;
        var VMA30 = 0;
        charts.map((item, index) => {
          var {key, high_base, high_quote, low_base, low_quote, open_base, open_quote, close_base, close_quote, base_volume, quote_volume} = item;
          var market = {
            time: this.state.bucketSize===24*60*60?MyUtil.TtimeToMyTime(key.open):MyUtil.TtimeToMyTime2(key.open,'hh:mm'),
            high: NumberUtil.assetNum(high_quote, quote.precision) / NumberUtil.assetNum(high_base, base.precision)*1,
            low: NumberUtil.assetNum(low_quote, quote.precision) / NumberUtil.assetNum(low_base, base.precision)*1,
            open: NumberUtil.assetNum(open_quote, quote.precision) / NumberUtil.assetNum(open_base, base.precision)*1,
            close: NumberUtil.assetNum(close_quote, quote.precision) / NumberUtil.assetNum(close_base, base.precision)*1,
            base_volume: NumberUtil.assetNum(base_volume, base.precision)*1,
            quote_volume: NumberUtil.assetNum(quote_volume, quote.precision)*1
          };

          MA5 += market.close;
          if (index - 5 >= 0) {
            MA5 -= candles[index - 5].close;
            line5s.push({x: index, y: (MA5 / 5).toFixed(base.precision)*1})
          }
          MA10 += market.close;
          if (index - 10 >= 0) {
            MA10 -= candles[index - 10].close;
            line10s.push({x: index, y: (MA10 / 10).toFixed(base.precision)*1})
          }
          MA20 += market.close;
          if (index - 20 >= 0) {
            MA20 -= candles[index - 20].close;
            line20s.push({x: index, y: (MA20 / 20).toFixed(base.precision)*1})
          }
          MA30 += market.close;
          if (index - 30 >= 0) {
            MA30 -= candles[index - 30].close;
            line30s.push({x: index, y: (MA30 / 30).toFixed(base.precision)*1})
          }
          candles.push({
            x:market.time,
            shadowH: market.high.toFixed(base.precision)*1,
            shadowL: market.low.toFixed(base.precision)*1,
            open: market.open.toFixed(base.precision)*1,
            close: market.close.toFixed(base.precision)*1,
            market: market
          });
          tables.push(market.time);
          vBar.push(market.base_volume);


          VMA5 += market.base_volume;
          if (index - 5 >= 0) {
            VMA5 -= vBar[index - 5];
            vLine5s.push({x: index, y: (VMA5 / 5).toFixed(base.precision)*1})
          }
          VMA10 += market.base_volume;
          if (index - 10 >= 0) {
            VMA10 -= vBar[index - 10];
            vLine10s.push({x: index, y: (VMA10 / 10).toFixed(base.precision)*1})
          }
          VMA20 += market.base_volume;
          if (index - 20 >= 0) {
            VMA20 -= vBar[index - 20];
            vLine20s.push({x: index, y: (VMA20 / 20).toFixed(base.precision)*1})
          }
          VMA30 += market.base_volume;
          if (index - 30 >= 0) {
            VMA30 -= vBar[index - 30];
            vLine30s.push({x: index, y: (VMA30 / 30).toFixed(base.precision)*1})
          }

        });
        this.setState({
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
                  decreasingColor: processColor('#D14B5A')
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
            granularity : 1,
          },
          data2:{
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
          }
        });

      })
    })
  }

  render() {
    return (
      <View style={styles.root}>
        <Header style={{backgroundColor: 'white'}} navigation={this.props.navigation} leftType={'back'}
                rightType={'none'} title={'行情详情'}/>
        <View style={styles.top}>

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
          zoom={{scaleX: 3, scaleY: 1,xValue:40,yValue:0, axisDependency: 'RIGHT'}}
        />


        <CombinedChart
          legend={this.state.legend}
          chartDescription={{text: ''}}
          data={this.state.data2}
          style={styles.chart2}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          autoScaleMinMaxEnabled={true}
          zoom={{scaleX: 3, scaleY: 1,xValue:40,yValue:0, axisDependency: 'RIGHT'}}
        />
        <View style={styles.bottom}>
          <TouchableHighlight onPress={()=>{this.setState({
            bucketSize:5*60
          });
            this.showData();
          }} style={[styles.bottomButtonView,this.state.bucketSize===5*60?{backgroundColor:'#708090'}:{}]}>
            <Text style={styles.bottomButton}>5分</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>{this.setState({
            bucketSize:60*60
          });
            this.showData();
          }} style={[styles.bottomButtonView,this.state.bucketSize===60*60?{backgroundColor:'#708090'}:{}]}>
            <Text style={styles.bottomButton}>1时</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>{this.setState({
            bucketSize:4*60*60
          });
            this.showData();
          }} style={[styles.bottomButtonView,this.state.bucketSize===4*60*60?{backgroundColor:'#708090'}:{}]}>
            <Text style={styles.bottomButton}>4时</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>{this.setState({
            bucketSize:24*60*60
          });
            this.showData();
          }} style={[styles.bottomButtonView,this.state.bucketSize===24*60*60?{backgroundColor:'#708090'}:{}]}>
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
    this.timer=setInterval(()=>{this.showData()},10000);
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
    height: 70,
  },
  chart1: {
    flex: 1,
  },
  chart2: {
    height: 200
  },
  bottom:{
    height:30,
    flexDirection:'row',
  },
  bottomButton:{
    width:50,
    textAlign:'center',
    lineHeight:30,
    color:'white',
    fontWeight:'bold'
  },
  bottomButtonView:{
    borderColor:'gray',
    borderWidth:1
  }
})