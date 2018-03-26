import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

export default class OrderItem extends React.Component{

    /**
     * 渲染前
     */
    componentWillMount(){

    }

    render(){

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

})