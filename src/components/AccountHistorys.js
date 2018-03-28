import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import AccountHistoryItem from "./AccountHistoryItem";
import BitsharesUtil from "../utils/BitsharesUtil";

export default class AccountHistorys extends React.Component{
    static defaultProps={
        accountName:''
    }

    state={
        accountHistorys:[]
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }

    render(){
        return(
            <View style={styles.root}>
                <FlatList style={styles.root}
                          keyExtractor={item=>item.id}
                          data={this.state.accountHistorys}
                          ItemSeparatorComponent={()=><View style={{height:3,backgroundColor: '#DfDfDf'}}/>}
                          renderItem={({item})=>{
                              return (
                                  <AccountHistoryItem accountHistory={item}/>
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
        BitsharesUtil.history_api('get_account_history',[this.props.accountName,'1.11.9',20,'1.11.0'],(accountHistorys)=>{
            this.setState({
                accountHistorys:accountHistorys
            })
        })
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
        flex:1,
    }
})