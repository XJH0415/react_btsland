import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import DefaultConfig from "../DefaultConfig";

export default class FillOrderItem extends React.Component{
    static defaultProps={
        price:0.0,
        quote:0.0,
        base:0.0,
        time:'03-22 17:32',
        type:''
    }
    state={
        price:this.props.price,
        quote:this.props.quote,
        base:this.props.base,
        time:this.props.time,
        type:this.props.type
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }

    render(){
        var {price,quote,base,time}=this.state;
        return (
            <View style={styles.root}>
                <View style={styles.view}>
                    <Text style={
                        [styles.text,
                        this.state.type==='maker' ?
                            {color:DefaultConfig.yellow}
                            :
                            this.state.type==='sell' ?
                                {color:DefaultConfig.red}
                                :
                                this.state.type==='buy' ?
                                    {color:DefaultConfig.green}
                                    :
                                    {}
                        ]
                    }
                    >{price}</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.text}>{quote}</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.text}>{base}</Text>
                </View>
                <View style={styles.view}>
                    <Text style={styles.text}>{time}</Text>
                </View>
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
        height:35,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'white',
    },
    view:{
        flex:1,
    },
    text:{
        fontSize:13,
        color:'black',
        lineHeight:35,
        textAlign:'center'
    }
})