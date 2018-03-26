import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    WebView
} from 'react-native';
import sha256 from 'js-sha256'
export default class Photo extends React.Component{
    static defaultProps={
        width:100,
        height:100,
        account:null
    }
    /**
     * 渲染前
     */
    componentWillMount(){

    }

    render(){
        var {width,height,account}=this.props;
        var hash=account?sha256(account):null;
        var html=
            "<html>" +
            "<head>" +
            "</head>"+
            "<style>" +
            "body{" +
            "padding: 0;" +
            "margin: 0;" +
            "}" +
            "canvas{" +
            "padding: 0;" +
            "margin: 0;" +
            "height: "+height*4+";" +
            "width: "+width*4+";" +
            "float: left;" +
            "background-color: transparent}" +
            "</style>"+
            "<script src='https://cdn.jsdelivr.net/jdenticon/1.3.2/jdenticon.min.js'></script>" +
            "<body>" +
            "<canvas width='100' height='100' data-jdenticon-hash='"+hash+"'></canvas>" +
            "</body>"
            "</html>";
        return (
            <View  style={[styles.root,{width:this.props.width,height:this.props.height}]}>
                <WebView
                    style={[styles.root,{width:this.props.width,height:this.props.height}]}
                    javaScriptEnabled={true}
                    scrollEnabled={false}
                    source={{html:html}}
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
        width:200,
        height:200,
    }
})