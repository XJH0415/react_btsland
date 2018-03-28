import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import DefaultConfig from "../DefaultConfig";
import BitsharesUtil from "../utils/BitsharesUtil";
import NumberUtil from "../utils/NumberUtil";
import MyUtil from "../utils/MyUtil";

export default class AccountHistoryItem extends React.Component{
    static defaultProps={
        accountHistory:null,
    }

    state={
        accountHistory:this.props.accountHistory,
        tab:'未知',
        center:'',
        time:'',
        color:0,
    }
    /**
     * 渲染前
     */
    componentWillMount(){
        this.showAccountHistory(this.state.accountHistory);
        this.showAccountHistoryTime(this.state.accountHistory)
    }
    showAccountHistoryTime(accountHistory){
        var {block_num} = accountHistory;
        BitsharesUtil.db_api('get_block',[block_num],(objects)=>{
            this.setState({
                time:MyUtil.TtimeToMyTime(objects.timestamp)
            })
            clearInterval(this.timer2);
        })
    }
    showAccountHistory(accountHistory){
        if(this.state.accountHistory) {
            var {id, op, block_num} = accountHistory;
            var obj = op[1];
            switch (op[0]) {
                //转账
                case 0:
                    this.setState({
                        color:{color:DefaultConfig.blue}
                    });
                    var center='';
                    var tab ='转账';
                    this.setState({
                        tab:tab
                    });
                    BitsharesUtil.db_api('get_accounts',[[obj.from,obj.to]],(accounts)=>{
                        BitsharesUtil.getAssetObject(obj.amount.asset_id,(assetObj)=>{
                            center = accounts[0].name+'转账'+NumberUtil.assetNum(obj.amount.amount,assetObj.precision)+assetObj.symbol+'给'+accounts[1].name
                            this.setState({
                                center:center
                            });
                            clearInterval(this.timer)
                        })
                    });
                    break;
                case 1:
                    this.setState({
                        color:{color:'#FF6347'}
                    });
                    var center='';
                    var tab ='限价单';
                    this.setState({
                        tab:tab
                    });
                    var {amount_to_sell,min_to_receive}=obj;
                    BitsharesUtil.db_api('get_accounts',[[obj.seller]],(accounts)=>{
                        var assetIds=[amount_to_sell.asset_id,min_to_receive.asset_id];
                        BitsharesUtil.getAssetObject(assetIds,(assetObj)=>{
                            center=accounts[0].name+'用'+NumberUtil.assetNum(amount_to_sell.amount,assetObj[0].precision)+assetObj[0].symbol+'以'+(NumberUtil.assetNum(amount_to_sell.amount,assetObj[0].precision)/
                                NumberUtil.assetNum(min_to_receive.amount,assetObj[1].precision)).toFixed(assetObj[0].precision)+
                                assetObj[0].symbol+'/'+assetObj[1].symbol+'的价格购买'+NumberUtil.assetNum(min_to_receive.amount,assetObj[1].precision)+assetObj[1].symbol
                            this.setState({
                                center:center
                            });
                            clearInterval(this.timer)
                        })
                    })
                    break;
                case 2:
                    this.setState({
                        color:{color:'#B22222'}
                    });
                    var center='';
                    var tab ='取消订单';
                    this.setState({
                        tab:tab
                    });
                    BitsharesUtil.db_api('get_accounts',[[obj.fee_paying_account]],(accounts)=>{
                        center=accounts[0].name+'取消了订单 #'+obj.order.split('.')[2];
                        this.setState({
                            center:center
                        });
                        clearInterval(this.timer)
                    })
                    break;
                case 3:
                    this.setState({
                        color:{color:DefaultConfig.yellow}
                    });
                    var center='';
                    var tab ='更新抵押';
                    this.setState({
                        tab:tab
                    });
                    var {delta_collateral,delta_debt}=obj;
                    BitsharesUtil.db_api('get_accounts',[[obj.funding_account]],(accounts)=>{
                        BitsharesUtil.getAssetObject([delta_collateral.asset_id,delta_debt.asset_id],(assetObj)=>{
                            center=accounts[0].name+'将抵押仓库更新为负债'+NumberUtil.assetNum(delta_debt.amount,assetObj[1].precision).toFixed(assetObj[1].precision)+assetObj[1].symbol+
                                '抵押'+NumberUtil.assetNum(delta_collateral.amount,assetObj[0].precision).toFixed(assetObj[0].precision)+assetObj[0].symbol
                            this.setState({
                                center:center
                            });
                            clearInterval(this.timer)
                        })
                    })
                    break;
                case 4:
                    this.setState({
                        color:{color:DefaultConfig.green}
                    });
                    var center='';
                    var tab ='订单撮合';
                    this.setState({
                        tab:tab
                    });
                    var {pays,receives,fill_price}=obj;
                    BitsharesUtil.db_api('get_accounts',[[obj.account_id]],(accounts)=>{
                        BitsharesUtil.getAssetObject([pays.asset_id,receives.asset_id,fill_price.base.asset_id,fill_price.quote.asset_id],(assetObj)=>{
                            center=accounts[0].name+'用'+NumberUtil.assetNum(pays.amount,assetObj[0].precision).toFixed(assetObj[0].precision)+assetObj[0].symbol+'以'+
                                (NumberUtil.assetNum(fill_price.quote.amount,assetObj[3].precision)/NumberUtil.assetNum(fill_price.base.amount,assetObj[2].precision))
                                    .toFixed(assetObj[3].precision)+assetObj[3].symbol+'/'+assetObj[2].symbol+'的价格成功购买了'+NumberUtil.assetNum(receives.amount,
                                    assetObj[1].precision).toFixed(assetObj[1].precision)+assetObj[1].symbol;
                            this.setState({
                                center:center
                            });
                            clearInterval(this.timer);
                        })
                    })
                    break;
            }
        }
    }
    render(){
        return(
            <View style={styles.root}>
                <View style={styles.center}>
                    <Text style={[styles.tab,this.state.color]}>
                        {this.state.tab}
                    </Text>
                    <Text style={[styles.centerText,{}]}>
                        {this.state.center}
                        </Text>
                </View>
                <Text style={styles.time}>{this.state.time}</Text>
            </View>
        )
    }

    /**
     * 渲染后，只会调用一次
     */
    componentDidMount(){
        this.timer=setInterval(()=>{
            this.showAccountHistory(this.state.accountHistory)
        },2000);
        this.timer2=setInterval(()=>{
            this.showAccountHistoryTime(this.state.accountHistory)
        },2000)
    }

    /**
     * 当props发生变化时
     * @param nextProps 变化后的props
     */
    componentWillReceiveProps(nextProps){
        this.setState({
            accountHistory:nextProps.accountHistory,
            center:nextProps.center,
            teb:nextProps.tab
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

    }

}

const styles=StyleSheet.create({
    root:{
        margin:5,
    },
    tab:{
        marginRight:10,
        fontSize:14,
        fontWeight:'bold',
        lineHeight:24,
        color:DefaultConfig.blue

    },
    center:{
        flexDirection:'row',
        borderBottomWidth:0.3,
        borderTopWidth:0.3,
        borderColor:'#DfDfDf',
    },
    centerText:{
        flex:1,
        fontSize:14,
        textAlign:'center',
        lineHeight:24
    },
    time:{
        fontSize:12,
        textAlign:'right',
        marginRight:10,
        lineHeight:14,
        color:'#A1A1A1'
    }
})