import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import DataPool from "../service/DataPool";
import LimitOrderItem from "./LimitOrderItem";

export default class AccountLimitOrders extends React.Component{
    static defaultProps={
        limit_orders:[]
    }
    state={
        limit_orders:this.props.limit_orders
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }
    showLimitOrders=(limit_orders)=>{
        this.setState({
            limit_orders:limit_orders
        })
    }

    render(){
        return(
            <View style={styles.root}>
                <FlatList style={styles.root}
                      keyExtractor={item=>item.id}
                      data={this.state.limit_orders}
                      ItemSeparatorComponent={()=><View style={{height:3,backgroundColor: '#DfDfDf'}}/>}
                      renderItem={({item})=>{
                          return (
                              <LimitOrderItem
                                  limitOrder={item}
                              />
                          )
                      }}
                />
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
        flex:1
    }
})