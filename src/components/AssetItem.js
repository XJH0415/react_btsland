import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class AssetItem extends React.Component{
    static defaultProps={
        quote:'BTS',
        base:'CNY',
        onPress:()=>{}
    }
    render(){
        var {base,quote,onPress}=this.props;
        return(
            base!==quote?
                <TouchableOpacity style={styles.root} onPress={()=>{onPress(base,quote)}}>
                    <View style={styles.view}>
                        <Text style={[styles.leftText]}>{quote}</Text><Text style={[styles.rightText]}>/{base}</Text>
                    </View>

                </TouchableOpacity>
            :null
        )
    }
}

const styles=StyleSheet.create({
    root:{
        flex:1
    },
    view:{
        flex:1,
        height:40,
        flexDirection:'row',
        justifyContent:'center'
    },
    leftText:{
        height:40,
        fontSize:14,
        fontWeight:'bold',
        textAlign:'right',
        lineHeight:40,
    },
    rightText:{
        height:40,
        fontSize:10,
        textAlign:'left',
        lineHeight:42,
    }
})