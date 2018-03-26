import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,Image,
    TouchableOpacity
} from 'react-native';

export default class RowOnPressItem extends React.Component{
    static defaultProps={
        config: {
            leftImage: undefined,
            leftText: undefined,
            leftTextDesc:'dadada',
            rightText: undefined,
            rightImage: undefined,
            onPress: undefined
        }
    }
    state={
        rightText:this.props.config.rightText
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            rightText:nextProps.config.rightText
        })
    }
    render(){
        var {leftImage,
            leftText,
            leftTextDesc,
            rightImage,
            onPress}=this.props.config;
        var rightText=this.state.rightText;
        return (
            <TouchableOpacity style={styles.root} onPress={onPress}>
                <Image style={styles.leftImage} source={leftImage}/>
                <View style={styles.center}>
                    <View>
                        <Text style={[styles.leftText,leftTextDesc?{lineHeight:26}:{}]}>{leftText}</Text>
                        <Text style={styles.leftTextDesc}>{leftTextDesc}</Text>
                    </View>
                    <Text style={styles.rightText}>{rightText}</Text>
                </View>
                <Image style={styles.rightImage} source={rightImage}/>
            </TouchableOpacity>
        )
    }
}

const styles=StyleSheet.create({
    root:{
        paddingLeft:5,
        paddingRight:5,
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'white'
    },
    leftImage:{
        width:30,
        height:30,
        margin:5
    },
    center:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    leftText:{
        textAlign:'left',
        lineHeight:40,
        fontSize:14,
        color:'#6E7B8B',
        fontWeight:'bold'
    },
    leftTextDesc:{
        textAlign:'left',
        lineHeight:10,
        fontSize:10,
        color:'#9F9F9F',
    },
    rightText:{
        textAlign:'right',
        lineHeight:40,
        fontSize:14,
        color:'gray'
    },
    rightImage:{
        width:30,
        height:30,
        margin:5
    }
})