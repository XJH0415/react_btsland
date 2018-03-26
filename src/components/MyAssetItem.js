import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import DefaultConfig from "../DefaultConfig";
import Application from "../Application";
import BitsharesUtil from "../utils/BitsharesUtil";

export default class MyAssetItem extends React.Component{
    static defaultProps={
        name:null,
        num:0.0,
        limitOrder:0.0,
        callOrder:0.0,
        asset_object:undefined,
        accountName:'',
        market:0.0,
    }
    state={
        name:this.props.name,
        num:this.props.num,
        limitOrder:this.props.limitOrder,
        callOrder:this.props.callOrder,
        asset_object:this.props.asset_object,
        accountName:this.props.accountName,
        market:this.props.market,
    }
    /**
     * 渲染前
     */
    componentWillMount() {

    }

    render(){
        var {name,num,limitOrder,callOrder,asset_object,accountName,market}=this.state;
        if(!name){
            name=asset_object.name
        }
        var precision =asset_object.precision;
        var total = name === 'BTS' ? (num + callOrder + limitOrder).toFixed(precision) : (num - callOrder + limitOrder).toFixed(precision);
        num=num.toFixed(precision);
        limitOrder=limitOrder.toFixed(precision);
        callOrder=callOrder.toFixed(precision);
        return (
            <View style={styles.root}>
                <View style={styles.top}>
                    <Text style={styles.topTabText}>{name}</Text>
                    <Text style={styles.topRightText}>≈{(market*1*total).toFixed(2)}CNY</Text>
                </View>
                <View style={styles.center}>
                    <View style={styles.left}>
                        <View style={styles.row}>
                            <Text style={styles.text}>总额：</Text>
                            <Text style={styles.text}>{total}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.text}>可用：</Text><Text style={styles.text}>{num}</Text>
                            {DefaultConfig.bowerCoins.indexOf(name) !== -1&&accountName===Application.account
                                ?
                                <TouchableOpacity style={styles.topButton}>
                                    <Text style={styles.topButtonText}>借入</Text>
                                </TouchableOpacity>
                                :
                                null
                            }
                        </View>

                    </View>
                    <View style={styles.right}>
                        <View style={styles.row}>
                            <Text style={styles.text}>挂单：</Text><Text style={styles.text}>{limitOrder}</Text>
                        </View>

                        <View style={styles.row}>
                            {DefaultConfig.bowerCoins.indexOf(name)!==-1
                                ?
                                <Text style={styles.text}>{name==='BTS'?'抵押：':'负债：'}</Text>
                                :
                                <Text style={styles.text}>{name==='BTS'?'抵押：':''}</Text>

                            }
                            {DefaultConfig.bowerCoins.indexOf(name)!==-1
                                ?
                                <Text style={[styles.text]}>{callOrder}</Text>
                                :
                                <Text style={[styles.text]}>{name==='BTS'?callOrder:''}</Text>
                            }


                            {DefaultConfig.bowerCoins.indexOf(name) !== -1&&callOrder>0&&accountName===Application.account
                                ?
                                <TouchableOpacity style={[styles.topButton, {backgroundColor: DefaultConfig.green}]}>
                                    <Text style={styles.topButtonText}>还款</Text>
                                </TouchableOpacity>
                                :
                                null
                            }
                            {name==='BTS'&&accountName===Application.account
                                ?
                                <TouchableOpacity style={[styles.topButton, {backgroundColor: DefaultConfig.blue}]}>
                                    <Text style={styles.topButtonText}>理仓</Text>
                                </TouchableOpacity>
                                :
                                null
                            }
                        </View>


                    </View>
                </View>
                {accountName===Application.account
                    ?
                    <View style={styles.bottom}>
                        <TouchableOpacity style={styles.bottomTabButton}><Text
                            style={[styles.bottomTabText, {color: DefaultConfig.blue}]}>充值</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.bottomTabButton}><Text
                            style={[styles.bottomTabText, {color: DefaultConfig.blue}]}>提现</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.bottomTabButton}><Text
                            style={[styles.bottomTabText, {color: DefaultConfig.green}]}>转账</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.bottomTabButton}><Text
                            style={[styles.bottomTabText, {color: DefaultConfig.red}]}>交易</Text></TouchableOpacity>
                    </View>
                    :null
                }
            </View>
        )
    }

    /**
     * 渲染后，只会调用一次
     */
    componentDidMount(){

    }

    /**
     * 当props发生变化时
     * @param nextProps 变化后的props
     */
    componentWillReceiveProps(nextProps){
        this.setState({
            name:nextProps.name,
            num:nextProps.num,
            limitOrder:nextProps.limitOrder,
            callOrder:nextProps.callOrder,
            asset_object:nextProps.asset_object,
            accountName:nextProps.accountName,
            market:nextProps.market,
        })
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
        clearInterval(this.timer);
    }

}

const styles=StyleSheet.create({
    root:{
        paddingLeft:10,
        paddingRight:10,
        borderTopWidth:0.5,
        borderTopColor:'#D3D3D3',
        borderBottomColor:'#D3D3D3',
        borderBottomWidth:0.5
    },
    top:{
        flexDirection:'row',
        height:25
    },
    topTabText:{
        lineHeight:25,
        fontWeight:'bold',
        fontSize:16,
        color:'#242424',
        marginRight:5
    },
    topButton:{
        height:21,
        marginTop:2,
        marginBottom:2,
        marginLeft:5,
        marginRight:5,
        paddingLeft:5,
        paddingRight:5,
        borderRadius:5,
        backgroundColor:DefaultConfig.red
    },
    topButtonText:{
        lineHeight:21,
        color:'white',
        fontSize:12,
        fontWeight:'bold'
    },
    topRightText:{
        flex:1,
        lineHeight:25,
        fontWeight:'bold',
        fontSize:14,
        color:'#708090',
        textAlign:'right'
    },
    center:{
        paddingTop:8,
        paddingBottom:8,
        flexDirection:'row',
        justifyContent:'space-between',
        height:66,
        borderTopWidth:0.5,
        borderTopColor:'#D3D3D3',
        borderBottomColor:'#D3D3D3',
        borderBottomWidth:0.5
    },
    bottom:{
        height:25,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    bottomTabButton:{
        paddingLeft:15,
        paddingRight:15
    },
    bottomTabText:{
        lineHeight:25,
        textAlign:'center',
        fontWeight:'bold'
    },
    left:{
        flex:1,
    },
    right: {
        flex:1,
    },
    row:{
        flex:1,
        flexDirection:'row',
    },
    text:{
        lineHeight:25,
        fontSize:12,
        color:'#708090'
    }
})