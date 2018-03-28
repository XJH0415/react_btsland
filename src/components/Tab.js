import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,TouchableWithoutFeedback
} from 'react-native';

export default class Tab extends React.Component{
    static defaultProps={
        onPress:(index)=>{},
    }
    state={
        index:0,
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }

    render(){
        return(
            <View style={styles.root}>
                <TouchableWithoutFeedback onPress={()=>{this.setState({index:0,});this.props.onPress(0)}}>
                    <View style={[styles.tab,this.state.index===0?styles.tabTouch:{}]}>
                        <Text style={styles.text}>资产</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{this.setState({index:1,});this.props.onPress(1)}}>
                    <View style={[styles.tab,this.state.index===1?styles.tabTouch:{}]}>
                        <Text style={styles.text}>委单</Text>
                    </View>
                </TouchableWithoutFeedback>
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
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#4682B4'
    },
    tab:{
        flex:1,
    },
    tabTouch:{
        borderBottomColor:'white',
        borderBottomWidth:5
    },
    text:{
        fontSize:14,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
        lineHeight:40
    }
})