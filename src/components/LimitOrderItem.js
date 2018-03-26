import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,TouchableOpacity
} from 'react-native';
import DefaultConfig from "../DefaultConfig";
import BitsharesUtil from "../utils/BitsharesUtil";
import NumberUtil from "../utils/NumberUtil";

export default class LimitOrderItem extends React.Component{
    static defaultProps={
        limitOrder:null
    }
    state={
        baseName:'',
        quoteName:'',
        saleNum:0,
        baseNum:0,
        quoteNum:0,
        baseObj:null,
        quoteObj:null,
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }

    render(){
        var {baseName,quoteName,saleNum,baseNum,quoteNum,quoteObj,baseObj}=this.state;
        var type=DefaultConfig.bowerCoins.indexOf(quoteName)!==-1? 'sell' : 'buy';
        return(
            <View style={styles.root}>
                <View style={styles.top}>
                    <View style={styles.topTitle1}>
                        <Text style={[styles.topTitleType,{color:type==='buy'?DefaultConfig.green:DefaultConfig.red}]}>{type==='buy'?'买入':'卖出'}</Text>
                        <Text style={[styles.topTitleTextNum,{color:type==='buy'?DefaultConfig.green:DefaultConfig.red}]}>（{baseName}</Text>
                        <Text style={[styles.topTitleTextNum,{color:type==='buy'?DefaultConfig.green:DefaultConfig.red}]}>{'→'}</Text>
                        <Text style={[styles.topTitleTextNum,{color:type==='buy'?DefaultConfig.green:DefaultConfig.red}]}>{quoteName}）</Text>
                    </View>
                    <View style={styles.topTitle2}>
                        <Text style={styles.topTitleText}>价格：</Text>
                        <Text style={[styles.topTitleTextNum,{color:type==='buy'?DefaultConfig.green:DefaultConfig.red}]}>{
                            type==='buy'?
                                (baseNum/quoteNum).toFixed(baseObj?baseObj.precision:4)+' '+baseName
                                :
                                (quoteNum/baseNum).toFixed(baseObj?baseObj.precision:4)+' '+quoteName
                        }
                        </Text>
                    </View>
                </View>
                <View style={styles.center}>
                    <View style={styles.centerLeft}>
                        <View style={styles.centerRow}>
                            <Text style={styles.centerTab}>消耗：</Text><Text style={styles.centerTabNum}>{baseNum} {baseName}</Text>
                        </View>
                        <View style={styles.centerRow}>
                            <Text style={styles.centerTab}>获得：</Text><Text style={styles.centerTabNum}>{quoteNum} {quoteName}</Text>
                        </View>
                        <View style={styles.centerRow}>
                            <Text style={styles.centerTab}>已成交：</Text><Text style={styles.centerTabNum}>{baseNum-saleNum} {baseName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                    <View style={styles.centerRight}>
                        <Text style={styles.centerRightText}>取消</Text>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom}>
                    <View style={styles.backColor}>
                        <View style={[styles.foreColor,{flex:(baseNum-saleNum)/baseNum},{backgroundColor:type==='buy'?DefaultConfig.green:DefaultConfig.red}]}/>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * 渲染后，只会调用一次
     */
    componentDidMount(){
        let baseName, quoteName,saleNum,baseNum,quoteNum;
        let limitOrder=this.props.limitOrder;
        if(limitOrder){
            let {for_sale,sell_price}=limitOrder;
            let {base,quote}=sell_price;
            BitsharesUtil.getAssetObject(base.asset_id,(assetObj)=>{
                baseName=assetObj.symbol;
                baseNum=NumberUtil.assetNum(base.amount,assetObj.precision);
                saleNum=NumberUtil.assetNum(for_sale,assetObj.precision);
                this.setState({
                    baseName:baseName,
                    baseNum:baseNum,
                    saleNum:saleNum,
                    baseObj:assetObj,
                })
            });
            BitsharesUtil.getAssetObject(quote.asset_id,(assetObj)=>{
                quoteName=assetObj.symbol;
                quoteNum=NumberUtil.assetNum(quote.amount,assetObj.precision);
                this.setState({
                    quoteName:quoteName,
                    quoteNum:quoteNum,
                    quoteObj:assetObj,
                })
            });
        }
    }

    /**
     * 当props发生变化时
     * @param nextProps 变化后的props
     */
    componentWillReceiveProps(nextProps){

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
    componentWillUpdate(nextProps,nextState){

    }

    /**
     * 更新后调用
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate(prevProps,prevState){

    }

    /**
     * 当组件要被从界面上移除的时候
     */
    componentWillUnmount(){

    }

}

const styles=StyleSheet.create({
    root:{
        height:96,
        paddingLeft:5,
        paddingRight:5
    },
    top:{
        height:22,
        flexDirection:'row',
    },
    topTitle1:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    topTitle2:{
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',

    },
    topTitleType:{
        lineHeight:22,
        fontSize:16,
        color:DefaultConfig.red,
        fontWeight:'bold'
    },
    topTitleText:{
        lineHeight:22,
        color:'gray',
        fontSize:12
    },
    topTitleTextNum:{
        lineHeight:22,
        fontSize:12,
        fontWeight:'bold',
        color:DefaultConfig.red,
    },
    center:{
        height:60,
        borderBottomWidth:0.5,
        borderBottomColor:'#D3D3D3',
        borderTopWidth:0.5,
        borderTopColor:'#D3D3D3',
        flexDirection:'row',
        justifyContent:'center'
    },
    centerLeft:{
        flex:2,
    },
    centerRow:{
        height:20,
        flexDirection:'row',
    },
    centerTab:{
        fontSize:13,
        lineHeight:20,
        color:'gray'
    },
    centerTabNum:{
        fontSize:13,
        lineHeight:20,
    },
    centerRight:{
        width:50,
        height:60,
        flexDirection:'row',
        justifyContent:'center'
    },
    centerRightText:{
        fontSize:16,
        fontWeight:'bold',
        textAlign:'center',
        lineHeight:60,
        color:'gray'
    },
    bottom:{
        height:14
    },
    backColor:{
        flexDirection:'row',
        height:4,
        borderRadius:5,
        backgroundColor:'#D3D3D3',
        marginTop:5,
        marginBottom:5
    },
    foreColor:{
        flex:0.2,
        borderRadius:5,
        backgroundColor:DefaultConfig.red,
    }

})